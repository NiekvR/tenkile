import { Component, Input, OnInit } from '@angular/core';
import { TodoTag } from '../../models/enums/todo-tag.enum';
import { TodoTagColor } from '../../models/enums/todo-tag-color.enum';
import { TodoTagTitle } from '../../models/enums/todo-tag-title.enum';
import { User } from '../../models/user.model';

@Component({
  selector: 'tkl-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  @Input() user: User;
  @Input() active = false;

  constructor() { }

  ngOnInit(): void {

  }

}
