import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Policy } from '@app/_models';
import { Observable } from 'rxjs';


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

    getByProposalNumber(proposal_no: string) {
        console.log('prop from service ', proposal_no);
        return this.http.get(`${environment.apiUrl}/policies/proposal_no/${proposal_no}`);
    }

    update(id: string, params: any) {
        return this.http.put<Policy>(`${environment.apiUrl}/policies/${id}`, params);
    }

    delete(id: string) {
        return this.http.delete<Policy>(`${environment.apiUrl}/policies/${id}`);
    }

    fetchMakesData() {
        const dataUrl = `/assets/vehiclesData/makes.txt`;
        return this.http.get(dataUrl, { responseType: 'json' });
    }

    fetchModelsData() {
        const dataUrl = `/assets/vehiclesData/models.txt`;
        return this.http.get(dataUrl, { responseType: 'json' });
    }

    uploadFiles(files: any) {
        return this.http.post<any>(`${environment.apiUrl}/policies/uploadFiles`, files);
    }

}