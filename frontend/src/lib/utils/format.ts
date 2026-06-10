import dayjs from 'dayjs';
export const fmt = {
  date:     (d: string | Date) => dayjs(d).format('DD MMM YYYY'),
  datetime: (d: string | Date) => dayjs(d).format('DD MMM YYYY, hh:mm A'),
  currency: (n: number)        => `₹${n.toLocaleString('en-IN')}`,
  percent:  (n: number)        => `${n.toFixed(1)}%`,
  grade:    (pct: number)      => pct>=90?'A+':pct>=80?'A':pct>=70?'B+':pct>=60?'B':pct>=50?'C':pct>=40?'D':'F',
};
