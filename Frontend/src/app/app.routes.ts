import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Sports } from './components/sports/sports';
import { Diet } from './components/diet/diet';
import { Learning } from './components/learning/learning';
import { Books } from './components/books/books';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    component: Home,
  },
  {
    path: 'sports',
    title: 'Sports',
    component: Sports,
  },
  {
    path: 'diet',
    title: 'Diet',
    component: Diet,
  },
  {
    path: 'learning',
    title: 'Learning',
    component: Learning,
  },
  {
    path: 'books',
    title: 'Books',
    component: Books,
  },
];
