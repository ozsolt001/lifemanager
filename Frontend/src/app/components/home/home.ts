import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OpenmojiIconComponent } from '../../shared/openmoji-icon/openmoji-icon';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, OpenmojiIconComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

activity = [
  {
    id: 1,
    title: 'Futás',
    description: '5 km futás',
    icon: '1F3C3-200D-2642-FE0F-200D-27A1-FE0F'
  }, 
  {
    id: 2,
    title: 'Úszás',
    description: '30 perc úszás',
    icon: '1F3CA'
  }
];

selectedActivities: any[] = [];

toggleActivity(activity: any): void {
  const exists = this.selectedActivities.some(x => x.id === activity.id);

  if (exists) {
    this.selectedActivities = this.selectedActivities.filter(x => x.id !== activity.id);
  } else {
    this.selectedActivities = [...this.selectedActivities, activity];
  }

  console.log(this.selectedActivities);
}

isSelected(activity: any): boolean {
  return this.selectedActivities.some(x => x.id === activity.id);
}
  
}
