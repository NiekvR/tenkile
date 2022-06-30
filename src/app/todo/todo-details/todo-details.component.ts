import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../todo.service';
import { USERS } from '../../../assets/users/users';
import { ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { TagService } from '../tag.service';
import { Tag } from 'src/app/models/tag.model';

@Component({
  selector: 'tkl-todo-details',
  templateUrl: './todo-details.component.html',
  styleUrls: ['./todo-details.component.scss'],
  providers: [ TodoService ]
})
export class TodoDetailsComponent implements OnInit, OnDestroy {

  public todo: Todo;
  public tag: Tag;

  public editing = false;
  public activeOption: 'text' | 'tag' | 'date' | 'note' | 'user';
  public USERS = USERS;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private activatedRoute: ActivatedRoute, private todoService: TodoService, private router: Router,
              private tagService: TagService) { }

  ngOnInit(): void {
    this.getTodo();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
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
      .pipe(takeUntil(this.destroyed$))
      .subscribe(todo => {
        this.todo = todo;
        this.getTag();
      });
  }

  private getTag(): void {
    this.tagService.getTag(this.todo.tag)
      .pipe(take(1))
      .subscribe(tag => this.tag = tag);
  }
}
