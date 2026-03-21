import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { EditComponent } from './edit.component';
import { SmartListService } from './smart-list.service';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;
  let mockActivatedRoute: any;
  let mockSmartListService: any;
  let mockDataService: any;
  let mockFormGroup: FormGroup;

  beforeEach(async () => {
    mockActivatedRoute = {
      params: of({ id: '123' }),
    };

    mockFormGroup = new FormGroup({
      id: new FormControl(123),
      name: new FormControl('Test Item'),
      Active: new FormControl(false),
    });

    mockDataService = {
      getFormGroup: vi.fn().mockReturnValue(mockFormGroup),
      getOne: vi.fn().mockReturnValue(of({ data: { id: 123, name: 'Test Item', Active: 0 } })),
      update: vi.fn().mockReturnValue(of({ data: { id: 123, name: 'Test Item', Active: 1 } })),
    };

    mockSmartListService = {
      dataService: mockDataService,
      getBaseRoute: vi.fn().mockReturnValue('/base'),
      closeSidebar: vi.fn(),
      refresh: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        EditComponent,
        MatCardModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        CommonModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: SmartListService, useValue: mockSmartListService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and load item', () => {
    expect(mockDataService.getFormGroup).toHaveBeenCalled();
    expect(mockDataService.getOne).toHaveBeenCalledWith(123);
    // After initialization, the effect should patch the value.
    // We might need to wait for the effect if it's asynchronous, but signal effects are usually fine.
    // Let's check if the form is patched.
    expect(component.itemForm.get('name')?.value).toBe('Test Item');
  });

  it('should determine control type correctly', () => {
    expect(component.getControlType('id')).toBe('hidden');
    expect(component.getControlType('Active')).toBe('checkbox');
    expect(component.getControlType('name')).toBe('text');
  });

  it('should call updateItem and refresh on submit', () => {
    component.selectedId = 123;
    component.itemForm.patchValue({ name: 'Updated name', Active: true });
    component.updateItem();
    
    expect(mockDataService.update).toHaveBeenCalledWith(123, { id: 123, name: 'Updated name', Active: 1 });
    expect(mockSmartListService.refresh).toHaveBeenCalled();
  });

  it('should close sidebar', () => {
    component.closeSidebar();
    expect(mockSmartListService.closeSidebar).toHaveBeenCalledWith('/base');
  });
});
