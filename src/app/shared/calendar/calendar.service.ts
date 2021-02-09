import { Injectable } from '@angular/core';
import { Calendar } from '../../models/calendar/calendar.model';
import { CalendarDayColumn } from '../../models/calendar/calendar-day-column.model';
import { DateService } from '../date/date.service';
import { CalendarMonth } from '../../models/calendar/calendar-month.model';

@Injectable()
export class CalendarService {

  constructor(private dateService: DateService) { }

  public initCalendar(date: Date): Calendar {
    return {
      [ 0 ]: this.createCalendar(date, 0),
      [ -1 ]: this.createCalendar(this.dateService.substractMonth(date), -1),
      [ 1 ]: this.createCalendar(this.dateService.addMonth(date), 1)
    };
  }

  public getCalendar(index: number, date: Date): Calendar {
    return {
      [ index ]: this.createCalendar(date, index)
    };
  }

  private createCalendar(date: Date, index: number): CalendarMonth {
    return {
      index,
      month: this.dateService.getMonth(date),
      monthLabel: this.dateService.formatMonth(date),
      year: this.dateService.getYear(date),
      dayColumns: this.createDayColumns(date)
    };
  }

  private createDayColumns(date: Date): CalendarDayColumn {
    let firstDay = this.dateService.getFirstDayOfWeek(this.dateService.getFirstDayOfMonth(date));
    const lastDay = this.dateService.getLastDayOfWeek(this.dateService.getLastDayOfMonth(date));

    const dayColumns = {} as CalendarDayColumn;
    while (!this.dateService.isAfter(firstDay, lastDay)) {
      const dayOfWeek = this.dateService.getDayOfWeek(firstDay);
      if (!dayColumns[ dayOfWeek ]) {
        dayColumns[dayOfWeek] = {
          day: this.dateService.formatDayOfWeek(firstDay),
          dates: []
        };
      }
      dayColumns[ dayOfWeek ].dates.push(firstDay);

      firstDay = this.dateService.addDay(firstDay);
    }

    return dayColumns;
  }
}
