
import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { first } from 'rxjs/operators';

import { AgentService } from '@app/_services';

import { Columns, Config, DefaultConfig, TableModule } from 'ngx-easy-table';
import { User } from '@app/_models';

import { AgGridModule } from 'ag-grid-angular'; // Angular Grid Logic
import { ColDef } from 'ag-grid-community'; // Column Definitions Interface

@Component({
    templateUrl: 'agent-list.html',
    standalone: true,
    imports: [RouterLink, NgFor, NgIf, TableModule, AgGridModule]
})
export class AgentListComponent implements OnInit {

    public configuration!: Config;
    public columns!: Columns[];
    public pagination = {
        limit: 10,
        offset: 0,
        count: -1,
        sort: '',
        order: '',
    };

    loading = true
    agents!: any[]
    id = ''
   
    // Column Definitions: Defines & controls grid columns.
    colDefs: ColDef[] = [
        { field: "full_name" },
        { field: "company" },
        { field: "location" },
        { field: "date" },
        { field: "price" },
        { field: "successful" },
        { field: "rocket" }
    ];
    
     // Row Data: The data to be displayed.
     rowData: any[] = []


    constructor(private agentService: AgentService, private router: Router) { }

    ngOnInit() {
        this.configuration = { ...DefaultConfig };
        this.configuration.searchEnabled = true;

        this.columns = [
            // { key: 'SrNo', title: 'Sr. No.' },
            { key: 'posp_code', title: 'POSP CODE' },
            { key: 'registration_code', title: 'REG. CODE' },
            { key: 'full_name', title: 'POSP NAME' },
            { key: 'gender', title: 'GENDER' },

            { key: 'email_id', title: 'EMAIL' },
            { key: 'mob_no', title: 'MOBILE NO.' },
            { key: 'address', title: 'ADDREES' },
            { key: 'state', title: 'STATE' },
            { key: 'city', title: 'CITY' },
            { key: 'pincode', title: 'PINCODE' },
            { key: 'rural_urban', title: 'RURAL/URBAN' },
            { key: 'slab', title: 'SLAB' },
            { key: 'GSTIN', title: 'GSTIN' },
            { key: 'account_no', title: 'BANK ACCOUNT NO' },
            { key: 'ifsc_code', title: 'IFSC CODE' },
            { key: 'bank_name', title: 'BANK NAME' },
            { key: 'basic_qualification', title: 'BASIC QQUALIFICATION' },
            { key: 'aadhar_card', title: 'AADHAR CARD' },
            { key: 'pan_card', title: 'PAN CARD' },
            { key: 'training_certificate', title: 'TRAINING CERTIFICATE' },
            { key: 'appointment_certificate', title: 'APPOINTMENT CERTIFICATE' },
            { key: 'agreement_certificate', title: 'AGREEMENT' },
            { key: 'bank_details', title: 'BANK DETAILS' },
            { key: 'login_id', title: 'LOGIN ID' },
            { key: 'created_by', title: 'CREATED BY' },
            { key: 'status', title: 'STATUS' },
            // { key: 'gender', title: 'ACTION' }
        ];
        this.agentService.getAll()
            .pipe(first())
            .subscribe(agents => this.rowData = agents);
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
}