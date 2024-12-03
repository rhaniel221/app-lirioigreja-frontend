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

  public adicionarAoCarrinho(produto: any) {
    const itemExistente = this.carrinho.find(item => item.id === produto.id);
    if (itemExistente) {
      itemExistente.quantidade = (itemExistente.quantidade || 1) + 1;
    } else {
      this.carrinho.push({ ...produto, quantidade: 1 });
    }
    this.salvarCarrinhoLocal();
  }

  public removerDoCarrinho(item: any) {
    const index = this.carrinho.findIndex(i => i.id === item.id);
    if (index > -1) {
      this.carrinho.splice(index, 1);
      this.salvarCarrinhoLocal();
    }
  }

  public getCarrinho() {
    this.carregarCarrinhoLocal();
    return this.carrinho;
  }

  public limparCarrinho() {
    this.carrinho = [];
    this.salvarCarrinhoLocal();
  }

  public salvarCarrinhoLocal() {
    localStorage.setItem('carrinho', JSON.stringify(this.carrinho));
  }

  private carregarCarrinhoLocal() {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
      this.carrinho = JSON.parse(carrinhoSalvo);
    }
  }

  async getCategorias(): Promise<any[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<any[]>(`${this.apiUrl}/categorias`)
      );
      return response || [];
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
  }

  async getProdutos(categoriaId?: number): Promise<any[]> {
    try {
      const url = categoriaId 
        ? `${this.apiUrl}/categorias/${categoriaId}/produtos`
        : `${this.apiUrl}/produtos`;
      const response = await firstValueFrom(this.http.get<any[]>(url));
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

      const pedidoData = {
        comanda_id: comandaId,
        itens: this.carrinho.map(item => ({
          produto_id: item.id,
          quantidade: item.quantidade || 1
        }))
      };

      const response = await firstValueFrom(
        this.http.post(`${this.apiUrl}/finalizar-pedido`, pedidoData)
      );
      
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
      return response;
    } catch (error) {
      console.error('Erro ao limpar comanda:', error);
      throw error;
    }
  }
}