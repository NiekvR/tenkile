import { Injectable } from '@angular/core';
import moment from 'moment';
import 'moment/locale/nl';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() {
    moment().locale('nl');
  }

  public format(date: Date): string {
    return moment(date).format();
  }

  public formatDayOfWeek(date: Date): string {
    return moment(date).format('dd');
  }

  public formatMonth(date: Date): string {
    return moment(date).format('MMMM');
  }

  public getDayOfWeek(date: Date): number {
    return moment(date).weekday();
  }

  public getMonth(date: Date): number {
    return moment(date).month();
  }

  public getYear(date: Date): number {
    return moment(date).year();
  }

  public getFirstDayOfWeek(date: Date): Date {
    return moment(date).weekday(0).toDate();
  }

  public getFirstDayOfMonth(date: Date): Date {
    return moment(date).date(1).toDate();
  }

  public getLastDayOfWeek(date: Date): Date {
    return moment(date).weekday(6).toDate();
  }

  public getLastDayOfMonth(date: Date): Date {
    return moment(date).date(moment(date).daysInMonth()).toDate();
  }

  public isSame(date: Date, newDate: Date): boolean {
    return moment(date).isSame(newDate);
  }

  public isSameDay(date: Date, newDate: Date): boolean {
    return moment(date).isSame(newDate, 'day');
  }

  public isAfter(date: Date, newDate: Date): boolean {
    return moment(date).isAfter(newDate);
  }

  public addDay(date: Date): Date {
    return moment(date).add(1, 'day').toDate();
  }

  public addMonth(date: Date, amount = 1): Date {
    return moment(date).add(amount, 'month').toDate();
  }

  public substractMonth(date: Date): Date {
    return moment(date).subtract(1, 'month').toDate();
  }

  public getDateFromMonthAndYear(year: number, month: number): Date {
    return moment().year(year).month(month).day(1).toDate();
  }
}
