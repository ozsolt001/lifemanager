import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  movingListElement =
    `hover:[&+li]:translate-x-4 [&:has(+li:hover)]:-translate-x-4
    hover:[&+li+li]:translate-x-3 [&:has(+li+li:hover)]:-translate-x-3
    hover:[&+li+li+li]:translate-x-2 [&:has(+li+li+li:hover)]:-translate-x-2 
    hover:[&+li+li+li+li]:translate-x-1 [&:has(+li+li+li+li:hover)]:-translate-x-1 
    transition-all duration-700 ease-in-out`;

  navigationListElement = `block py-2 px-3 text-heading rounded
    text-white bg-blue-400
    hover:outline-2 outline-offset-2 outline-gray-700/75 
    hover:translate-y-4 hover:scale-140 
    transition-none md:transition-all duration-700 ease-in-out 
    md:dark:hover:bg-transparent
    `;
}
