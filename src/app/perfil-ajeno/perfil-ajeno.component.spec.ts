import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilAjenoComponent } from './perfil-ajeno.component';

describe('PerfilAjenoComponent', () => {
  let component: PerfilAjenoComponent;
  let fixture: ComponentFixture<PerfilAjenoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfilAjenoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerfilAjenoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
