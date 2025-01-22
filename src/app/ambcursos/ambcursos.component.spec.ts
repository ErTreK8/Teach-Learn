import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AMBCursosComponent } from './ambcursos.component';

describe('AMBCursosComponent', () => {
  let component: AMBCursosComponent;
  let fixture: ComponentFixture<AMBCursosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AMBCursosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AMBCursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
