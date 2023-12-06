import { Component } from '@angular/core';

import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { BaseComponent } from "../base/base";
import { RouterLink } from '@angular/router';

@Component({
   
    templateUrl: 'home.component.html',
    standalone: true,
    imports: [BaseComponent, RouterLink]
})
export class HomeComponent {
    user: User | null;

    constructor(private accountService: AccountService) {
        this.user = this.accountService.userValue;
    }
}