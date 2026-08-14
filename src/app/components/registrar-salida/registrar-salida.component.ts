import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstacionamientoService } from '../../services/estacionamiento.service';
import { EstanciaResponseDTO, Vehiculo } from '../../models/estacionamiento.models';

@Component({
  selector: 'app-registrar-salida',
  templateUrl: './registrar-salida.component.html',
  styleUrls: ['./registrar-salida.component.scss']
})
export class RegistrarSalidaComponent implements OnInit {
  form!: FormGroup;
  loading: boolean = false;
  resultadoSalida: EstanciaResponseDTO | null = null;
  esConfirmacion: boolean = false;
  placaConfirmacion: string = '';
  listaVehiculos: Vehiculo[] = [];
  vehiculosFiltrados: Vehiculo[] = [];

  constructor(
    private fb: FormBuilder,
    private service: EstacionamientoService,
    private dialogRef: MatDialogRef<RegistrarSalidaComponent>,
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
      this.cargarVehiculosAdentroParaSeleccion();
      this.form.get('placa')?.valueChanges.subscribe((val) => {
        this.filtrarVehiculos(val || '');
      });
    }
  }

  cargarVehiculosAdentroParaSeleccion(): void {
    this.service.obtenerVehiculos().subscribe({
      next: (res) => {
        const todos = res.data || [];
        this.listaVehiculos = todos.filter((v) => v.estaAdentro);
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

  confirmarSalidaDirecta(): void {
    if (!this.placaConfirmacion) return;
    this.ejecutarSalida(this.placaConfirmacion);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let placaLimpia = this.form.value.placa || '';
    placaLimpia = placaLimpia.replace(/<[^>]*>/g, '').trim().toUpperCase();
    this.ejecutarSalida(placaLimpia);
  }

  private ejecutarSalida(placa: string): void {
    this.loading = true;
    this.service.registrarSalida(placa).subscribe({
      next: (res) => {
        this.loading = false;
        this.resultadoSalida = res.data;
        this.snackBar.open(res.message || 'Salida registrada correctamente', 'Aceptar', {
          duration: 4000,
          panelClass: ['snackbar-success']
        });
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.message || 'Error al registrar salida', 'Cerrar', {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  cerrar(exito: boolean = false): void {
    this.dialogRef.close(exito || !!this.resultadoSalida);
  }
}
