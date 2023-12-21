
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { first } from 'rxjs/operators';

import { AlertService, InsurerService } from '@app/_services';
import { User } from '@app/_models';
import { AgGridModule } from 'ag-grid-angular'; // Angular Grid Logic
import { ColDef } from 'ag-grid-community'; // Column Definitions Interface
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
    templateUrl: 'insurer-list.html',
    standalone: true,
    imports: [RouterLink, NgFor, NgIf, AgGridModule, ReactiveFormsModule, CommonModule]
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

    @ViewChild('addBtn') addBtn: ElementRef | null = null
    @ViewChild('closeBtn') closeBtn: ElementRef | null = null

    constructor(private insurerService: InsurerService, private router: Router, private formBuilder: FormBuilder,
        private alertService: AlertService) { }

    ngOnInit() {

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
            if (confirm('Do you really want to delete this Insurer?')) {
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

    saveInsurer() {
        // create or update user based on id param
        return this.id
            ? this.insurerService.update(this.id!, this.form.value)
            : this.insurerService.register(this.form.value);
    }

    resetForm(){
        this.form.reset()
        this.id = ''
        this.title = 'Add Insurer'
    }

}