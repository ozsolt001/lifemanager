import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Sports } from './components/sports/sports';
import { Diet } from './components/diet/diet';

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
    }
];

