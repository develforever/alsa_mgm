import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ViewComponent } from './view.component';
import { SmartListService } from './smart-list.service';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

describe('ViewComponent', () => {
  let component: ViewComponent;
  let fixture: ComponentFixture<ViewComponent>;
  let mockActivatedRoute: any;
  let mockSmartListService: any;
  let mockDataService: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      params: of({ id: '123' }),
    };

    mockDataService = {
      getOne: vi.fn().mockReturnValue(of({ data: { id: 123, name: 'Test Item', active: true, createdAt: '2023-01-01T10:00:00Z' } })),
      getItemEditRoute: vi.fn().mockReturnValue(['edit', 123]),
      delete: vi.fn().mockReturnValue(of({})),
    };

    mockSmartListService = {
      dataService: mockDataService,
      getBaseRoute: vi.fn().mockReturnValue('/base'),
      closeSidebar: vi.fn(),
      refresh: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        ViewComponent,
        MatCardModule,
        MatButtonModule,
        CommonModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: SmartListService, useValue: mockSmartListService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load item on init if id is present in route', () => {
    expect(mockDataService.getOne).toHaveBeenCalledWith(123);
    expect(component.item()).toEqual({ id: 123, name: 'Test Item', active: true, createdAt: '2023-01-01T10:00:00Z' });
  });

  it('should format values correctly', () => {
    expect(component.formatValue('name', 'Test')).toBe('Test');
    expect(component.formatValue('active', true)).toBe('Tak');
    expect(component.formatValue('active', false)).toBe('Nie');
    expect(component.formatValue('createdAt', '2023-01-01T10:00:00Z')).toContain('2023');
    expect(component.formatValue('other', null)).toBe('-');
  });

  it('should call closeSidebar', () => {
    component.closeSidebar();
    expect(mockSmartListService.closeSidebar).toHaveBeenCalledWith('/base');
  });

  it('should call editItem', () => {
    component.selectedId = 123;
    component.editItem();
    expect(mockDataService.getItemEditRoute).toHaveBeenCalledWith(123);
    expect(mockSmartListService.closeSidebar).toHaveBeenCalledWith(['/base', { outlets: { sidebar: ['edit', 123] } }]);
  });

  it('should call deleteItem and refresh', () => {
    component.selectedId = 123;
    component.deleteItem();
    expect(mockDataService.delete).toHaveBeenCalledWith(123);
    expect(mockSmartListService.refresh).toHaveBeenCalled();
    expect(mockSmartListService.closeSidebar).toHaveBeenCalled();
  });
});
