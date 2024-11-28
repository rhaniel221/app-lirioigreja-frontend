import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProdutosService {
  private apiUrl = 'http://127.0.0.1:5000'; // URL do backend
  private comandaAtual: any = null;

  constructor(private http: HttpClient) {}

  // Gestão da Comanda
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

  // Carrinho
  async adicionarAoCarrinho(dados: { comanda_id: number; produto_id: number; quantidade: number }) {
    try {
      const response = await firstValueFrom(
        this.http.post(`${this.apiUrl}/carrinho`, dados)
      );
      console.log('Produto adicionado ao carrinho:', response);
      return response;
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      throw error;
    }
  }

  async removerDoCarrinho(dados: { comanda_id: number; produto_id: number }) {
    try {
      const response = await firstValueFrom(
        this.http.delete(`${this.apiUrl}/carrinho`, {
          body: dados, // Envia o corpo com os dados necessários
        })
      );
      console.log('Item removido do carrinho:', response);
      return response;
    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error);
      throw error;
    }
  }
  

  async getCarrinho(comandaId: number): Promise<any[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<any[]>(`${this.apiUrl}/carrinho?comanda_id=${comandaId}`)
      );
      console.log('Itens do carrinho obtidos:', response);
      return response || [];
    } catch (error) {
      console.error('Erro ao buscar itens do carrinho:', error);
      return [];
    }
  }

  limparCarrinho() {
    localStorage.removeItem('carrinho'); // Limpa qualquer carrinho local
  }

  // API de Categorias e Produtos
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
      const url = categoriaId
        ? `${this.apiUrl}/categorias/${categoriaId}/produtos`
        : `${this.apiUrl}/produtos`;

      const response = await firstValueFrom(this.http.get<any[]>(url));
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

  async finalizarPedido(comandaId: number) {
    try {
      console.log('Iniciando finalização do pedido para comanda:', comandaId);

      const carrinho = await this.getCarrinho(comandaId); // Certifica-se de buscar o carrinho atualizado
      console.log('Itens no carrinho:', carrinho);

      if (carrinho.length === 0) {
        throw new Error('Carrinho vazio.');
      }

      const pedidoData = {
        comanda_id: comandaId,
        itens: carrinho.map((item) => ({
          produto_id: item.id,
          quantidade: item.quantidade,
        })),
      };

      console.log('Dados do pedido a serem enviados:', pedidoData);

      const response = await firstValueFrom(
        this.http.post(`${this.apiUrl}/finalizar-pedido`, pedidoData)
      );

      console.log('Resposta da finalização do pedido:', response);
      this.limparCarrinho();
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
