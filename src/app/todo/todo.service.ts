import { Injectable, OnDestroy } from '@angular/core';
import { Todo } from '../models/todo.model';
import { BehaviorSubject, from, Observable, ReplaySubject } from 'rxjs';
import { filter, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { ListType } from '../models/enums/list-type.enum';
import { TagService } from './tag.service';
import { Tag } from '../models/tag.model';
import { TodoTag } from '../models/enums/todo-tag.enum';

@Injectable({
  providedIn: 'root',
})
export class TodoService implements OnDestroy {
  private collection: AngularFirestoreCollection<Todo>;

  private todos$ = new BehaviorSubject<Todo[]>(null);
  private state$ = new BehaviorSubject<ListType>(ListType.Todos);
  private date$ = new BehaviorSubject<Date>(new Date());

  public nextOrder = new BehaviorSubject<number>(0);

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  private tags: Tag[];
  private tagEnum: TodoTag;

  constructor(private db: AngularFirestore, private auth: AngularFireAuth, private tagService: TagService) {
    this.getTags();
    this.collection = this.db.collection<Todo>('todo');
    this.initTodos();
    this.updateNextOrder();
  }

  ngOnDestroy(): void {
    this.todos$.complete();
    this.todos$ = null;
    this.state$.complete();
    this.state$ = null;
    this.date$.complete();
    this.date$ = null;
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public initTodos(): void {
    this.collection.snapshotChanges()
      .pipe(
        map(list => list.map(a => {
          let item = a.payload.doc.data() as Todo;
          (item as any).id = a.payload.doc.id;
          item = this.convertItem(item);
          return item;
        })))
      .subscribe(todos => this.todos$.next(todos));
  }

  public setTodoListState(state: ListType): void {
    this.state$.next(state);
  }

  public getTodoListState(): Observable<ListType> {
    return this.state$.asObservable();
  }

  public setCurrentDate(date: Date): void {
    this.date$.next(date);
  }

  public getCurrentDate(): Observable<Date> {
    return this.date$.asObservable();
  }

  public getTodos$(): Observable<Todo[]> {
    return this.todos$.asObservable()
      .pipe(
        filter(todos => !!todos),
        switchMap(todos => this.filterTodosOfOtherUsers(todos)));
  }

  public getAllTodos$(): Observable<Todo[]> {
    return this.todos$.asObservable().pipe(filter(todos => !!todos));
  }

  public getDoneTodos(): Observable<Todo[]> {
    return this.getTodos$()
      .pipe(map(todos => todos.filter(todo => todo.done)));
  }

  public getTodo(id: string): Observable<Todo> {
    return this.getTodos$()
      .pipe(map(todos => todos.find(todo => todo.id === id)));
  }

  public getTodosByTag(): Observable<{ [ tag: string ]: Todo[] }> {
    return this.getTodos()
      .pipe(map(todos => this.sortTodosOnTags(todos)));
  }

  public getTodosByUser(): Observable<Todo[]> {
    return this.getAllTodos$()
      .pipe(
        map(todos => todos.filter(todo => !todo.done)),
        switchMap(todos => this.filterTodosOfCurrentUser(todos)));
  }

  public getTodos(): Observable<Todo[]> {
    return this.getTodos$()
      .pipe(
        map(todos => todos.filter(todo => !todo.done)),
        map(todos => todos.sort((a, b) => b.order - a.order)));
  }

  public addTodo(todo: Todo): Observable<Todo> {
    return !!todo.id ? this.update(todo) : this.add(todo);
  }

  public getNextOrder(): Observable<number> {
    return this.nextOrder.asObservable();
  }

  public updateListOrder(todos: Todo[]): Observable<any> {
    const batch = this.db.firestore.batch();
    todos.forEach(todo => {
      const ref = this.db.firestore.collection('todo').doc(todo.id);
      batch.update(ref, { order: todo.order });
    });

    return from(batch.commit());
  }

  public removeTodo(todo: Todo): void {
    this.collection.doc(todo.id).delete();
  }

  public removeTodos(todos: Todo[]): Observable<void> {
    const batch = this.db.firestore.batch();

    todos.forEach(todo => {
      const delTodo = this.db.firestore.collection('todo').doc(todo.id);
      batch.delete(delTodo);
    });

    return from(batch.commit());
  }

  private add(item: Todo): Observable<Todo> {
    delete (item as any).id;
    return from(this.collection.add(item)).pipe(switchMap(document => from(document.get()).pipe(
        map(doc => {
          let convertItem = doc.data() as Todo;
          (convertItem as any).id = doc.id;
          convertItem = this.convertItem(convertItem);
          return convertItem;
        })
      )));
  }

  private update(item: Todo): Observable<Todo> {
    return from(this.collection.doc((item as any).id).update(item)).pipe(map(() => item));
  }

  private sortTodosOnTags(todos: Todo[]): { [ tag: string ]: Todo[] } {
    const todosByTag = {};
    this.tags.forEach(tag => todosByTag[ tag.id ] = todos.filter(todo => todo.tag === tag.id));
    return todosByTag;
  }

  private convertItem(item: any): Todo {
    if (!!item.date) {
      item.date = item.date.toDate();
    }
    if (!!item.plannedDate) {
      item.plannedDate = item.plannedDate.toDate();
    }
    return item;
  }

  private filterTodosOfCurrentUser(todos: Todo[]): Observable<Todo[]> {
    return this.auth.user
      .pipe(take(1), map(user => todos.filter(todo => todo.user !== user.uid)));
  }

  private filterTodosOfOtherUsers(todos: Todo[]): Observable<Todo[]> {
    return this.auth.user
      .pipe(take(1), map(user => todos.filter(todo => todo.user === user.uid)));
  }

  private updateNextOrder(): void {
    this.getTodos()
      .pipe(map(todos => todos[ 0 ].order))
      .subscribe(highestOrder => this.nextOrder.next(highestOrder + 1));
  }

  private getTags(): void {
    this.tagService.getTags$()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(tags => this.tags = tags);
  }
}
