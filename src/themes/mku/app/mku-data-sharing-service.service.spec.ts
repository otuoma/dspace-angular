import { TestBed } from '@angular/core/testing';

import { MkuDataSharingServiceService } from './mku-data-sharing-service.service';

describe('MkuDataSharingServiceService', () => {
  let service: MkuDataSharingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MkuDataSharingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
