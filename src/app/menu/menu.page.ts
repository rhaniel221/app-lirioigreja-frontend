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
  categoriaSelecionada: string = '';
  comandaAtual: any = null;

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
  }

  async carregarDados() {
    try {
      // Carregar categorias
      this.categorias = await this.produtosService.getCategorias();
      if (this.categorias.length > 0) {
        this.atualizarProdutos(this.categorias[0].id); // Selecionar a primeira categoria como padrão
        this.categoriaSelecionada = this.categorias[0].id;
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      this.mostrarErro('Erro ao carregar categorias.');
    }
  }

  async atualizarProdutos(categoriaId: number) {
    try {
      // Carregar produtos da categoria selecionada
      this.produtos = await this.produtosService.getProdutos(categoriaId);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      this.mostrarErro('Erro ao carregar produtos.');
    }
  }

  async onCategoriaClicada(categoria: any) {
    this.categoriaSelecionada = categoria.id.toString();
    await this.atualizarProdutos(categoria.id);
  }

  async adicionarAoCarrinho(produto: any) {
    try {
      if (!this.comandaAtual) {
        await this.mostrarErro('Comanda não encontrada.');
        return;
      }

      // Adicionar produto ao carrinho via serviço
      await this.produtosService.adicionarAoCarrinho({
        comanda_id: this.comandaAtual.id,
        produto_id: produto.id,
        quantidade: 1,
      });

      // Atualizar quantidade disponível localmente
      produto.quantidade_disponivel--;

      // Exibir mensagem de sucesso
      await this.mostrarToast('Produto adicionado ao carrinho!');
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      this.mostrarErro('Erro ao adicionar ao carrinho.');
    }
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

  // Mapeia ícones para cada categoria
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
