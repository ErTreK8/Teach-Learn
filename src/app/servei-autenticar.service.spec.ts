import { TestBed } from '@angular/core/testing';

import { ServeiAutenticarService } from './servei-autenticar.service';

describe('ServeiAutenticarService', () => {
  let service: ServeiAutenticarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServeiAutenticarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
