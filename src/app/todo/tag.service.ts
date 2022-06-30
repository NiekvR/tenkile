import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Tag } from '../models/tag.model';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TagService implements OnDestroy {
  private collection: AngularFirestoreCollection<Tag>;

  private tags$ = new BehaviorSubject<Tag[]>(null);

  constructor(private db: AngularFirestore) {
    this.collection = this.db.collection<Tag>('tag');
    this.initTags();
  }

  ngOnDestroy(): void {
    this.tags$.complete();
    this.tags$ = null;
  }

  public initTags(): void {
    this.collection.snapshotChanges()
      .pipe(
        map(list => list.map(a => {
          const item = a.payload.doc.data() as Tag;
          (item as any).id = a.payload.doc.id;
          return item;
        })))
      .subscribe(todos => this.tags$.next(todos));
  }

  public getTags$(): Observable<Tag[]> {
    return this.tags$.asObservable()
      .pipe(filter(todos => !!todos));
  }

  public getTag(id: string): Observable<Tag> {
    return this.getTags$()
      .pipe(map(tags => tags.find(tag => tag.id === id)));
  }

  public addTag(tag: Tag): Observable<Tag> {
    return !!tag.id ? this.update(tag) : this.add(tag);
  }

  public removeTag(tag: Tag): void {
    this.collection.doc(tag.id).delete();
  }

  private add(item: Tag): Observable<Tag> {
    delete (item as any).id;
    return from(this.collection.add(item)).pipe(switchMap(document => from(document.get()).pipe(
      map(doc => {
        const convertItem = doc.data() as Tag;
        (convertItem as any).id = doc.id;
        return convertItem;
      })
    )));
  }

  private update(item: Tag): Observable<Tag> {
    return from(this.collection.doc((item as any).id).update(item)).pipe(map(() => item));
  }
}
