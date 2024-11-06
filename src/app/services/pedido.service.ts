// src/app/services/pedido.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private pedido: any[] = [];
  private apiUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {}

  // Adiciona um item ao pedido
  adicionarItem(item: any) {
    this.pedido.push(item);
  }

  // Finaliza o pedido enviando o comandaId ao backend e limpando o pedido local
  finalizarPedido(comandaId: number): Observable<any> {
    console.log('Pedido finalizado com a comanda:', comandaId);
    console.log('Itens do pedido:', this.pedido);

    // Faz a requisição HTTP para o backend
    return this.http.post<any>(`${this.apiUrl}/finalizar-pedido`, { comanda_id: comandaId });
  }

  // Retorna o pedido atual
  getPedido() {
    return this.pedido;
  }
}
