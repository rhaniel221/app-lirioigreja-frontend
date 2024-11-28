import { Component, OnInit } from '@angular/core';
import { ProdutosService } from '../services/produtos.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  categorias: any[] = [];
  produtos: any[] = [];
  categoriaSelecionada: number = 0;
  comandaAtual: any = null;
  itensCarrinho: any[] = [];

  constructor(
    private produtosService: ProdutosService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    await this.carregarDados();
  }

  async ionViewWillEnter() {
    await this.carregarDados();
    this.comandaAtual = this.produtosService.getComandaAtual();
    this.itensCarrinho = this.produtosService.getCarrinho();
  }

  async carregarDados() {
    try {
      // Load categories
      this.categorias = await this.produtosService.getCategorias();
      if (this.categorias.length > 0) {
        this.categoriaSelecionada = this.categorias[0].id;
        await this.atualizarProdutos(this.categoriaSelecionada);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      await this.mostrarErro('Error loading data.');
    }
  }

  async atualizarProdutos(categoriaId: number) {
    try {
      // Load products for the selected category
      this.produtos = await this.produtosService.getProdutos(categoriaId);
    } catch (error) {
      console.error('Error loading products:', error);
      await this.mostrarErro('Error loading products.');
    }
  }

  async onCategoriaClicada(categoria: any) {
    this.categoriaSelecionada = categoria.id;
    await this.atualizarProdutos(this.categoriaSelecionada);
  }

  async adicionarAoCarrinho(produto: any) {
    try {
      // Add product to the cart
      await this.produtosService.adicionarAoCarrinho({
        comanda_id: this.comandaAtual.id,
        produto_id: produto.id,
        quantidade: 1,
      });

      produto.quantidade_disponivel--;
      this.atualizarCarrinho(produto, 1);
      await this.mostrarToast('Produto adicionado ao carrinho!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      await this.mostrarErro('Error adding to cart.');
    }
  }

  async removerDoCarrinho(item: any) {
    try {
      // Remove item from the cart
      this.produtosService.removerDoCarrinho(item);
      this.atualizarCarrinho(item, -1);
      await this.mostrarToast('Produto removido do carrinho.');
    } catch (error) {
      console.error('Error removing from cart:', error);
      await this.mostrarErro('Error removing from cart.');
    }
  }

  async atualizarQuantidade(item: any, quantidade: number) {
    try {
      // Update quantity of an item in the cart
      item.quantidade += quantidade;
      if (item.quantidade <= 0) {
        await this.removerDoCarrinho(item);
      } else {
        this.atualizarCarrinho(item, quantidade);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      await this.mostrarErro('Error updating quantity.');
    }
  }

  async finalizarPedido() {
    try {
      // Finalize the order
      await this.produtosService.finalizarPedido(this.comandaAtual.id);
      this.itensCarrinho = [];
      await this.mostrarToast('Pedido finalizado com sucesso!');
    } catch (error) {
      console.error('Error finalizing order:', error);
      await this.mostrarErro('Error finalizing order.');
    }
  }

  private atualizarCarrinho(item: any, quantidade: number) {
    const index = this.itensCarrinho.findIndex(i => i.id === item.id);
    if (index > -1) {
      this.itensCarrinho[index].quantidade += quantidade;
    } else {
      this.itensCarrinho.push({
        ...item,
        quantidade: 1,
      });
    }
    this.produtosService.salvarCarrinhoLocal();
  }

  private async mostrarErro(mensagem: string) {
    await this.mostrarToast(mensagem, 'danger');
  }

  private async mostrarToast(mensagem: string, tipo: string = 'success') {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 1000,
      position: 'middle',
      color: tipo,
    });
    await toast.present();
  }

  getIconForCategoria(nome: string): string {
    const iconsMap: { [key: string]: string } = {
      Cafés: 'cafe-outline',
      Bebidas: 'wine-outline',
      Doces: 'ice-cream-outline',
      Salgados: 'pizza-outline',
    };
    return iconsMap[nome] || 'list-outline';
  }
}