# 📖 SRE EDU OS — API Documentation

Base URL: `https://api.sreedos.com` (local: `http://localhost:3001`)

All endpoints require `Authorization: Bearer <jwt_token>` unless marked 🔓

---

## 🔐 Authentication

### POST /auth/login 🔓
Login and get JWT token.
```json
// Request
{ "email": "admin@sreedos.com", "password": "Admin@123" }

// Response 200
{
  "access_token": "eyJhbGci...",
  "user": { "id": "uuid", "name": "Admin", "role": "admin", "schoolId": "uuid" }
}
```

### POST /auth/refresh
Refresh access token.
```json
// Request Header: Authorization: Bearer <expired_token>
// Response: { "access_token": "new_token" }
```

### POST /auth/logout
Invalidate token.

---

## 👨‍🎓 Students

### GET /students
List all students (paginated).
```
Query: ?page=1&limit=20&classId=uuid&search=name
Response: { data: [...], total, page, limit }
```

### POST /students
Create new student.
```json
{
  "firstName": "Ravi",
  "lastName": "Kumar",
  "dateOfBirth": "2010-05-15",
  "gender": "male",
  "classId": "uuid",
  "parentName": "Suresh Kumar",
  "parentPhone": "+919876543210",
  "parentEmail": "suresh@example.com",
  "address": "123 Main St, Chennai"
}
```

### GET /students/:id
Get student details.

### PUT /students/:id
Update student information.

### DELETE /students/:id
Soft-delete student (admin only).

### GET /students/:id/attendance
Get student's attendance history.

### GET /students/:id/results
Get student's exam results.

---

## 💰 Fees

### GET /fees/structures
List all fee structures.

### POST /fees/structures
Create fee structure.
```json
{
  "name": "Term 1 - 2024",
  "classId": "uuid",
  "amount": 15000,
  "dueDate": "2024-04-30",
  "components": [
    { "name": "Tuition", "amount": 10000 },
    { "name": "Transport", "amount": 3000 },
    { "name": "Exam", "amount": 2000 }
  ]
}
```

### POST /fees/collect
Record fee payment.
```json
{
  "studentId": "uuid",
  "structureId": "uuid",
  "amount": 15000,
  "paymentMethod": "razorpay",
  "razorpayPaymentId": "pay_..."
}
```

### GET /fees/defaulters
Get list of fee defaulters.
```
Query: ?classId=uuid&month=2024-04
```

### GET /fees/receipts/:paymentId
Download/view payment receipt.

### POST /fees/razorpay/order
Create Razorpay order for online payment.
```json
{ "studentId": "uuid", "structureId": "uuid", "amount": 15000 }
// Returns: { "orderId": "order_...", "amount": 1500000, "currency": "INR" }
```

---

## 📅 Attendance

### POST /attendance/mark
Mark attendance for a class.
```json
{
  "classId": "uuid",
  "date": "2024-03-15",
  "records": [
    { "studentId": "uuid", "status": "present" },
    { "studentId": "uuid", "status": "absent" },
    { "studentId": "uuid", "status": "late" }
  ]
}
```

### GET /attendance/class/:classId
Get attendance for a class.
```
Query: ?date=2024-03-15 OR ?from=2024-03-01&to=2024-03-31
```

### GET /attendance/student/:studentId
Get student attendance summary.
```
Response: { present: 45, absent: 3, late: 2, percentage: 93.75 }
```

### GET /attendance/report
Generate attendance report (CSV/PDF).
```
Query: ?classId=uuid&month=2024-03&format=csv
```

---

## 📊 Exams & Results

### GET /exams
List all exams.

### POST /exams
Create exam.
```json
{
  "name": "Mid-Term Examination",
  "classId": "uuid",
  "subjects": ["uuid1", "uuid2"],
  "startDate": "2024-05-10",
  "endDate": "2024-05-20"
}
```

### POST /results/marks
Enter student marks.
```json
{
  "examId": "uuid",
  "subjectId": "uuid",
  "marks": [
    { "studentId": "uuid", "marksObtained": 85, "maxMarks": 100 }
  ]
}
```

### GET /results/report-card/:studentId/:examId
Generate report card.

### GET /results/class-report/:examId/:classId
Get class-wise performance report.

---

## 📚 Library

### GET /library/books
List all books.
```
Query: ?search=title&author=name&available=true
```

### POST /library/books
Add book to catalog.
```json
{
  "title": "Mathematics Class 10",
  "author": "R.D. Sharma",
  "isbn": "978-81-xxx",
  "quantity": 5,
  "category": "textbook"
}
```

### POST /library/issue
Issue a book to student.
```json
{ "bookId": "uuid", "studentId": "uuid", "dueDate": "2024-04-15" }
```

### POST /library/return/:issueId
Return a book.

### GET /library/overdue
Get list of overdue books.

---

## 🚌 Transport

### GET /transport/routes
List all routes.

### POST /transport/routes
Create transport route.
```json
{
  "name": "Route 1 - North Chennai",
  "stops": [
    { "name": "Ambattur", "time": "07:30", "lat": 13.098, "lng": 80.168 },
    { "name": "Villivakkam", "time": "07:45", "lat": 13.101, "lng": 80.205 }
  ],
  "vehicleId": "uuid",
  "driverId": "uuid"
}
```

### POST /transport/assign
Assign student to route.
```json
{ "studentId": "uuid", "routeId": "uuid", "stopName": "Ambattur" }
```

---

## 🤖 AI Analytics

### POST /ai/performance-prediction
Predict student performance.
```json
{ "studentId": "uuid", "subject": "Mathematics" }
// Returns: { prediction: "at-risk", confidence: 0.78, recommendations: [...] }
```

### POST /ai/fee-risk
Get fee defaulter risk score.
```json
{ "studentId": "uuid" }
// Returns: { riskLevel: "high", score: 0.82, factors: [...] }
```

### POST /ai/insights
Generate school-wide insights report.
```json
{ "schoolId": "uuid", "period": "2024-Q1" }
```

---

## 💬 Notifications

### POST /notifications/send
Send notification to users.
```json
{
  "recipients": ["uuid1", "uuid2"],
  "title": "Exam Schedule Released",
  "message": "Mid-term exams start May 10th",
  "channels": ["push", "whatsapp"]
}
```

### POST /notifications/broadcast
Broadcast to entire class or school.
```json
{
  "scope": "class",
  "classId": "uuid",
  "title": "Holiday Notice",
  "message": "School closed tomorrow"
}
```

---

## 📈 Reports

### GET /reports/attendance-summary
School-wide attendance summary.

### GET /reports/fee-collection
Fee collection report by month/class.

### GET /reports/academic-performance
Academic performance across classes.

### GET /reports/export/:type
Export reports as PDF or Excel.
```
Query: ?type=attendance&format=excel&month=2024-03
```

---

## 🔧 School Settings

### GET /settings
Get school configuration.

### PUT /settings
Update school settings.
```json
{
  "schoolName": "SRE International School",
  "address": "123 School Road, Chennai",
  "phone": "+914412345678",
  "academicYear": "2024-2025",
  "workingDays": ["mon","tue","wed","thu","fri"]
}
```

---

## 📋 Response Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Bad request / validation error |
| 401 | Unauthorized (invalid/expired token) |
| 403 | Forbidden (insufficient role) |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## 📖 Full Interactive Docs

Run the backend locally and visit: **http://localhost:3001/api/docs** (Swagger UI)
