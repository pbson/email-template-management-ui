import { createEvent } from 'ics';

const dayMap = {
  Sunday: 'SU',
  Monday: 'MO',
  Tuesday: 'TU',
  Wednesday: 'WE',
  Thursday: 'TH',
  Friday: 'FR',
  Saturday: 'SA',
};

const monthMap = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

export const handleExportSchedule = (schedule) => {
  const { name, description, start_timestamp, recurrence } = schedule;
  const start = new Date(start_timestamp);
  const duration = { hours: 1 };

  let recurrenceRule;
  if (recurrence && recurrence.frequency !== 'OneTime') {
    let rule = `FREQ=${recurrence.frequency.toUpperCase()};INTERVAL=${recurrence.interval}`;

    if (recurrence.days_of_week) {
      const days = recurrence.days_of_week
        .split(',')
        .map((day) => dayMap[day.trim()])
        .join(',');
      rule += `;BYDAY=${days}`;
    }
    if (recurrence.days_of_month) {
      rule += `;BYMONTHDAY=${recurrence.days_of_month}`;
    }
    if (recurrence.months_of_year) {
      const months = recurrence.months_of_year
        .split(',')
        .map((month) => monthMap[month.trim()])
        .join(',');
      rule += `;BYMONTH=${months}`;
    }

    recurrenceRule = rule;
  }

  const event = {
    title: name,
    description: description,
    start: [
      start.getUTCFullYear(),
      start.getUTCMonth() + 1,
      start.getUTCDate(),
      start.getUTCHours(),
      start.getUTCMinutes(),
    ],
    duration,
    recurrenceRule: recurrenceRule || undefined,
    status: 'CONFIRMED',
  };

  createEvent(event, (error, value) => {
    if (error) {
      console.log(error);
      return;
    }

    const blob = new Blob([value], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};
