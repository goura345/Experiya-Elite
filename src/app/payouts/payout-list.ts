
import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { first } from 'rxjs/operators';

import { AccountService, PayoutService, PolicyService } from '@app/_services';
// import { Columns, Config, DefaultConfig, TableModule } from 'ngx-easy-table';
import { User } from '@app/_models';
import { AgGridModule, } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community'; // Column Definitions Interface

@Component({
  templateUrl: 'payout-list.html',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, AgGridModule]
})
export class PayoutListComponent implements OnInit {

  loading = false
  payouts: any[] = []
  id = ''

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef[] = [
    { headerName: "SR. NO.", field: 'serialNumber', sortable: true, filter: true },
    { headerName: "Payout Name", field: 'payout_name', sortable: true, filter: true },
    { headerName: "INSURER NAME", field: 'insurance_company', sortable: true, filter: true },
    { headerName: "SERVICE PROVIDER", field: 'sp_name', sortable: true, filter: true },
    { headerName: "BROKER CODE", field: 'sp_brokercode', sortable: true, filter: true },
    { headerName: "PRODUCT NAME", field: 'product_name', sortable: true, filter: true },
    { headerName: "REGISTRATION NO.", field: 'registration_no', sortable: true, filter: true },
    { headerName: "RTO STATE", field: 'rto_state', sortable: true, filter: true },
    { headerName: "RTO CITY", field: 'rto_city', sortable: true, filter: true },
    { headerName: "VEHICLE CATEGORY", field: 'vehicle_catagory', sortable: true, filter: true },
    { headerName: "VEHICLE MAKE", field: 'vehicle_makeby', sortable: true, filter: true },
    { headerName: "VEHICLE MODEL", field: 'vehicle_model', sortable: true, filter: true },
    { headerName: "FUEL TYPE", field: 'vehicle_fuel_type', sortable: true, filter: true },
    { headerName: "MFG. YEAR", field: 'mfg_year', sortable: true, filter: true },
    { headerName: "ADDON", field: 'addon', sortable: true, filter: true },
    { headerName: "NCB", field: 'ncb', sortable: true, filter: true },
    { headerName: "CUBIC CAPACITY", field: 'cubic_capacity', sortable: true, filter: true },
    { headerName: "COVERAGE TYPE", field: 'coverage_type', sortable: true, filter: true },
    { headerName: "SEATING CAPACITY", field: 'seating_capacity', sortable: true, filter: true },
    { headerName: "GVW", field: 'gvw', sortable: true, filter: true },
    { headerName: "POLICY TYPE", field: 'policy_type', sortable: true, filter: true },
    { headerName: "CPA", field: 'cpa', sortable: true, filter: true },
    { headerName: "POLICY TERM", field: 'policy_term', sortable: true, filter: true },

    { headerName: "OD REWARD (POS)", field: 'agent_od_reward', sortable: true, filter: true },
    { headerName: "OD AMOUNT (POS)", field: 'agent_od_amount', sortable: true, filter: true },
    { headerName: "TP REWARD (POS)", field: 'agent_tp_reward', sortable: true, filter: true },
    { headerName: "TP AMOUNT (POS)", field: 'agent_tp_amount', sortable: true, filter: true },

    { headerName: "OD REWARD (SELF)", field: 'self_od_reward', sortable: true, filter: true },
    { headerName: "OD AMOUNT (SELF)", field: 'self_od_amount', sortable: true, filter: true },
    { headerName: "TP REWARD (SELF)", field: 'self_tp_reward', sortable: true, filter: true },
    { headerName: "TP AMOUNT (SELF)", field: 'self_tp_amount', sortable: true, filter: true },

    { headerName: "REMARK", field: 'remark', sortable: true, filter: true },
    { headerName: "STATUS", field: 'status', sortable: true, filter: true },

    {
      headerName: "ACTION"
      , cellRenderer: (params: { value: string; }) => {
        // put the value in bold
        return `${this.editIcon} ${this.deleteIcon}`;
      }
    },

  ];
  // Row Data: The data to be displayed.
  rowData: any[] = []
  editIcon = '<a style="cursor: pointer;"> <i class="bi bi-pencil"></i></a>';
  deleteIcon = '<a style="cursor: pointer;" class="ms-2"><i class="bi bi-trash3" style="color: red;"></i></a>';

  constructor(private payoutService: PayoutService, private router: Router) { }

  ngOnInit() {

    this.rowData = JSON.parse(localStorage.getItem('payoutRowData') || "[]")
    // return      
    this.payoutService.getAll().subscribe((data: any) => {
      // console.log(data);
      this.payouts = data
      this.rowData = data.map((item: any, index: any) => ({ ...item, serialNumber: index + 1 }));
      localStorage.setItem('payoutRowData', JSON.stringify(this.rowData))

    }, (error => {
      console.log(error);
      alert(error)
    }))
  }

  onEditDelete(event: any) {
    console.log(event);

    if (event.event.srcElement.outerHTML == '<i class="bi bi-pencil"></i>') {     
      console.log(event.data.id);
      this.router.navigateByUrl('/payouts/edit/' + event.data.id)
    }
    else if (event.event.srcElement.outerHTML == '<i class="bi bi-trash3" style="color: red;"></i>') {
      if (confirm(`Do you really want to delete this payout: ${event.data.payout_name}`)) {
        console.log('deleting payout:');
        this.payoutService.delete(event.data.id).subscribe((data) => {
          console.log(data);
          this.ngOnInit()
        }, (error) => {
          console.log(error);
        })
      }
    }
  }



}