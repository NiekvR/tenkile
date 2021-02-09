import { Injectable, OnDestroy } from '@angular/core';
import { Todo } from '../models/todo.model';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { TodoTag } from '../models/enums/todo-tag.enum';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class TodoService implements OnDestroy {
  private collection: AngularFirestoreCollection<Todo>;

  private todos$ = new BehaviorSubject<Todo[]>(null);

  public nextOrder = new BehaviorSubject<number>(0);

  constructor(private db: AngularFirestore, private auth: AngularFireAuth) {
    this.collection = this.db.collection<Todo>('todo');
    this.initTodos();
    this.updateNextOrder();
  }

  ngOnDestroy(): void {
    this.todos$.complete();
    this.todos$ = null;
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
    return this.getTodos$()
      .pipe(map(todos => this.sortTodosOnTags(todos)));
  }

  public getTodosByUser(): Observable<Todo[]> {
    return this.getAllTodos$()
      .pipe(switchMap(todos => this.filterTodosOfCurrentUser(todos)));
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
    return {
      [TodoTag.FutureForNature]: todos.filter(todo => todo.tag === TodoTag.FutureForNature),
      [TodoTag.NIOO]: todos.filter(todo => todo.tag === TodoTag.NIOO),
      [TodoTag.APP]: todos.filter(todo => todo.tag === TodoTag.APP),
      [TodoTag.Family]: todos.filter(todo => todo.tag === TodoTag.Family)
    };
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
}
