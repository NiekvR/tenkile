import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../todo.service';
import { USERS } from '../../../assets/users/users';

@Component({
  selector: 'tkl-todo-details',
  templateUrl: './todo-details.component.html',
  styleUrls: ['./todo-details.component.scss'],
  providers: [ TodoService ]
})
export class TodoDetailsComponent implements OnInit {

  public todo: Todo;

  public editing = false;
  public activeOption: 'text' | 'tag' | 'date' | 'note' | 'user';
  public USERS = USERS;

  constructor(private activatedRoute: ActivatedRoute, private todoService: TodoService, private router: Router) { }

  ngOnInit(): void {
    this.getTodo();
  }

  public backTodos(): void {
    this.router.navigate([ './todos' ]);
  }


  updateTodo(activeOption: 'text' | 'tag' | 'date' | 'note' | 'user'): void {
    this.editing = true;
    this.activeOption = activeOption;
  }

  private getTodo(): void {
    this.todoService.getTodo(this.activatedRoute.snapshot.params.id)
      .subscribe(todo => this.todo = todo);
  }
}
