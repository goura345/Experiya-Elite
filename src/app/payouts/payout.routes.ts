import { Routes } from '@angular/router';

import { PayoutListComponent } from './payout-list';
import { AddEditPayoutComponent } from './add-edit-payout';

export const PAYOUT_ROUTES: Routes = [
    { path: '', component: PayoutListComponent },
    { path: 'add', component: AddEditPayoutComponent },
    { path: 'edit/:id', component: AddEditPayoutComponent }
];