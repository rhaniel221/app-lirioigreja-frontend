import { Component, OnInit } from '@angular/core';
import { ProdutosService } from '../services/produtos.service';
import { ToastController } from '@ionic/angular';

interface Produto {
  id: number;
  nome: string;
  preco: number;
  descricao?: string;
  quantidade_disponivel: number;
  categoria_id: number;
  isLoading?: boolean; // Adicionado para controle de carregamento
}

interface Categoria {
  id: number;
  nome: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  categorias: Categoria[] = [];
  produtosPorCategoria: { [key: number]: Produto[] } = {};
  categoriaSelecionada: number = 0; // Define a categoria inicial
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
      console.log('Categorias carregadas:', this.categorias);

      // Pré-carregar produtos de todas as categorias
      for (const categoria of this.categorias) {
        this.produtosPorCategoria[categoria.id] = await this.produtosService.getProdutos(categoria.id);
      }

      // Selecionar a primeira categoria como padrão
      if (this.categorias.length > 0) {
        this.categoriaSelecionada = this.categorias[0].id;
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      await this.mostrarErro('Erro ao carregar dados');
    }
  }

  // Método para selecionar uma categoria
  onCategoriaSelecionada(categoria: Categoria) {
    this.categoriaSelecionada = categoria.id;
  }

  // Método para buscar o ícone correspondente a uma categoria
  getIconForCategoria(nome: string): string {
    const iconsMap: { [key: string]: string } = {
      Cafés: 'cafe-outline',
      Bebidas: 'wine-outline',
      Doces: 'ice-cream-outline',
      Salgados: 'pizza-outline',
    };
    return iconsMap[nome] || 'list-outline';
  }

  async adicionarAoCarrinho(produto: Produto) {
    try {
      if (produto.quantidade_disponivel <= 0) {
        await this.mostrarErro('Produto indisponível no momento');
        return;
      }

      produto.isLoading = true;
      await this.produtosService.adicionarAoCarrinho(produto);
      produto.quantidade_disponivel--;
      produto.isLoading = false;

      const toast = await this.toastController.create({
        message: 'Adicionado ao carrinho!',
        duration: 800,
        position: 'middle',
      });
      await toast.present();
    } catch (err: any) {
      console.error('Erro ao adicionar ao carrinho:', err);
      produto.isLoading = false;
      await this.mostrarErro('Erro ao adicionar ao carrinho');
    }
  }

  private async mostrarErro(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 1000,
      position: 'middle',
      color: 'danger',
    });
    await toast.present();
  }
}
