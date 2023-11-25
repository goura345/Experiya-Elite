import { Routes } from '@angular/router';

import { EntrylistComponent } from './policylist';
import { AddEditPolicyComponent } from './add-edit-policy';
// import { AddEditComponent } from './';

export const POLICY_ROUTES: Routes = [
    { path: '', component: EntrylistComponent },
    { path: 'add', component: AddEditPolicyComponent },
    { path: 'edit/:id', component: AddEditPolicyComponent }
];