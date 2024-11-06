// src/app/services/produtos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {
  private apiUrl = 'http://127.0.0.1:5000';
  private carrinho: any[] = [];

  constructor(private http: HttpClient) {}

  async getCategorias(): Promise<any[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<any[]>(`${this.apiUrl}/categorias`)
      );
      console.log('Resposta getCategorias:', response);
      return response || [];
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
  }

  async getProdutos(categoriaId?: number): Promise<any[]> {
    try {
      let url = categoriaId 
        ? `${this.apiUrl}/categorias/${categoriaId}/produtos`
        : `${this.apiUrl}/produtos`;
      
      const response = await firstValueFrom(
        this.http.get<any[]>(url)
      );
      console.log(`Resposta getProdutos (categoria ${categoriaId}):`, response);
      return response || [];
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  }

  adicionarAoCarrinho(produto: any) {
    console.log('Adicionando ao carrinho:', produto);
    this.carrinho.push(produto);
  }

  removerDoCarrinho(item: any) {
    const index = this.carrinho.findIndex(i => i.id === item.id);
    if (index > -1) {
      this.carrinho.splice(index, 1);
      console.log('Item removido do carrinho:', item);
    }
  }

  getCarrinho() {
    return this.carrinho;
  }

  limparCarrinho() {
    this.carrinho = [];
    console.log('Carrinho limpo');
  }

  async finalizarPedido(comandaId: string) {
    try {
        const response = await firstValueFrom(
            this.http.post(`${this.apiUrl}/finalizar-pedido`, {
                comanda_id: comandaId
            })
        );
        console.log('Pedido finalizado:', response);
        this.limparCarrinho();
        return response;
    } catch (error) {
        console.error('Erro ao finalizar pedido:', error);
        throw error;
    }
  }
}
