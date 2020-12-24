import { TestBed } from '@angular/core/testing';

import { CvMakerService } from './cv-maker.service';

describe('CvMakerService', () => {
  let service: CvMakerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CvMakerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
