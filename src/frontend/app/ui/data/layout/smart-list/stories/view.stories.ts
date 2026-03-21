import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ViewComponent } from '../view.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { SmartListService } from '../smart-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

const mockItem = {
  id: 123,
  Name: 'Generyczny Produkt',
  Description: 'To jest opis produktu widoczny w generycznym podglądzie',
  Price: 99.99,
  Active: true,
  CreatedAt: new Date().toISOString()
};

const meta: Meta<ViewComponent> = {
  title: 'UI/Layout/SmartList/View',
  component: ViewComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, MatCardModule, MatButtonModule],
      providers: [
        {
          provide: SmartListService,
          useValue: {
            dataService: {
              getOne: () => of({ data: mockItem })
            },
            getBaseRoute: () => '/test',
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
type Story = StoryObj<ViewComponent>;

export const Default: Story = {
  args: {},
};
