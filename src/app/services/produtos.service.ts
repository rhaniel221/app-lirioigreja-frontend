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
    // Verifica se o produto já existe no carrinho
    const itemExistente = this.carrinho.find(item => item.id === produto.id);
    if (itemExistente) {
      // Se existe, incrementa a quantidade
      itemExistente.quantidade = (itemExistente.quantidade || 1) + 1;
    } else {
      // Se não existe, adiciona com quantidade 1
      this.carrinho.push({...produto, quantidade: 1});
    }
    console.log('Carrinho atualizado:', this.carrinho);
  }

  removerDoCarrinho(item: any) {
    const index = this.carrinho.findIndex(i => i.id === item.id);
    if (index > -1) {
      this.carrinho.splice(index, 1);
      console.log('Item removido do carrinho:', item);
      console.log('Carrinho atualizado:', this.carrinho);
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
      // Verifica se há itens no carrinho
      if (this.carrinho.length === 0) {
        throw new Error('Carrinho vazio');
      }

      // Prepara os dados para serem enviados
      const pedidoData = {
        comanda_id: comandaId,
        itens: this.carrinho.map(item => ({
          produto_id: item.id,
          quantidade: item.quantidade || 1
        }))
      };

      console.log('Enviando pedido:', pedidoData);

      const response = await firstValueFrom(
        this.http.post(`${this.apiUrl}/finalizar-pedido`, pedidoData)
      );

      console.log('Pedido finalizado com sucesso:', response);
      this.limparCarrinho();
      return response;
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      throw error;
    }
  }

  async getCarrinhoComanda(comandaId: string) {
    try {
      const response = await firstValueFrom(
        this.http.get<any[]>(`${this.apiUrl}/carrinho?comanda_id=${comandaId}`)
      );
      console.log('Carrinho da comanda:', response);
      return response;
    } catch (error) {
      console.error('Erro ao buscar carrinho:', error);
      return [];
    }
  }
}