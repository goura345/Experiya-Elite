import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AccountService } from './_services';
import { User } from './_models';
import { AlertComponent } from './_components/alert.component';
import { BaseComponent } from "./base/base";

import { AgGridModule } from 'ag-grid-angular'; // Angular Grid Logic
import { ColDef } from 'ag-grid-community'; // Column Definitions Interface


@Component({
    selector: 'app-root', templateUrl: 'app.component.html',
    standalone: true,
    imports: [NgIf, RouterOutlet, RouterLink, RouterLinkActive, AlertComponent, BaseComponent, AgGridModule, CommonModule]
})
export class AppComponent {
    user?: User | null;

    visible = true

    constructor(private accountService: AccountService) {
        this.accountService.user.subscribe(x => this.user = x);
    }

    logout() {     
        this.accountService.logout();
    }

    showMenu(){      
        this.visible = !this.visible
    }

}