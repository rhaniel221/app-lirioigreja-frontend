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
  comandaId: string = '1'; // Defina aqui o número da comanda que você quer usar

  constructor(
    private produtosService: ProdutosService,
    private router: Router,
    private toastController: ToastController,
    private navController: NavController
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
      if (!this.comandaId) {
        this.presentToast("Erro: Comanda ID não definido", 'danger');
        return;
      }
  
      const response = await this.produtosService.finalizarPedido(this.comandaId);
      
      if (response) {
        this.presentToast("Finalizado com Sucesso", 'success');
        this.produtosService.limparCarrinho();
        this.itensCarrinho = [];
  
        // Redireciona para a home após 2 segundos
        setTimeout(() => {
          this.navController.navigateRoot('/home');
        }, 2000);
      } else {
        this.presentToast("Erro ao finalizar o pedido", 'danger');
      }
    } catch (error: any) {  // Ajuste para o tipo `any` em `error`
      console.error('Erro ao finalizar pedido:', error);
      this.presentToast("Erro ao finalizar pedido: " + (error.message || error), 'danger');
    }
  }
}
