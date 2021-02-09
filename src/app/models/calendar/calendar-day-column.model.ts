export interface CalendarDayColumn {
  [ dayColumn: number ]: {
    day: string,
    dates: Date[]
  };
}
