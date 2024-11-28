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
      this.mostrarToast('Número da comanda é obrigatório', 'aviso');
      return;
    }

    try {
      const response = await this.produtosService.registrarComanda(this.numeroComanda);

      if (response.comanda) {
        this.produtosService.setComandaAtual(response.comanda);
        await this.mostrarToast('Comanda registrada com sucesso', 'sucesso');
        this.numeroComanda = ''; // Limpa o campo após registrar com sucesso
        this.router.navigate(['/tabs/menu']); // Navega para o menu
      } else {
        this.mostrarToast('Comanda não encontrada', 'aviso');
      }
    } catch (error) {
      console.error('Erro ao registrar comanda:', error);
      this.mostrarToast('Erro ao registrar comanda', 'erro');
    }
  }

  async mostrarToast(mensagem: string, tipo: string = 'normal') {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 1000,
      color: tipo,
      position: 'middle',
      cssClass: 'custom-toast',
    });
    toast.present();
  }
}