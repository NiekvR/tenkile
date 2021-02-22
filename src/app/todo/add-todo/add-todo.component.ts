import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../todo.service';
import { TodoTag } from '../../models/enums/todo-tag.enum';
import { USERS } from '../../../assets/users/users';
import { User } from '../../models/user.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { take } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';

@Component({
  selector: 'tkl-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss']
})
export class AddTodoComponent implements OnInit {
  @Input() todo: Todo;
  @Input() update = false;
  @Input() editing = false;
  @Input() activeOption: 'text' | 'tag' | 'date' | 'note' | 'user' = 'text';
  @Output() editingChange = new EventEmitter<boolean>();

  public Tag = TodoTag;
  public USERS = USERS;
  private focus = true;

  constructor(private el: ElementRef, private todoService: TodoService, public auth: AngularFireAuth) { }

  ngOnInit(): void {
    if (!this.todo) {
      combineLatest([ this.auth.user.pipe(take(1)), this.todoService.getNextOrder() ])
        .subscribe(([user, order ]) => this.todo = {
          task: '',
          date: new Date(),
          done: false,
          user: user.uid,
          order
        });
    }
  }

  public toggleEditing(): void {
    this.editing = !this.editing;
    if (this.editing) {
      setTimeout(() => this.onFocus(), 0);
    } else {
      this.clearAddTodo();
    }
  }

  public addTodo(): void {
    if (!!this.todo.task) {
      this.todoService.addTodo(this.todo)
        .subscribe(() => {
          this.clearAddTodo();
          if (this.update) {
            this.editing = false;
            this.editingChange.emit(this.editing);
          }
        });
    }
  }

  public selectOption(option: 'text' | 'tag' | 'date' | 'note' | 'user'): void {
    this.activeOption = option;
  }

  public setActiveTag(tag: TodoTag): void {
    if (this.todo.tag === tag) {
      this.todo.tag = null;
    } else {
      this.todo.tag = tag;
    }
  }

  public setUser(user: User): void {
    this.todo.user = user.id;
  }

  // public onFocus(): void {
  //   setTimeout(() => window.scroll(0, 0), 0);
  // }

  public onFocus(): void {
    this.focusAndOpenKeyboard(this.el.nativeElement.querySelector('input'));
  }

  private clearAddTodo(): void {
    combineLatest([ this.auth.user.pipe(take(1)), this.todoService.getNextOrder() ])
      .subscribe(([user, order]) => this.todo = {
        task: '',
        date: new Date(),
        done: false,
        user: user.uid,
        order
      });
    this.selectOption('text');
  }

  private focusAndOpenKeyboard(el): void {
    const timeout = 100;
    if (el && this.focus) {
      // Align temp input element approximately where the input element is
      // so the cursor doesn't jump around
      const tempEl = document.createElement('input');
      tempEl.style.position = 'absolute';
      tempEl.style.top = (el.offsetTop + 7) + 'px';
      tempEl.style.left = el.offsetLeft + 'px';

      // @ts-ignore
      tempEl.style.height = 0;
      // @ts-ignore
      tempEl.style.opacity = 0;
      // Put this temp element as a child of the page <body> and focus on it
      document.body.appendChild(tempEl);
      tempEl.focus();

      // The keyboard is open. Now do a delayed focus on the target element
      setTimeout(() => {
        el.focus();
        el.click();
        this.focus = false;
        // Remove the temp element
        document.body.removeChild(tempEl);
      }, timeout);
    }
  }
}
