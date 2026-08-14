import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstacionamientoService } from '../../services/estacionamiento.service';
import { ReporteResidenteDTO } from '../../models/estacionamiento.models';
import { IniciarMesComponent } from '../iniciar-mes/iniciar-mes.component';
import {
  SeleccionarMesImpresionDialogComponent,
  ResultadoImpresionDialog
} from '../seleccionar-mes-impresion-dialog/seleccionar-mes-impresion-dialog.component';

@Component({
  selector: 'app-reporte-residentes',
  templateUrl: './reporte-residentes.component.html',
  styleUrls: ['./reporte-residentes.component.scss']
})
export class ReporteResidentesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['placa', 'tiempoAcumuladoMinutos', 'montoTotalPagar'];
  dataSource: MatTableDataSource<ReporteResidenteDTO> = new MatTableDataSource<ReporteResidenteDTO>([]);
  filterValue: string = '';
  loading: boolean = false;

  modoHistorico: boolean = false;
  tituloModoReporte: string = 'Mes Actual (En Curso)';

  totalResidentes: number = 0;
  totalMinutos: number = 0;
  totalMonto: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: EstacionamientoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarReporte();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarReporte(): void {
    this.loading = true;
    this.modoHistorico = false;
    this.tituloModoReporte = 'Mes Actual (En Curso)';

    this.service.generarInformeResidentes().subscribe({
      next: (res) => {
        this.loading = false;
        const lista = res.data || [];
        this.dataSource.data = lista;
        this.calcularResumen(lista);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.message || 'Error al generar el informe de residentes', 'Cerrar', {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  calcularResumen(lista: ReporteResidenteDTO[]): void {
    this.totalResidentes = lista.length;
    this.totalMinutos = lista.reduce((acc, curr) => acc + (curr.tiempoAcumuladoMinutos || 0), 0);
    this.totalMonto = lista.reduce((acc, curr) => acc + (curr.montoTotalPagar || 0), 0);
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

  openIniciarMes(): void {
    const dialogRef = this.dialog.open(IniciarMesComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) this.cargarReporte();
    });
  }

  imprimirReporte(): void {
    const dialogRef = this.dialog.open(SeleccionarMesImpresionDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((res: ResultadoImpresionDialog | undefined) => {
      if (!res) return;

      if (res.tipo === 'ACTUAL') {
        this.cargarReporte();
        setTimeout(() => window.print(), 400);
      } else if (res.tipo === 'HISTORICO' && res.detalle) {
        this.modoHistorico = true;
        this.tituloModoReporte = `Respaldo Histórico: ${res.nombreMes} ${res.anio}`;
        const residentes = res.detalle.residentes || [];
        this.dataSource.data = residentes;
        this.totalResidentes = residentes.length;
        this.totalMinutos = residentes.reduce((acc, curr) => acc + (curr.tiempoAcumuladoMinutos || 0), 0);
        this.totalMonto = res.detalle.montoTotalResidentes || 0;

        this.snackBar.open(`Reporte histórico de ${res.nombreMes} ${res.anio} cargado correctamente.`, 'Aceptar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });

        setTimeout(() => window.print(), 400);
      }
    });
  }
}
