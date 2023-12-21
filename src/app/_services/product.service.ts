import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Product } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class ProductService {

    constructor(private http: HttpClient) { }

    register(product: Product) {
        return this.http.post<Product>(`${environment.apiUrl}/products/register`, product);
    }

    getAll() {
        return this.http.get<Product[]>(`${environment.apiUrl}/products`);
    }

    getById(id: string) {
        return this.http.get<Product>(`${environment.apiUrl}/products/${id}`);
    }

    update(id: string, params: any) {
        return this.http.put<Product>(`${environment.apiUrl}/products/${id}`, params)
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/products/${id}`)
    }

}