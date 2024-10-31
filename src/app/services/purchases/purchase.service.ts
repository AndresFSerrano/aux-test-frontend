// services/purchases/purchase.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Purchase } from '../../interfaces/Purchase';
import { Page } from '../../interfaces/Pagination';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private apiUrl = `${environment.apiUrl}/purchases`;

  constructor(private http: HttpClient) {}

  getPurchases(page: number, size: number): Observable<Page<Purchase>> {
    return this.http.get<Page<Purchase>>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  getPurchasesByUserId(userId: number, page: number, size: number): Observable<Page<Purchase>> {
    return this.http.get<Page<Purchase>>(`${this.apiUrl}/user/${userId}?page=${page}&size=${size}`);
  }
  
  getPurchasesByProductId(productId: number, page: number, size: number): Observable<Page<Purchase>> {
    return this.http.get<Page<Purchase>>(`${this.apiUrl}/product/${productId}?page=${page}&size=${size}`);
  }

  createPurchase(purchase: Purchase): Observable<Purchase> {
    return this.http.post<Purchase>(this.apiUrl, purchase);
  }

  deletePurchase(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
