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

    countInfo = {
        totalAgent: 0,
        totalInsurer: 0,
        totalProduct: 0,
        totalUser: 0,
        totalPolicy: 0
    }
    totalStaff = 0
    totalAgent = 0
    totalInsurer = 0
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

        this.countInfo = JSON.parse(localStorage.getItem('DashData') || '{}')
         
        // return
        this.accountService.totalDocument().subscribe((data: any) => {
            console.log(data);
            // this.totalStaff = data.user
            // this.totalAgent = data.agent
            // this.totalInsurer = data.insurer
            // this.totalProduct = data.product
            // this.totalPolicy = data.policy

            this.countInfo.totalAgent = data.agent
            this.countInfo.totalInsurer = data.insurer
            this.countInfo.totalProduct = data.product
            this.countInfo.totalUser = data.user
            this.countInfo.totalPolicy = data.policy

            localStorage.setItem('DashData', JSON.stringify(this.countInfo))

        })

    }
}

