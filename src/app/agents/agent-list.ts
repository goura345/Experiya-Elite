
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { first } from 'rxjs/operators';
import flatpickr from "flatpickr";
import { AgentService, PolicyService } from '@app/_services';
import { User } from '@app/_models';
import { AgGridModule } from 'ag-grid-angular'; // Angular Grid Logic
import { ColDef } from 'ag-grid-community'; // Column Definitions Interface
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms';


@Component({
    templateUrl: 'agent-list.html',
    standalone: true,
    imports: [RouterLink, NgFor, NgIf, AgGridModule,CommonModule, FormsModule]
})
export class AgentListComponent implements OnInit {


    loading = true
    agents!: any[]
    id = ''


    // Column Definitions: Defines & controls grid columns.
    colDefs: ColDef[] = [
        { headerName: "SR. NO.", field: 'serialNumber', sortable: true, filter: true },
        { headerName: "POSP CODE", field: 'posp_code', sortable: true, filter: true },
        { headerName: "REG. CODE", field: 'registration_code', sortable: true, filter: true },
        { headerName: "POSP NAME", field: 'full_name', sortable: true, filter: true },
        { headerName: "GENDER", field: 'gender', sortable: true, filter: true },
        { headerName: "EMAIL", field: 'email_id', sortable: true, filter: true },
        { headerName: "MOBILE NO.", field: 'mob_no', sortable: true, filter: true },

        { headerName: "ADDREES", field: 'address', sortable: true, filter: true },
        { headerName: "STATE", field: 'state', sortable: true, filter: true },
        { headerName: "CITY", field: 'city', sortable: true, filter: true },
        { headerName: "PINCODE", field: 'pincode', sortable: true, filter: true },
        { headerName: "RURAL/URBAN", field: 'rural_urban', sortable: true, filter: true },
        { headerName: "SLAB", field: 'slab', sortable: true, filter: true },
        { headerName: "GSTIN", field: 'GSTIN', sortable: true, filter: true },
        { headerName: "BANK ACCOUNT NO.", field: 'account_no', sortable: true, filter: true },
        { headerName: "IFSC CODE", field: 'ifsc_code', sortable: true, filter: true },
        { headerName: "BANK NAME", field: 'bank_name', sortable: true, filter: true },
        { headerName: "BASIC QUALIFICATION", field: 'basic_qualification', sortable: true, filter: true },
        { headerName: "AADHAR CARD", field: 'aadhar_card', sortable: true, filter: true },
        { headerName: "PAN CARD", field: 'pan_card', sortable: true, filter: true },
        { headerName: "TRAINING CERTIFICATE", field: 'training_certificate', sortable: true, filter: true },

        { headerName: "APPOINTMENT CERTIFICATE", field: 'appointment_certificate', sortable: true, filter: true },
        { headerName: "AGREEMENT", field: 'agreement_certificate', sortable: true, filter: true },
        { headerName: "BANK DETAILS", field: 'bank_details', sortable: true, filter: true },
        { headerName: "LOGIN ID", field: 'login_id', sortable: true, filter: true },
        { headerName: "CREATED BY", field: 'created_by', sortable: true, filter: true },
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
    frmDateFlatpickr: any;
    toDateFlatpickr: any;
    period = 'today'
    frmDate: Date = new Date()
    toDate: Date = new Date()
    currentDate: string = '';

    exportData: any[] = []

    constructor(private agentService: AgentService, private router: Router) { }

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

        this.rowData = JSON.parse(localStorage.getItem('agentRowData') || "[]")

        // return
        this.agentService.getAll()
            .pipe(first())
            .subscribe((data: any) => {
                // console.log(data);
                this.agents = data
                this.rowData = data.map((item: any, index: any) => ({ ...item, serialNumber: index + 1 }));

                localStorage.setItem('agentRowData', JSON.stringify(this.rowData))

            }, (error => {
                console.log(error);
            }),
                () => {
                    this.loading = false;
                })
    }

    deleteUser(id: string) {
        const user = this.agents!.find(x => x.id === id);
        user.isDeleting = true;
        this.agentService.delete(id)
            .pipe(first())
            .subscribe(() => this.agents = this.agents!.filter(x => x.id !== id));
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
            this.router.navigateByUrl('/agents/edit/' + event.data.id)
        }

        else if (event.event.srcElement.outerHTML == '<i class="bi bi-trash3" style="color: red;"></i>') {

            if (confirm('Do you really want to delete this POSP?')) {
                console.log('deleting agent:');
                this.agentService.delete(event.data.id).subscribe((data) => {
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