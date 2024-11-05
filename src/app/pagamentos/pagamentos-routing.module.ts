import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagamentosPage } from './pagamentos.page';

const routes: Routes = [
  {
    path: '',
    component: PagamentosPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagamentosPageRoutingModule {}
