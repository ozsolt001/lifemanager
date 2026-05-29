import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenmojiIcon } from './openmoji-icon';

describe('OpenmojiIcon', () => {
  let component: OpenmojiIcon;
  let fixture: ComponentFixture<OpenmojiIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenmojiIcon],
    }).compileComponents();

    fixture = TestBed.createComponent(OpenmojiIcon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
