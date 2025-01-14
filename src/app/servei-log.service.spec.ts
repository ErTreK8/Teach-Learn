import { TestBed } from '@angular/core/testing';

import { ServeiLogService } from './servei-log.service';

describe('ServeiLogService', () => {
  let service: ServeiLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServeiLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
