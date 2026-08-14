import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { VehiculoListComponent } from './vehiculo-list.component';
import { EstacionamientoService } from '../../services/estacionamiento.service';

describe('VehiculoListComponent', () => {
  let component: VehiculoListComponent;
  let fixture: ComponentFixture<VehiculoListComponent>;
  let service: EstacionamientoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VehiculoListComponent],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        BrowserAnimationsModule
      ],
      providers: [EstacionamientoService]
    }).compileComponents();

    fixture = TestBed.createComponent(VehiculoListComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(EstacionamientoService);
  });

  it('debe crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar vehículos al inicializarse', () => {
    spyOn(service, 'obtenerVehiculos').and.returnValue(
      of({
        success: true,
        data: [{ placa: 'TEST-123', tipoVehiculo: 'RESIDENTE' }]
      })
    );

    component.ngOnInit();
    expect(service.obtenerVehiculos).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].placa).toBe('TEST-123');
  });

  it('debe filtrar la tabla por placa limpiando etiquetas HTML e inyecciones XSS', () => {
    component.dataSource.data = [
      { placa: 'ABC-123', tipoVehiculo: 'RESIDENTE' },
      { placa: 'XYZ-999', tipoVehiculo: 'OFICIAL' }
    ];

    const mockEvent = {
      target: { value: '<script>abc</script>' }
    } as any;

    component.aplicarFiltro(mockEvent);
    expect(component.filterValue).toBe('ABC');
  });
});
