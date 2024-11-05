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
    this.itensCarrinho = this.produtosService.getCarrinho();
  }

  removerItem(item: any) {
    this.produtosService.removerDoCarrinho(item);
    this.itensCarrinho = this.produtosService.getCarrinho();
  }

  async finalizarPedido() {
    try {
      await this.produtosService.finalizarPedido(this.itensCarrinho);
      this.produtosService.limparCarrinho();
      this.router.navigate(['/comanda']);
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
    }
  }
}