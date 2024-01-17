
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { first } from 'rxjs/operators';
import flatpickr from "flatpickr";

import { AlertService, InsurerService, PolicyService } from '@app/_services';
import { User } from '@app/_models';
import { AgGridModule } from 'ag-grid-angular'; // Angular Grid Logic
import { ColDef } from 'ag-grid-community'; // Column Definitions Interface
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms';


@Component({
    templateUrl: 'insurer-list.html',
    standalone: true,
    imports: [RouterLink, NgFor, NgIf, AgGridModule, ReactiveFormsModule, CommonModule, FormsModule]
})
export class InsurerListComponent implements OnInit {

    insurers!: any[]
    id = ''

    form!: FormGroup;
    title!: string;
    submitTitle!: string;

    loading = false;
    submitting = false;
    submitted = false;

    // Column Definitions: Defines & controls grid columns.
    colDefs: ColDef[] = [
        { headerName: "SR. NO.", field: 'serialNumber', sortable: true, filter: true },
        { headerName: "INSURER NAME", field: 'comp_name', sortable: true, filter: true },
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


    @ViewChild('addBtn') addBtn: ElementRef | null = null
    @ViewChild('closeBtn') closeBtn: ElementRef | null = null

    constructor(private insurerService: InsurerService, private router: Router, private formBuilder: FormBuilder,
        private alertService: AlertService) { }

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


        this.rowData = JSON.parse(localStorage.getItem('insurerRowData') || "[]")

      

        this.title = 'Add Insurer';
        this.submitTitle = 'SAVE'

        // form with validation rules
        this.form = this.formBuilder.group({
            comp_name: ['', Validators.required],
            status: ['', Validators.required],
        });

        // return
        this.insurerService.getAll()
            .pipe(first())
            .subscribe((data: any) => {
                console.log(data);
                this.insurers = data
                this.rowData = data.map((item: any, index: any) => ({ ...item, serialNumber: index + 1 }));
                localStorage.setItem('insurerRowData', JSON.stringify(this.rowData))


            }, (error => {
                console.log(error);
            }),
                () => {
                    this.loading = false;
                })
    }

    deleteUser(id: string) {
        const user = this.insurers!.find(x => x.id === id);
        user.isDeleting = true;
        this.insurerService.delete(id)
            .pipe(first())
            .subscribe(() => this.insurers = this.insurers!.filter(x => x.id !== id));
    }

    eventEmitted($event: { event: string; value: any }): void {
        // this.clicked = JSON.stringify($event);    
        console.log('$event', $event);
        this.id = $event.value.row.id
        this.router.navigateByUrl('users/edit/' + this.id)
    }

    onEditDelete(event: any) {

        console.log(event);

        if (event.event.srcElement.outerHTML == '<i class="bi bi-pencil"></i>') {
            console.log('id: ', event.data.id);
            // this.router.navigateByUrl('/insurers/edit/' + event.data.id)

            this.addBtn?.nativeElement.click()
            this.id = event.data.id
            this.title = 'Update Insurer'
            let insurer = this.insurers.find(item => item.id === this.id)
            console.log(insurer);
            this.form.patchValue(insurer)
        }

        else if (event.event.srcElement.outerHTML == '<i class="bi bi-trash3" style="color: red;"></i>') {
            if (confirm(`Do you really want to delete the insurer: ${event.data.comp_name}?`)) {
                console.log('deleting agent:');
                this.insurerService.delete(event.data.id).subscribe((data) => {
                    console.log(data);
                    this.ngOnInit()
                }, (error) => {
                    console.log(error);
                })
            }
        }
    }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            console.log('invalid form');
            return;
        }

        this.submitting = true;
        this.saveInsurer()
            .pipe(first())
            .subscribe({
                next: () => {
                    // this.alertService.success('Insurer Saved', true);
                    // this.router.navigateByUrl('/insurers');
                    this.submitting = false;
                    this.ngOnInit()
                    this.closeBtn?.nativeElement.click()
                    this.form.reset()
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            })
    }

    onFrmDateChange(selectedDates: any, dateStr: any, instance: any) {

        // console.log('From Date:', dateStr);
        // this.frmDate = dateStr
        // console.log(this.frmDateFlatpickr.now);
    
      }
    
      onToDateChange(selectedDates: any, dateStr: any, instance: any) {
    
        // console.log('To Date:', dateStr);
    
    
      }


    saveInsurer() {
        // create or update user based on id param
        return this.id
            ? this.insurerService.update(this.id!, this.form.value)
            : this.insurerService.register(this.form.value);
    }

    resetForm() {
        this.form.reset()
        this.id = ''
        this.title = 'Add Insurer'
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