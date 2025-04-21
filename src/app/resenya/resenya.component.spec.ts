import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResenyaComponent } from './resenya.component';

describe('ResenyaComponent', () => {
  let component: ResenyaComponent;
  let fixture: ComponentFixture<ResenyaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResenyaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResenyaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
