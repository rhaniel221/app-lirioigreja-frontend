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

  onInputChange(event: any) {
    this.comandaId = event.target.value;
    console.log("Comanda ID atualizado:", this.comandaId);
  }

  async buscarComanda() {
    console.log("Buscar Comanda foi clicado");
    console.log("Valor de comandaId:", this.comandaId);

    if (!this.comandaId) {
      this.presentToast('Informe o número da comanda', 'danger');
      return;
    }

    try {
      this.itensComanda = await this.produtosService.consultarComanda(this.comandaId);
      console.log("Itens da comanda obtidos:", this.itensComanda);
    } catch (error) {
      console.error("Erro ao buscar a comanda:", error);
      this.presentToast('Erro ao buscar a comanda', 'danger');
    }
  }

  async limparComanda() {
    console.log("Limpando comanda com ID:", this.comandaId);
    if (!this.comandaId) {
      this.presentToast('Informe o número da comanda', 'danger');
      return;
    }

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

  async presentToast(message: string, color: string = 'light') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: color, // Cor do toast
      position: 'middle', // Centraliza o toast na tela
      cssClass: 'custom-toast' // Classe CSS personalizada
    });
    toast.present();
  }
}
