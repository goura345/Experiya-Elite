
import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { first } from 'rxjs/operators';
import flatpickr from "flatpickr";

import { AccountService, PayoutService, PolicyService } from '@app/_services';
// import { Columns, Config, DefaultConfig, TableModule } from 'ngx-easy-table';
import { User } from '@app/_models';
import { AgGridModule, } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community'; // Column Definitions Interface
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms';

@Component({
  templateUrl: 'payout-list.html',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, AgGridModule, FormsModule]
})
export class PayoutListComponent implements OnInit {

  loading = false
  payouts: any[] = []
  id = ''

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef[] = [
    { headerName: "SR. NO.", field: 'serialNumber', sortable: true, filter: true },
    { headerName: "PAYOUT NAME", field: 'payout_name', sortable: true, filter: true },
    { headerName: "POLICY TYPE", field: 'policy_type', sortable: true, filter: true },
    { headerName: "INSURER NAME", field: 'insurance_company', sortable: true, filter: true },
    // { headerName: "SERVICE PROVIDER", field: 'sp_name', sortable: true, filter: true },
    // { headerName: "BROKER CODE", field: 'sp_brokercode', sortable: true, filter: true },
    { headerName: "PRODUCT NAME", field: 'product_name', sortable: true, filter: true },
    // { headerName: "REGISTRATION NO.", field: 'registration_no', sortable: true, filter: true },  
    { headerName: "VEHICLE CATEGORY", field: 'vehicle_catagory', sortable: true, filter: true },
    { headerName: "VEHICLE MAKE", field: 'vehicle_makeby', sortable: true, filter: true },
    { headerName: "VEHICLE MODEL", field: 'vehicle_model', sortable: true, filter: true },
    { headerName: "FUEL TYPE", field: 'vehicle_fuel_type', sortable: true, filter: true },
    { headerName: "RTO STATE", field: 'rto_state', sortable: true, filter: true },
    { headerName: "RTO CITY", field: 'rto_city', sortable: true, filter: true },
    { headerName: "MFG. YEAR", field: 'mfg_year', sortable: true, filter: true },
    { headerName: "ADDON", field: 'addon', sortable: true, filter: true },
    { headerName: "NCB", field: 'ncb', sortable: true, filter: true },
    { headerName: "CUBIC CAPACITY", field: 'cubic_capacity', sortable: true, filter: true },
    { headerName: "COVERAGE TYPE", field: 'coverage_type', sortable: true, filter: true },
    { headerName: "SEATING CAPACITY", field: 'seating_capacity', sortable: true, filter: true },
    { headerName: "GVW", field: 'gvw', sortable: true, filter: true },
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
  frmDateFlatpickr: any;
  toDateFlatpickr: any;
  period = 'today'
  frmDate: Date = new Date()
  toDate: Date = new Date()
  currentDate: string = '';
 

  exportData: any[] = []

  constructor(private payoutService: PayoutService, private router: Router) { }
  
  // Row Data: The data to be displayed.
  rowData: any[] = []
  editIcon = '<a style="cursor: pointer;"> <i class="bi bi-pencil"></i></a>';
  deleteIcon = '<a style="cursor: pointer;" class="ms-2"><i class="bi bi-trash3" style="color: red;"></i></a>';

  
ngOnInit() {
  this.frmDateFlatpickr = flatpickr("#frmDate", {
    // enableTime: true,
    // dateFormat: "Y-m-d",
    // defaultDate: new Date(),
    onChange: this.onFrmDateChange.bind(this) // Bind the callback to the component instance
  });
  this.toDateFlatpickr = flatpickr("#toDate", {
    // enableTime: true,
    // defaultDate: new Date(),
    // dateFormat: "Y-m-d",
    onChange: this.onToDateChange.bind(this)
  });

    this.rowData = JSON.parse(localStorage.getItem('payoutRowData') || "[]")
    // return      
    this.payoutService.getAll()    .subscribe((data: any) => {
      // console.log(data);
      this.payouts = data
      this.rowData = data.map((item: any, index: any) => ({ ...item, serialNumber: index + 1 }));
      localStorage.setItem('payoutRowData', JSON.stringify(this.rowData))

    }, (error => {
      console.log(error);
      alert(error)
    }))
  }

  deleteUser(id: string) {
    const user = this.payouts!.find(x => x.id === id);
    user.isDeleting = true;
    this.payoutService.delete(id)
        .pipe(first())
        .subscribe(() => this.payouts = this.payouts!.filter(x => x.id !== id));
}

eventEmitted($event: { event: string; value: any }): void {
    return
    // this.clicked = JSON.stringify($event);    
    console.log('$event', $event);
    this.id = $event.value.row.id
    this.router.navigateByUrl('users/edit/' + this.id)
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

  onFrmDateChange(selectedDates: any, dateStr: any, instance: any) {

    // console.log('From Date:', dateStr);
    // this.frmDate = dateStr
    // console.log(this.frmDateFlatpickr.now);

  }

  onToDateChange(selectedDates: any, dateStr: any, instance: any) {

    // console.log('To Date:', dateStr);


  }

  exportToExcel() {
    this.exportData = this.rowData;
    setTimeout(() => {
      var elt = document.getElementById('table');
      var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
      XLSX.writeFile(wb, ('MySheetName.' + ('xlsx' || 'xlsx')));
    }, 1000)
  }

  onPeriodChange() {

    if (this.period === 'today') {
      this.frmDateFlatpickr.setDate(new Date());
      this.toDateFlatpickr.setDate(new Date());
    }
    else if (this.period === 'yesterday') {
      let today = new Date();
      let yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      this.frmDateFlatpickr.setDate(yesterday);
      this.toDateFlatpickr.setDate(today);

    }
    else if (this.period === 'this_month') {
      // calculate date for this month
      let date = new Date();
      let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      console.log("First day = " + firstDay);
      console.log("Last day = " + lastDay);
      this.frmDateFlatpickr.setDate(firstDay);
      this.toDateFlatpickr.setDate(lastDay);
    }
    else if (this.period === 'last_month') {
      // calculate date for last month

      let date = new Date();
      let firstDayOfLastMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      let lastDayOfLastMonth = new Date(date.getFullYear(), date.getMonth(), 0);

      console.log("First day of the last month = " + firstDayOfLastMonth);
      console.log("Last day of the last month = " + lastDayOfLastMonth);
      this.frmDateFlatpickr.setDate(firstDayOfLastMonth);
      this.toDateFlatpickr.setDate(lastDayOfLastMonth);

    }
    else if (this.period === 'this_year') {
      // calculate date for this year

      let date = new Date();
      let firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      let lastDayOfYear = new Date(date.getFullYear(), 11, 31);

      console.log("First day of the year = " + firstDayOfYear);
      console.log("Last day of the year = " + lastDayOfYear);

      this.frmDateFlatpickr.setDate(firstDayOfYear);
      this.toDateFlatpickr.setDate(lastDayOfYear);
    }
    else if (this.period === 'last_year') {
      // calculate date for last year

      let date = new Date();
      let firstDayOfLastYear = new Date(date.getFullYear() - 1, 0, 1);
      let lastDayOfLastYear = new Date(date.getFullYear() - 1, 11, 31);

      console.log("First day of the last year = " + firstDayOfLastYear);
      console.log("Last day of the last year = " + lastDayOfLastYear);
      this.frmDateFlatpickr.setDate(firstDayOfLastYear);
      this.toDateFlatpickr.setDate(lastDayOfLastYear);

    }
    else if (this.period === 'custom') {
      this.frmDateFlatpickr.setDate(null);
      this.toDateFlatpickr.setDate(null);
    }

  }

}