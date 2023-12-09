
import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { User } from '@app/_models';
import { AgGridModule } from 'ag-grid-angular'; // Angular Grid Logic
import { ColDef } from 'ag-grid-community'; // Column Definitions Interface


@Component({
    templateUrl: 'list.component.html',
    standalone: true,
    imports: [RouterLink, NgFor, NgIf, AgGridModule]
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

    constructor(private accountService: AccountService, private router: Router) { }

    ngOnInit() {

        this.loading = true;

        this.accountService.getAll()
            .pipe(first())
            .subscribe((data: any) => {
                // console.log(data);
                this.users = data
                this.rowData = data.map((item: any, index: any) => ({ ...item, serialNumber: index + 1 }));

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

    eventEmitted($event: { event: string; value: any }): void {
        // this.clicked = JSON.stringify($event);    
        console.log('$event', $event);
        this.id = $event.value.row.id
        this.router.navigateByUrl('users/edit/' + this.id)
    }

    onEditDelete(event: any) {
        return
        console.log(event);
        console.log(event.colDef.headerName);
        console.log(event.data.mobileNumber);

        let submission = this.users.filter((item) => item.mobileNumber == event.data.mobileNumber)[0]
        console.log(submission);

        if (event.event.srcElement.outerHTML == '<i class="bi bi-pencil"></i>') {

        }

        else if (event.event.srcElement.outerHTML == '<i class="bi bi-trash3" style="color: red;"></i>') {
            this.deleteUser(event.data.mobileNumber)

        }
    }
}