import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  produtos: any[] = [];
  comanda: number | undefined; // Permite que comanda seja undefined inicialmente

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Obtém o número da comanda da navegação anterior usando ActivatedRoute
    this.route.queryParams.subscribe(params => {
      if (params && params['comanda']) {
        this.comanda = +params['comanda'];
      }
    });
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.http.get<any>('http://localhost:3000/produtos').subscribe(
      (data: any) => {
        this.produtos = data;
      },
      (error) => {
        console.error('Erro ao carregar produtos:', error);
      }
    );
  }

  adicionarAoPedido(produto: any) {
    if (this.comanda) { // Verifica se comanda está definida antes de fazer a requisição
      console.log('Produto adicionado:', produto);
      this.http.post('http://localhost:3000/pedidos', {
        comanda: this.comanda,
        produtoId: produto.id
      }).subscribe(
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
