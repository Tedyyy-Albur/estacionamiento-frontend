import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstacionamientoService } from '../../services/estacionamiento.service';
import { EstanciaResponseDTO } from '../../models/estacionamiento.models';
import { RegistrarSalidaComponent } from '../registrar-salida/registrar-salida.component';

@Component({
  selector: 'app-estancia-list',
  templateUrl: './estancia-list.component.html',
  styleUrls: ['./estancia-list.component.scss']
})
export class EstanciaListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'placa',
    'tipoVehiculo',
    'fechaHoraEntrada',
    'fechaHoraSalida',
    'minutosTranscurridos',
    'montoCobrado',
    'activa',
    'acciones'
  ];

  dataSource: MatTableDataSource<EstanciaResponseDTO> = new MatTableDataSource<EstanciaResponseDTO>([]);
  filterValue: string = '';
  loading: boolean = false;

  totalEstancias: number = 0;
  estanciasActivas: number = 0;
  totalRecaudado: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: EstacionamientoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarEstancias();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarEstancias(): void {
    this.loading = true;
    this.service.obtenerEstancias().subscribe({
      next: (res) => {
        this.loading = false;
        const lista = res.data || [];
        lista.sort((a, b) => {
          if (a.activa === b.activa) {
            const timeA = a.fechaHoraEntrada ? new Date(a.fechaHoraEntrada).getTime() : 0;
            const timeB = b.fechaHoraEntrada ? new Date(b.fechaHoraEntrada).getTime() : 0;
            return timeB - timeA;
          }
          return a.activa ? -1 : 1;
        });
        this.dataSource.data = lista;
        this.calcularResumen(lista);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.message || 'Error al cargar el historial de estancias', 'Cerrar', {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  calcularResumen(lista: EstanciaResponseDTO[]): void {
    this.totalEstancias = lista.length;
    this.estanciasActivas = lista.filter((e) => e.activa).length;
    this.totalRecaudado = lista.reduce((acc, curr) => acc + (curr.montoCobrado || 0), 0);
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

  openRegistrarSalida(placa: string): void {
    const dialogRef = this.dialog.open(RegistrarSalidaComponent, {
      width: '450px',
      data: { placa, modoConfirmacion: true }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) this.cargarEstancias();
    });
  }
}
