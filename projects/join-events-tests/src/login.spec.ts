import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Login } from '../../../src/app/Onboard/login/login';
import { PortalLogin } from '../../../src/app/Onboard/portal-login/portal-login';
import { AuthService } from '../../../src/app/core/services/auth.service';
import { ToastService } from '../../../src/app/core/services/toast.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('Login Components Tests (All Users)', () => {
  let mockAuthService: any;
  let mockToastService: any;
  let mockActivatedRoute: any;

  beforeEach(() => {
    mockAuthService = {
      login: jasmine.createSpy('login').and.returnValue(of({ success: true, message: 'Login successful!' }))
    };
    mockToastService = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
      warning: jasmine.createSpy('warning')
    };
    mockActivatedRoute = {
      snapshot: { queryParams: { returnUrl: '' } }
    };
  });

  // --- Customer Login Page Tests ---
  describe('Customer Login Component', () => {
    let component: Login;
    let fixture: ComponentFixture<Login>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [Login, FormsModule, RouterTestingModule],
        providers: [
          { provide: AuthService, useValue: mockAuthService },
          { provide: ToastService, useValue: mockToastService },
          { provide: ActivatedRoute, useValue: mockActivatedRoute }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(Login);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create customer login', () => {
      expect(component).toBeTruthy();
    });

    it('should load completely empty with no mock credentials', () => {
      expect(component.email).toBe('');
      expect(component.password).toBe('');
      expect(component.rememberMe).toBeFalse();
    });

    it('should trigger error toast for blank submit', () => {
      component.onSubmit();
      expect(mockToastService.error).toHaveBeenCalledWith('Please fill all fields.');
    });

    it('should login customer via real API endpoint', () => {
      component.email = 'customer@demo.com';
      component.password = 'JoinEvents@2025';
      component.onSubmit();
      expect(mockAuthService.login).toHaveBeenCalledWith('customer@demo.com', 'JoinEvents@2025', 'customer', '');
    });

    it('should handle rememberMe localStorage preferences on successful login', () => {
      spyOn(localStorage, 'setItem');
      component.email = 'customer@demo.com';
      component.password = 'JoinEvents@2025';
      component.rememberMe = true;
      component.onSubmit();
      expect(localStorage.setItem).toHaveBeenCalledWith('joinevents_remember_email', 'customer@demo.com');
      expect(localStorage.setItem).toHaveBeenCalledWith('joinevents_remember_me', 'true');
    });
  });

  // --- Partner/Portal Login Page Tests (Vendor, Admin, Support) ---
  describe('Portal Login Component (Vendor, Admin, Support)', () => {
    let component: PortalLogin;
    let fixture: ComponentFixture<PortalLogin>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [PortalLogin, FormsModule, RouterTestingModule],
        providers: [
          { provide: AuthService, useValue: mockAuthService },
          { provide: ToastService, useValue: mockToastService },
          { provide: ActivatedRoute, useValue: mockActivatedRoute }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(PortalLogin);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create portal login', () => {
      expect(component).toBeTruthy();
    });

    it('should load completely empty with no mock credentials for default vendor role', () => {
      expect(component.email).toBe('');
      expect(component.password).toBe('');
      expect(component.selectedRole()).toBe('vendor');
    });

    it('should keep email and password blank when switching roles', () => {
      component.selectRole('admin');
      expect(component.selectedRole()).toBe('admin');
      expect(component.email).toBe('');
      expect(component.password).toBe('');

      component.selectRole('support');
      expect(component.selectedRole()).toBe('support');
      expect(component.email).toBe('');
      expect(component.password).toBe('');
    });

    it('should trigger error toast for blank portal submit', () => {
      component.onSubmit();
      expect(mockToastService.error).toHaveBeenCalledWith('Please fill all fields.');
    });

    it('should login Vendor via real API endpoint', () => {
      component.selectRole('vendor');
      component.email = 'vendor@demo.com';
      component.password = 'JoinEvents@2025';
      component.onSubmit();
      expect(mockAuthService.login).toHaveBeenCalledWith('vendor@demo.com', 'JoinEvents@2025', 'vendor', '');
    });

    it('should login Admin via real API endpoint', () => {
      component.selectRole('admin');
      component.email = 'admin@demo.com';
      component.password = 'JoinEvents@2025';
      component.onSubmit();
      expect(mockAuthService.login).toHaveBeenCalledWith('admin@demo.com', 'JoinEvents@2025', 'admin', '');
    });

    it('should login Support via real API endpoint', () => {
      component.selectRole('support');
      component.email = 'support@demo.com';
      component.password = 'JoinEvents@2025';
      component.onSubmit();
      expect(mockAuthService.login).toHaveBeenCalledWith('support@demo.com', 'JoinEvents@2025', 'support', '');
    });

    it('should show error toast if login API fails', () => {
      mockAuthService.login.and.returnValue(of({ success: false, message: 'Invalid credentials' }));
      component.email = 'bademail@example.com';
      component.password = 'wrongpassword';
      component.onSubmit();
      expect(mockToastService.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });
});
