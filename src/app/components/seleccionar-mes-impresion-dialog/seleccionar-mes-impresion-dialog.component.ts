import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstacionamientoService } from '../../services/estacionamiento.service';
import { DetalleHistorialMensualDTO } from '../../models/estacionamiento.models';

export interface ResultadoImpresionDialog {
  tipo: 'ACTUAL' | 'HISTORICO';
  detalle?: DetalleHistorialMensualDTO;
  nombreMes?: string;
  anio?: number;
}

@Component({
  selector: 'app-seleccionar-mes-impresion-dialog',
  templateUrl: './seleccionar-mes-impresion-dialog.component.html',
  styleUrls: ['./seleccionar-mes-impresion-dialog.component.scss']
})
export class SeleccionarMesImpresionDialogComponent implements OnInit {
  form!: FormGroup;
  loading: boolean = false;
  errorMessage: string | null = null;

  meses: { id: number; nombre: string }[] = [
    { id: 1, nombre: 'Enero' },
    { id: 2, nombre: 'Febrero' },
    { id: 3, nombre: 'Marzo' },
    { id: 4, nombre: 'Abril' },
    { id: 5, nombre: 'Mayo' },
    { id: 6, nombre: 'Junio' },
    { id: 7, nombre: 'Julio' },
    { id: 8, nombre: 'Agosto' },
    { id: 9, nombre: 'Septiembre' },
    { id: 10, nombre: 'Octubre' },
    { id: 11, nombre: 'Noviembre' },
    { id: 12, nombre: 'Diciembre' }
  ];

  anios: number[] = [];

  constructor(
    private fb: FormBuilder,
    private service: EstacionamientoService,
    private dialogRef: MatDialogRef<SeleccionarMesImpresionDialogComponent>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const anioActual = new Date().getFullYear();
    const mesActual = new Date().getMonth() + 1;

    for (let i = anioActual; i >= anioActual - 5; i--) {
      this.anios.push(i);
    }

    this.form = this.fb.group({
      tipoReporte: ['ACTUAL', [Validators.required]],
      anio: [anioActual, [Validators.required]],
      mes: [mesActual, [Validators.required]]
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    const tipo = this.form.value.tipoReporte;

    if (tipo === 'ACTUAL') {
      this.dialogRef.close({ tipo: 'ACTUAL' });
      return;
    }

    const anio = Number(this.form.value.anio);
    const mesId = Number(this.form.value.mes);
    const nombreMes = this.meses.find((m) => m.id === mesId)?.nombre || `Mes ${mesId}`;

    this.loading = true;
    this.service.buscarHistorialMensual(anio, mesId).subscribe({
      next: (res) => {
        const respaldos = res.data || [];
        if (respaldos.length === 0) {
          this.loading = false;
          this.errorMessage = `No existe ningún respaldo del informe para ${nombreMes} de ${anio}.`;
          this.snackBar.open(this.errorMessage, 'Cerrar', {
            duration: 5000,
            panelClass: ['snackbar-error']
          });
          return;
        }

        const idRespaldo = respaldos[0].id;
        this.service.obtenerDetalleHistorialMensual(idRespaldo).subscribe({
          next: (resDetalle) => {
            this.loading = false;
            this.dialogRef.close({
              tipo: 'HISTORICO',
              detalle: resDetalle.data,
              nombreMes,
              anio
            });
          },
          error: (err) => {
            this.loading = false;
            this.errorMessage = err.message || 'Error al obtener el detalle del respaldo.';
            this.snackBar.open(this.errorMessage || 'Error', 'Cerrar', {
              duration: 5000,
              panelClass: ['snackbar-error']
            });
          }
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Error al buscar el historial del mes.';
        this.snackBar.open(this.errorMessage || 'Error', 'Cerrar', {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
