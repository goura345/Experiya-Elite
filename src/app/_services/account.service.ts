import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Policy, User } from '@app/_models';
import * as CryptoJS from 'crypto-js';

export function encryptData(data: string | undefined): string {
    const encryptionKey = environment.encryptionKey;
    return CryptoJS.AES.encrypt(data || "", encryptionKey).toString();
}

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(user: User) {    

        console.log(user, user.firstName);
        // const encryptedFirstName = encryptData(user.firstName);
        // const encryptedLastName = encryptData(user.lastName);
        // const encryptedUsername = encryptData(user.username);
        // const encryptedPassword = encryptData(user.password);
        // const encryptedMobileNumber = encryptData("86072968062");


        // if (!user || !user.username || !user.password || !user.firstName || !user.lastName || !user.mobileNumber) {
        //     return throwError('Invalid user data'); // You can handle this error as needed
        // }

        // const dataToEncryptForRegister = {
        //     id: null,
        //     firstName: encryptedFirstName,
        //     lastName: encryptedLastName,
        //     username: encryptedUsername,
        //     mobileNumber: encryptedMobileNumber,
        //     password: encryptedPassword,
        //     token: null,
        //     role: 'lead'
        // };
        // console.log('Encrypted data sent to server: ', dataToEncryptForRegister);

        return this.http.post(`${environment.apiUrl}/users/register`, user);

    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    update(id: string, params: any) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue?.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue?.id) {
                    this.logout();
                }
                return x;
            }));
    }

    getAllPolicy() {
        return this.http.get<Policy[]>(`${environment.apiUrl}/policies`);
    }

    getPolicyById(id: string) {
        return this.http.get<Policy>(`${environment.apiUrl}/policies/${id}`);
    }

    updatePolicyById(id: string, params: any) {
        return this.http.put(`${environment.apiUrl}/policies/${id}`, params);
    }

    registerPolicy(policy: any) {

        console.log('service register method calling: ', policy);        
        return this.http.post(`${environment.apiUrl}/policies/register`, policy);

    }



}