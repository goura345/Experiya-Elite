import { Component, OnInit } from '@angular/core';
import { NgIf, NgClass, CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AgentService, AlertService, InsurerService, PayoutService, PolicyService, ProductService } from '@app/_services';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
    templateUrl: './list-apply-payout.html',
    standalone: true,
    imports: [CommonModule, NgIf, FormsModule, ReactiveFormsModule, NgClass, RouterLink, NgSelectModule]
})
export class ListApplyPayoutComponent implements OnInit {

    payouts: any[] = []

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private payoutService: PayoutService,
        private insurerService: InsurerService,
        private agentService: AgentService,
        private policyService: PolicyService,
        private productService: ProductService,
    ) { }

    ngOnInit() {

        // return
        this.payoutService.getAll().pipe(first()).subscribe(data => {
            console.log(data);
            this.payouts = data

            this.matchPayout()
        });

    }

    matchPayout() {
        // return

        let form = JSON.parse(localStorage.getItem('motorFormValue') || '{}')

        console.log(form);

        for (const iterator of this.payouts) {
            console.log(iterator);

            if (iterator.insurance_company === form.insurance_company &&
                iterator.vehicle_catagory === form.vehicle_catagory &&
                iterator.rto_state === form.rto_state &&
                iterator.mfg_year === form.mfg_year) {
                    
                console.log('match found');

                let od = form.OD_premium
                let tp = form.TP_terrorism

                console.log(od, '  ', tp);

                od = ( od / 100) * iterator.agent_od_reward
                tp = ( tp / 100) * iterator.agent_tp_reward

                console.log(od, '  ', tp);

                iterator.agent_od_amount = od
                iterator.agent_tp_amount = tp

            } 
        }
    }


}
