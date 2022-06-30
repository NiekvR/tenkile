import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodosComponent } from './todos/todos.component';
import { SharedModule } from '../shared/shared.module';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoComponent } from './todo-list/todo/todo.component';
import { AddTodoComponent } from './add-todo/add-todo.component';
import { TodoDetailsComponent } from './todo-details/todo-details.component';
import { ListTypeSelectorComponent } from './list-type-selector/list-type-selector.component';
import { SettingsComponent } from './settings/settings.component';



@NgModule({
  declarations: [
    TodosComponent,
    TodoListComponent,
    TodoComponent,
    AddTodoComponent,
    TodoDetailsComponent,
    ListTypeSelectorComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class TodoModule { }
