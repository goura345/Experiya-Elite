import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Agent, Policy, User } from '@app/_models';
import * as CryptoJS from 'crypto-js';


@Injectable({ providedIn: 'root' })
export class AgentService {
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

        return this.http.post<Agent>(`${environment.apiUrl}/agents/register`, user);
    }

    getAll() {
        return this.http.get<Agent[]>(`${environment.apiUrl}/agents`);
    }

    getById(id: string) {
        return this.http.get<Agent>(`${environment.apiUrl}/agents/${id}`);
    }

    update(id: string, params: any) {
        return this.http.put<Agent>(`${environment.apiUrl}/agents/${id}`, params);
    }

    delete(id: string) {
        return this.http.delete<Agent>(`${environment.apiUrl}/agents/${id}`);       
    }

    uploadFiles(files: any) {
        return this.http.post<any>(`${environment.apiUrl}/policies/uploadFiles`, files);
    }

}