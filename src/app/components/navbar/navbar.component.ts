import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegistrarEntradaComponent } from '../registrar-entrada/registrar-entrada.component';
import { RegistrarSalidaComponent } from '../registrar-salida/registrar-salida.component';
import { AltaVehiculoComponent } from '../alta-vehiculo/alta-vehiculo.component';
import { IniciarMesComponent } from '../iniciar-mes/iniciar-mes.component';
import { EstacionamientoService } from '../../services/estacionamiento.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(
    private dialog: MatDialog,
    private service: EstacionamientoService
  ) {}

  openRegistrarEntrada(): void {
    const dialogRef = this.dialog.open(RegistrarEntradaComponent, { width: '450px' });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) this.service.notificarCambioVehiculos();
    });
  }

  openRegistrarSalida(): void {
    const dialogRef = this.dialog.open(RegistrarSalidaComponent, { width: '450px' });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) this.service.notificarCambioVehiculos();
    });
  }

  openAltaVehiculo(): void {
    const dialogRef = this.dialog.open(AltaVehiculoComponent, { width: '450px' });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) this.service.notificarCambioVehiculos();
    });
  }

  openIniciarMes(): void {
    const dialogRef = this.dialog.open(IniciarMesComponent, { width: '450px' });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) this.service.notificarCambioVehiculos();
    });
  }
}
