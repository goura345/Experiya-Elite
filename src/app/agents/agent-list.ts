
import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { first } from 'rxjs/operators';

import { AgentService } from '@app/_services';
import { User } from '@app/_models';
import { AgGridModule } from 'ag-grid-angular'; // Angular Grid Logic
import { ColDef } from 'ag-grid-community'; // Column Definitions Interface

@Component({
    templateUrl: 'agent-list.html',
    standalone: true,
    imports: [RouterLink, NgFor, NgIf, AgGridModule]
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


    constructor(private agentService: AgentService, private router: Router) { }

    ngOnInit() {

        this.agentService.getAll()
            .pipe(first())
            .subscribe((data: any) => {
                // console.log(data);
                this.agents = data
                this.rowData = data.map((item: any, index: any) => ({ ...item, serialNumber: index + 1 }));

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
}