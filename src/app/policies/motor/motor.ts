import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService, AgentService, AlertService, InsurerService, PolicyService, ProductService } from '@app/_services';
import { Observable, first } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-add-edit-policy',
  standalone: true,
  templateUrl: './motor.html',
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, FormsModule]
})
export class MotorComponent {

  form!: FormGroup;
  id?: string;
  title!: string;
  submitTitle!: string;
  loading = false;
  submitting = false;
  submitted = false;
  vehicleCategories = [
    VehicleCategories.TWO_WHEELER,
    VehicleCategories.TWO_WHEELER_BIKE,
    VehicleCategories.TWO_WHEELER_SCOOTER,
    VehicleCategories.TWO_WHEELER_COMMERCIAL,
    VehicleCategories.PRIVATE_CAR,
    VehicleCategories.GCV_PUBLIC_CARRIER_OTHER_THAN_3W,
    VehicleCategories.THREE_WHEELER_PCV,
    VehicleCategories.THREE_WHEELER_GCV_PUBLIC_CARRIER,
    VehicleCategories.TAXI_4_WHEELER,
    VehicleCategories.BUS_AND_OTHERS,
    VehicleCategories.MISC_D_SPECIAL_VEHICLE,
    VehicleCategories.SCHOOL_BUS_SCHOOL_NAME,
    VehicleCategories.SCHOOL_BUS_INDIVIDUAL_NAME,
    VehicleCategories.TRADE_RISK,
    VehicleCategories.E_CART_GCV
  ]
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
    private alertService: AlertService, private agentService: AgentService, private accountService: AccountService
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
      product_name: ['MOTOR'],
      registration_no: [null, Validators.required],
      rto_state: [null, Validators.required],
      rto_city: [null, Validators.required],
      vehicle_makeby: [null, Validators.required],
      vehicle_model: [null, Validators.required],
      vehicle_catagory: [null, Validators.required],
      vehicle_fuel_type: [null, Validators.required],
      mfg_year: [null, Validators.required],
      addon: [null, Validators.required],
      ncb: [null, Validators.required],
      cubic_capacity: [null],
      gvw: [null],
      seating_capacity: [null],
      coverage_type: [null],
      policy_type: [null, Validators.required],
      cpa: [null, Validators.required],
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

    this.title = 'Motor Policy';
    this.submitTitle = 'SAVE POLICY'

    if (this.id) {
      // edit mode
      this.title = 'Motor Policy';
      this.submitTitle = 'UPDATE POLICY'
      console.log('getting id: ', this.id);
      this.loading = true;
      this.policyService.getById(this.id)
        .pipe(first())
        .subscribe(x => {
          console.log(x);
          this.form.patchValue(x);
          this.addValuesAndValidators()
          this.loading = false;
        });
    }
    // return
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


    this.policyService.fetchMakesData().subscribe((data: any) => this.makes$ = data);
    this.policyService.fetchModelsData().subscribe((data: any) => this.models$ = data);

  }

  getRandomFile(event: any) {

    // let propNo = this.form.controls['proposal_no'].value
    let fileName = event.target.files[0].name.split('.')[0]
    let ext = event.target.files[0].name.split('.')[1]
    let newFileName = fileName + '-' + Date.now().toString() + "." + ext
    console.log('filename: ', newFileName);
    return new File([event.target.files[0]!], newFileName, { type: event.target.files[0].type });
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

  calculatePremiumValues() {

    try {

      let od = this.form.controls['OD_premium'].value
      let tp = this.form.controls['TP_terrorism'].value

      let net = Number(od) + Number(tp)
      this.form.controls['net'].patchValue(net)

      // calculating amount with gst
      let category = this.form.controls['vehicle_catagory'].value

      // console.log(category);

      if (category === null || category === undefined) {
        console.log('Vehicle category not provided!');
        return
      }

      if (category === "GCV-PUBLIC CARRIER OTHER THAN 3 W" || category === "3 WHEELER GCV-PUBLIC CARRIER" || category === "E CART - GCV") {
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
      // console.log(total);
      this.form.controls['total'].patchValue(total)

    } catch (error) {
      console.log(error);
    }



  }

  addValuesAndValidators() {

    // This method adds dynamic options and validators based on vehicle category
    //  This method also calls to calculatePremiumValues() to update premium details values

    this.form.controls['cubic_capacity'].clearValidators()
    this.form.controls['coverage_type'].clearValidators()
    this.form.controls['seating_capacity'].clearValidators()
    this.form.controls['gvw'].clearValidators()

    this.cubicCapacities = []
    this.coverageTypes = []
    this.showSeatingCapacity = false
    this.gvw = []
    this.showGCV = false

    let vCategory = this.form.controls['vehicle_catagory'].value

    if (vCategory === VehicleCategories.TWO_WHEELER || VehicleCategories.TWO_WHEELER_SCOOTER || vCategory === VehicleCategories.TWO_WHEELER_BIKE) {
      // adding cubic capacities   
      this.cubicCapacities.push('75CC-150CC')
      this.cubicCapacities.push('150CC-350CC')
      this.cubicCapacities.push('ABOVE 350CC')
      // adding coverage types   
      this.coverageTypes.push('1 YEAR PACKAGE')
      this.coverageTypes.push('1+4 YEAR PACKAGE')
      this.coverageTypes.push('5 YEAR TP')
      this.coverageTypes.push('TP ONLY')
      this.coverageTypes.push('OD ONLY')
      // apply validators
      this.applyValidators('cubic_capacity')
      this.applyValidators('coverage_type')

    }
    else if (vCategory === VehicleCategories.TWO_WHEELER_COMMERCIAL) {
      // adding cubic capacities   
      this.cubicCapacities.push('75CC-150CC')
      this.cubicCapacities.push('150CC-350CC')
      this.cubicCapacities.push('ABOVE 350CC')
      // adding coverage types   
      this.coverageTypes.push('1 YEAR PACKAGE')
      this.coverageTypes.push('1+4 YEAR PACKAGE')
      this.coverageTypes.push('5 YEAR TP')
      this.coverageTypes.push('TP ONLY')
      this.coverageTypes.push('OD ONLY')
      // showing seating capacity
      this.showSeatingCapacity = true
      // apply validators
      this.applyValidators('cubic_capacity')
      this.applyValidators('coverage_type')

    }
    else if (vCategory === VehicleCategories.PRIVATE_CAR || vCategory === VehicleCategories.TRADE_RISK) {
      // adding cubic capacities   
      this.cubicCapacities.push('BELOW 1000CC')
      this.cubicCapacities.push('1000CC-1500CC')
      this.cubicCapacities.push('ABOVE 1500CC')
      // adding coverage types   
      this.coverageTypes.push('1 YEAR PACKAGE')
      this.coverageTypes.push('1+2 YEAR PACKAGE')
      this.coverageTypes.push('3 YEAR TP')
      this.coverageTypes.push('TP ONLY')
      this.coverageTypes.push('OD ONLY')
      // apply validators
      this.applyValidators('cubic_capacity')
      this.applyValidators('coverage_type')
    }
    else if (vCategory === VehicleCategories.GCV_PUBLIC_CARRIER_OTHER_THAN_3W || vCategory === VehicleCategories.E_CART_GCV) {
      // adding coverage types   
      this.coverageTypes.push('1 YEAR PACKAGE')
      this.coverageTypes.push('TP ONLY')
      // showing gvw`s options
      this.showGCV = true
      // apply validators
      this.applyValidators('coverage_type')
      this.applyValidators('gvw')
    }
    else if (vCategory === VehicleCategories.THREE_WHEELER_PCV) {
      // adding coverage types   
      this.coverageTypes.push('1 YEAR PACKAGE')
      this.coverageTypes.push('TP ONLY')
      // showing seating capacity
      this.showSeatingCapacity = true
      // apply validators
      this.applyValidators('coverage_type')
      this.applyValidators('seating_capacity')
    }
    else if (vCategory === VehicleCategories.THREE_WHEELER_GCV_PUBLIC_CARRIER) {
      // adding coverage types   
      this.coverageTypes.push('1 YEAR PACKAGE')
      this.coverageTypes.push('TP ONLY')
      // showing seating capacity
      this.showSeatingCapacity = true
      // showing gvw
      this.showGCV = true
      // apply validators
      this.applyValidators('coverage_type')
      this.applyValidators('seating_capacity')
      this.applyValidators('gvw')
    }
    else if (vCategory === VehicleCategories.TAXI_4_WHEELER) {
      // adding cubic capacities   
      this.cubicCapacities.push('BELOW 1000CC')
      this.cubicCapacities.push('1000CC-1500CC')
      this.cubicCapacities.push('ABOVE 1500CC')
      // adding coverage types   
      this.coverageTypes.push('1 YEAR PACKAGE')
      this.coverageTypes.push('1+2 YEAR PACKAGE')
      this.coverageTypes.push('3 YEAR TP')
      this.coverageTypes.push('TP ONLY')
      this.coverageTypes.push('OD ONLY')
      // showing seating capacity
      this.showSeatingCapacity = true
      // apply validators
      this.applyValidators('cubic_capacity')
      this.applyValidators('coverage_type')
      this.applyValidators('seating_capacity')
    }
    else if (vCategory === VehicleCategories.BUS_AND_OTHERS) {
      // adding coverage types   
      this.coverageTypes.push('1 YEAR PACKAGE')
      this.coverageTypes.push('TP ONLY')
      // showing seating capacity
      this.showSeatingCapacity = true
      // apply validators   
      this.applyValidators('coverage_type')
      this.applyValidators('seating_capacity')
    }
    else if (vCategory === VehicleCategories.MISC_D_SPECIAL_VEHICLE) {
      // adding coverage types   
      this.coverageTypes.push('1 YEAR PACKAGE')
      this.coverageTypes.push('1+2 YEAR PACKAGE')
      this.coverageTypes.push('3 YEAR TP')
      this.coverageTypes.push('TP ONLY')
      this.coverageTypes.push('OD ONLY')
      // showing seating capacity
      this.showSeatingCapacity = true
      // apply validators   
      this.applyValidators('coverage_type')
      this.applyValidators('seating_capacity')
    }
    else if (vCategory === VehicleCategories.SCHOOL_BUS_SCHOOL_NAME) {
      // adding coverage types   
      this.coverageTypes.push('1 YEAR PACKAGE')
      this.coverageTypes.push('1+2 YEAR PACKAGE')
      this.coverageTypes.push('3 YEAR TP')
      this.coverageTypes.push('TP ONLY')
      this.coverageTypes.push('OD ONLY')
      // showing seating capacity
      this.showSeatingCapacity = true
      // apply validators   
      this.applyValidators('coverage_type')
      this.applyValidators('seating_capacity')
    }
    else if (vCategory === VehicleCategories.SCHOOL_BUS_INDIVIDUAL_NAME) {
      // adding coverage types   
      this.coverageTypes.push('1 YEAR PACKAGE')
      this.coverageTypes.push('1+2 YEAR PACKAGE')
      this.coverageTypes.push('3 YEAR TP')
      this.coverageTypes.push('TP ONLY')
      this.coverageTypes.push('OD ONLY')
      // showing seating capacity
      this.showSeatingCapacity = true
      // apply validators   
      this.applyValidators('coverage_type')
      this.applyValidators('seating_capacity')
    }

    this.calculatePremiumValues()

  }

  applyValidators(fieldName: any) {
    this.form.get(fieldName)?.setValidators([Validators.required]);
    this.form.get(fieldName)?.updateValueAndValidity();
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

    this.submitting = true; 
    if (Object.entries(formData).length > 0) {
      console.log('Uploading Docs...');
      this.policyService.uploadFiles(formData).subscribe(
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

  setPOSP() {
    if (this.selectedPOSP !== null) {
      this.form.controls['pos'].patchValue(this.selectedPOSP.split('|')[0])
      this.form.controls['pos_name'].patchValue(this.selectedPOSP.split('|')[1])

    }
    console.log(this.form.value);
  }

  addDocs(){
    
  }

}

enum VehicleCategories {
  TWO_WHEELER = 'TWO WHEELER',
  TWO_WHEELER_BIKE = 'TWO WHEELER BIKE',
  TWO_WHEELER_SCOOTER = 'TWO WHEELER SCOOTER',
  TWO_WHEELER_COMMERCIAL = 'TWO WHEELER COMMERCIAL',
  PRIVATE_CAR = 'PRIVATE CAR',
  GCV_PUBLIC_CARRIER_OTHER_THAN_3W = 'GCV-PUBLIC CARRIER OTHER THAN 3 W',
  THREE_WHEELER_PCV = '3 WHEELER PCV',
  THREE_WHEELER_GCV_PUBLIC_CARRIER = '3 WHEELER GCV-PUBLIC CARRIER',
  TAXI_4_WHEELER = 'TAXI 4 WHEELER',
  BUS_AND_OTHERS = 'BUS AND OTHERS',
  MISC_D_SPECIAL_VEHICLE = 'MISC-D SPECIAL VEHICLE',
  SCHOOL_BUS_SCHOOL_NAME = 'SCHOOL BUS-SCHOOL NAME',
  SCHOOL_BUS_INDIVIDUAL_NAME = 'SCHOOL BUS-INDIVIDUAL NAME',
  TRADE_RISK = 'TRADE RISK',
  E_CART_GCV = 'E CART - GCV'
}


