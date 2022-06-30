import { Component, Input, OnInit } from '@angular/core';
import { Tag } from 'src/app/models/tag.model';

@Component({
  selector: 'tkl-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent {

  @Input() tag: Tag;
  @Input() active = false;

  constructor() { }
}
