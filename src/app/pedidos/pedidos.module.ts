import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidosPage } from './pedidos.page';
import { PedidosPageRoutingModule } from './pedidos-routing.module';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    PedidosPageRoutingModule
  ],
  declarations: [PedidosPage]
})
export class PedidosPageModule {}
