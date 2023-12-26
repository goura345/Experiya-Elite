import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyService } from '@app/_services';
import { Policy } from '@app/_models';

import { Router } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community'; // Column Definitions Interface
import flatpickr from "flatpickr";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-entrylist',
  standalone: true,
  imports: [CommonModule, FormsModule,
    AgGridModule],
  templateUrl: './policylist.html',

})
export class EntrylistComponent {

  loading = false
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
  editIcon = '<a style="cursor: pointer;"> <i class="bi bi-pencil"></i></a>';
  deleteIcon = '<a style="cursor: pointer;" class="ms-2"><i class="bi bi-trash3" style="color: red;"></i></a>';

  frmDateFlatpickr: any;
  toDateFlatpickr: any;
  period = 'today'
  frmDate: any
  toDate: any

  constructor(private policyService: PolicyService, private router: Router) { }

  ngOnInit() {

    this.frmDateFlatpickr = flatpickr("#frmDate", {
      // enableTime: true,
      dateFormat: "Y-m-d",
      // defaultDate: new Date(),
      onChange: this.onFrmDateChange.bind(this) // Bind the callback to the component instance
    });
    this.toDateFlatpickr = flatpickr("#toDate", {
      // enableTime: true,
      // defaultDate: new Date(),
      dateFormat: "Y-m-d",
      onChange: this.onToDateChange.bind(this)
    });

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

  navigateToMotorPolicy() {
    this.router.navigateByUrl('/policies/motor/add')
  }

  ngOnDestroy() {
    if (this.frmDateFlatpickr) {
      this.frmDateFlatpickr.destroy();    
    }

    if (this.toDateFlatpickr) {
      this.toDateFlatpickr.destroy();
    }
  }

  onPeriodChange() {

    if (this.period !== 'custom') {
      this.frmDateFlatpickr.setDate(null);
      this.toDateFlatpickr.setDate(null);
    }

  }

  onFrmDateChange(selectedDates: any, dateStr: any, instance: any) {

    console.log('From Date:', dateStr);
    this.frmDate = dateStr

  }

  onToDateChange(selectedDates: any, dateStr: any, instance: any) {

    console.log('To Date:', dateStr);
    this.toDate = dateStr

  }

}
