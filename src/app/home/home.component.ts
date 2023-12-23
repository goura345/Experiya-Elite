import { Component } from '@angular/core';

import { User } from '@app/_models';
import { AccountService, AgentService, InsurerService, PolicyService, ProductService } from '@app/_services';
import { BaseComponent } from "../base/base";
import { RouterLink } from '@angular/router';
import { concatMap, first, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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

    totalStaff = 0
    totalAgent = 0
    totalInsurer= 0
    totalProduct = 0
    totalPolicy = 0

    constructor(private accountService: AccountService, private http: HttpClient,
        private insurerService: InsurerService,
        private agentService: AgentService,
        private productService: ProductService,
        private policyService: PolicyService) {
        this.user = this.accountService.userValue;
    }

    ngOnInit() {
       
        this.http.get('http://localhost:4000/total-documents').subscribe((data: any) => {
            console.log(data);
            this.totalStaff = data.user
            this.totalAgent = data.agent
            this.totalInsurer = data.insurer
            this.totalProduct = data.product
            this.totalPolicy = data.policy
        })

        return

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