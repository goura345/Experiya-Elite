
import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { Columns, Config, DefaultConfig, TableModule } from 'ngx-easy-table';
import { User } from '@app/_models';

@Component({
    templateUrl: 'list.component.html',
    standalone: true,
    imports: [RouterLink, NgFor, NgIf, TableModule]
})
export class ListComponent implements OnInit {

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
    users!: any[]
    id = ''

    constructor(private accountService: AccountService, private router: Router) { }

    ngOnInit() {
        this.configuration = { ...DefaultConfig };
        this.configuration.searchEnabled = true;

        this.columns = [
            // { key: 'SrNo', title: 'Sr. No.' },
            { key: 'firstName', title: 'First Name' },
            { key: 'lastName', title: 'Last Name' },
            { key: 'username', title: 'Username' },
            { key: 'mobileNumber', title: 'Mobile Number' },
            { key: 'role', title: 'Role' },
            { key: 'status', title: 'Status' },
        ];
        this.accountService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
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
}