import { Component, Input, OnInit } from '@angular/core';
import { Todo } from '../../../models/todo.model';
import { Router } from '@angular/router';
import { TodoTagColor } from '../../../models/enums/todo-tag-color.enum';
import { TodoService } from '../../todo.service';

@Component({
  selector: 'tkl-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent {

  @Input() todo: Todo;
  @Input() highlighted = false;

  public TodoTagColor = TodoTagColor;

  constructor(private router: Router, private todoService: TodoService) { }

  public openTodo(): void {
    this.router.navigate([ './todo', this.todo.id ]);
  }

  public checkTodo(): void {
    this.todo.done = !this.todo.done;
    this.todoService.addTodo(this.todo);
  }

  public removeTodo(): void {
    this.todoService.removeTodo(this.todo);
  }

}
