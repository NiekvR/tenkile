import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tag } from '../../models/tag.model';
import { TagService } from '../tag.service';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tkl-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  public addingTag = false;
  public newTag: Tag;
  public hexError = false;
  public tags: Tag[];

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private router: Router, private tagService: TagService) { }

  ngOnInit(): void {
    this.getTags$();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public backTodos(): void {
    this.router.navigate([ './todos' ]);
  }

  public getTags$(): void {
    this.tagService.getTags$()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(tags => this.tags = tags);
  }

  public addTag(): void {
    if (!this.addingTag) {
      this.addingTag = true;
      this.newTag = {name: '', color: ''} as Tag;
    } else {
      if (this.newTag?.name?.length > 0 && this.checkIfHex()) {
        this.tagService.addTag(this.newTag).subscribe(() => {
          this.newTag = {name: '', color: ''} as Tag;
          this.addingTag = false;
        });
      }
    }
  }

  public deleteTag(tag: Tag): void {
    this.tagService.removeTag(tag);
  }

  public updateTag(tag: Tag): void {
    this.addingTag = true;
    this.newTag = tag;
  }

  public blurHexCheck(): void {
    if (this.checkIfHex()) {
      this.hexError = false;
    } else {
      this.hexError = true;
    }
  }

  private checkIfHex(): boolean {
    return /^#[0-9A-F]{6}$/i.test(this.newTag.color);
  }

}
