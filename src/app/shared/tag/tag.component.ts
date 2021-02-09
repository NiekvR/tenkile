import { Component, Input, OnInit } from '@angular/core';
import { TodoTag } from '../../models/enums/todo-tag.enum';
import { TodoTagColor } from '../../models/enums/todo-tag-color.enum';
import { TodoTagTitle } from '../../models/enums/todo-tag-title.enum';

@Component({
  selector: 'tkl-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {

  @Input() tag: TodoTag;
  @Input() active = false;

  public Tag = TodoTag;
  public TagColor = TodoTagColor;
  public TagTitle = TodoTagTitle

  constructor() { }

  ngOnInit(): void {

  }

}
