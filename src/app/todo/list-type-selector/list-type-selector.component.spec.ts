import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTypeSelectorComponent } from './list-type-selector.component';

describe('ListTypeSelectorComponent', () => {
  let component: ListTypeSelectorComponent;
  let fixture: ComponentFixture<ListTypeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTypeSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTypeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
