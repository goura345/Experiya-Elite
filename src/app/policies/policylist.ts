import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService, PolicyService } from '@app/_services';
import { Policy } from '@app/_models';
import { delay } from 'rxjs';
import { Columns, Config, DefaultConfig, TableModule } from 'ngx-easy-table';
import { Router } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community'; // Column Definitions Interface

@Component({
  selector: 'app-entrylist',
  standalone: true,
  imports: [CommonModule,
    AgGridModule],
  templateUrl: './policylist.html',

})
export class EntrylistComponent {

  loading = true
  policies: Policy[] = []
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

    // { headerName: "POSP CODE", field: 'status', sortable: true, filter: true },

    { headerName: "BQP", field: 'bqp', sortable: true, filter: true },
    { headerName: "EMPLOYEE", field: 'employee', sortable: true, filter: true },
    { headerName: "REMARK", field: 'remark', sortable: true, filter: true },
    { headerName: "OD", field: 'OD_premium', sortable: true, filter: true },
    { headerName: "TP", field: 'TP_terrorism', sortable: true, filter: true },
    { headerName: "NET", field: 'net', sortable: true, filter: true },
    { headerName: "GST 18%", field: 'gst_amount', sortable: true, filter: true },
    { headerName: "GST 12%", field: 'gst_gcv_amount', sortable: true, filter: true },
    { headerName: "TOTAL", field: 'total', sortable: true, filter: true },
    { headerName: "PAYMENT MODE", field: 'payment_mode', sortable: true, filter: true },
    { headerName: "PROPOSAL", field: 'proposal', sortable: true, filter: true },
    { headerName: "MANDATE", field: 'mandate', sortable: true, filter: true },
    { headerName: "POLICY", field: 'policy', sortable: true, filter: true },
    { headerName: "PREVIOUS POLICY", field: 'previous_policy', sortable: true, filter: true },
    { headerName: "PAN CARD", field: 'pan_card', sortable: true, filter: true },
    { headerName: "AADHAR CARD", field: 'aadhar_card', sortable: true, filter: true },
    { headerName: "VEHICLE RC", field: 'vehicle_rc', sortable: true, filter: true },
    { headerName: "INSPECTION REPORT", field: 'inspection_report', sortable: true, filter: true },
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
  editIcon = '<a> <i class="bi bi-pencil"></i></a>';
  deleteIcon = '<a class="ms-2"><i class="bi bi-trash3" style="color: red;"></i></a>';
  gridOptions: any = {
    rowSelection: 'single',
    // alwaysShowHorizontalScroll: true,
    // alwaysShowVerticalScroll: true,
    // columnDefs: this.columnDefs,
    // rowData: this.rowData,
  };

  constructor(private policyService: PolicyService, private router: Router) { }

  ngOnInit() {

    // return
    this.loading = true
    this.policyService.getAll().subscribe((data: any) => {
      // console.log(data);
      this.policies = data
      this.rowData = data.map((item: any, index: any) => ({ ...item, serialNumber: index + 1 }));

    }, (error => {
      console.log(error);
    }),
      () => {
        this.loading = false;
      })

  }

  eventEmitted($event: { event: string; value: any }): void {
    // this.clicked = JSON.stringify($event);    
    console.log('$event', $event);
    this.id = $event.value.row.id

    this.router.navigateByUrl('policies/edit/' + this.id)

  }

  onEditDelete(event: any) {
    return
    console.log(event);
    console.log(event.colDef.headerName);
    console.log(event.data.mobileNumber);

    // let submission = this.policies.filter((item) => item.mobileNumber == event.data.mobileNumber)[0]
    // console.log(submission);

    if (event.event.srcElement.outerHTML == '<i class="bi bi-pencil"></i>') {

    }

    else if (event.event.srcElement.outerHTML == '<i class="bi bi-trash3" style="color: red;"></i>') {
      // this.deleteUser(event.data.mobileNumber)

    }
  }

}
