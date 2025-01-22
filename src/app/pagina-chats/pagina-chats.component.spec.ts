import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaChatsComponent } from './pagina-chats.component';

describe('PaginaChatsComponent', () => {
  let component: PaginaChatsComponent;
  let fixture: ComponentFixture<PaginaChatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginaChatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaginaChatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
