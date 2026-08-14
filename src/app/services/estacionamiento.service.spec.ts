import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EstacionamientoService } from './estacionamiento.service';
import { ApiResponse, Vehiculo, EstanciaResponseDTO, ReporteResidenteDTO } from '../models/estacionamiento.models';

describe('EstacionamientoService', () => {
  let service: EstacionamientoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EstacionamientoService]
    });
    service = TestBed.inject(EstacionamientoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe obtener el listado de vehículos', () => {
    const mockVehiculos: ApiResponse<Vehiculo[]> = {
      success: true,
      message: 'OK',
      data: [
        { placa: 'ABC-123', tipoVehiculo: 'RESIDENTE' },
        { placa: 'OFF-001', tipoVehiculo: 'OFICIAL' }
      ]
    };

    service.obtenerVehiculos().subscribe((res) => {
      expect(res.data.length).toBe(2);
      expect(res.data[0].placa).toBe('ABC-123');
    });

    const req = httpMock.expectOne('http://localhost:8080/neo/vehiculos');
    expect(req.request.method).toBe('GET');
    req.flush(mockVehiculos);
  });

  it('debe registrar la entrada de un vehículo', () => {
    const mockResponse: ApiResponse<EstanciaResponseDTO> = {
      success: true,
      message: 'Entrada registrada',
      data: {
        placa: 'ABC-123',
        tipoVehiculo: 'RESIDENTE',
        fechaHoraEntrada: '2026-08-13T10:00:00Z',
        activa: true
      }
    };

    service.registrarEntrada('abc-123').subscribe((res) => {
      expect(res.data.placa).toBe('ABC-123');
      expect(res.data.activa).toBeTrue();
    });

    const req = httpMock.expectOne('http://localhost:8080/neo/estancias/entrada');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ placa: 'ABC-123' });
    req.flush(mockResponse);
  });

  it('debe registrar la salida de un vehículo', () => {
    const mockResponse: ApiResponse<EstanciaResponseDTO> = {
      success: true,
      message: 'Salida registrada',
      data: {
        placa: 'ABC-123',
        tipoVehiculo: 'RESIDENTE',
        fechaHoraEntrada: '2026-08-13T10:00:00Z',
        fechaHoraSalida: '2026-08-13T11:00:00Z',
        minutosTranscurridos: 60,
        montoCobrado: 3.00,
        activa: false
      }
    };

    service.registrarSalida('ABC-123').subscribe((res) => {
      expect(res.data.montoCobrado).toBe(3.00);
    });

    const req = httpMock.expectOne('http://localhost:8080/neo/estancias/salida');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ placa: 'ABC-123' });
    req.flush(mockResponse);
  });

  it('debe generar el informe de residentes', () => {
    const mockInforme: ApiResponse<ReporteResidenteDTO[]> = {
      success: true,
      message: 'OK',
      data: [
        { placa: 'RES-111', tiempoAcumuladoMinutos: 120, montoTotalPagar: 6.00 }
      ]
    };

    service.generarInformeResidentes().subscribe((res) => {
      expect(res.data.length).toBe(1);
      expect(res.data[0].montoTotalPagar).toBe(6.00);
    });

    const req = httpMock.expectOne('http://localhost:8080/neo/residentes/pagos');
    expect(req.request.method).toBe('GET');
    req.flush(mockInforme);
  });
});
