import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Insurer } from '@app/_models';


@Injectable({ providedIn: 'root' })
export class InsurerService {
   
    constructor(private http: HttpClient) { }

    register(insurer: Insurer) {
        return this.http.post<Insurer>(`${environment.apiUrl}/insurers/register`, insurer);
    }

    getAll() {
        return this.http.get<Insurer[]>(`${environment.apiUrl}/insurers`);
    }

    getById(id: string) {
        return this.http.get<Insurer>(`${environment.apiUrl}/insurers/${id}`);
    }

    update(id: string, params: any) {
        return this.http.put<Insurer>(`${environment.apiUrl}/insurers/${id}`, params)
    }

    delete(id: string) {
        return this.http.delete<Insurer>(`${environment.apiUrl}/insurers/${id}`)
    }

}