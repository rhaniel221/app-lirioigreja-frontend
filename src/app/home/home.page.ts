// src/app/home/home.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProdutosService } from '../services/produtos.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  numeroComanda: string = '';

  constructor(
    private produtosService: ProdutosService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async registrarComanda() {
    if (!this.numeroComanda) {
      this.presentToast('Número da comanda é obrigatório', 'warning');
      return;
    }

    try {
      const response = await this.produtosService.registrarComanda(this.numeroComanda);

      if (response.comanda) {
        this.produtosService.setComandaAtual(response.comanda);
        this.presentToast('Comanda registrada com sucesso', 'success');
        this.router.navigate(['/tabs/menu']);
      } else {
        this.presentToast('Comanda não encontrada', 'warning');
      }
    } catch (error) {
      console.error('Erro ao registrar comanda:', error);
      this.presentToast('Erro ao registrar comanda', 'danger');
    }
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