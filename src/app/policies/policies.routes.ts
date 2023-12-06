import { Routes } from '@angular/router';

import { EntrylistComponent } from './policylist';
import { AddEditPolicyComponent } from './motor/add-edit-policy';
import { NonMotorComponent } from './non-motor/non-motor';
// import { AddEditComponent } from './';

export const POLICY_ROUTES: Routes = [
    { path: '', component: EntrylistComponent },
    { path: 'motor/add', component: AddEditPolicyComponent },
    { path: 'motor/edit/:id', component: AddEditPolicyComponent },
 
    { path: 'non-motor/add', component: NonMotorComponent },
    { path: 'non-motor/edit/:id', component: NonMotorComponent }

];