import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Vehiculo } from '../../models/estacionamiento.models';
import { RegistrarEntradaComponent } from '../registrar-entrada/registrar-entrada.component';
import { RegistrarSalidaComponent } from '../registrar-salida/registrar-salida.component';

@Component({
  selector: 'app-vehiculo-detail',
  templateUrl: './vehiculo-detail.component.html',
  styleUrls: ['./vehiculo-detail.component.scss']
})
export class VehiculoDetailComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public vehiculo: Vehiculo,
    private dialogRef: MatDialogRef<VehiculoDetailComponent>,
    private dialog: MatDialog
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }

  openEntrada(): void {
    this.dialogRef.close();
    this.dialog.open(RegistrarEntradaComponent, {
      width: '450px',
      data: { placa: this.vehiculo.placa }
    });
  }

  openSalida(): void {
    this.dialogRef.close();
    this.dialog.open(RegistrarSalidaComponent, {
      width: '450px',
      data: { placa: this.vehiculo.placa }
    });
  }

  getTarifaTexto(): string {
    switch (this.vehiculo.tipoVehiculo) {
      case 'OFICIAL':
        return 'Exento de cobro (Tarifa $0.00 / min)';
      case 'RESIDENTE':
        return 'Tarifa preferencial de $0.05 por minuto acumulado en informe mensual';
      case 'NO_RESIDENTE':
        return 'Tarifa estándar de $0.50 por minuto al registrar salida';
      default:
        return 'Sin tarifa asignada';
    }
  }
}
