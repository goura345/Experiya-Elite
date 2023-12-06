import { Routes } from '@angular/router';

import { EntrylistComponent } from './policylist';
import { MotorComponent } from './motor/motor';
import { NonMotorComponent } from './non-motor/non-motor';
// import { AddEditComponent } from './';

export const POLICY_ROUTES: Routes = [
    { path: '', component: EntrylistComponent },
    { path: 'motor/add', component: MotorComponent },
    { path: 'motor/edit/:id', component: MotorComponent },
 
    { path: 'non-motor/add', component: NonMotorComponent },
    { path: 'non-motor/edit/:id', component: NonMotorComponent }

];