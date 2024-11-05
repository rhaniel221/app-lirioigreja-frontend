import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private pedido: any[] = [];
  private comandaId: string | null = null;

  constructor() {}

  // Adiciona um item ao pedido
  adicionarItem(item: any) {
    this.pedido.push(item);
  }

  // Finaliza o pedido associando-o a uma comanda
  finalizarPedido(comandaId: string) {
    this.comandaId = comandaId;
    console.log('Pedido finalizado com a comanda:', comandaId);
    console.log('Itens do pedido:', this.pedido);

    // Limpa o pedido após finalização
    this.pedido = [];
    this.comandaId = null;
  }

  // Retorna o pedido atual
  getPedido() {
    return this.pedido;
  }
}
