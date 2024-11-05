// src/app/menu/menu.page.ts
import { Component, OnInit } from '@angular/core';
import { ProdutosService } from '../services/produtos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  produtos: any[] = [];

  constructor(
    private produtosService: ProdutosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarProdutos();
  }

  async carregarProdutos() {
    try {
      this.produtos = await this.produtosService.getProdutos();
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  }

  adicionarAoCarrinho(produto: any) {
    this.produtosService.adicionarAoCarrinho(produto);
    this.router.navigate(['/carrinho']);
  }
}