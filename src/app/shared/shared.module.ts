import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SortablejsModule } from 'ngx-sortablejs';
import { FormsModule } from '@angular/forms';
import { EnumToArrayPipe } from './enum-to-array/enum-to-array.pipe';
import { CalendarComponent } from './calendar/calendar.component';
import { ObjectToArrayPipe } from './object-to-array/object-to-array.pipe';
import { TagComponent } from './tag/tag.component';
import { UserComponent } from './user/user.component';



@NgModule({
  declarations: [
    HeaderComponent,
    EnumToArrayPipe,
    CalendarComponent,
    ObjectToArrayPipe,
    TagComponent,
    UserComponent
  ],
  exports: [
    HeaderComponent,
    SortablejsModule,
    FormsModule,
    EnumToArrayPipe,
    CalendarComponent,
    TagComponent,
    UserComponent,
    ObjectToArrayPipe
  ],
  imports: [
    CommonModule,
    SortablejsModule.forRoot({ animation: 150 }),
    FormsModule
  ]
})
export class SharedModule { }
