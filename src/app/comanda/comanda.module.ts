// src/app/comanda/comanda.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ComandaPageRoutingModule } from './comanda-routing.module';
import { ComandaPage } from './comanda.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ComandaPageRoutingModule
  ],
  declarations: [ComandaPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComandaModule {}