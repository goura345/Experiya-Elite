import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Payout, Policy } from '@app/_models';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class PayoutService {

    constructor(private http: HttpClient) { }

    register(payout: Payout) {
        return this.http.post<Payout>(`${environment.apiUrl}/payouts/register`, payout);
    }

    getAll() {
        return this.http.get<Payout[]>(`${environment.apiUrl}/payouts`);
    }

    getById(id: string) {
        return this.http.get<Payout>(`${environment.apiUrl}/payouts/${id}`);
    }
   
    update(id: string, params: any) {
        return this.http.put<Payout>(`${environment.apiUrl}/payouts/${id}`, params);
    }

    delete(id: string) {
        return this.http.delete<Payout>(`${environment.apiUrl}/payouts/${id}`);
    }

    fetchMakesData() {    
        return this.http.get(`/assets/vehiclesData/makes.txt`, { responseType: 'json' });
    }

    fetchModelsData() {      
        return this.http.get(`/assets/vehiclesData/models.txt`, { responseType: 'json' });
    }
  
  

}