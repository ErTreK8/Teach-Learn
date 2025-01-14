import { TestBed } from '@angular/core/testing';

import { ServeiPerfilsService } from './servei-perfils.service';

describe('ServeiPerfilsService', () => {
  let service: ServeiPerfilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServeiPerfilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
