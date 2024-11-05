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

  async registrarComanda(numero: string) {
    return firstValueFrom(
      this.http.post(`${this.apiUrl}/comandas`, { numero })
    );
  }

  async consultarComanda(comandaId: string): Promise<any[]> {
    return firstValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/consultar-comanda?comanda_id=${comandaId}`)
    );
  }

  async getPedidosComanda(comandaId: string): Promise<any[]> {
    return firstValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/carrinho?comanda_id=${comandaId}`)
    );
  }
}