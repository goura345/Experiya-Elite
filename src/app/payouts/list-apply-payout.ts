import { Component, OnInit } from '@angular/core';
import { NgIf, NgClass, CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AgentService, AlertService, InsurerService, PayoutService, PolicyService, ProductService } from '@app/_services';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
    templateUrl: './list-apply-payout.html',
    standalone: true,
    imports: [CommonModule, NgIf,FormsModule, ReactiveFormsModule, NgClass, RouterLink, NgSelectModule]
})
export class ListApplyPayoutComponent implements OnInit {
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

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private payoutService: PayoutService,
        private insurerService: InsurerService,
        private agentService: AgentService,
        private policyService: PolicyService,
        private productService: ProductService,
    ) { }

    ngOnInit() {

        console.log(this.vehicleCategories);
        this.id = this.route.snapshot.params['id'];

        console.log(this.id);

        // form with validation rules
        this.form = this.formBuilder.group({
            payout_name: [null, Validators.required],
            insurance_company: [null, Validators.required],
            product_name: [null],
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
            policy_term: [null, Validators.required],
            agent_od_reward: [null],
            agent_od_amount: [null],
            agent_tp_reward: [null],
            agent_tp_amount: [null],
            self_od_reward: [null],
            self_od_amount: [null],
            self_tp_reward: [null],
            self_tp_amount: [null],
            remark: [null],
            status: ['ACTIVE'],
            createdBy: [this.accountService.userValue?.loginId, Validators.required],
        });

        this.title = 'Add Payout';
        this.submitTitle = 'SAVE PAYOUT'

        if (this.id) {
            // edit mode    
            this.submitTitle = 'UPDATE PAYOUT'
            console.log('Getting ID: ', this.id);

            this.payoutService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    console.log(x);
                    this.form.patchValue(x);
                    this.addValuesAndValidators();
                });
        }

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

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {

        this.submitted = true;

        // reset alerts on submit
        // this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            console.log('Invalid form-details');
            return;
        }

        console.log(this.form);

        // return

        this.submitting = true;
        this.saveUser()
            .pipe(first())
            .subscribe({
                next: () => {
                    this.router.navigateByUrl('/payouts');
                },
                error: error => {
                    alert(error)
                }
            })
    }

    saveUser() {
        // create or update user based on id param
        return this.id
            ? this.payoutService.update(this.id!, this.form.value)
            : this.payoutService.register(this.form.value);
    }

    applyValidators(fieldName: any) {
        this.form.get(fieldName)?.setValidators([Validators.required]);
        this.form.get(fieldName)?.updateValueAndValidity();
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

        // this.calculatePremiumValues()

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