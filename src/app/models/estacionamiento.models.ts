export type TipoVehiculo = 'OFICIAL' | 'RESIDENTE' | 'NO_RESIDENTE';

export interface Vehiculo {
  placa: string;
  tipoVehiculo: TipoVehiculo;
  estaAdentro?: boolean;
}

export interface VehiculoRequestDTO {
  placa: string;
}

export interface EstanciaEntradaRequestDTO {
  placa: string;
}

export interface EstanciaSalidaRequestDTO {
  placa: string;
}

export interface EstanciaResponseDTO {
  id?: number;
  placa: string;
  tipoVehiculo: TipoVehiculo;
  fechaHoraEntrada: string;
  fechaHoraSalida?: string;
  minutosTranscurridos?: number;
  montoCobrado?: number;
  activa?: boolean;
}

export interface ReporteResidenteDTO {
  placa: string;
  tiempoAcumuladoMinutos: number;
  montoTotalPagar: number;
}

export interface HistorialMensualDTO {
  id: number;
  anio: number;
  mes: number;
  fechaCierre: string;
  totalEstancias: number;
  montoTotalRecaudado: number;
  montoTotalResidentes: number;
}

export interface DetalleHistorialMensualDTO {
  id: number;
  anio: number;
  mes: number;
  fechaCierre: string;
  totalEstancias: number;
  montoTotalRecaudado: number;
  montoTotalResidentes: number;
  residentes: ReporteResidenteDTO[];
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}
