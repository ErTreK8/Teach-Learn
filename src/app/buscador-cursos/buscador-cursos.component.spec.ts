import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorCursosComponent } from './buscador-cursos.component';

describe('BuscadorCursosComponent', () => {
  let component: BuscadorCursosComponent;
  let fixture: ComponentFixture<BuscadorCursosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuscadorCursosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuscadorCursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
