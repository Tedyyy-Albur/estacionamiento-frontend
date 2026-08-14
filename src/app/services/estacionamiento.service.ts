import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  ApiResponse,
  Vehiculo,
  VehiculoRequestDTO,
  EstanciaEntradaRequestDTO,
  EstanciaSalidaRequestDTO,
  EstanciaResponseDTO,
  ReporteResidenteDTO,
  HistorialMensualDTO,
  DetalleHistorialMensualDTO
} from '../models/estacionamiento.models';

@Injectable({
  providedIn: 'root'
})
export class EstacionamientoService {
  private readonly baseUrl = 'http://localhost:8080/neo';

  constructor(private http: HttpClient) {}

  private sanitizePlaca(placa: string): string {
    if (!placa) return '';
    return placa.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
  }

  obtenerVehiculos(): Observable<ApiResponse<Vehiculo[]>> {
    return this.http.get<ApiResponse<Vehiculo[]>>(`${this.baseUrl}/vehiculos`)
      .pipe(catchError(this.handleError));
  }

  registrarResidente(placa: string): Observable<ApiResponse<Vehiculo>> {
    const payload: VehiculoRequestDTO = { placa: this.sanitizePlaca(placa) };
    return this.http.post<ApiResponse<Vehiculo>>(`${this.baseUrl}/vehiculos/residentes`, payload)
      .pipe(catchError(this.handleError));
  }

  registrarOficial(placa: string): Observable<ApiResponse<Vehiculo>> {
    const payload: VehiculoRequestDTO = { placa: this.sanitizePlaca(placa) };
    return this.http.post<ApiResponse<Vehiculo>>(`${this.baseUrl}/vehiculos/oficiales`, payload)
      .pipe(catchError(this.handleError));
  }

  registrarNoResidente(placa: string): Observable<ApiResponse<Vehiculo>> {
    const payload: VehiculoRequestDTO = { placa: this.sanitizePlaca(placa) };
    return this.http.post<ApiResponse<Vehiculo>>(`${this.baseUrl}/vehiculos/no-residentes`, payload)
      .pipe(catchError(this.handleError));
  }

  registrarEntrada(placa: string): Observable<ApiResponse<EstanciaResponseDTO>> {
    const payload: EstanciaEntradaRequestDTO = { placa: this.sanitizePlaca(placa) };
    return this.http.post<ApiResponse<EstanciaResponseDTO>>(`${this.baseUrl}/estancias/entrada`, payload)
      .pipe(catchError(this.handleError));
  }

  registrarSalida(placa: string): Observable<ApiResponse<EstanciaResponseDTO>> {
    const payload: EstanciaSalidaRequestDTO = { placa: this.sanitizePlaca(placa) };
    return this.http.post<ApiResponse<EstanciaResponseDTO>>(`${this.baseUrl}/estancias/salida`, payload)
      .pipe(catchError(this.handleError));
  }

  iniciarNuevoMes(): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/mes/iniciar`, {})
      .pipe(catchError(this.handleError));
  }

  generarInformeResidentes(): Observable<ApiResponse<ReporteResidenteDTO[]>> {
    return this.http.get<ApiResponse<ReporteResidenteDTO[]>>(`${this.baseUrl}/residentes/pagos`)
      .pipe(catchError(this.handleError));
  }

  obtenerEstancias(): Observable<ApiResponse<EstanciaResponseDTO[]>> {
    return this.http.get<ApiResponse<EstanciaResponseDTO[]>>(`${this.baseUrl}/estancias`)
      .pipe(catchError(this.handleError));
  }

  buscarHistorialMensual(anio: number, mes: number): Observable<ApiResponse<HistorialMensualDTO[]>> {
    return this.http.get<ApiResponse<HistorialMensualDTO[]>>(`${this.baseUrl}/mes/historial/buscar/${anio}/${mes}`)
      .pipe(catchError(this.handleError));
  }

  obtenerDetalleHistorialMensual(id: number): Observable<ApiResponse<DetalleHistorialMensualDTO>> {
    return this.http.get<ApiResponse<DetalleHistorialMensualDTO>>(`${this.baseUrl}/mes/historial/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error inesperado al conectar con el servidor.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.status === 0) {
      errorMessage = 'No se pudo conectar con el servicio backend en http://localhost:8080. Verifique que el microservicio esté en ejecución.';
    }
    return throwError(() => new Error(errorMessage));
  }
}
