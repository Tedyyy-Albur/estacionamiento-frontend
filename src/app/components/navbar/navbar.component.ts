import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegistrarEntradaComponent } from '../registrar-entrada/registrar-entrada.component';
import { RegistrarSalidaComponent } from '../registrar-salida/registrar-salida.component';
import { AltaVehiculoComponent } from '../alta-vehiculo/alta-vehiculo.component';
import { IniciarMesComponent } from '../iniciar-mes/iniciar-mes.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private dialog: MatDialog) {}

  openRegistrarEntrada(): void {
    this.dialog.open(RegistrarEntradaComponent, { width: '450px' });
  }

  openRegistrarSalida(): void {
    this.dialog.open(RegistrarSalidaComponent, { width: '450px' });
  }

  openAltaVehiculo(): void {
    this.dialog.open(AltaVehiculoComponent, { width: '450px' });
  }

  openIniciarMes(): void {
    this.dialog.open(IniciarMesComponent, { width: '450px' });
  }
}
