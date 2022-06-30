import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Calendar } from '../../models/calendar/calendar.model';
import { CalendarService } from './calendar.service';
import { DateService } from '../date/date.service';

@Component({
  selector: 'tkl-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [ CalendarService ]
})
export class CalendarComponent implements OnInit {
  @Input() selectedDate: Date;
  @Input() collapsable = false;
  @Input() datesWithTodo: Date[] = [];
  @Output() selectedDateChange = new EventEmitter<Date>();

  public startDate: Date;
  public calendar: Calendar;
  public slide = 0;
  public height: number;

  public collapsed = false;

  constructor(private calendarService: CalendarService, private dateService: DateService) { }

  ngOnInit(): void {
    this.startDate = this.selectedDate || new Date();
    this.calendar = this.calendarService.initCalendar(this.startDate);
    this.getHeightForMonth();
  }

  public next(): void {
    const date = this.dateService.addMonth(this.startDate, this.slide + 2);
    const nextMonth = this.calendarService.getCalendar(this.slide + 2, date);
    this.calendar = { ...this.calendar, ...nextMonth };
    this.slide += 1;
    this.getHeightForMonth();
  }

  public back(): void {
    const date = this.dateService.addMonth(this.startDate, this.slide - 2);
    const nextMonth = this.calendarService.getCalendar(this.slide - 2, date);
    this.calendar = { ...this.calendar, ...nextMonth };
    this.slide += -1;
    this.getHeightForMonth();
  }

  public selectDate(date: Date): void {
    if (this.selectedDate === date) {
      this.selectedDate = null;
    } else {
      this.selectedDate = date;
    }
    this.selectedDateChange.emit(this.selectedDate);
  }

  public isSelected(date: Date): boolean {
    return this.dateService.isSameDay(this.selectedDate, date);
  }

  public isToday(date: Date): boolean {
    return this.dateService.isSameDay(new Date(), date);
  }

  public openCalendar(): void {
    this.collapsed = !this.collapsed;
  }

  public hasTodo(date: Date): boolean {
    return this.datesWithTodo.findIndex(dateWithTodo => this.dateService.isSameDay(dateWithTodo, date)) > -1;
  }

  private getHeightForMonth(): void {
    this.height = (this.calendar[ this.slide ].dayColumns[ 0 ].dates.length + 1) * 30 + 10;
  }
}
