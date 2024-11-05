// src/app/comanda/comanda.page.ts
import { Component } from '@angular/core';
import { ComandaService } from '../services/comanda.service';

@Component({
  selector: 'app-comanda',
  templateUrl: './comanda.page.html',
  styleUrls: ['./comanda.page.scss'],
})
export class ComandaPage {
  pedidos: any[] = [];
  numeroComanda: string = '';

  constructor(private comandaService: ComandaService) {}

  ionViewWillEnter() {
    this.carregarComanda();
  }

  async carregarComanda() {
    try {
      this.numeroComanda = localStorage.getItem('comandaId') || '';
      if (this.numeroComanda) {
        this.pedidos = await this.comandaService.getPedidosComanda(this.numeroComanda);
      }
    } catch (error) {
      console.error('Erro ao carregar comanda:', error);
    }
  }
}