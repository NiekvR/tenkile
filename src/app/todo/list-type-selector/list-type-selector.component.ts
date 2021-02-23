import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { ListType } from '../../models/enums/list-type.enum';
import { USERS } from '../../../assets/users/users';
import { User } from '../../models/user.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'tkl-list-type-selector',
  templateUrl: './list-type-selector.component.html',
  styleUrls: ['./list-type-selector.component.scss']
})
export class ListTypeSelectorComponent implements OnInit {

  public ListType = ListType;

  @Input() @HostBinding('class.open') open = false;
  @Input() @HostBinding('class.selected') onlyShowSelected = false;
  @Input() activeListType = ListType.Todos;
  @Output() activeListTypeChange = new EventEmitter<ListType>();

  public user: User;

  constructor(private auth: AngularFireAuth) { }

  ngOnInit(): void {
    this.auth.user
      .pipe(take(1), map(user => user.uid))
      .subscribe(uid => this.user = Object.values(USERS).filter(user => user.id !== uid)[ 0 ]);
  }

  public selectListType(listType: ListType): void {
    if (this.activeListType !== listType && !this.onlyShowSelected) {
      this.activeListType = listType;
      this.activeListTypeChange.emit(this.activeListType);
    }
  }
}
