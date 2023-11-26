import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';
import { first } from 'rxjs';

@Component({
  selector: 'app-add-edit-policy',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-edit-policy.html',

})
export class AddEditPolicyComponent {

  form!: FormGroup;
  id?: string;
  title!: string;
  loading = false;
  submitting = false;
  submitted = false;

  vehicleCategories = [
    "TWO WHEELER",
    "TWO WHEELER BIKE",
    "TWO WHEELER SCOOTER",
    "TWO WHEELER COMMERCIAL",
    "PRIVATE CAR",
    "GCV-PUBLIC CARRIER OTHER THAN 3 W",
    "3 WHEELER PCV",
    "3 WHEELER GCV-PUBLIC CARRIER",
    "TAXI 4 WHEELER",
    "BUS AND OTHERS",
    "MISC-D SPECIAL VEHICLE",
    "SCHOOL BUS-SCHOOL NAME",
    "SCHOOL BUS-INDIVIDUAL NAME",
    "TRADE RISK",
    "E CART - GCV"
  ]

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    // form with validation rules
    this.form = this.formBuilder.group({      
      policy_no: ['', Validators.required],
      proposal_no: ['', Validators.required],
      customer_name: ['', Validators.required],
      insurance_company: ['', Validators.required],
      sp_name: ['', Validators.required],
      sp_brokercode: ['', Validators.required],
      product_name: ['', Validators.required],
      registration_no: ['', Validators.required],
      rto_state: ['', Validators.required],
      rto_city: ['', Validators.required],
      vehicle_makeby: ['', Validators.required],
      vehicle_model: ['', Validators.required],
      vehicle_catagory: ['TWO WHEELER BIKE', Validators.required],
      vehicle_fuel_type: ['', Validators.required],
      mfg_year: ['', Validators.required],
      addon: ['', Validators.required],
      ncb: ['', Validators.required],
      cubic_capacity: ['', Validators.required],
      gvw: ['', Validators.required],
      seating_capacity: ['', Validators.required],
      coverage_type: ['', Validators.required],
      policy_type: ['', Validators.required],
      cpa: ['', Validators.required],
      risk_start_date: ['', Validators.required],
      risk_end_date: ['', Validators.required],
      issue_date: ['', Validators.required],
      insured_age: ['', Validators.required],
      policy_term: ['', Validators.required],
      bqp: ['', Validators.required],
      pos: ['', Validators.required],
      employee: ['', Validators.required],
      OD_premium: ['', Validators.required],
      TP_terrorism: ['', Validators.required],
      net: ['', Validators.required],
      gst_amount: ['', Validators.required],
      gst_gcv_amount: ['', Validators.required],
      total: ['', Validators.required],
      payment_mode: ['', Validators.required],
      agent_od_reward: ['', Validators.required],
      agent_od_amount: ['', Validators.required],
      agent_tp_reward: ['', Validators.required],
      agent_tp_amount: ['', Validators.required],
      self_od_reward: ['', Validators.required],
      self_od_amount: ['', Validators.required],
      self_tp_reward: ['', Validators.required],
      self_tp_amount: ['', Validators.required],
      proposal: ['', Validators.required],
      mandate: ['', Validators.required],
      policy: ['', Validators.required],
      previous_policy: ['', Validators.required],
      pan_card: ['', Validators.required],
      aadhar_card: ['', Validators.required],
      vehicle_rc: ['', Validators.required],
      inspection_report: ['', Validators.required],
      remark: ['', Validators.required],
      status: ['', Validators.required]


    });

    this.title = 'Add Policy';   
    if (this.id) {
      // edit mode
      this.title = 'Edit Policy';
      this.loading = true;
      this.accountService.getPolicyById(this.id)
        .pipe(first())
        .subscribe(x => {
          this.form.patchValue(x);
          console.log(x);
          this.loading = false;
        });
    }
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.submitting = true;
    this.saveUser()
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('User saved', true);
          this.router.navigateByUrl('/users');
        },
        error: error => {
          this.alertService.error(error);
          this.submitting = false;
        }
      })
  }

  private saveUser() {
    // create or update user based on id param
    return this.id
      ? this.accountService.updatePolicyById(this.id!, this.form.value)
      : this.accountService.registerPolicy(this.form.value);
  }

}
