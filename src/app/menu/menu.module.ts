// src/app/menu/menu.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MenuPageRoutingModule } from './menu-routing.module';
import { MenuPage } from './menu.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    MenuPageRoutingModule
  ],
  declarations: [MenuPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MenuModule {}