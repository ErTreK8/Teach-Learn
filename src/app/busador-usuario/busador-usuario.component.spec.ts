import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusadorUsuarioComponent } from './busador-usuario.component';

describe('BusadorUsuarioComponent', () => {
  let component: BusadorUsuarioComponent;
  let fixture: ComponentFixture<BusadorUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusadorUsuarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusadorUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
