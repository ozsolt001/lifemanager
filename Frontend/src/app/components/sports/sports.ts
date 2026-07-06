import { Component, HostListener } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Sport {
  id: number;
  name: string;
  category: string;
}

enum MeasurementType {
  Sets = 'sets',
  Minutes = 'minutes',
}

type SelectedSport = Sport &
  (
    | {
        measurementType: MeasurementType.Sets;
        sets: number;
      }
    | {
        measurementType: MeasurementType.Minutes;
        minutes: number;
      }
  );

@Component({
  selector: 'app-sports',
  imports: [FormsModule, NgClass],
  templateUrl: './sports.html',
  styleUrl: './sports.css',
  host: {
    class: 'fixed inset-x-0 bottom-0 top-[4.5rem] z-[1] block overflow-hidden bg-[#f5f7fb] text-[#172033]',
  },
})
export class Sports {
  readonly sports: Sport[] = [
    { id: 1, name: 'Archery', category: 'Target' },
    { id: 2, name: 'Badminton', category: 'Racket' },
    { id: 3, name: 'Baseball', category: 'Team' },
    { id: 4, name: 'Basketball', category: 'Team' },
    { id: 5, name: 'Boxing', category: 'Combat' },
    { id: 6, name: 'Climbing', category: 'Outdoor' },
    { id: 7, name: 'Cricket', category: 'Team' },
    { id: 8, name: 'Cycling', category: 'Endurance' },
    { id: 9, name: 'Dancing', category: 'Fitness' },
    { id: 10, name: 'Fencing', category: 'Combat' },
    { id: 11, name: 'Football', category: 'Team' },
    { id: 12, name: 'Golf', category: 'Target' },
    { id: 13, name: 'Gymnastics', category: 'Fitness' },
    { id: 14, name: 'Handball', category: 'Team' },
    { id: 15, name: 'Hiking', category: 'Outdoor' },
    { id: 16, name: 'Hockey', category: 'Team' },
    { id: 17, name: 'Judo', category: 'Combat' },
    { id: 18, name: 'Kayaking', category: 'Water' },
    { id: 19, name: 'Kickboxing', category: 'Combat' },
    { id: 20, name: 'Pilates', category: 'Fitness' },
    { id: 21, name: 'Rowing', category: 'Water' },
    { id: 22, name: 'Running', category: 'Endurance' },
    { id: 23, name: 'Skateboarding', category: 'Outdoor' },
    { id: 24, name: 'Skiing', category: 'Winter' },
    { id: 25, name: 'Squash', category: 'Racket' },
    { id: 26, name: 'Swimming', category: 'Water' },
    { id: 27, name: 'Table tennis', category: 'Racket' },
    { id: 28, name: 'Tennis', category: 'Racket' },
    { id: 29, name: 'Volleyball', category: 'Team' },
    { id: 30, name: 'Weight training', category: 'Strength' },
    { id: 31, name: 'Wrestling', category: 'Combat' },
    { id: 32, name: 'Yoga', category: 'Fitness' },
  ];

  selectedSports: SelectedSport[] = [];
  activeSport: Sport | null = null;
  measurementType: MeasurementType = MeasurementType.Sets;
  setCount = 1;
  minuteCount = 1;

  openSetDialog(sport: Sport): void {
    this.activeSport = sport;
    const selectedSport = this.selectedSports.find((item) => item.id === sport.id);

    this.measurementType = selectedSport?.measurementType ?? MeasurementType.Sets;
    this.setCount = selectedSport?.measurementType === MeasurementType.Sets ? selectedSport.sets : 1;
    this.minuteCount = selectedSport?.measurementType === MeasurementType.Minutes ? selectedSport.minutes : 1;
  }

  closeSetDialog(): void {
    this.activeSport = null;
  }

  saveSport(): void {
    if (!this.activeSport) {
      return;
    }

    const selectedValue = this.measurementType === MeasurementType.Sets ? this.setCount : this.minuteCount;

    if (!Number.isInteger(selectedValue) || selectedValue < 1) {
      return;
    }

    const selection: SelectedSport =
      this.measurementType === MeasurementType.Sets
        ? { ...this.activeSport, measurementType: MeasurementType.Sets, sets: selectedValue }
        : { ...this.activeSport, measurementType: MeasurementType.Minutes, minutes: selectedValue };
    const existingIndex = this.selectedSports.findIndex((item) => item.id === selection.id);

    if (existingIndex === -1) {
      this.selectedSports = [...this.selectedSports, selection];
    } else {
      this.selectedSports = this.selectedSports.map((item) =>
        item.id === selection.id ? selection : item,
      );
    }

    this.closeSetDialog();
  }

  removeSport(sportId: number): void {
    this.selectedSports = this.selectedSports.filter((sport) => sport.id !== sportId);
  }

  isSelected(sportId: number): boolean {
    return this.selectedSports.some((sport) => sport.id === sportId);
  }

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    this.closeSetDialog();
  }
}

