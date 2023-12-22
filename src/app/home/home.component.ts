import { Component } from '@angular/core';

import { User } from '@app/_models';
import { AccountService, AgentService, InsurerService, PolicyService, ProductService } from '@app/_services';
import { BaseComponent } from "../base/base";
import { RouterLink } from '@angular/router';
import { concatMap, first, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({

    templateUrl: 'home.component.html',
    standalone: true,
    imports: [BaseComponent, RouterLink, CommonModule]
})
export class HomeComponent {
    user: User | null;

    agents = []
    insurers = []
    products = []
    users = []
    policies = []
    loading = false;

    constructor(private accountService: AccountService,
        private insurerService: InsurerService,
        private agentService: AgentService,
        private productService: ProductService,
        private policyService: PolicyService) {
        this.user = this.accountService.userValue;
    }

    ngOnInit() {

        // getting counts
        this.agentService.getAll()
            .pipe(first())
            .subscribe((data: any) => {
                // console.log(data);
                this.agents = data
            })

        this.insurerService.getAll()
            .pipe(first())
            .subscribe((data: any) => {
                // console.log(data);
                this.insurers = data
            })

        this.productService.getAll()
            .pipe(first())
            .subscribe((data: any) => {
                // console.log(data);
                this.products = data
            })

        this.accountService.getAll()
            .pipe(first())
            .subscribe((data: any) => {
                // console.log(data);
                this.users = data

            })

        this.loading = true
        this.policyService.getAll().subscribe((data: any) => {
            // console.log(data);
            this.policies = data
            this.loading = false;

        }, (error => {
            console.log(error);
            this.loading = false;

        }))

    }
}