import { TestBed } from '@angular/core/testing';

import { CarCategoryService } from './car-category.service';

describe('CarCategoryService', () => {
  let service: CarCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
