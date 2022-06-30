export interface Todo {
  id?: string;
  task: string;
  tag?: string;
  date: Date;
  notes?: string;
  done: boolean;
  plannedDate?: Date;
  user: string;
  order?: number;
}
