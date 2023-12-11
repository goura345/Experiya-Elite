import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService, AlertService, InsurerService, PolicyService, ProductService } from '@app/_services';
import { Observable, first } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-add-edit-policy',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, FormsModule],
  templateUrl: './motor.html',

})
export class MotorComponent {

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

  insurers = []
  selectedInsurer = null

  makes$!: any;
  models$!: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private policyService: PolicyService,
    private insurerService: InsurerService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    // form with validation rules
    this.form = this.formBuilder.group({
      policy_no: ['', Validators.required],
      proposal_no: ['', Validators.required],
      customer_name: ['', Validators.required],
      insurance_company: [null, Validators.required],
      sp_name: [null, Validators.required],
      sp_brokercode: [null, Validators.required],
      product_name: [null, Validators.required],
      registration_no: ['', Validators.required],
      rto_state: [null, Validators.required],
      rto_city: ['', Validators.required],
      vehicle_makeby: [null, Validators.required],
      vehicle_model: [null, Validators.required],
      vehicle_catagory: [null, Validators.required],
      vehicle_fuel_type: [null, Validators.required],
      mfg_year: [null, Validators.required],
      addon: [null, Validators.required],
      ncb: [null, Validators.required],
      cubic_capacity: [null, Validators.required],
      gvw: [null, Validators.required],
      seating_capacity: [null, Validators.required],
      coverage_type: [null, Validators.required],
      policy_type: [null, Validators.required],
      cpa: [null, Validators.required],
      risk_start_date: ['', Validators.required],
      risk_end_date: ['', Validators.required],
      issue_date: ['', Validators.required],
      insured_age: ['', Validators.required],
      policy_term: [null, Validators.required],
      bqp: ['', Validators.required],
      pos: [null, Validators.required],
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
      this.policyService.getById(this.id)
        .pipe(first())
        .subscribe(x => {
          this.form.patchValue(x);
          console.log(x);
          this.loading = false;
        });
    }
    // return
    this.insurerService.getAll()
      .pipe(first())
      .subscribe((data: any) => {
        console.log(data);
        this.insurers = data

      }, (error => {
        console.log(error);
      }),
        () => {
          this.loading = false;
        })

    this.policyService.fetchMakesData().subscribe((data: any) => this.makes$ = data);
    this.policyService.fetchModelsData().subscribe((data: any) => this.models$ = data);

  }

  onSubmit() {

    console.log(this.form);
    // return
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    // if (this.form.invalid) {
    //   return;
    // }

    this.submitting = true;
    this.saveUser()
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Policy saved', true);
          this.router.navigateByUrl('/policies');
        },
        error: error => {
          this.alertService.error(error);
          this.submitting = false;
        }
      })
  }

  private saveUser() {
    // create or update policy based on id param
    return this.id
      ? this.policyService.update(this.id!, this.form.value)
      : this.policyService.register(this.form.value);
  }

  showGCV = false // used to control gst 12% control field`s visibility

  calculatePremiumValues() {

    try {

      let od = this.form.controls['OD_premium'].value
      let tp = this.form.controls['TP_terrorism'].value


      let net = Number(od) + Number(tp)
      this.form.controls['net'].patchValue(net)

      // calculating amount with gst
      let vcategory = this.form.controls['vehicle_catagory'].value

      console.log(vcategory);

      if (vcategory === null || vcategory === undefined) {
        console.log('Vehicle category not provided!');
        return
      }

      if (vcategory === "GCV-PUBLIC CARRIER OTHER THAN 3 W" || vcategory === "3 WHEELER GCV-PUBLIC CARRIER" || vcategory === "E CART - GCV") {
        this.form.controls['gst_amount'].patchValue(Number(od * 18 / 100).toFixed(2))
        this.form.controls['gst_gcv_amount'].patchValue(Number(tp * 12 / 100).toFixed(2))
        this.showGCV = true
      } else {
        this.form.controls['gst_amount'].patchValue(Number(net * 18 / 100).toFixed(2))
        this.showGCV = false
        this.form.controls['gst_gcv_amount'].patchValue(null)

      }

      // total amount 
      let n = Number(this.form.controls['net'].value);
      let g = Number(this.form.controls['gst_amount'].value);
      let gg = Number(this.form.controls['gst_gcv_amount'].value);
      let total = Number(n + g + gg).toFixed(2)
      console.log(total);
      this.form.controls['total'].patchValue(total)

    } catch (error) {
      console.log(error);
    }



  }

}
