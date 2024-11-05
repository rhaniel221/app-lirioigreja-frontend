// src/app/carrinho/carrinho.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProdutosService } from '../services/produtos.service';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
})
export class CarrinhoPage {
  itensCarrinho: any[] = [];

  constructor(
    private produtosService: ProdutosService,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.carregarCarrinho();
  }

  carregarCarrinho() {
    this.itensCarrinho = this.produtosService.getCarrinho();
    console.log('Itens no carrinho:', this.itensCarrinho);
  }

  removerDoCarrinho(item: any) {
    this.produtosService.removerDoCarrinho(item);
    this.carregarCarrinho();
  }

  async finalizarPedido() {
    try {
      const comandaId = localStorage.getItem('comandaId');
      if (comandaId) {
        await this.produtosService.finalizarPedido(comandaId);
        this.produtosService.limparCarrinho();
        this.itensCarrinho = [];
        this.router.navigate(['/tabs/comanda']);
      }
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
    }
  }
}