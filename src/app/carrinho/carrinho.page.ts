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

  async ionViewWillEnter() {
    await this.carregarDados();
  }

  async carregarDados() {
    try {
      this.comandaAtual = this.produtosService.getComandaAtual();

      if (!this.comandaAtual?.id) {
        this.presentToast('Erro: Comanda não identificada.', 'danger');
        return;
      }

      this.itensCarrinho = await this.produtosService.getCarrinho(this.comandaAtual.id);
      console.log('Itens no carrinho:', this.itensCarrinho);
    } catch (error) {
      console.error('Erro ao carregar dados do carrinho:', error);
      this.presentToast('Erro ao carregar carrinho.', 'danger');
    }
  }

  calcularTotal(): number {
    return this.itensCarrinho.reduce((total, item) => {
      const preco = item.preco || 0; // Certifica que o preço existe
      const quantidade = item.quantidade || 0; // Certifica que a quantidade existe
      return total + preco * quantidade;
    }, 0);
  }

  // src/app/carrinho/carrinho.page.ts
async removerDoCarrinho(item: any) {
  try {
    await this.produtosService.removerDoCarrinho({
      comanda_id: this.comandaAtual.id,
      produto_id: item.id,
    });
    await this.carregarDados();
    this.presentToast('Item removido com sucesso', 'success');
  } catch (error) {
    console.error('Erro ao remover item do carrinho:', error);
    this.presentToast('Erro ao remover item.', 'danger');
  }
}

  async finalizarPedido() {
    try {
      if (!this.comandaAtual?.id) {
        this.presentToast('Erro: Comanda não identificada.', 'danger');
        return;
      }

      if (this.itensCarrinho.length === 0) {
        this.presentToast('Erro: Carrinho vazio.', 'danger');
        return;
      }

      const response = await this.produtosService.finalizarPedido(this.comandaAtual.id);
      console.log('Pedido finalizado:', response);

      this.presentToast('Pedido finalizado com sucesso!', 'success');

      // Redireciona para a home após 2 segundos
      setTimeout(() => {
        this.navController.navigateRoot('/tabs/home');
      }, 2000);
    } catch (error: any) {
      console.error('Erro ao finalizar pedido:', error);
      const errorMessage = (error as any)?.message || 'Erro desconhecido';
      this.presentToast(`Erro ao finalizar pedido: ${errorMessage}`, 'danger');
    }
  }

  async presentToast(message: string, color: string = 'light') {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      color: color,
      position: 'middle',
    });
    await toast.present();
  }
}
