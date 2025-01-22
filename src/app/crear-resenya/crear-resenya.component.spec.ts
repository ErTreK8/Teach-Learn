import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearResenyaComponent } from './crear-resenya.component';

describe('CrearResenyaComponent', () => {
  let component: CrearResenyaComponent;
  let fixture: ComponentFixture<CrearResenyaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrearResenyaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearResenyaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
