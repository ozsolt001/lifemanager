import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Diary } from './diary';

describe('Diary', () => {
  let component: Diary;
  let fixture: ComponentFixture<Diary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Diary],
    }).compileComponents();

    fixture = TestBed.createComponent(Diary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should stop showing the loading state when editor initialization fails', () => {
    (component as unknown as { handleEditorInitializationFailure: (error?: unknown) => void }).handleEditorInitializationFailure(
      new Error('boom'),
    );

    expect(component.editorReady).toBeTrue();
    expect(component.editorError).toContain('Unable to load');
  });
});
