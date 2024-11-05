// src/app/home/home.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ComandaService } from '../services/comanda.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  numeroComanda: string = '';

  constructor(
    private comandaService: ComandaService,
    private router: Router
  ) {}

  async registrarComanda() {
    console.log('Clicou em registrar comanda');
    if (this.numeroComanda) {
      try {
        console.log('Enviando requisição para registrar comanda:', this.numeroComanda);
        await this.comandaService.registrarComanda(this.numeroComanda);
        console.log('Comanda registrada com sucesso');
        localStorage.setItem('numeroComanda', this.numeroComanda);
        this.router.navigate(['/tabs/menu']);
      } catch (error) {
        console.error('Erro ao registrar comanda:', error);
      }
    }
  }
}