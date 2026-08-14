import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstacionamientoService } from '../../services/estacionamiento.service';

@Component({
  selector: 'app-iniciar-mes',
  templateUrl: './iniciar-mes.component.html',
  styleUrls: ['./iniciar-mes.component.scss']
})
export class IniciarMesComponent {
  loading: boolean = false;

  constructor(
    private service: EstacionamientoService,
    private dialogRef: MatDialogRef<IniciarMesComponent>,
    private snackBar: MatSnackBar
  ) {}

  confirmar(): void {
    this.loading = true;
    this.service.iniciarNuevoMes().subscribe({
      next: (res) => {
        this.loading = false;
        this.snackBar.open(res.message || 'El mes ha sido reiniciado correctamente.', 'Aceptar', {
          duration: 4000,
          panelClass: ['snackbar-success']
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.message || 'Error al reiniciar el mes', 'Cerrar', {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
