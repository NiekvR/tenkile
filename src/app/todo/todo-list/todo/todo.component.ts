import { Component, Input, OnInit } from '@angular/core';
import { Todo } from '../../../models/todo.model';
import { Router } from '@angular/router';
import { TodoService } from '../../todo.service';
import { TagService } from '../../tag.service';
import { take } from 'rxjs/operators';
import { Tag } from '../../../models/tag.model';

@Component({
  selector: 'tkl-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  @Input() todo: Todo;
  @Input() highlighted = false;

  public tag: Tag;


  constructor(private router: Router, private todoService: TodoService, private tagService: TagService) { }

  ngOnInit(): void {
    this.getTag(this.todo.tag);
  }

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

  private getTag(id: string): void {
    this.tagService.getTag(id)
      .pipe(take(1))
      .subscribe(tag => this.tag = tag);
  }

}
