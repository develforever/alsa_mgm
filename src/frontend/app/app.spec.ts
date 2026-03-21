import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { ActivatedRoute, Router, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './services/auth.service';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';

describe('App', () => {
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let mockAuthService: Partial<AuthService>;
  let mockRouter: Partial<Router>;

  beforeEach(async () => {
    mockActivatedRoute = {
      root: {
        snapshot: { title: 'Home', data: {} } as ActivatedRouteSnapshot,
        firstChild: null
      } as unknown as ActivatedRoute
    };

    mockAuthService = {
      isLoggedIn: signal(false),
      checkAuth: () => of(false),
      logout: vi.fn()
    };

    mockRouter = {
      events: of(new NavigationEnd(0, '/', '/')),
      url: '/',
      navigate: vi.fn(),
      createUrlTree: vi.fn().mockReturnValue({}),
      serializeUrl: vi.fn().mockReturnValue(''),
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.breadcrumb')?.textContent).toBeDefined();
  });
});
