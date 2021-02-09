import { Component, Input, OnInit } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { SortableOptions } from 'sortablejs';
import { TodoService } from '../todo.service';

@Component({
  selector: 'tkl-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  @Input() sortable = false;
  @Input() todos: Todo[];
  @Input() group: string;

  public options: SortableOptions;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.options = {
      group: this.group,
      onUpdate: (event: any) => {
        console.log(this.todos);
        this.todos.forEach((todo, index) => todo.order = this.todos.length - index);
        console.log(this.todos);
        this.todoService.updateListOrder(this.todos);
      }
    };
  }

}
