
import flatpickr from "flatpickr";

import { ColDef } from 'ag-grid-community'; // Column Definitions Interface
import { User } from '@app/_models';
import { AccountService, AgentService, InsurerService, PolicyService, ProductService } from '@app/_services';
import { BaseComponent } from "../base/base";
import { Router, RouterLink } from '@angular/router';
import { concatMap, first, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AlertComponent } from "../_components/alert.component";
import { FormsModule } from '@angular/forms';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { Policy } from '@app/_models';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
@Component({
    templateUrl: 'home.component.html',
    standalone: true,
    imports: [BaseComponent, RouterLink, CommonModule, AlertComponent, FormsModule, AgGridModule]
})
export class HomeComponent {
    user: User | null;

    agents = []
    insurers = []
    products = []
    users = []
    policies = []
    loading = false;
    neumorphicButtonClicked = false;
    showPolicyList: boolean = false;

    frmDateFlatpickr: any;
  toDateFlatpickr: any;
  period = 'today'
  frmDate: Date = new Date()
  toDate: Date = new Date()
  currentDate: string = '';
  exportData: any[] = []
  id = ''


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

    showPolicyListContent(): void {
        this.showPolicyList = true;
      }



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
        private policyService: PolicyService, private router: Router) {
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

    navigateToMotorPolicy() {
        this.router.navigateByUrl('/policies/motor/add')
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
      onFilterPolicy() {

        this.frmDate = this.frmDateFlatpickr.selectedDates[0]
        this.toDate = this.toDateFlatpickr.selectedDates[0]
    
        console.log(this.frmDate);
    
        // Create a Moment.js object from the given date
        let momentFrmDate = moment(this.frmDate);
        let formattedFrmDate = momentFrmDate.format('YYYY-MM-DD HH:mm:ss');
        console.log('Formatted Date:', formattedFrmDate);
        let momentToDate = moment(this.toDate);
        let formattedToDate = momentToDate.format('YYYY-MM-DD HH:mm:ss');
        console.log('Formatted Date:', formattedToDate);
    
        // return
    
        this.policyService.getFromRange(formattedFrmDate, formattedToDate).subscribe(
          (data:any) => {
            console.log(data);
    
            this.policies = data
            this.rowData = data.map((item: any, index: any) => ({ ...item, serialNumber: index + 1 }));
    
          }
        )
    
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
    
      exportToExcel() {
        this.exportData = this.rowData;
        setTimeout(() => {
          var elt = document.getElementById('table');
          var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
          XLSX.writeFile(wb, ('MySheetName.' + ('xlsx' || 'xlsx')));
        }, 1000)
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

