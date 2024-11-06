// src/app/menu/menu.page.ts
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
  produtosPorCategoria: { [key: number]: any[] } = {};
  categoriasExpandidas: { [key: number]: boolean } = {};

  constructor(
    private produtosService: ProdutosService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    await this.carregarDados();
  }

  async ionViewWillEnter() {
    await this.carregarDados();
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
    }
  }

  toggleCategoria(categoriaId: number) {
    this.categoriasExpandidas[categoriaId] = !this.categoriasExpandidas[categoriaId];
  }

  isExpanded(categoriaId: number): boolean {
    return this.categoriasExpandidas[categoriaId] || false;
  }

  async adicionarAoCarrinho(produto: any) {
    this.produtosService.adicionarAoCarrinho(produto);

    // Exibe a mensagem de "Adicionado com sucesso"
    const toast = await this.toastController.create({
      message: 'Adicionado com sucesso!',
      duration: 2000, // Duração de 2 segundos
      position: 'bottom'
    });
    toast.present();
  }
}
