import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-comanda',
  templateUrl: './comanda.page.html',
  styleUrls: ['./comanda.page.scss'],
})
export class ComandaPage {
  comanda: number | undefined; // Permite que comanda seja undefined inicialmente

  constructor(
    private http: HttpClient,
    private navCtrl: NavController
  ) {}

  iniciarComanda() {
    if (this.comanda) {
      this.http.post('http://localhost:3000/comandas', { numero: this.comanda })
        .subscribe(
          () => {
            console.log('Comanda salva com sucesso');
            // Navega para a página de seleção de produtos com a comanda como parâmetro de consulta
            this.navCtrl.navigateForward(['/menu'], {
              queryParams: { comanda: this.comanda }
            });
          },
          (error) => {
            console.error('Erro ao salvar comanda:', error);
          }
        );
    }
  }
}
