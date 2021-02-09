import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodosComponent } from './todo/todos/todos.component';
import { TodoDetailsComponent } from './todo/todo-details/todo-details.component';
import { LoginComponent } from './authentication/login/login.component';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToTodos = () => redirectLoggedInTo(['todos']);

const routes: Routes = [
  {path: '', redirectTo: 'todos', pathMatch: 'full', data: {animation: ''} },
  {path: 'login', component: LoginComponent, ...canActivate(redirectLoggedInToTodos) },
  {path: 'todos', component: TodosComponent, data: {animation: 'Todos'}, ...canActivate(redirectUnauthorizedToLogin) },
  {path: 'todo/:id', component: TodoDetailsComponent, data: {animation: 'Todo'}, ...canActivate(redirectUnauthorizedToLogin) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
