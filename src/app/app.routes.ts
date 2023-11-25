import { Routes } from "@angular/router";

import { HomeComponent } from './home';
import { LoginComponent, RegisterComponent } from './account';
import { authGuard } from './_helpers';
import { EntrylistComponent } from "./policies/policylist";

const usersRoutes = () => import('./users/users.routes').then(x => x.USERS_ROUTES);

const policyRoutes = () => import('./policies/policies.routes').then(x => x.POLICY_ROUTES)

export const APP_ROUTES: Routes = [
    { path: '', component: HomeComponent, canActivate: [authGuard] },  
    { path: 'users', loadChildren: usersRoutes, canActivate: [authGuard] },
    { path: 'entrylist', loadChildren: policyRoutes, canActivate: [authGuard] },
    { path: 'account/login', component: LoginComponent },
    { path: 'account/register', component: RegisterComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];
