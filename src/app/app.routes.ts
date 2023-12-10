import { Routes } from "@angular/router";

import { HomeComponent } from './home';
import { LoginComponent, RegisterComponent } from './account';
import { authGuard } from './_helpers';
import { EntrylistComponent } from "./policies/policylist";

const usersRoutes = () => import('./users/users.routes').then(x => x.USERS_ROUTES);
const policyRoutes = () => import('./policies/policies.routes').then(x => x.POLICY_ROUTES)
const agentRoutes = () => import('./agents/agents.routes').then(x => x.AGENT_ROUTES)
const slabRoutes = () => import('./slabs/slabs.routes').then(x => x.SLAB_ROUTES)
const insurerRoutes = () => import('./insurers/insurer.routes').then(x => x.AGENT_ROUTES)
const productrRoutes = () => import('./products/product.routes').then(x => x. PRODUCT_ROUTES)


export const APP_ROUTES: Routes = [
    { path: '', component: HomeComponent, canActivate: [authGuard] },
    { path: 'account/login', component: LoginComponent },
    { path: 'account/register', component: RegisterComponent },
    { path: 'users', loadChildren: usersRoutes, canActivate: [authGuard] },
    { path: 'policies', loadChildren: policyRoutes, canActivate: [authGuard] },
    { path: 'agents', loadChildren: agentRoutes, canActivate: [authGuard] },
    { path: 'slabs', loadChildren: slabRoutes, canActivate: [authGuard] },
    { path: 'insurers', loadChildren: insurerRoutes, canActivate: [authGuard] },
    { path: 'products', loadChildren: productrRoutes, canActivate: [authGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];
