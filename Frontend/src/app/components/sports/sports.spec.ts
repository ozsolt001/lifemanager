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

  it('adds a sport with only its set count when sets are selected', () => {
    component.openSetDialog(component.sports[0]);
    component.measurementType = 'sets';
    component.setCount = 4;
    component.minuteCount = 20;
    component.saveSport();

    expect(component.selectedSports).toEqual([
      { ...component.sports[0], measurementType: 'sets', sets: 4 },
    ]);
    expect('minutes' in component.selectedSports[0]).toBe(false);
    expect(component.activeSport).toBeNull();
  });

  it('adds a sport with only its minute count when minutes are selected', () => {
    component.openSetDialog(component.sports[0]);
    component.measurementType = 'minutes';
    component.setCount = 4;
    component.minuteCount = 30;
    component.saveSport();

    expect(component.selectedSports).toEqual([
      { ...component.sports[0], measurementType: 'minutes', minutes: 30 },
    ]);
    expect('sets' in component.selectedSports[0]).toBe(false);
    expect(component.activeSport).toBeNull();
  });

  it('updates an already selected sport instead of duplicating it', () => {
    component.openSetDialog(component.sports[0]);
    component.measurementType = 'sets';
    component.setCount = 2;
    component.saveSport();
    component.openSetDialog(component.sports[0]);
    component.measurementType = 'minutes';
    component.minuteCount = 15;
    component.saveSport();

    expect(component.selectedSports.length).toBe(1);
    expect(component.selectedSports[0]).toEqual({
      ...component.sports[0],
      measurementType: 'minutes',
      minutes: 15,
    });
    expect('sets' in component.selectedSports[0]).toBe(false);
  });

  it('restores the saved measurement type and value when reopening a selected sport', () => {
    component.openSetDialog(component.sports[0]);
    component.measurementType = 'minutes';
    component.minuteCount = 25;
    component.saveSport();

    component.openSetDialog(component.sports[0]);

    expect(component.measurementType).toBe('minutes');
    expect(component.minuteCount).toBe(25);
    expect(component.setCount).toBe(1);
  });

  it('removes a selected sport', () => {
    component.openSetDialog(component.sports[0]);
    component.saveSport();
    component.removeSport(component.sports[0].id);

    expect(component.selectedSports).toEqual([]);
  });
});
