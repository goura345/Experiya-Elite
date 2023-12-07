import { Routes } from '@angular/router';

import { ServiceProviderListComponent } from './service-provider-list';
import { AddEditServiceProviderComponent } from './service-provider';

export const SERVICE_PROVIDER_ROUTES: Routes = [
    { path: '', component: ServiceProviderListComponent },
    { path: 'add', component: AddEditServiceProviderComponent },
    { path: 'edit/:id', component: AddEditServiceProviderComponent }
];