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

  ionViewWillEnter() {
    // Limpa o campo toda vez que a página for carregada
    this.numeroComanda = '';
  }

  async registrarComanda() {
    if (!this.numeroComanda) {
      this.presentToast('Número da comanda é obrigatório', 'warning');
      return;
    }

    try {
      const response = await this.produtosService.registrarComanda(this.numeroComanda);

      if (response.comanda) {
        this.produtosService.setComandaAtual(response.comanda);
        await this.presentToast('Comanda registrada com sucesso', 'success');
        
        // Limpa o campo após registrar com sucesso
        this.numeroComanda = '';
        
        // Navega para o menu
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
      duration: 1000,
      color: color,
      position: 'middle',
      cssClass: 'custom-toast'
    });
    toast.present();
  }
}