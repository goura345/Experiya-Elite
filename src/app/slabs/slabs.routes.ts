import { Routes } from '@angular/router';

import { SlabListComponent } from './slab-list';
import { AddEditSlabComponent } from './slab';

export const SLAB_ROUTES: Routes = [
    { path: '', component: SlabListComponent },
    { path: 'add', component: AddEditSlabComponent },
    { path: 'edit/:id', component: AddEditSlabComponent }
];