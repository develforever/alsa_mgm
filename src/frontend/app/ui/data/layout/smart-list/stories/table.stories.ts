import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { AppUiDataTableComponent } from '../../../table.component';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ApiResponse } from '../../../../../../../shared/api/ApiResponse';
import { ActivatedRoute, Router } from '@angular/router';

const meta: Meta<AppUiDataTableComponent<any>> = {
  title: 'UI/Data/DataTable',
  component: AppUiDataTableComponent,
  decorators: [
    moduleMetadata({
      imports: [
        MatTableModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        BrowserAnimationsModule
      ],
      providers: [
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
      ]
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<AppUiDataTableComponent<any>>;

const mockData = [
  { id: 1, name: 'Product A', active: true, price: 100 },
  { id: 2, name: 'Product B', active: false, price: 200 },
  { id: 3, name: 'Product C', active: true, price: 300 },
];

export const Default: Story = {
  args: {
    isLoading: false,
    pageSize: 5,
    fetchFn: (options: any) => of({
      data: mockData,
      total: mockData.length,
      page: options.page,
      limit: options.limit,
      totalPages: 1
    } as ApiResponse<any>),
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    fetchFn: () => of({ data: [], total: 0 } as any),
  },
};
