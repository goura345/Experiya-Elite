import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-base',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './base.html',
  styleUrls: ['./base.css']
})
export class BaseComponent {

  showPolicySubMenu: boolean = true;

  toggleAboutSubMenu() {
    // alert()
    this.showPolicySubMenu = !this.showPolicySubMenu;
    
  }

}
