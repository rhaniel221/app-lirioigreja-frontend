// src/app/services/produtos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {
  private apiUrl = 'http://127.0.0.1:5000';
  private carrinho: any[] = [];

  constructor(private http: HttpClient) {}

  async getProdutos(): Promise<any[]> {
    const response = await this.http.get<any[]>(`${this.apiUrl}/produtos`).toPromise();
    return response || [];
  }

  adicionarAoCarrinho(produto: any) {
    this.carrinho.push(produto);
  }

  removerDoCarrinho(produto: any) {
    const index = this.carrinho.findIndex(item => item.id === produto.id);
    if (index > -1) {
      this.carrinho.splice(index, 1);
    }
  }

  getCarrinho() {
    return this.carrinho;
  }

  limparCarrinho() {
    this.carrinho = [];
  }

  async finalizarPedido(itens: any[]) {
    const numeroComanda = localStorage.getItem('numeroComanda');
    return this.http.post(`${this.apiUrl}/pedidos`, {
      numeroComanda,
      itens
    }).toPromise();
  }
}