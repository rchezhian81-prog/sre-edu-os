import { Injectable, Logger }    from '@nestjs/common';
import { InjectRepository }        from '@nestjs/typeorm';
import { Repository, DataSource }  from 'typeorm';
import { OpenAiService }           from './openai.service';
import { Student }                 from '../students/entities/student.entity';
import { Attendance }              from '../attendance/entities/attendance.entity';
import { FeePayment }              from '../fees/entities/fee-payment.entity';
import { ExamResult }              from '../exam/entities/exam-result.entity';
import {
  AttendanceInsightDto,
  FeeRiskDto,
  PerformanceInsightDto,
  NlQueryDto,
  AnomalyDto,
} from './dto/analytics.dto';

@Injectable()
export class AiAnalyticsService {
  private readonly log = new Logger(AiAnalyticsService.name);

  constructor(
    @InjectRepository(Student)    private readonly students:    Repository<Student>,
    @InjectRepository(Attendance) private readonly attendance:  Repository<Attendance>,
    @InjectRepository(FeePayment) private readonly fees:        Repository<FeePayment>,
    @InjectRepository(ExamResult) private readonly examResults: Repository<ExamResult>,
    private readonly openai:      OpenAiService,
    private readonly ds:          DataSource,
  ) {}

  // ── 1. Attendance Pattern Insights ────────────────────────────────────────
  async attendanceInsights(branchId: string): Promise<AttendanceInsightDto> {
    const raw: any[] = await this.ds.query(`
      SELECT
        s.id,
        s.full_name,
        s.class_id,
        COUNT(*) FILTER (WHERE a.status = 'PRESENT') AS present,
        COUNT(*) FILTER (WHERE a.status = 'ABSENT')  AS absent,
        COUNT(*)                                       AS total,
        ROUND(100.0 * COUNT(*) FILTER (WHERE a.status = 'PRESENT') / NULLIF(COUNT(*), 0), 1) AS pct
      FROM students s
      JOIN attendance a ON a.student_id = s.id
      WHERE s.branch_id = $1 AND s.is_deleted = false
        AND a.date >= NOW() - INTERVAL '30 days'
      GROUP BY s.id, s.full_name, s.class_id
      ORDER BY pct ASC
    `, [branchId]);

    const atRisk        = raw.filter(r => +r.pct < 75);
    const chronic       = raw.filter(r => +r.pct < 60);
    const avgAttendance = raw.reduce((s, r) => s + +r.pct, 0) / (raw.length || 1);

    // Day-of-week pattern
    const dowRaw: any[] = await this.ds.query(`
      SELECT
        EXTRACT(DOW FROM date) AS dow,
        COUNT(*) FILTER (WHERE status = 'ABSENT') AS absences,
        COUNT(*)                                    AS total
      FROM attendance
      WHERE branch_id = $1 AND date >= NOW() - INTERVAL '30 days'
      GROUP BY dow ORDER BY dow
    `, [branchId]);
    const highAbsentDay = dowRaw.reduce((best, r) =>
      +r.absences / +r.total > +best.absences / +best.total ? r : best, dowRaw[0] ?? { dow: 1 });
    const dayName = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][+highAbsentDay?.dow ?? 1];

    // GPT-4o narrative
    const prompt = `You are a school analytics engine. Given data about student attendance for the past 30 days:
- Total students analysed: ${raw.length}
- Average attendance rate: ${avgAttendance.toFixed(1)}%
- Students below 75% (at-risk): ${atRisk.length}
- Students below 60% (chronic): ${chronic.length}
- Highest absenteeism day of week: ${dayName}
- Top 5 at-risk students: ${atRisk.slice(0, 5).map(r => `${r.full_name} (${r.pct}%)`).join(', ')}

Write a concise 3-sentence insight summary for the school principal. Include one actionable recommendation.`;

    const narrative = await this.openai.chat([
      { role: 'system', content: 'You are a school analytics engine. Be concise and data-driven.' },
      { role: 'user',   content: prompt },
    ]);

    return {
      avgAttendance:    +avgAttendance.toFixed(1),
      atRiskCount:      atRisk.length,
      chronicCount:     chronic.length,
      highAbsentDay:    dayName,
      atRiskStudents:   atRisk.slice(0, 10).map(r => ({
        id: r.id, name: r.full_name, percentage: +r.pct,
      })),
      narrative,
    };
  }

  // ── 2. Fee Defaulter Risk Scoring ─────────────────────────────────────────
  async feeRiskScoring(branchId: string): Promise<FeeRiskDto[]> {
    const raw: any[] = await this.ds.query(`
      SELECT
        s.id, s.full_name, s.class_id,
        SUM(fs.total_amount - COALESCE(fp.amount_paid, 0)) AS outstanding,
        COUNT(DISTINCT fp.id) FILTER (WHERE fp.status IN ('PENDING','PARTIAL')) AS unpaid_terms,
        MAX(fp.created_at) AS last_payment,
        AVG(a_sub.pct) AS attendance_pct
      FROM students s
      JOIN fee_structures fs ON fs.class_id = s.class_id AND fs.academic_year = EXTRACT(YEAR FROM NOW())::text
      LEFT JOIN fee_payments fp ON fp.student_id = s.id
      LEFT JOIN (
        SELECT student_id, ROUND(100.0 * SUM(CASE WHEN status = 'PRESENT' THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct
        FROM attendance GROUP BY student_id
      ) a_sub ON a_sub.student_id = s.id
      WHERE s.branch_id = $1 AND s.is_deleted = false
      GROUP BY s.id, s.full_name, s.class_id
      HAVING SUM(fs.total_amount - COALESCE(fp.amount_paid, 0)) > 0
      ORDER BY outstanding DESC
      LIMIT 50
    `, [branchId]);

    // Score each student (0-100, higher = higher risk)
    const scored = raw.map(r => {
      const outstanding   = +r.outstanding || 0;
      const unpaid        = +r.unpaid_terms || 0;
      const lastPayment   = r.last_payment ? (Date.now() - new Date(r.last_payment).getTime()) / 86400000 : 365;
      const attendancePct = +r.attendance_pct || 50;

      // Weighted scoring
      const score = Math.min(100, Math.round(
        (outstanding / 10000) * 30 +    // 30 pts: outstanding amount (per ₹10k)
        unpaid * 15 +                   // 15 pts per unpaid term
        Math.min(30, lastPayment / 10) + // 30 pts: days since last payment
        Math.max(0, (60 - attendancePct) / 2), // 25 pts: low attendance correlates with dropout risk
      ));

      const riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' =
        score >= 70 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW';

      return {
        studentId:    r.id,
        name:         r.full_name,
        outstanding:  outstanding,
        unpaidTerms:  unpaid,
        daysSincePay: Math.round(lastPayment),
        riskScore:    score,
        riskLevel,
        recommendation:
          riskLevel === 'HIGH'   ? 'Call parent immediately. Offer instalment plan.' :
          riskLevel === 'MEDIUM' ? 'Send WhatsApp reminder. Follow up in 7 days.'  :
                                   'Send monthly fee reminder.',
      };
    });

    return scored;
  }

  // ── 3. Academic Performance Insights ──────────────────────────────────────
  async performanceInsights(branchId: string): Promise<PerformanceInsightDto> {
    const raw: any[] = await this.ds.query(`
      SELECT
        sub.name AS subject,
        cl.name  AS class,
        ROUND(AVG(er.marks_obtained), 1) AS avg_score,
        ROUND(100.0 * AVG(er.marks_obtained) / NULLIF(AVG(er.max_marks), 0), 1) AS avg_pct,
        COUNT(*) AS attempts,
        COUNT(*) FILTER (WHERE er.grade = 'F') AS failed
      FROM exam_results er
      JOIN exam_schedules es ON es.id = er.exam_id
      JOIN subjects sub ON sub.id = er.subject_id
      JOIN classes cl ON cl.id = es.class_id
      JOIN students s ON s.id = er.student_id
      WHERE s.branch_id = $1 AND s.is_deleted = false
        AND es.exam_date >= NOW() - INTERVAL '90 days'
      GROUP BY sub.name, cl.name
      ORDER BY avg_pct ASC
    `, [branchId]);

    const weakSubjects = raw.filter(r => +r.avg_pct < 60);
    const failRate     = raw.map(r => ({ subject: r.subject, class: r.class, failPct: Math.round(+r.failed / +r.attempts * 100) }))
                            .sort((a, b) => b.failPct - a.failPct)
                            .slice(0, 5);

    const prompt = `You are an academic performance analyst for a school.
Data summary (last 90 days):
- Subjects below 60% average: ${weakSubjects.map(r => `${r.subject} (${r.class}) — ${r.avg_pct}%`).join(', ') || 'None'}
- Highest fail rate subjects: ${failRate.map(r => `${r.subject} (${r.class}): ${r.failPct}% fail rate`).join(', ') || 'None'}

Write 2-3 sentences identifying the key academic challenges and one specific, actionable recommendation for the principal.`;

    const narrative = await this.openai.chat([
      { role: 'system', content: 'You are a school academic analyst. Be concise.' },
      { role: 'user',   content: prompt },
    ]);

    return {
      subjectBreakdown: raw.map(r => ({
        subject:  r.subject,
        class:    r.class,
        avgScore: +r.avg_pct,
        failCount: +r.failed,
        total:    +r.attempts,
      })),
      weakSubjects: weakSubjects.map(r => r.subject + ' (' + r.class + ')'),
      topFailRateSubjects: failRate,
      narrative,
    };
  }

  // ── 4. Natural-Language Report Query ─────────────────────────────────────
  async naturalLanguageQuery(branchId: string, dto: NlQueryDto): Promise<string> {
    // Gather a mini data snapshot for context
    const [studentCount] = await this.ds.query(
      `SELECT COUNT(*) FROM students WHERE branch_id = $1 AND is_deleted = false`, [branchId],
    );
    const [attSummary] = await this.ds.query(`
      SELECT ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'PRESENT') / NULLIF(COUNT(*), 0), 1) AS avg_att
      FROM attendance a JOIN students s ON s.id = a.student_id
      WHERE s.branch_id = $1 AND a.date >= NOW() - INTERVAL '30 days'
    `, [branchId]);
    const [feeSummary] = await this.ds.query(`
      SELECT COALESCE(SUM(amount_paid), 0) AS collected,
             COUNT(*) FILTER (WHERE status = 'PENDING') AS pending_count
      FROM fee_payments fp JOIN students s ON s.id = fp.student_id
      WHERE s.branch_id = $1
    `, [branchId]);

    const context = `School Data Snapshot:
- Total students: ${studentCount.count}
- 30-day avg attendance: ${attSummary.avg_att}%
- Total fees collected: ₹${(+feeSummary.collected).toLocaleString('en-IN')}
- Pending fee records: ${feeSummary.pending_count}`;

    return this.openai.chat([
      {
        role: 'system',
        content: `You are an intelligent school management assistant. Answer questions about the school using the data context provided. Be concise, factual, and helpful. If you cannot answer from context, say so clearly. Never make up specific student names or numbers not in the context.`,
      },
      { role: 'user', content: `${context}\n\nQuestion: ${dto.query}` },
    ]);
  }

  // ── 5. Anomaly Detection ──────────────────────────────────────────────────
  async detectAnomalies(branchId: string): Promise<AnomalyDto[]> {
    const anomalies: AnomalyDto[] = [];

    // Sudden attendance drop (>15% drop week-over-week)
    const attTrend: any[] = await this.ds.query(`
      SELECT
        DATE_TRUNC('week', date) AS week,
        ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'PRESENT') / NULLIF(COUNT(*), 0), 1) AS pct
      FROM attendance a JOIN students s ON s.id = a.student_id
      WHERE s.branch_id = $1 AND date >= NOW() - INTERVAL '14 days'
      GROUP BY week ORDER BY week
    `, [branchId]);

    if (attTrend.length >= 2) {
      const [prev, curr] = attTrend.slice(-2);
      const drop = +prev.pct - +curr.pct;
      if (drop > 15) {
        anomalies.push({
          type:     'ATTENDANCE_DROP',
          severity: drop > 25 ? 'HIGH' : 'MEDIUM',
          title:    `Attendance dropped ${drop.toFixed(1)}% this week`,
          detail:   `Previous week: ${prev.pct}% → This week: ${curr.pct}%`,
          action:   'Investigate class-level data for illness outbreaks or exam anxiety.',
        });
      }
    }

    // Multiple students with 0% recent attendance (possible dropout)
    const zeroAtt: any[] = await this.ds.query(`
      SELECT s.full_name, s.id
      FROM students s
      LEFT JOIN attendance a ON a.student_id = s.id AND a.date >= NOW() - INTERVAL '14 days'
      WHERE s.branch_id = $1 AND s.is_deleted = false
      GROUP BY s.id, s.full_name
      HAVING COUNT(a.id) = 0
      LIMIT 10
    `, [branchId]);

    if (zeroAtt.length > 0) {
      anomalies.push({
        type:     'POSSIBLE_DROPOUT',
        severity: 'HIGH',
        title:    `${zeroAtt.length} student(s) have zero attendance in 14 days`,
        detail:   zeroAtt.map(s => s.full_name).join(', '),
        action:   'Contact parents immediately. Initiate dropout prevention protocol.',
      });
    }

    // Fee collection anomaly (0 payments in last 7 days — could indicate system issue)
    const [recentFees] = await this.ds.query(`
      SELECT COUNT(*) FROM fee_payments fp
      JOIN students s ON s.id = fp.student_id
      WHERE s.branch_id = $1 AND fp.created_at >= NOW() - INTERVAL '7 days'
    `, [branchId]);
    if (+recentFees.count === 0) {
      anomalies.push({
        type:     'FEE_COLLECTION_HALT',
        severity: 'MEDIUM',
        title:    'No fee payments recorded in last 7 days',
        detail:   'This may indicate a payment gateway issue or academic holiday.',
        action:   'Verify payment system is operational.',
      });
    }

    return anomalies;
  }
}
