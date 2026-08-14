import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { VehiculoListComponent } from './components/vehiculo-list/vehiculo-list.component';
import { VehiculoDetailComponent } from './components/vehiculo-detail/vehiculo-detail.component';
import { RegistrarEntradaComponent } from './components/registrar-entrada/registrar-entrada.component';
import { RegistrarSalidaComponent } from './components/registrar-salida/registrar-salida.component';
import { AltaVehiculoComponent } from './components/alta-vehiculo/alta-vehiculo.component';
import { IniciarMesComponent } from './components/iniciar-mes/iniciar-mes.component';
import { ReporteResidentesComponent } from './components/reporte-residentes/reporte-residentes.component';
import { EstanciaListComponent } from './components/estancia-list/estancia-list.component';
import { SeleccionarMesImpresionDialogComponent } from './components/seleccionar-mes-impresion-dialog/seleccionar-mes-impresion-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    VehiculoListComponent,
    VehiculoDetailComponent,
    RegistrarEntradaComponent,
    RegistrarSalidaComponent,
    AltaVehiculoComponent,
    IniciarMesComponent,
    ReporteResidentesComponent,
    EstanciaListComponent,
    SeleccionarMesImpresionDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatDividerModule,
    MatBadgeModule,
    MatAutocompleteModule,
    MatRadioModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
