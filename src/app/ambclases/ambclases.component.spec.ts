import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AMBClasesComponent } from './ambclases.component';

describe('AMBClasesComponent', () => {
  let component: AMBClasesComponent;
  let fixture: ComponentFixture<AMBClasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AMBClasesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AMBClasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
