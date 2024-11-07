// src/app/carrinho/carrinho.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProdutosService } from '../services/produtos.service';
import { ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
})
export class CarrinhoPage {
  itensCarrinho: any[] = [];
  comandaAtual: any = null;

  constructor(
    private produtosService: ProdutosService,
    private router: Router,
    private toastController: ToastController,
    private navController: NavController
  ) {}

  ionViewWillEnter() {
    this.carregarDados();
  }

  carregarDados() {
    this.itensCarrinho = this.produtosService.getCarrinho();
    this.comandaAtual = this.produtosService.getComandaAtual();
    console.log('Itens no carrinho:', this.itensCarrinho);
    console.log('Comanda atual:', this.comandaAtual);
  }

  calcularTotal(): number {
    return this.itensCarrinho.reduce((total, item) => {
      return total + (item.preco * (item.quantidade || 1));
    }, 0);
  }

  removerDoCarrinho(item: any) {
    this.produtosService.removerDoCarrinho(item);
    this.carregarDados();
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }

  async finalizarPedido() {
    try {
      if (!this.comandaAtual?.id) {
        this.presentToast("Erro: Comanda não identificada", 'danger');
        return;
      }

      if (this.itensCarrinho.length === 0) {
        this.presentToast("Erro: Carrinho vazio", 'danger');
        return;
      }

      const response = await this.produtosService.finalizarPedido(this.comandaAtual.id);
      console.log('Pedido finalizado:', response);
      
      this.presentToast("Pedido finalizado com sucesso", 'success');
      
      // Redireciona para a home após 2 segundos
      setTimeout(() => {
        this.navController.navigateRoot('/tabs/home');
      }, 2000);
    } catch (error: any) {
      console.error('Erro ao finalizar pedido:', error);
      this.presentToast(
        "Erro ao finalizar pedido: " + (error.message || "Erro desconhecido"), 
        'danger'
      );
    }
  }
}