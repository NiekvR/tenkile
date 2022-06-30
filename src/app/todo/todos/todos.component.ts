import { Component, OnDestroy, OnInit } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../todo.service';
import { ReplaySubject, Subscription } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { ListType } from '../../models/enums/list-type.enum';
import { DateService } from '../../shared/date/date.service';
import { Router } from '@angular/router';
import { TagService } from '../tag.service';
import { Tag } from 'src/app/models/tag.model';

@Component({
  selector: 'tkl-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit, OnDestroy {

  public todosByDate: Todo[] = [];
  public todosForSelectedDate: Todo[] = [];
  public todosDone: Todo[] = [];
  public todosByUser: Todo[] = [];
  public todosByTag: { [ tag: string ]: Todo[] };

  public datesWithTodos: Date[] = [];

  public listSelectorOpen = true;
  public sortAscending = true;
  public listType: ListType;
  public ListType = ListType;

  public tags: Tag[];
  public tagOpen = {};

  public selectedDate = new Date();

  private todoSubscription: Subscription;
  private subscriptions: Subscription[] = [];

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private todoService: TodoService, private dateService: DateService, private router: Router,
              private tagService: TagService) { }

  ngOnInit(): void {
    this.getTags();
    this.getListType();
    this.getSelectedDate();
  }

  ngOnDestroy(): void {
    if (!!this.todoSubscription) {
      this.todoSubscription.unsubscribe();
      this.todoSubscription = null;
    }

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public getListType(): void {
    this.subscriptions.push(this.todoService.getTodoListState()
      .pipe(tap(listType => this.listType = listType))
      .subscribe(() => this.setTodos()));
  }

  public getSelectedDate(): void {
    this.subscriptions.push(this.todoService.getCurrentDate()
      .pipe(tap(date => this.selectedDate = date))
      .subscribe(() => this.setTodos()));
  }

  public toggleListSelector(): void {
    this.listSelectorOpen = !this.listSelectorOpen;
  }

  public setSelectedDate(date: Date): void {
    this.todoService.setCurrentDate(date);
    this.setListType(ListType.Planned);
  }

  public setListType(listType: ListType): void {
    this.todoService.setTodoListState(listType);
  }

  public setTodos(): void {
    if (!!this.todoSubscription) {
      this.todoSubscription.unsubscribe();
      this.todoSubscription = null;
    }
    switch (this.listType) {
      case ListType.Todos: this.setTodosByDateAdded(); break;
      case ListType.Planned: this.setTodosByDatePlanned(); break;
      case ListType.Done: this.setTodosDone(); break;
      case ListType.Tag: this.setTodosByTag(); break;
      case ListType.Users: this.setTodosByUser(); break;
    }
  }

  public toggleTagTodo(tag: Tag): void {
    this.tagOpen[ tag.id ] = !this.tagOpen[ tag.id ];
  }

  public openSettings(): void {
    this.router.navigate([ './settings' ]);
  }

  public deleteALlDoneTodos(todos: Todo[]): void {
    this.todoService.removeTodos(todos).subscribe();
  }

  private setTodosByDateAdded(): void {
    this.todoSubscription = this.todoService.getTodos()
      .subscribe(todosByDate => this.todosByDate = todosByDate);
  }

  private setTodosByDatePlanned(): void {
    this.todoSubscription = this.todoService.getTodos()
      .pipe(
        tap(todos => this.todosByDate = todos),
        tap(todos => this.datesWithTodos = this.getDatesWithTodos(todos)),
        map(todos => this.filterPlannedOnDate(todos)))
      .subscribe(todosByDate => this.todosForSelectedDate = todosByDate);
  }

  private setTodosDone(): void {
    this.todoSubscription = this.todoService.getDoneTodos()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(todosDone => this.todosDone = todosDone);
  }

  private setTodosByTag(): void {
    this.todoSubscription = this.todoService.getTodosByTag()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(todosByTag => this.todosByTag = todosByTag);
  }

  private setTodosByUser(): void {
    this.todoSubscription = this.todoService.getTodosByUser()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(todosByUser => this.todosByUser = todosByUser);
  }

  private filterPlannedOnDate(todos: Todo[]): Todo[] {
    return todos.filter(todo => !!todo.plannedDate && this.dateService.isSameDay(todo.plannedDate, this.selectedDate));
  }

  private getDatesWithTodos(todos: Todo[]): Date[] {
    const dates = todos.filter(todo => !!todo.plannedDate).map(todo => todo.plannedDate);
    return dates
      .filter((date, index) =>
        dates.findIndex(selfValue => this.dateService.isSameDay(date, selfValue)) === index);
  }

  private getTags(): void {
    this.tagService.getTags$()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(tags => {
        this.tags = tags;
        tags.forEach(tag => this.tagOpen[ tag.id ] = true);
      });
  }
}
