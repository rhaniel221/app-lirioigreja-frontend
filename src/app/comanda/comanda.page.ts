import { Component, ViewChild } from '@angular/core';
import { ProdutosService } from '../services/produtos.service';
import { ToastController, AlertController, IonInput } from '@ionic/angular';

@Component({
  selector: 'app-comanda',
  templateUrl: './comanda.page.html',
  styleUrls: ['./comanda.page.scss'],
})
export class ComandaPage {
  @ViewChild('comandaInput', { static: false }) comandaInput: IonInput | undefined;

  comandaId: string = ''; // Campo para o número da comanda
  itensComanda: any[] = []; // Itens retornados da consulta de comanda

  constructor(
    private produtosService: ProdutosService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ionViewWillEnter() {
    // Reseta o modelo e o campo de entrada ao entrar na aba
    this.comandaId = '';
    this.itensComanda = [];
    if (this.comandaInput) {
      this.comandaInput.value = '';
    }
    console.log("Página de comanda resetada.");
  }

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

      if (this.itensComanda.length === 0) {
        this.apresentarMensagemComandaVazia();
      }
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
      duration: 1000,
      color: color, // Cor do toast
      position: 'middle', // Centraliza o toast na tela
      cssClass: 'custom-toast' // Classe CSS personalizada
    });
    toast.present();
  }

  async apresentarMensagemComandaVazia() {
    const alert = await this.alertController.create({
      header: 'Comanda Vazia',
      message: 'A comanda não possui itens.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  calcularTotal(): number {
    return this.itensComanda.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  }
}