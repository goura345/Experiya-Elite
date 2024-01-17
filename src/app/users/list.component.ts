
import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { first } from 'rxjs/operators';
import flatpickr from "flatpickr";

import { AccountService, PolicyService, ProductService } from '@app/_services';
import { User } from '@app/_models';
import { AgGridModule } from 'ag-grid-angular'; // Angular Grid Logic
import { ColDef } from 'ag-grid-community'; // Column Definitions Interface
import { Title } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms';

@Component({
    templateUrl: 'list.component.html',
    standalone: true,
    imports: [RouterLink, NgFor, NgIf, AgGridModule, FormsModule]
})
export class ListComponent implements OnInit {

    loading = true
    users!: any[]
    id = ''

    // Column Definitions: Defines & controls grid columns.
    colDefs: ColDef[] = [
        { headerName: "SR. NO.", field: 'serialNumber', sortable: true, filter: true },
        { headerName: "FIRST NAME", field: 'firstName', sortable: true, filter: true },
        { headerName: "LAST NAME", field: 'lastName', sortable: true, filter: true },
        { headerName: "USER NAME", field: 'username', sortable: true, filter: true },
        { headerName: "MOBILE NUMBER", field: 'mobileNumber', sortable: true, filter: true },
        { headerName: "EMAIL ID", field: 'email', sortable: true, filter: true },
        { headerName: "ROLE", field: 'role', sortable: true, filter: true },
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


    constructor(private accountService: AccountService, private router: Router) { }

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

        this.rowData = JSON.parse(localStorage.getItem('userRowData') || "[]")

        // this.loading = true;
        this.accountService.getAll()
            .pipe(first())
            .subscribe((data: any) => {
                // console.log(data);
                this.users = data
                this.rowData = data.map((item: any, index: any) => ({ ...item, serialNumber: index + 1 }));
                localStorage.setItem('userRowData', JSON.stringify(this.rowData))

            }, (error => {
                console.log(error);
            }),
                () => {
                    this.loading = false;
                })
    }

    deleteUser(id: string) {
        const user = this.users!.find(x => x.id === id);
        user.isDeleting = true;
        this.accountService.delete(id)
            .pipe(first())
            .subscribe(() => this.users = this.users!.filter(x => x.id !== id));
    }

    onEditDelete(event: any) {

        console.log(event);

        if (event.event.srcElement.outerHTML == '<i class="bi bi-pencil"></i>') {
            console.log('id: ', event.data.id);
            this.router.navigateByUrl('/users/edit/' + event.data.id)
        }

        else if (event.event.srcElement.outerHTML == '<i class="bi bi-trash3" style="color: red;"></i>') {
            if (confirm(`Do you really want to delete User: ${event.data.username}`)) {
                console.log('deleting user:');
                this.accountService.delete(event.data.id).subscribe((data) => {
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