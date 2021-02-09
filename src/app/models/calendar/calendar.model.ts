import { CalendarMonth } from './calendar-month.model';

export interface Calendar {
  [ index: number]: CalendarMonth;
}
