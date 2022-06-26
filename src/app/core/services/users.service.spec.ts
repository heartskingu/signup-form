import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let httpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClient = jasmine.createSpyObj<HttpClient>(['post']);
    service = new UsersService(httpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
