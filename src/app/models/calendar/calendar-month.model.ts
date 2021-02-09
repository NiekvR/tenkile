import { CalendarDayColumn } from './calendar-day-column.model';

export interface CalendarMonth {
  index: number;
  month: number;
  monthLabel: string;
  year: number;
  dayColumns: CalendarDayColumn;
}
