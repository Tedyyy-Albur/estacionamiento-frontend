import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehiculoListComponent } from './components/vehiculo-list/vehiculo-list.component';
import { ReporteResidentesComponent } from './components/reporte-residentes/reporte-residentes.component';
import { EstanciaListComponent } from './components/estancia-list/estancia-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'vehiculos', pathMatch: 'full' },
  { path: 'vehiculos', component: VehiculoListComponent },
  { path: 'estancias', component: EstanciaListComponent },
  { path: 'residentes', component: ReporteResidentesComponent },
  { path: '**', redirectTo: 'vehiculos' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
