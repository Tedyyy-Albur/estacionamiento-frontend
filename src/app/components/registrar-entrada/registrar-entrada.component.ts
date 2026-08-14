import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstacionamientoService } from '../../services/estacionamiento.service';
import { Vehiculo } from '../../models/estacionamiento.models';

@Component({
  selector: 'app-registrar-entrada',
  templateUrl: './registrar-entrada.component.html',
  styleUrls: ['./registrar-entrada.component.scss']
})
export class RegistrarEntradaComponent implements OnInit {
  form!: FormGroup;
  loading: boolean = false;
  esConfirmacion: boolean = false;
  placaConfirmacion: string = '';
  listaVehiculos: Vehiculo[] = [];
  vehiculosFiltrados: Vehiculo[] = [];

  constructor(
    private fb: FormBuilder,
    private service: EstacionamientoService,
    private dialogRef: MatDialogRef<RegistrarEntradaComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { placa?: string; modoConfirmacion?: boolean }
  ) {}

  ngOnInit(): void {
    this.placaConfirmacion = (this.data?.placa || '').trim().toUpperCase();
    this.esConfirmacion = !!(this.data?.modoConfirmacion && this.placaConfirmacion);

    this.form = this.fb.group({
      placa: [
        this.placaConfirmacion,
        [Validators.required, Validators.pattern(/^[A-Za-z0-9-]{3,10}$/)]
      ]
    });

    if (!this.esConfirmacion) {
      this.cargarVehiculosParaSeleccion();
      this.form.get('placa')?.valueChanges.subscribe((val) => {
        this.filtrarVehiculos(val || '');
      });
    }
  }

  cargarVehiculosParaSeleccion(): void {
    this.service.obtenerVehiculos().subscribe({
      next: (res) => {
        const todos = res.data || [];
        this.listaVehiculos = todos.filter((v) => !v.estaAdentro);
        this.filtrarVehiculos(this.form.get('placa')?.value || '');
      }
    });
  }

  filtrarVehiculos(query: string): void {
    const q = query.trim().toUpperCase();
    if (!q) {
      this.vehiculosFiltrados = this.listaVehiculos;
    } else {
      this.vehiculosFiltrados = this.listaVehiculos.filter((v) =>
        v.placa.toUpperCase().includes(q)
      );
    }
  }

  seleccionarPlaca(placa: string): void {
    this.form.get('placa')?.setValue(placa);
  }

  confirmarEntradaDirecta(): void {
    if (!this.placaConfirmacion) return;
    this.ejecutarRegistro(this.placaConfirmacion);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let placaLimpia = this.form.value.placa || '';
    placaLimpia = placaLimpia.replace(/<[^>]*>/g, '').trim().toUpperCase();
    this.ejecutarRegistro(placaLimpia);
  }

  private ejecutarRegistro(placa: string): void {
    this.loading = true;
    this.service.registrarEntrada(placa).subscribe({
      next: (res) => {
        this.loading = false;
        this.snackBar.open(res.message || 'Entrada registrada exitosamente', 'Aceptar', {
          duration: 4000,
          panelClass: ['snackbar-success']
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.message || 'Error al registrar entrada', 'Cerrar', {
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
