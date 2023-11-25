import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '@app/_services';
import { Policy } from '@app/_models';
import { delay } from 'rxjs';

@Component({
  selector: 'app-entrylist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './policylist.html',

})
export class EntrylistComponent {

  loading = true

  constructor(private accountService: AccountService) { }

  ngOnInit() {


    return
    this.loading = true
    this.accountService.getAllPolicy().pipe(delay(5000)).subscribe((data: Policy[])=> {
      console.log(data);
      this.loading = false
    })

  }
}
