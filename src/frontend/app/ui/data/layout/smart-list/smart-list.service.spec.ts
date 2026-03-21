import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SmartListService } from './smart-list.service';
import { ICrudService } from '../smart-list-layout.component';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';

describe('SmartListService', () => {
  let service: SmartListService;
  let routerMock: any;
  let dataServiceMock: any;

  beforeEach(() => {
    routerMock = {
      url: '/test-route(sidebar:edit/1)',
      navigate: vi.fn(),
    };

    dataServiceMock = {
      notifyChange: vi.fn(),
      getOne: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      getListViewCommands: vi.fn(),
      getSidebarBaseRoute: vi.fn(),
      getItemEditRoute: vi.fn(),
      getFormGroup: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        SmartListService,
        { provide: Router, useValue: routerMock },
      ],
    });

    service = TestBed.inject(SmartListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return baseRoute if set', () => {
    service.baseRoute.set('/custom-base');
    expect(service.getBaseRoute()).toBe('/custom-base');
  });

  it('should return baseRoute from URL if not set', () => {
    expect(service.getBaseRoute()).toBe('/test-route');
  });

  it('should set and get dataService', () => {
    service.setDataService(dataServiceMock);
    expect(service.dataService).toBe(dataServiceMock);
  });

  it('should throw error if dataService is not set', () => {
    expect(() => service.dataService).toThrow('SmartListService: dataService not initialized');
  });

  it('should call notifyChange on dataService when refresh is called', () => {
    service.setDataService(dataServiceMock);
    service.refresh();
    expect(dataServiceMock.notifyChange).toHaveBeenCalled();
  });

  it('should call router.navigate when navigate is called', () => {
    const commands = ['/new-route'];
    const extras = { queryParams: { debug: true } };
    service.navigate(commands, extras);
    expect(routerMock.navigate).toHaveBeenCalledWith(commands, extras);
  });

  it('should call router.navigate when closeSidebar is called', () => {
    const commands = '/base-route';
    service.closeSidebar(commands);
    expect(routerMock.navigate).toHaveBeenCalledWith([commands]);
  });

  it('should handle array commands in closeSidebar', () => {
    const commands = ['/base-route', 'other'];
    service.closeSidebar(commands);
    expect(routerMock.navigate).toHaveBeenCalledWith(commands);
  });
});
