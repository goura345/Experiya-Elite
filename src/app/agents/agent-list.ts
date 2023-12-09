
import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { first } from 'rxjs/operators';

import { AgentService } from '@app/_services';

import { Columns, Config, DefaultConfig, TableModule } from 'ngx-easy-table';
import { User } from '@app/_models';

@Component({
    templateUrl: 'agent-list.html',
    standalone: true,
    imports: [RouterLink, NgFor, NgIf, TableModule]
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

    policies!: any[]
    id = ''


    constructor(private agentService: AgentService, private router: Router) { }

    ngOnInit() {
        this.configuration = { ...DefaultConfig };
        this.configuration.searchEnabled = true;

        this.columns = [
            // { key: 'SrNo', title: 'Sr. No.' },
            { key: 'posp_code', title: 'Posp Code' },
            { key: 'registration_code', title: 'Reg. Code' },
            { key: 'full_name', title: 'Full Name' },
            { key: 'gender', title: 'Gender' },           
        ];
        this.agentService.getAll()
            .pipe(first())
            .subscribe(agents => this.agents = agents);
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