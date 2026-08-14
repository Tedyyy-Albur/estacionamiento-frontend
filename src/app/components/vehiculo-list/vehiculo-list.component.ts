import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { EstacionamientoService } from '../../services/estacionamiento.service';
import { Vehiculo } from '../../models/estacionamiento.models';
import { VehiculoDetailComponent } from '../vehiculo-detail/vehiculo-detail.component';
import { RegistrarEntradaComponent } from '../registrar-entrada/registrar-entrada.component';
import { RegistrarSalidaComponent } from '../registrar-salida/registrar-salida.component';
import { AltaVehiculoComponent } from '../alta-vehiculo/alta-vehiculo.component';
import { IniciarMesComponent } from '../iniciar-mes/iniciar-mes.component';

@Component({
  selector: 'app-vehiculo-list',
  templateUrl: './vehiculo-list.component.html',
  styleUrls: ['./vehiculo-list.component.scss']
})
export class VehiculoListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['placa', 'tipoVehiculo', 'estaAdentro', 'acciones'];
  dataSource: MatTableDataSource<Vehiculo> = new MatTableDataSource<Vehiculo>([]);
  filterValue: string = '';
  loading: boolean = false;
  private vehiculosSubscription?: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: EstacionamientoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarVehiculos();
    this.vehiculosSubscription = this.service.vehiculosActualizados$.subscribe(() => {
      this.cargarVehiculos();
    });
  }

  ngOnDestroy(): void {
    if (this.vehiculosSubscription) {
      this.vehiculosSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarVehiculos(): void {
    this.loading = true;
    this.service.obtenerVehiculos().subscribe({
      next: (res) => {
        this.loading = false;
        this.dataSource.data = res.data || [];
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.message || 'Error al cargar los vehículos', 'Cerrar', {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  aplicarFiltro(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let rawValue = inputElement ? inputElement.value : '';
    rawValue = rawValue.replace(/<[^>]*>/g, '').trim().toUpperCase();
    this.filterValue = rawValue;
    this.dataSource.filter = this.filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  limpiarFiltro(): void {
    this.filterValue = '';
    this.dataSource.filter = '';
  }

  verDetalle(vehiculo: Vehiculo): void {
    this.dialog.open(VehiculoDetailComponent, {
      width: '500px',
      data: vehiculo
    });
  }

  openRegistrarEntrada(placa?: string): void {
    const dialogRef = this.dialog.open(RegistrarEntradaComponent, {
      width: '450px',
      data: { placa: placa || '', modoConfirmacion: !!placa }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) this.cargarVehiculos();
    });
  }

  openRegistrarSalida(placa?: string): void {
    const dialogRef = this.dialog.open(RegistrarSalidaComponent, {
      width: '450px',
      data: { placa: placa || '', modoConfirmacion: !!placa }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) this.cargarVehiculos();
    });
  }

  openAltaVehiculo(): void {
    const dialogRef = this.dialog.open(AltaVehiculoComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) this.cargarVehiculos();
    });
  }

  openIniciarMes(): void {
    const dialogRef = this.dialog.open(IniciarMesComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) this.cargarVehiculos();
    });
  }
}
