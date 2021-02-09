import { TodoTag } from './enums/todo-tag.enum';

export interface Todo {
  id?: string;
  task: string;
  tag?: TodoTag;
  date: Date;
  notes?: string;
  done: boolean;
  plannedDate?: Date;
  user: string;
  order?: number;
}
