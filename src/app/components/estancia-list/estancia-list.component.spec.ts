import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { EstanciaListComponent } from './estancia-list.component';
import { EstacionamientoService } from '../../services/estacionamiento.service';

describe('EstanciaListComponent', () => {
  let component: EstanciaListComponent;
  let fixture: ComponentFixture<EstanciaListComponent>;
  let service: EstacionamientoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstanciaListComponent],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatCardModule,
        BrowserAnimationsModule
      ],
      providers: [EstacionamientoService]
    }).compileComponents();

    fixture = TestBed.createComponent(EstanciaListComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(EstacionamientoService);
  });

  it('debe crearse el componente de estancias', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar el historial de estancias al inicializarse', () => {
    spyOn(service, 'obtenerEstancias').and.returnValue(
      of({
        success: true,
        data: [
          {
            id: 1,
            placa: 'ABC-123',
            tipoVehiculo: 'RESIDENTE',
            fechaHoraEntrada: '2026-08-13T10:00:00Z',
            activa: true
          }
        ]
      })
    );

    component.ngOnInit();
    expect(service.obtenerEstancias).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(1);
    expect(component.estanciasActivas).toBe(1);
  });
});
