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
  private comandaAtual: any = null;

  constructor(private http: HttpClient) {}

  // Métodos de Gestão da Comanda
  setComandaAtual(comanda: any) {
    this.comandaAtual = comanda;
    localStorage.setItem('comandaAtual', JSON.stringify(comanda));
  }

  getComandaAtual() {
    if (!this.comandaAtual) {
      const comandaSalva = localStorage.getItem('comandaAtual');
      if (comandaSalva) {
        this.comandaAtual = JSON.parse(comandaSalva);
      }
    }
    return this.comandaAtual;
  }

  limparComandaAtual() {
    this.comandaAtual = null;
    localStorage.removeItem('comandaAtual');
  }

  // Métodos de Gestão do Carrinho
  adicionarAoCarrinho(produto: any) {
    console.log('Adicionando ao carrinho:', produto);
    const itemExistente = this.carrinho.find(item => item.id === produto.id);
    if (itemExistente) {
      itemExistente.quantidade = (itemExistente.quantidade || 1) + 1;
    } else {
      this.carrinho.push({ ...produto, quantidade: 1 });
    }
    this.salvarCarrinhoLocal();
  }

  removerDoCarrinho(item: any) {
    const index = this.carrinho.findIndex(i => i.id === item.id);
    if (index > -1) {
      this.carrinho.splice(index, 1);
      this.salvarCarrinhoLocal();
    }
  }

  getCarrinho() {
    this.carregarCarrinhoLocal();
    return this.carrinho;
  }

  limparCarrinho() {
    this.carrinho = [];
    this.salvarCarrinhoLocal();
  }

  private salvarCarrinhoLocal() {
    localStorage.setItem('carrinho', JSON.stringify(this.carrinho));
  }

  private carregarCarrinhoLocal() {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
      this.carrinho = JSON.parse(carrinhoSalvo);
    }
  }

  // Métodos de API
  async getCategorias(): Promise<any[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<any[]>(`${this.apiUrl}/categorias`)
      );
      console.log('Categorias obtidas:', response);
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
      console.log(`Produtos obtidos (categoria ${categoriaId}):`, response);
      return response || [];
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  }

  async registrarComanda(numero: string) {
    try {
      const response = await firstValueFrom(
        this.http.post<any>(`${this.apiUrl}/comandas`, { numero })
      );
      console.log('Resposta do registro de comanda:', response);
      return response;
    } catch (error) {
      console.error('Erro ao registrar comanda:', error);
      throw error;
    }
  }

  async finalizarPedido(comandaId: string) {
    try {
      if (!comandaId) {
        throw new Error('Comanda ID não informado');
      }

      console.log('Iniciando finalização do pedido para comanda:', comandaId);
      console.log('Itens no carrinho:', this.carrinho);

      const pedidoData = {
        comanda_id: comandaId,
        itens: this.carrinho.map(item => ({
          produto_id: item.id,
          quantidade: item.quantidade || 1
        }))
      };

      console.log('Dados do pedido a serem enviados:', pedidoData);

      const response = await firstValueFrom(
        this.http.post(`${this.apiUrl}/finalizar-pedido`, pedidoData)
      );
      
      console.log('Resposta da finalização do pedido:', response);
      this.limparCarrinho();
      this.limparComandaAtual();
      return response;
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      throw error;
    }
  }

  async consultarComanda(numero: string) {
    try {
      const response = await firstValueFrom(
        this.http.get<any[]>(`${this.apiUrl}/consultar-comanda?numero=${numero}`)
      );
      console.log('Consulta da comanda:', response);
      return response;
    } catch (error) {
      console.error('Erro ao consultar comanda:', error);
      return [];
    }
  }

  async limparComanda(numero: string) {
    try {
      const response = await firstValueFrom(
        this.http.delete(`${this.apiUrl}/limpar-comanda?numero=${numero}`)
      );
      console.log('Comanda limpa:', response);
      return response;
    } catch (error) {
      console.error('Erro ao limpar comanda:', error);
      throw error;
    }
  }
}