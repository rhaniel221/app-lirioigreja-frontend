import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProdutosService } from '../services/produtos.service';
import { ToastController, NavController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';  // Corrigido para importar

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

  async carregarDados() {
    try {
      this.comandaAtual = this.produtosService.getComandaAtual();
      if (this.comandaAtual) {
        this.itensCarrinho = await this.produtosService.getCarrinho(this.comandaAtual.id);
      } else {
        // Se a comanda não estiver disponível, exibe uma mensagem ou trata o erro
        this.presentToast("Comanda não encontrada", 'danger');
      }
    } catch (error) {
      console.error('Erro ao carregar dados do carrinho:', error);
      this.presentToast("Erro ao carregar dados", 'danger');
    }
  }

  async removerItemDoCarrinho(item: any) {
    try {
      const dados = {
        comanda_id: this.comandaAtual.id,
        produto_id: item.id,
      };

      // Removendo o item do carrinho via ProdutoService
      await this.produtosService.removerItemDoCarrinho(dados);  // Corrigido para chamar 'removerItemDoCarrinho'
      this.carregarDados(); // Recarrega os itens do carrinho após remoção
      this.presentToast('Item removido do carrinho', 'success');
    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error);
      this.presentToast('Erro ao remover item do carrinho', 'danger');
    }
  }

  calcularTotal(): number {
    return this.itensCarrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);
  }

  async presentToast(message: string, color: string = 'light') {
    const toast = await this.toastController.create({
      message,
      duration: 1000,
      color: color,
      position: 'middle',
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
      }, 1000);
    } catch (error: any) {
      console.error('Erro ao finalizar pedido:', error);
      this.presentToast("Erro ao finalizar pedido: " + (error.message || "Erro desconhecido"), 'danger');
    }
  }
}
