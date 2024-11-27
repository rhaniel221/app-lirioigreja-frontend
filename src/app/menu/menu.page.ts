import { Component, OnInit } from '@angular/core';
import { ProdutosService } from '../services/produtos.service';
import { ToastController } from '@ionic/angular';

// Interfaces para melhor tipagem
interface Produto {
  id: number;
  nome: string;
  preco: number;
  descricao?: string;
  quantidade_disponivel: number;
  categoria_id: number;
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
  categoriasExpandidas: { [key: number]: boolean } = {};
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
      
      // Inicializar todas as categorias como não expandidas
      this.categorias.forEach(categoria => {
        this.categoriasExpandidas[categoria.id] = false;
      });

      // Pré-carregar produtos de todas as categorias
      for (const categoria of this.categorias) {
        const produtos = await this.produtosService.getProdutos(categoria.id);
        this.produtosPorCategoria[categoria.id] = produtos;
        console.log(`Produtos da categoria ${categoria.nome}:`, produtos);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      await this.mostrarErro('Erro ao carregar dados');
    }
  }

  // Método para expandir/recolher categorias
  toggleCategoria(categoriaId: number) {
    this.categoriasExpandidas[categoriaId] = !this.categoriasExpandidas[categoriaId];
  }

  // Método para verificar se uma categoria está expandida
  isExpanded(categoriaId: number): boolean {
    return this.categoriasExpandidas[categoriaId] || false;
  }

  async adicionarAoCarrinho(produto: Produto) {
    try {
      if (produto.quantidade_disponivel <= 0) {
        await this.mostrarErro('Produto indisponível no momento');
        return;
      }

      await this.produtosService.adicionarAoCarrinho(produto);
      produto.quantidade_disponivel--; // Atualiza quantidade local
      
      const toast = await this.toastController.create({
        message: 'Adicionado com sucesso!',
        duration: 800,
        position: 'middle',
        cssClass: 'custom-toast'
      });
      await toast.present();
    } catch (err: any) { // Tipando o erro como 'any' para evitar problemas com o TypeScript
      console.error('Erro ao adicionar ao carrinho:', err);
      if (err.error?.error === 'Quantidade insuficiente em estoque') {
        await this.mostrarErro('Quantidade insuficiente em estoque');
      } else {
        await this.mostrarErro('Erro ao adicionar ao carrinho');
      }
    }
  }

  private async mostrarErro(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 1000,
      position: 'middle',
      color: 'danger',
      cssClass: 'custom-toast'
    });
    await toast.present();
  }
}