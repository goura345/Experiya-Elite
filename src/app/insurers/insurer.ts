import { Component, OnInit } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService, InsurerService } from '@app/_services';

@Component({
    templateUrl: 'insurer.html',
    standalone: true,
    imports: [NgIf, ReactiveFormsModule, NgClass, RouterLink]
})
export class AddEditInsurerComponent implements OnInit {
    form!: FormGroup;
    id?: string;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private insurerService: InsurerService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];

        // form with validation rules
        this.form = this.formBuilder.group({
            comp_name: ['', Validators.required],           
            status: ['', Validators.required],
        });

        this.title = 'Add User';
        if (this.id) {
            // edit mode
            this.title = 'Edit User';
            this.loading = true;
            this.insurerService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.form.patchValue(x);
                    this.loading = false;
                });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.submitting = true;
        this.saveInsurer()
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Insurer Saved', true);
                    this.router.navigateByUrl('/insurers');
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            })
    }

    private saveInsurer() {
        // create or update user based on id param
        return this.id
            ? this.insurerService.update(this.id!, this.form.value)
            : this.insurerService.register(this.form.value);
    }
}