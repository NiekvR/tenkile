import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { TodoModule } from './todo/todo.module';
import 'hammerjs';

import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AuthenticationModule } from './authentication/authentication.module';
import { TodoService } from './todo/todo.service';

registerLocaleData(localeNl);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    AppRoutingModule,
    TodoModule,
    HammerModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AuthenticationModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'nl' },
    TodoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
