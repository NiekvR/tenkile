import { Component, OnDestroy, OnInit } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../todo.service';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ListType } from '../../models/enums/list-type.enum';
import { TodoTag } from '../../models/enums/todo-tag.enum';
import { TodoTagTitle } from '../../models/enums/todo-tag-title.enum';
import { TodoTagColor } from '../../models/enums/todo-tag-color.enum';
import { DateService } from '../../shared/date/date.service';

@Component({
  selector: 'tkl-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
  providers: [ TodoService ]
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
  public listType = ListType.Planned;
  public ListType = ListType;
  public TodoTag = TodoTag;
  public TodoTagTitle = TodoTagTitle;
  public TodoTagColor = TodoTagColor;
  public tagOpen = {
    [TodoTag.FutureForNature]: true,
    [TodoTag.NIOO]: true,
    [TodoTag.APP]: true,
    [TodoTag.Family]: true
  };

  public selectedDate = new Date();

  private todoSubscription: Subscription;

  constructor(private todoService: TodoService, private dateService: DateService) { }

  ngOnInit(): void {
    this.setTodos(this.listType);
  }

  ngOnDestroy(): void {
    if (!!this.todoSubscription) {
      this.todoSubscription.unsubscribe();
      this.todoSubscription = null;
    }
  }

  public toggleListSelector(): void {
    this.listSelectorOpen = !this.listSelectorOpen;
  }

  public setTodos(listType: ListType): void {
    if (!!this.todoSubscription) {
      this.todoSubscription.unsubscribe();
      this.todoSubscription = null;
    }
    this.listType = listType;
    switch (listType) {
      case ListType.Todos: this.setTodosByDateAdded(); break;
      case ListType.Planned: this.setTodosByDatePlanned(); break;
      case ListType.Done: this.setTodosDone(); break;
      case ListType.Tag: this.setTodosByTag(); break;
      case ListType.Users: this.setTodosByUser(); break;
    }
  }

  public toggleTagTodo(tag: TodoTag): void {
    this.tagOpen[ tag ] = !this.tagOpen[ tag ];
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
      .subscribe(todosByDate => {
        console.log(this.datesWithTodos);
        this.todosForSelectedDate = todosByDate
      });
  }

  private setTodosDone(): void {
    this.todoSubscription = this.todoService.getDoneTodos()
      .subscribe(todosDone => this.todosDone = todosDone);
  }

  private setTodosByTag(): void {
    this.todoSubscription = this.todoService.getTodosByTag()
      .subscribe(todosByTag => this.todosByTag = todosByTag);
  }

  private setTodosByUser(): void {
    this.todoSubscription = this.todoService.getTodosByUser()
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
}
