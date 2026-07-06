import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sports } from './sports';

describe('Sports', () => {
  let component: Sports;
  let fixture: ComponentFixture<Sports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sports],
    }).compileComponents();

    fixture = TestBed.createComponent(Sports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('adds a sport with its set count', () => {
    component.openSetDialog(component.sports[0]);
    component.setCount = 4;
    component.saveSport();

    expect(component.selectedSports).toEqual([
      { ...component.sports[0], sets: 4 },
    ]);
    expect(component.activeSport).toBeNull();
  });

  it('updates an already selected sport instead of duplicating it', () => {
    component.openSetDialog(component.sports[0]);
    component.setCount = 2;
    component.saveSport();
    component.openSetDialog(component.sports[0]);
    component.setCount = 5;
    component.saveSport();

    expect(component.selectedSports.length).toBe(1);
    expect(component.selectedSports[0].sets).toBe(5);
  });

  it('removes a selected sport', () => {
    component.openSetDialog(component.sports[0]);
    component.saveSport();
    component.removeSport(component.sports[0].id);

    expect(component.selectedSports).toEqual([]);
  });
});
