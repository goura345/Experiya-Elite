import { Routes } from '@angular/router';

import { InsurerListComponent } from './insurer-list';
import { AddEditInsurerComponent } from './insurer';

export const AGENT_ROUTES: Routes = [
    { path: '', component: InsurerListComponent },
    { path: 'add', component: AddEditInsurerComponent },
    { path: 'edit/:id', component: AddEditInsurerComponent }
];