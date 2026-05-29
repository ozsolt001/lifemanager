import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-openmoji-icon',
  standalone: true,
  templateUrl: './openmoji-icon.html',
})
export class OpenmojiIconComponent {
  @Input({ required: true }) code!: string;
  @Input() label = '';
  @Input() size = 32;

  get src(): string {
    return `openemoji/color/svg/${this.code}.svg`;
  }
}