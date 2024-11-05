import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagamentosPage } from './pagamentos.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { PagamentosPageRoutingModule } from './pagamentos-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    PagamentosPageRoutingModule
  ],
  declarations: [PagamentosPage]
})
export class PagamentosPageModule {}
