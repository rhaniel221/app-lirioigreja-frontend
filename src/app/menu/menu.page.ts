import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ProdutosService } from '../services/produtos.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  produtos: any[] = [];
  comanda: number | undefined;

  constructor(
    private produtosService: ProdutosService,
    private alertController: AlertController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params['comanda']) {
        this.comanda = +params['comanda'];
      }
    });
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.produtosService.getProdutos().subscribe(
      (data: any) => {
        this.produtos = data;
      },
      (error) => {
        console.error('Erro ao carregar produtos:', error);
      }
    );
  }

  adicionarAoPedido(produto: any) {
    if (this.comanda) {
      console.log('Produto adicionado:', produto);
      this.produtosService.adicionarPedido(this.comanda, produto.id).subscribe(
        () => console.log('Pedido salvo com sucesso'),
        (error) => console.error('Erro ao salvar pedido:', error)
      );
    } else {
      console.error('Número da comanda não definido');
    }
  }

  async finalizarPedido() {
    const alert = await this.alertController.create({
      header: 'Finalizar Pedido',
      message: 'Pedido finalizado com sucesso!',
      buttons: ['OK']
    });

    await alert.present();
  }
}
