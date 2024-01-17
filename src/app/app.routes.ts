// import { Routes } from "@angular/router";
// import { HomeComponent } from './home';
// import { LoginComponent, RegisterComponent } from './account';
// import { authGuard } from './_helpers';
// import { EntrylistComponent } from "./policies/policylist";

// import { Component } from '@angular/core';
// import { Router } from '@angular/router';



// const usersRoutes = () => import('./users/users.routes').then(x => x.USERS_ROUTES);
// const policyRoutes = () => import('./policies/policies.routes').then(x => x.POLICY_ROUTES)
// const agentRoutes = () => import('./agents/agents.routes').then(x => x.AGENT_ROUTES)
// const payoutRoutes = () => import('./payouts/payout.routes').then(x => x.PAYOUT_ROUTES)
// const insurerRoutes = () => import('./insurers/insurer.routes').then(x => x.AGENT_ROUTES)
// const productrRoutes = () => import('./products/product.routes').then(x => x. PRODUCT_ROUTES)


// export const APP_ROUTES: Routes = [
//     { path: '', component: LandingComponent, pathMatch: 'full' },
//     { path: 'home', component: HomeComponent,outlet: 'content'},
//     { path: 'account/login', component: LoginComponent },
//     { path: 'account/register', component: RegisterComponent },
//     { path: 'users', loadChildren: usersRoutes, canActivate: [authGuard] },
//     { path: 'policies', loadChildren: policyRoutes, canActivate: [authGuard] },
//     { path: 'agents', loadChildren: agentRoutes, canActivate: [authGuard] },
//     { path: 'payouts', loadChildren: payoutRoutes, canActivate: [authGuard] },
//     { path: 'insurers', loadChildren: insurerRoutes, canActivate: [authGuard] },
//     { path: 'products', loadChildren: productrRoutes, canActivate: [authGuard] },
  
//     // otherwise redirect to home
//     { path: '**', redirectTo: '' }
    
// ];
// export class LoginComponent {

//     // Inject the Router service in the constructor
//     constructor(private router: Router) {}
  
//     // Your login logic here
//     onLoginSuccess() {
//       // Perform your login logic...
  
//       // After a successful login, navigate to the 'home' route in the 'content' outlet
//       this.router.navigate([{ outlets: { content: ['home'] } }]);
//     }
//   }



// app.routes.ts

import { Routes } from "@angular/router";
import { HomeComponent } from './home';
import { LoginComponent, RegisterComponent } from './account';
import { authGuard } from './_helpers';
import { LandingComponent } from "./landing/landing.component";

const usersRoutes = () => import('./users/users.routes').then(x => x.USERS_ROUTES);
const policyRoutes = () => import('./policies/policies.routes').then(x => x.POLICY_ROUTES)
const agentRoutes = () => import('./agents/agents.routes').then(x => x.AGENT_ROUTES)
const payoutRoutes = () => import('./payouts/payout.routes').then(x => x.PAYOUT_ROUTES)
const insurerRoutes = () => import('./insurers/insurer.routes').then(x => x.AGENT_ROUTES)
const productRoutes = () => import('./products/product.routes').then(x => x.PRODUCT_ROUTES)

export const APP_ROUTES: Routes = [
  { path: '', component: LandingComponent },
  { path: 'home', component: HomeComponent,canActivate: [authGuard]},
  { path: 'account/login', component: LoginComponent },
  { path: 'account/register', component: RegisterComponent },
  { path: 'users', loadChildren: usersRoutes, canActivate: [authGuard] },
  { path: 'policies', loadChildren: policyRoutes },
  { path: 'agents', loadChildren: agentRoutes, canActivate: [authGuard] },
  { path: 'payouts', loadChildren: payoutRoutes, canActivate: [authGuard] },
  { path: 'insurers', loadChildren: insurerRoutes, canActivate: [authGuard] },
  { path: 'products', loadChildren: productRoutes, canActivate: [authGuard] },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];
