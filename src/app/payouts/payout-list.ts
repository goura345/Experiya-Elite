
import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { first } from 'rxjs/operators';

import { AccountService, PolicyService } from '@app/_services';
// import { Columns, Config, DefaultConfig, TableModule } from 'ngx-easy-table';
import { User } from '@app/_models';
import { AgGridModule,  } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community'; // Column Definitions Interface

@Component({
    templateUrl: 'payout-list.html',
    standalone: true,
    imports: [RouterLink, NgFor, NgIf, AgGridModule]
})
export class PayoutListComponent implements OnInit {

    loading = false
    policies: any[] = []
    id = ''

    // Column Definitions: Defines & controls grid columns.
    colDefs: ColDef[] = [
        { headerName: "SR. NO.", field: 'serialNumber', sortable: true, filter: true },
        { headerName: "PROPOSAL NO.", field: 'proposal_no', sortable: true, filter: true },
        { headerName: "POLICY NO.", field: 'policy_no', sortable: true, filter: true },
        { headerName: "CUSTOMER NAME", field: 'customer_name', sortable: true, filter: true },
        { headerName: "INSURER NAME", field: 'insurance_company', sortable: true, filter: true },
        { headerName: "SERVICE PROVIDER", field: 'sp_name', sortable: true, filter: true },
        { headerName: "BROKER CODE", field: 'sp_brokercode', sortable: true, filter: true },
        { headerName: "PRODUCT NAME", field: 'product_name', sortable: true, filter: true },
        { headerName: "REGISTRATION NO.", field: 'registration_no', sortable: true, filter: true },
        { headerName: "RTO STATE", field: 'rto_state', sortable: true, filter: true },
        { headerName: "RTO CITY", field: 'rto_city', sortable: true, filter: true },
        { headerName: "VEHICLE CATAGORY", field: 'vehicle_catagory', sortable: true, filter: true },
        { headerName: "VEHICLE MAKEBY", field: 'vehicle_makeby', sortable: true, filter: true },
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
        { headerName: "RISK START DATE", field: 'risk_start_date', sortable: true, filter: true },
        { headerName: "RISK END DATE", field: 'risk_end_date', sortable: true, filter: true },
        { headerName: "ISSUE DATE", field: 'issue_date', sortable: true, filter: true },
        { headerName: "INSURED AGE", field: 'insured_age', sortable: true, filter: true },
        { headerName: "POLICY TERM", field: 'policy_term', sortable: true, filter: true },
        { headerName: "POSP NAME", field: 'pos', sortable: true, filter: true },

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

    constructor(private policyService: PolicyService, private router: Router) { }

    ngOnInit() {
     
        this.rowData = JSON.parse(localStorage.getItem('policyRowData') || "[]")

        // return
        // this.loading = true
        this.policyService.getAll().subscribe((data: any) => {
          // console.log(data);
          this.policies = data
          this.rowData = data.map((item: any, index: any) => ({ ...item, serialNumber: index + 1 }));
          localStorage.setItem('policyRowData', JSON.stringify(this.rowData))
          this.loading = false;
    
        }, (error => {
          console.log(error);
          this.loading = false;
    
        }))
    }

    onEditDelete(event: any) {
        console.log(event);
    
        if (event.event.srcElement.outerHTML == '<i class="bi bi-pencil"></i>') {
    
          if (event.data.product_name === '' || event.data.product_name === 'MOTOR') {
            console.log('motor policy detected');
            this.router.navigateByUrl('/policies/motor/edit/' + event.data.id)
          }
          else {
            console.log('non-motor policy detected');
            this.router.navigateByUrl('/policies/non-motor/edit/' + event.data.id)
          }
        }
        else if (event.event.srcElement.outerHTML == '<i class="bi bi-trash3" style="color: red;"></i>') {
    
          if (confirm('Do you really want to delete this policy')) {
            console.log('deleting policy:');
            this.policyService.delete(event.data.id).subscribe((data) => {
              console.log(data);
              this.ngOnInit()
            }, (error) => {
              console.log(error);
            })
          }
        }
      }
    


}