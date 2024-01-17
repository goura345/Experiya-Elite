import { Component,OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';

import { AccountService } from './_services';
import { User } from './_models';
import { AlertComponent } from './_components/alert.component';
import { BaseComponent } from "./base/base";

import { AgGridModule } from 'ag-grid-angular'; // Angular Grid Logic
import { ColDef } from 'ag-grid-community'; // Column Definitions Interface


@Component({
    selector: 'app-root', templateUrl: 'app.component.html',
    standalone: true,
    imports: [NgIf, RouterOutlet, RouterLink, RouterLinkActive, AlertComponent, BaseComponent, AgGridModule, CommonModule]
})
// export class AppComponent {
//     user?: User | null;

//     visible = true
//     isVehicleVisible = true
  
//     constructor(private accountService: AccountService) {
//         this.accountService.user.subscribe(x => this.user = x);
//     }

//     logout() {
//         if (confirm('Are you sure you want to log out?')) {
//             this.accountService.logout();
//         }
//     }


//     showMenu() {
//         this.visible = !this.visible
//     }

//     showVehicle() {
//         this.isVehicleVisible = !this.isVehicleVisible
//     }

//     // Assuming isVehicleVisible is a boolean variable in your Angular component



//     isPolicyVisible: boolean = false;

//     toggleDropdownPolicy() {
//         this.isPolicyVisible = !this.isPolicyVisible;
//     }

//     navigate(page: string) {
//         // Logic for navigating to the respective page or functionality
//         console.log("Navigating to", page);
//         // Implement navigation logic here
//     }



//     toggleDropdownVehicle() {
//         this.isVehicleVisible = !this.isVehicleVisible;
//     }

//     navigateVehicle(page: string) {
//         // Logic for navigating to the respective page or functionality
//         console.log("Navigating to", page);
//         // Implement navigation logic here
//     }


// }
export class AppComponent implements OnInit {
  user?: User | null;
  visible = true;
  isVehicleVisible = true;
  isPolicyVisible: boolean = false;
  displayContent: boolean = true;

  constructor(private accountService: AccountService, private router: Router) {
    this.accountService.user.subscribe(x => this.user = x);
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.displayContent = !this.router.url.includes('account/login');
      }
    });
  }

  logout() {
    if (confirm('Are you sure you want to log out?')) {
      this.accountService.logout();
    }
  }

  showMenu() {
    this.visible = !this.visible;
  }

  showVehicle() {
    this.isVehicleVisible = !this.isVehicleVisible;
  }

  toggleDropdownPolicy() {
    this.isPolicyVisible = !this.isPolicyVisible;
  }

  navigate(page: string) {
    console.log("Navigating to", page);
    // Implement navigation logic here
  }

  toggleDropdownVehicle() {
    this.isVehicleVisible = !this.isVehicleVisible;
  }

  navigateVehicle(page: string) {
    console.log("Navigating to", page);
    // Implement navigation logic here
  }
  navigateToHome() {
    this.router.navigate(['/home']);
  }
  
}
