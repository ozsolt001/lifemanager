import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type DietSection = 'metrics' | MealType;
type MealType = 'breakfast' | 'lunch' | 'dinner';

interface WeightEntry {
  label: string;
  value: number;
}

interface FoodItem {
  id: number;
  name: string;
  icon: string;
  calories: number;
}

interface SectionTab {
  id: DietSection;
  label: string;
}

@Component({
  selector: 'app-diet',
  imports: [FormsModule, NgClass],
  templateUrl: './diet.html',
  styleUrl: './diet.css',
  host: {
    class: 'fixed inset-x-0 bottom-0 top-[4.5rem] z-[1] block overflow-hidden bg-[#eff6ff] text-[#172033]',
  },
})
export class Diet {
  readonly tabs: SectionTab[] = [
    { id: 'metrics', label: 'Body' },
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'lunch', label: 'Lunch' },
    { id: 'dinner', label: 'Dinner' },
  ];

  readonly mealOptions: Record<MealType, FoodItem[]> = {
    breakfast: [
      { id: 1, name: 'Bread', icon: '\u{1F35E}', calories: 80 },
      { id: 2, name: 'Eggs', icon: '\u{1F373}', calories: 155 },
      { id: 3, name: 'Bacon', icon: '\u{1F953}', calories: 120 },
      { id: 4, name: 'Oatmeal', icon: '\u{1F963}', calories: 150 },
      { id: 5, name: 'Yogurt', icon: '\u{1F95B}', calories: 95 },
      { id: 6, name: 'Fruit', icon: '\u{1F353}', calories: 60 },
    ],
    lunch: [
      { id: 7, name: 'Rice', icon: '\u{1F35A}', calories: 205 },
      { id: 8, name: 'Chicken', icon: '\u{1F357}', calories: 190 },
      { id: 9, name: 'Salad', icon: '\u{1F957}', calories: 90 },
      { id: 10, name: 'Soup', icon: '\u{1F372}', calories: 130 },
      { id: 11, name: 'Sandwich', icon: '\u{1F96A}', calories: 280 },
      { id: 12, name: 'Pasta', icon: '\u{1F35D}', calories: 320 },
    ],
    dinner: [
      { id: 13, name: 'Fish', icon: '\u{1F41F}', calories: 180 },
      { id: 14, name: 'Potatoes', icon: '\u{1F954}', calories: 160 },
      { id: 15, name: 'Vegetables', icon: '\u{1F966}', calories: 70 },
      { id: 16, name: 'Steak', icon: '\u{1F969}', calories: 300 },
      { id: 17, name: 'Rice bowl', icon: '\u{1F35B}', calories: 350 },
      { id: 18, name: 'Tea', icon: '\u{1F375}', calories: 5 },
    ],
  };

  activeSection: DietSection = 'metrics';
  height = 175;
  weight = 72;

  weightHistory: WeightEntry[] = [
    { label: 'Mon', value: 73.2 },
    { label: 'Tue', value: 72.9 },
    { label: 'Wed', value: 72.6 },
    { label: 'Thu', value: 72.8 },
    { label: 'Fri', value: 72.3 },
  ];

  selectedMeals: Record<MealType, FoodItem[]> = {
    breakfast: [],
    lunch: [],
    dinner: [],
  };

  get isMealSection(): boolean {
    return this.activeSection !== 'metrics';
  }

  get activeMeal(): MealType {
    return this.activeSection === 'metrics' ? 'breakfast' : this.activeSection;
  }

  get activeMealTitle(): string {
    return this.tabs.find((tab) => tab.id === this.activeMeal)?.label ?? 'Meal';
  }

  get activeMealOptions(): FoodItem[] {
    return this.mealOptions[this.activeMeal];
  }

  get activePlate(): FoodItem[] {
    return this.selectedMeals[this.activeMeal];
  }

  get latestWeight(): number {
    return this.weightHistory.at(-1)?.value ?? this.weight;
  }

  get trendValue(): number {
    if (this.weightHistory.length < 2) {
      return 0;
    }

    return Number((this.latestWeight - this.weightHistory[0].value).toFixed(1));
  }

  get trendLabel(): string {
    if (this.trendValue === 0) {
      return 'Stable';
    }

    return this.trendValue > 0 ? 'Trending up' : 'Trending down';
  }

  get graphPoints(): string {
    if (this.weightHistory.length === 0) {
      return '';
    }

    const values = this.weightHistory.map((entry) => entry.value);
    const min = Math.min(...values) - 0.5;
    const max = Math.max(...values) + 0.5;
    const range = max - min || 1;
    const width = 320;
    const height = 130;

    return this.weightHistory
      .map((entry, index) => {
        const x = this.weightHistory.length === 1 ? width / 2 : (index / (this.weightHistory.length - 1)) * width;
        const y = height - ((entry.value - min) / range) * height;

        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  setSection(section: DietSection): void {
    this.activeSection = section;
  }

  saveMetrics(): void {
    if (!Number.isFinite(this.weight) || this.weight <= 0 || !Number.isFinite(this.height) || this.height <= 0) {
      return;
    }

    const nextEntry: WeightEntry = {
      label: `#${this.weightHistory.length + 1}`,
      value: Number(this.weight.toFixed(1)),
    };

    this.weightHistory = [...this.weightHistory.slice(-6), nextEntry];
  }

  addFood(food: FoodItem): void {
    const meal = this.activeMeal;
    this.selectedMeals = {
      ...this.selectedMeals,
      [meal]: [...this.selectedMeals[meal], food],
    };
  }

  removeFood(index: number): void {
    const meal = this.activeMeal;
    this.selectedMeals = {
      ...this.selectedMeals,
      [meal]: this.selectedMeals[meal].filter((_, itemIndex) => itemIndex !== index),
    };
  }

  mealCalories(meal: MealType = this.activeMeal): number {
    return this.selectedMeals[meal].reduce((total, food) => total + food.calories, 0);
  }
}
