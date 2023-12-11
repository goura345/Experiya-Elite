import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Policy } from '@app/_models';


@Injectable({ providedIn: 'root' })
export class PolicyService {

    constructor(private http: HttpClient) { }

    register(policy: Policy) {
        return this.http.post<Policy>(`${environment.apiUrl}/policies/register`, policy);
    }

    getAll() {
        return this.http.get<Policy[]>(`${environment.apiUrl}/policies`);
    }

    getById(id: string) {
        return this.http.get<Policy>(`${environment.apiUrl}/policies/${id}`);
    }

    update(id: string, params: any) {
        return this.http.put<Policy>(`${environment.apiUrl}/policies/${id}`, params);
    }

    delete(id: string) {
        return this.http.delete<Policy>(`${environment.apiUrl}/policies/${id}`);
    }

}