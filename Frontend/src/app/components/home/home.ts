import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OpenmojiIconComponent } from '../../shared/openmoji-icon/openmoji-icon';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, OpenmojiIconComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
