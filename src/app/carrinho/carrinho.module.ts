// src/app/carrinho/carrinho.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CarrinhoPageRoutingModule } from './carrinho-routing.module';
import { CarrinhoPage } from './carrinho.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    CarrinhoPageRoutingModule
  ],
  declarations: [CarrinhoPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarrinhoModule {}