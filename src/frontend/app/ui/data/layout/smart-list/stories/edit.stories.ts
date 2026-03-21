import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { EditComponent } from '../edit.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SmartListService } from '../smart-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

const fb = new FormBuilder();
const mockForm = fb.group({
  id: [123],
  Name: ['Produkt do edycji'],
  Active: [true]
});

const meta: Meta<EditComponent> = {
  title: 'UI/Layout/SmartList/Edit',
  component: EditComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: SmartListService,
          useValue: {
            dataService: {
              getFormGroup: () => mockForm,
              getOne: () => of({ data: { id: 123, Name: 'Produkt do edycji', Active: 1 } }),
              update: () => of({ success: true })
            },
            getBaseRoute: () => '/test',
            refresh: () => {},
            closeSidebar: () => {}
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' })
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: () => Promise.resolve(true)
          }
        }
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<EditComponent>;

export const Default: Story = {};
