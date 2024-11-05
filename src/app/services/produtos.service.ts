import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProdutosService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProdutos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/produtos`);
  }

  adicionarPedido(comanda: number, produtoId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/pedidos`, {
      comanda,
      produtoId
    });
  }
}
