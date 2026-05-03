import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetStart } from './get-start';

describe('GetStart', () => {
  let component: GetStart;
  let fixture: ComponentFixture<GetStart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetStart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetStart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
