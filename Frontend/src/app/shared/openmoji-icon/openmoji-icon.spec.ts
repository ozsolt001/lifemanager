import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenmojiIconComponent } from './openmoji-icon';

describe('OpenmojiIconComponent', () => {
  let component: OpenmojiIconComponent;
  let fixture: ComponentFixture<OpenmojiIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenmojiIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OpenmojiIconComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
