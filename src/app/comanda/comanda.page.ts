import { Component } from '@angular/core';
import { ProdutosService } from '../services/produtos.service';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-comanda',
  templateUrl: './comanda.page.html',
  styleUrls: ['./comanda.page.scss'],
})
export class ComandaPage {
  comandaId: string = '';
  itensComanda: any[] = [];

  constructor(
    private produtosService: ProdutosService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  async buscarComanda() {
    if (!this.comandaId) {
      this.presentToast('Informe o número da comanda', 'danger');
      return;
    }

    try {
      this.itensComanda = await this.produtosService.consultarComanda(this.comandaId);
    } catch (error) {
      this.presentToast('Erro ao buscar a comanda', 'danger');
    }
  }

  async limparComanda() {
    const alert = await this.alertController.create({
      header: 'Limpar Comanda',
      message: `Deseja realmente limpar a comanda ${this.comandaId}?`,
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
        },
        {
          text: 'Sim',
          handler: async () => {
            try {
              await this.produtosService.limparComanda(this.comandaId);
              this.itensComanda = [];
              this.presentToast('Comanda limpa com sucesso', 'success');
            } catch (error) {
              this.presentToast('Erro ao limpar a comanda', 'danger');
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    toast.present();
  }
}
