import { Routes } from '@angular/router';

import { ProductListComponent } from './product-list';
import { AddEditProductComponent } from './product';

export const PRODUCT_ROUTES: Routes = [
    { path: '', component: ProductListComponent },
    { path: 'add', component: AddEditProductComponent },
    { path: 'edit/:id', component: AddEditProductComponent }
];