import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PolicyService, InsurerService, AlertService, AgentService, AccountService, ProductService } from '@app/_services';
import { first } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-non-motor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, FormsModule],
  templateUrl: './non-motor.html',
  styleUrl: './non-motor.css'
})
export class NonMotorComponent {


  form!: FormGroup;
  id?: string;
  title!: string;
  submitTitle!: string;
  loading = false;
  submitting = false;
  submitted = false;
  products: any[] = []
  insurers = []
  selectedInsurer = null
  agents: any[] = []
  makes$!: any;
  models$!: any;
  showGCV = false
  cubicCapacities: any[] = []
  coverageTypes: any[] = []
  showSeatingCapacity = false
  gvw: any[] = []

  proposal: File | null = null
  mandate: File | null = null
  policy: File | null = null
  previous_policy: File | null = null
  pan_card: File | null = null
  aadhar_card: File | null = null
  vehicle_rc: File | null = null
  inspection_report: File | null = null

  selectedPOSP: string | null = null

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private policyService: PolicyService,
    private insurerService: InsurerService,
    private alertService: AlertService, private agentService: AgentService, private accountService: AccountService,
    private productService: ProductService
  ) { }

  ngOnInit() {

    this.id = this.route.snapshot.params['id'];

    // form with validation rules
    this.form = this.formBuilder.group({
      policy_no: [null, Validators.required],
      proposal_no: [null, Validators.required],
      customer_name: [null, Validators.required],
      insurance_company: [null, Validators.required],
      sp_name: [null, Validators.required],
      sp_brokercode: [null, Validators.required],
      product_name: [null, Validators.required],
      registration_no: [null],
      rto_state: [null],
      rto_city: [null],
      vehicle_makeby: [null],
      vehicle_model: [null],
      vehicle_catagory: [null],
      vehicle_fuel_type: [null],
      mfg_year: [null],
      addon: [null],
      ncb: [null],
      cubic_capacity: [null],
      gvw: [null],
      seating_capacity: [null],
      coverage_type: [null],
      policy_type: [null, Validators.required],
      cpa: [null],
      risk_start_date: [null, Validators.required],
      risk_end_date: [null, Validators.required],
      issue_date: [null, Validators.required],
      insured_age: [null],
      policy_term: [null, Validators.required],
      bqp: [null, Validators.required],
      pos_name: [null, Validators.required],
      pos: [null, Validators.required],
      employee: [this.accountService.userValue?.loginId, Validators.required],
      OD_premium: [null, Validators.required],
      TP_terrorism: [null, Validators.required],
      net: [null, Validators.required],
      gst_amount: [null, Validators.required],
      gst_gcv_amount: [null],
      total: [null, Validators.required],
      payment_mode: [null, Validators.required],
      agent_od_reward: [null],
      agent_od_amount: [null],
      agent_tp_reward: [null],
      agent_tp_amount: [null],
      self_od_reward: [null],
      self_od_amount: [null],
      self_tp_reward: [null],
      self_tp_amount: [null],
      proposal: [null],
      mandate: [null],
      policy: [null],
      previous_policy: [null],
      pan_card: [null],
      aadhar_card: [null],
      vehicle_rc: [null],
      inspection_report: [null],
      remark: [null],
      status: ['Active']
    });

    this.title = 'Non-Motor Policy';
    this.submitTitle = 'SAVE POLICY'

    if (this.id) {
      // edit mode    
      this.submitTitle = 'UPDATE POLICY'
      console.log('getting id: ', this.id);
      this.loading = true;
      this.policyService.getById(this.id)
        .pipe(first())
        .subscribe(x => {
          console.log(x);
          this.form.patchValue(x);

          this.loading = false;
        });
    }

    this.insurerService.getAll()
      .pipe(first())
      .subscribe((data: any) => {
        // console.log(data);
        this.insurers = data

      }, (error => {
        console.log(error);
      }),
        () => {
          this.loading = false;
        })

    this.agentService.getAll()
      .pipe(first())
      .subscribe((data: any) => {
        // console.log(data);
        this.agents = data

      }, (error => {
        console.log(error);
      }),
        () => {
          this.loading = false;
        })

    this.productService.getAll()
      .pipe(first())
      .subscribe((data: any) => {
        console.log(data);
        this.products = data
      }, (error => {
        console.log(error);
      }),
        () => {
          this.loading = false;
        })
  }


  setPOSP() {
    if (this.selectedPOSP !== null) {
      this.form.controls['pos'].patchValue(this.selectedPOSP.split('|')[0])
      this.form.controls['pos_name'].patchValue(this.selectedPOSP.split('|')[1])

    }
    console.log(this.form.value);
  }

  onSubmit() {

    this.submitted = true;
    this.alertService.clear();

    // update employee id with current employee id
    this.form.controls['employee'].patchValue(this.accountService.userValue?.loginId)
    console.log(this.form.value);

    // stop here if form is invalid
    if (this.form.invalid) {
      console.log(this.form.value);
      console.log('Invalid form');
      return;
    }

    let frmData = this.getFormData()

    this.submitting = true;
    if (Object.entries(frmData).length > 0) {
      console.log('Uploading Docs...');
      this.policyService.uploadFiles(frmData).subscribe(
        (data) => {
          console.log(data);
          if (data.message === "Successfully uploaded!") {
            // return           
            this.savePolicy()
              .pipe(first())
              .subscribe({
                next: () => {
                  console.log('Policy Saved!');
                  this.alertService.success('Policy saved', true);
                  this.router.navigateByUrl('/policies');
                },
                error: error => {
                  this.alertService.error(error);
                  this.submitting = false;
                }
              })
          }
        },
        (error) => {
          console.log(error);
        }
      );

    }
    else {
      console.log('Saving Policy...');
      this.savePolicy()
        .pipe(first())
        .subscribe({
          next: () => {
            console.log('Policy Saved!');
            this.alertService.success('Policy saved', true);
            this.router.navigateByUrl('/policies');
          },
          error: error => {
            this.alertService.error(error);
            this.submitting = false;
          }
        })
    }

  }

  savePolicy() {
    // create or update policy based on id param
    return this.id
      ? this.policyService.update(this.id!, this.form.value)
      : this.policyService.register(this.form.value);
  }

  getFormData(): FormData {

    // upload docs if any
    let formData = new FormData();
    let filesArray = []
    if (this.proposal)
      filesArray.push(this.proposal)
    if (this.mandate)
      filesArray.push(this.mandate)
    if (this.policy)
      filesArray.push(this.policy)
    if (this.previous_policy)
      filesArray.push(this.previous_policy)
    if (this.pan_card)
      filesArray.push(this.pan_card)
    if (this.aadhar_card)
      filesArray.push(this.aadhar_card)
    if (this.vehicle_rc)
      filesArray.push(this.vehicle_rc)
    if (this.inspection_report)
      filesArray.push(this.inspection_report)

    for (let i = 0; i < filesArray.length; i++) {
      formData.append('files', filesArray[i]);
    }

    return formData

  }

  calculatePremiumValues() {

    try {
      let od = this.form.controls['OD_premium'].value
      let tp = this.form.controls['TP_terrorism'].value
      let net = Number(od) + Number(tp)
      this.form.controls['net'].patchValue(net)
      this.form.controls['gst_amount'].patchValue(Number(net * 18 / 100).toFixed(2))
      // total amount     
      let gst = Number(this.form.controls['gst_amount'].value);
      let total = Number(net + gst).toFixed(2)
      this.form.controls['total'].patchValue(total)

    } catch (error) {
      console.log(error);
    }
  }

  onFileChange(event: any) {

    let name = event.target.name

    if (name === 'proposal') {
      console.log('proposal field assigned!');
      this.proposal = this.getRandomFile(event)
      this.form.controls['proposal'].patchValue(this.proposal.name)
    }
    else if (name === 'mandate') {
      console.log('mandate field assigned!');
      this.mandate = this.getRandomFile(event)
      this.form.controls['mandate'].patchValue(this.mandate.name)
    }
    else if (name === 'policy') {
      console.log('policy field assigned!');
      this.policy = this.getRandomFile(event)
      this.form.controls['policy'].patchValue(this.policy.name)

    }
    else if (name === 'previous_policy') {
      console.log('previous_policy field assigned!');
      this.previous_policy = this.getRandomFile(event)
      this.form.controls['previous_policy'].patchValue(this.previous_policy.name)
    }
    else if (name === 'pan_card') {
      console.log('pan_card field assigned!');
      this.pan_card = this.getRandomFile(event)
      this.form.controls['pan_card'].patchValue(this.pan_card.name)
    }
    else if (name === 'aadhar_card') {
      console.log('aadhar_card field assigned!');
      this.aadhar_card = this.getRandomFile(event)
      this.form.controls['aadhar_card'].patchValue(this.aadhar_card.name)
    }
    else if (name === 'vehicle_rc') {
      console.log('vehicle_rc field assigned!');
      this.vehicle_rc = this.getRandomFile(event)
      this.form.controls['vehicle_rc'].patchValue(this.vehicle_rc.name)
    }
    else if (name === 'inspection_report') {
      console.log('inspection_report field assigned!');
      this.inspection_report = this.getRandomFile(event)
      this.form.controls['inspection_report'].patchValue(this.inspection_report.name)
    }
  }

  getRandomFile(event: any) {

    // let propNo = this.form.controls['proposal_no'].value
    let fileName = event.target.files[0].name.split('.')[0]
    let ext = event.target.files[0].name.split('.')[1]
    let newFileName = fileName + '-' + Date.now().toString() + "." + ext
    console.log('filename: ', newFileName);
    return new File([event.target.files[0]!], newFileName, { type: event.target.files[0].type });
  }


}
