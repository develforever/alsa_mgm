import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard.service';
import { DashboardConfig } from '../models/dashboard-config.model';

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with edit mode disabled', () => {
    expect(service.isEditMode()).toBe(false);
  });

  it('should toggle edit mode and create temp layout', () => {
    const initialLayout = service.layout();
    service.toggleEditMode();
    expect(service.isEditMode()).toBe(true);
    expect(service.tempLayout()).toEqual(initialLayout);
  });

  it('should update temp layout when editing', () => {
    service.toggleEditMode();
    const newConfig = { limit: 10 };
    const cellId = 'cell-1-1';
    
    service.updateWidgetConfig(cellId, newConfig);
    
    const temp = service.tempLayout();
    const cell = temp?.rows[0].cells.find(c => c.id === cellId);
    expect(cell?.widgetConfig).toEqual(newConfig);
    
    // Original layout should not be changed yet
    const originalCell = service.layout().rows[0].cells.find(c => c.id === cellId);
    expect(originalCell?.widgetConfig).not.toEqual(newConfig);
  });

  it('should persist changes on save', () => {
    service.toggleEditMode();
    const newConfig = { limit: 10 };
    const cellId = 'cell-1-1';
    
    service.updateWidgetConfig(cellId, newConfig);
    service.saveChanges();
    
    expect(service.isEditMode()).toBe(false);
    expect(service.tempLayout()).toBeNull();
    
    const savedCell = service.layout().rows[0].cells.find(c => c.id === cellId);
    expect(savedCell?.widgetConfig).toEqual(newConfig);
    
    // Check localStorage
    const saved = localStorage.getItem('dashboard_layout');
    expect(saved).toContain('"limit":10');
  });

  it('should discard changes on cancel', () => {
    service.toggleEditMode();
    const newConfig = { limit: 10 };
    service.updateWidgetConfig('cell-1-1', newConfig);
    service.cancelChanges();
    
    expect(service.isEditMode()).toBe(false);
    expect(service.layout().rows[0].cells[0].widgetConfig).not.toEqual(newConfig);
  });
});
