import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstacionamientoService } from '../../services/estacionamiento.service';
import { TipoVehiculo } from '../../models/estacionamiento.models';

@Component({
  selector: 'app-alta-vehiculo',
  templateUrl: './alta-vehiculo.component.html',
  styleUrls: ['./alta-vehiculo.component.scss']
})
export class AltaVehiculoComponent implements OnInit {
  form!: FormGroup;
  loading: boolean = false;

  tiposVehiculo: { label: string; value: TipoVehiculo; descripcion: string }[] = [
    { label: 'Residente', value: 'RESIDENTE', descripcion: 'Acumula tiempo a $0.05/minuto cobrado a fin de mes.' },
    { label: 'Oficial', value: 'OFICIAL', descripcion: 'Exento de pago (Tarifa $0.00).' },
    { label: 'No Residente', value: 'NO_RESIDENTE', descripcion: 'Paga al registrar su salida ($0.50/minuto).' }
  ];

  constructor(
    private fb: FormBuilder,
    private service: EstacionamientoService,
    private dialogRef: MatDialogRef<AltaVehiculoComponent>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      placa: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9-]{3,10}$/)]],
      tipoVehiculo: ['RESIDENTE', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let placaLimpia = this.form.value.placa || '';
    placaLimpia = placaLimpia.replace(/<[^>]*>/g, '').trim().toUpperCase();
    const tipo: TipoVehiculo = this.form.value.tipoVehiculo;

    this.loading = true;

    let req$;
    if (tipo === 'RESIDENTE') {
      req$ = this.service.registrarResidente(placaLimpia);
    } else if (tipo === 'OFICIAL') {
      req$ = this.service.registrarOficial(placaLimpia);
    } else {
      req$ = this.service.registrarNoResidente(placaLimpia);
    }

    req$.subscribe({
      next: (res) => {
        this.loading = false;
        this.service.notificarCambioVehiculos();
        this.snackBar.open(res.message || 'Vehículo dado de alta exitosamente', 'Aceptar', {
          duration: 4000,
          panelClass: ['snackbar-success']
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.message || 'Error al dar de alta el vehículo', 'Cerrar', {
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
