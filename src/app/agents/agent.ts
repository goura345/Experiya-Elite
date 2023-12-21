import { Component, OnInit } from '@angular/core';
import { NgIf, NgClass, CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AgentService, AlertService } from '@app/_services';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
    templateUrl: 'agent.html',
    standalone: true,
    imports: [CommonModule, NgIf, ReactiveFormsModule, NgClass, RouterLink, NgSelectModule, FormsModule]
})
export class AddEditAgentComponent implements OnInit {
    form!: FormGroup;
    id?: string;
    title!: string;
    submitTitle!: string;
    loading = false;
    submitting = false;
    submitted = false;

    basic_qualification: File | null = null
    aadhar_card: File | null = null
    pan_card: File | null = null
    training_certificate: File | null = null
    appointment_certificate: File | null = null
    agreement_certificate: File | null = null
    bank_details: File | null = null

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private agentService: AgentService,
        private alertService: AlertService,
        private accountService: AccountService
    ) { }

    ngOnInit() {

        this.id = this.route.snapshot.params['id'];

        // form with validation rules
        this.form = this.formBuilder.group({
            posp_code: [null, Validators.required],
            registration_code: [null, Validators.required],
            full_name: [null, Validators.required],
            gender: [null, Validators.required],
            email_id: [null, Validators.required],
            mob_no: [null, Validators.required],
            address: [null, Validators.required],
            state: [null, Validators.required],
            city: [null, Validators.required],
            pincode: [null, Validators.required],
            rural_urban: [null, Validators.required],
            slab: [null, Validators.required],
            GSTIN: [null, Validators.required],
            account_no: [null, Validators.required],
            ifsc_code: [null, Validators.required],
            bank_name: [null, Validators.required],
            basic_qualification: [null, Validators.required],
            aadhar_card: [null, Validators.required],
            pan_card: [null, Validators.required],
            training_certificate: [null, Validators.required],
            appointment_certificate: [null, Validators.required],
            agreement_certificate: [null, Validators.required],
            bank_details: [null, Validators.required],
            password: [null],
            created_by: [this.accountService.userValue?.loginId, Validators.required],
            remark: [null],
            status: ['Active']
        });

        this.title = 'POSP FORM';
        this.submitTitle = 'SAVE POSP'


        if (this.id) {
            // edit mode    
            this.submitTitle = 'UPDATE POSP'
            console.log('getting id: ', this.id);
            this.loading = true;

            this.agentService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    console.log(x);
                    this.form.patchValue(x);

                    this.loading = false;
                });
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

    onFileChange(event: any) {

        let name = event.target.name

        if (name === 'basic_qualification') {
            console.log('basic_qualification field assigned!');
            this.basic_qualification = this.getRandomFile(event)
            this.form.controls['basic_qualification'].patchValue(this.basic_qualification.name)
        }
        else if (name === 'aadhar_card') {
            console.log('aadhar_card field assigned!');
            this.aadhar_card = this.getRandomFile(event)
            this.form.controls['aadhar_card'].patchValue(this.aadhar_card.name)
        }
        else if (name === 'pan_card') {
            console.log('pan_card field assigned!');
            this.pan_card = this.getRandomFile(event)
            this.form.controls['pan_card'].patchValue(this.pan_card.name)
        }
        else if (name === 'training_certificate') {
            console.log('training_certificate field assigned!');
            this.training_certificate = this.getRandomFile(event)
            this.form.controls['training_certificate'].patchValue(this.training_certificate.name)
        }
        else if (name === 'appointment_certificate') {
            console.log('appointment_certificate field assigned!');
            this.appointment_certificate = this.getRandomFile(event)
            this.form.controls['appointment_certificate'].patchValue(this.appointment_certificate.name)

        }
        else if (name === 'agreement_certificate') {
            console.log('agreement_certificate field assigned!');
            this.agreement_certificate = this.getRandomFile(event)
            this.form.controls['agreement_certificate'].patchValue(this.agreement_certificate.name)
        }
        else if (name === 'bank_details') {
            console.log('bank_details field assigned!');
            this.bank_details = this.getRandomFile(event)
            this.form.controls['bank_details'].patchValue(this.bank_details.name)
        }

    }

    onSubmit() {

        this.submitted = true;
        this.alertService.clear();

        // update employee id with current employee id
        this.form.controls['created_by'].patchValue(this.accountService.userValue?.loginId)
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
        if (this.basic_qualification)
            filesArray.push(this.basic_qualification)
        if (this.aadhar_card)
            filesArray.push(this.aadhar_card)
        if (this.pan_card)
            filesArray.push(this.pan_card)
        if (this.training_certificate)
            filesArray.push(this.training_certificate)
        if (this.appointment_certificate)
            filesArray.push(this.appointment_certificate)
        if (this.agreement_certificate)
            filesArray.push(this.agreement_certificate)
        if (this.bank_details)
            filesArray.push(this.bank_details)

        for (let i = 0; i < filesArray.length; i++) {
            formData.append('files', filesArray[i]);
        }

        this.submitting = true;

        if (filesArray.length > 0) {
            console.log('Saving docs...');

            this.agentService.uploadFiles(formData).subscribe(
                (data) => {
                    console.log(data);

                    if (data.message === "Successfully uploaded!") {
                        this.savePosp()
                            .pipe(first())
                            .subscribe({
                                next: () => {
                                    console.log('POSP Saved!');
                                    this.alertService.success('POSP saved', true);
                                    this.router.navigateByUrl('/agents');
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
            console.log('Saving POSP...');
            this.savePosp()
                .pipe(first())
                .subscribe({
                    next: () => {
                        console.log('POSP Saved!');
                        this.alertService.success('POSP Saved!', true);
                        this.router.navigateByUrl('/agents');
                    },
                    error: error => {
                        this.alertService.error(error);
                        this.submitting = false;
                    }
                })
        }

    }

    savePosp() {
        // create or update agent based on id param
        return this.id
            ? this.agentService.update(this.id!, this.form.value)
            : this.agentService.register(this.form.value);
    }

}