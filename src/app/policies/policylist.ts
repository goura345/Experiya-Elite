import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '@app/_services';
import { Policy } from '@app/_models';
import { delay } from 'rxjs';
import { Columns, Config, DefaultConfig, TableModule } from 'ngx-easy-table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entrylist',
  standalone: true,
  imports: [CommonModule,
    TableModule],
  templateUrl: './policylist.html',

})
export class EntrylistComponent {

  public configuration!: Config;
  public columns!: Columns[];
  public pagination = {
    limit: 10,
    offset: 0,
    count: -1,
    sort: '',
    order: '',
  };

  loading = true
  policies: Policy[] = []
  id = ''

  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit() {

    this.configuration = { ...DefaultConfig };
    this.configuration.searchEnabled = true;

    this.columns = [
      // { key: 'SrNo', title: 'Sr. No.' },
      { key: 'proposal_no', title: 'Proposal No' },
      { key: 'policy_no', title: 'Policy No' },
      { key: 'customer_name', title: 'Customer Name' },
      { key: 'insurance_company', title: 'Insurance Company' },
      { key: 'sp_name', title: 'SP Name' },
      { key: 'sp_brokercode', title: 'Broker Code' },
      { key: 'product_name', title: 'Product Name' },
      { key: 'registration_no', title: 'Registration No.' },
      { key: 'rto_state', title: 'RTO State' },
      { key: 'rto_city', title: 'rto_city' },
      { key: 'vehicle_makeby', title: 'vehicle_makeby' },
      { key: 'vehicle_model', title: 'vehicle_model' },
      { key: 'vehicle_catagory', title: 'vehicle_catagory' },
      { key: 'vehicle_fuel_type', title: 'vehicle_fuel_type' },

      { key: 'mfg_year', title: 'mfg_year' },
      { key: 'addon', title: 'addon' },
      { key: 'ncb', title: 'ncb' },
      { key: 'cubic_capacity', title: 'cubic_capacity' },
      { key: 'gvw', title: 'gvw' },
      { key: 'seating_capacity', title: 'seating_capacity' },
      { key: 'coverage_type', title: 'coverage_type' },
      { key: 'policy_type', title: 'policy_type' },
      { key: 'cpa', title: 'cpa' },
      { key: 'risk_start_date', title: 'risk_start_date' },
      { key: 'risk_end_date', title: 'risk_end_date' },
      { key: 'issue_date', title: 'issue_date' },
      { key: 'insured_age', title: 'insured_age' },
      { key: 'policy_term', title: 'policy_term' },
      { key: 'bqp', title: 'bqp' },
      { key: 'pos', title: 'pos' },
      { key: 'employee', title: 'employee' },
      { key: 'OD_premium', title: 'OD_premium' },
      { key: 'TP_terrorism', title: 'TP_terrorism' },
      { key: 'net', title: 'net' },
      { key: 'gst_amount', title: 'gst_amount' },
      { key: 'gst_gcv_amount', title: 'gst_gcv_amount' },
      { key: 'total', title: 'total' },
      { key: 'payment_mode', title: 'payment_mode' },
      { key: 'agent_od_reward', title: 'agent_od_reward' },
      { key: 'agent_od_amount', title: 'agent_od_amount' },
      { key: 'agent_tp_reward', title: 'agent_tp_reward' },
      { key: 'agent_tp_amount', title: 'agent_tp_amount' },
      { key: 'self_od_reward', title: 'self_od_reward' },
      { key: 'self_od_amount', title: 'self_od_amount' },
      { key: 'self_tp_reward', title: 'self_tp_reward' },
      { key: 'self_tp_amount', title: 'self_tp_amount' },
      { key: 'proposal', title: 'proposal' },

      { key: 'mandate', title: 'mandate' },
      { key: 'policy', title: 'policy' },
      { key: 'previous_policy', title: 'previous_policy' },
      { key: 'pan_card', title: 'pan_card' },
      { key: 'aadhar_card', title: 'aadhar_card' },
      { key: 'vehicle_rc', title: 'vehicle_rc' },
      { key: 'inspection_report', title: 'inspection_report' },
      { key: 'remark', title: 'remark' },
      { key: 'status', title: 'status' },
    ];

    // return
    this.loading = true
    this.accountService.getAllPolicy().subscribe((data: Policy[]) => {
      console.log(data);
      this.policies = data
      this.loading = false
    })

  }

  eventEmitted($event: { event: string; value: any }): void {
    // this.clicked = JSON.stringify($event);    
    console.log('$event', $event);
    this.id = $event.value.row.id
   
    this.router.navigateByUrl('policies/edit/' + this.id)

  }
}
