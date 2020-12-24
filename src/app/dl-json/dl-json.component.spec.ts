import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DlJsonComponent } from './dl-json.component';

describe('DlJsonComponent', () => {
  let component: DlJsonComponent;
  let fixture: ComponentFixture<DlJsonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DlJsonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DlJsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
