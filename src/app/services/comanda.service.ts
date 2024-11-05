// src/app/services/comanda.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComandaService {
  private apiUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {}

  async registrarComanda(numeroComanda: string) {
    return firstValueFrom(
      this.http.post(`${this.apiUrl}/comandas`, { numeroComanda })
    );
  }

  async getPedidosComanda(numeroComanda: string): Promise<any[]> {
    const response = await firstValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/comandas/${numeroComanda}/pedidos`)
    );
    return response || [];
  }
}