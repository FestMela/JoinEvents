import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Register } from '../../../src/app/Onboard/register/register';
import { AuthService } from '../../../src/app/core/services/auth.service';
import { ToastService } from '../../../src/app/core/services/toast.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('Register Component Tests', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let mockAuthService: any;
  let mockToastService: any;

  beforeEach(async () => {
    mockAuthService = {
      register: jasmine.createSpy('register').and.returnValue(of({ success: true, message: 'Registration successful!' }))
    };
    mockToastService = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error')
    };

    await TestBed.configureTestingModule({
      imports: [Register, FormsModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the register component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with completely blank input fields (no mock data)', () => {
    expect(component.form.name).toBe('');
    expect(component.form.email).toBe('');
    expect(component.form.phone).toBe('');
    expect(component.form.password).toBe('');
    expect(component.form.confirmPassword).toBe('');
    expect(component.form.city).toBe('');
  });

  it('should show error toast if required fields are missing on submit', () => {
    component.form.name = '';
    component.onSubmit();
    expect(mockToastService.error).toHaveBeenCalledWith('Please fill all required fields.');
  });

  it('should show error toast if passwords do not match on submit', () => {
    component.form.name = 'Test User';
    component.form.email = 'test@example.com';
    component.form.phone = '+91 99999 88888';
    component.form.password = 'password123';
    component.form.confirmPassword = 'different_password';
    
    component.onSubmit();
    
    expect(mockToastService.error).toHaveBeenCalledWith('Passwords do not match.');
  });

  it('should register successfully as Customer and trigger success toast', () => {
    component.role.set('customer');
    component.form.name = 'Rajesh Kumar';
    component.form.email = 'customer@demo.com';
    component.form.phone = '+91 98765 43210';
    component.form.password = 'JoinEvents@2025';
    component.form.confirmPassword = 'JoinEvents@2025';
    
    component.onSubmit();
    
    expect(mockAuthService.register).toHaveBeenCalledWith(
      'Rajesh Kumar',
      'customer@demo.com',
      '+91 98765 43210',
      'JoinEvents@2025',
      'customer'
    );
    expect(mockToastService.success).toHaveBeenCalledWith('Registration successful!');
  });

  it('should register successfully as Vendor and trigger success toast', () => {
    component.role.set('vendor');
    component.form.name = 'Amit Sharma';
    component.form.email = 'vendor@demo.com';
    component.form.phone = '+91 91234 56789';
    component.form.password = 'JoinEvents@2025';
    component.form.confirmPassword = 'JoinEvents@2025';
    
    component.onSubmit();
    
    expect(mockAuthService.register).toHaveBeenCalledWith(
      'Amit Sharma',
      'vendor@demo.com',
      '+91 91234 56789',
      'JoinEvents@2025',
      'vendor'
    );
    expect(mockToastService.success).toHaveBeenCalledWith('Registration successful!');
  });

  it('should show error toast if registration API fails', () => {
    mockAuthService.register.and.returnValue(of({ success: false, message: 'Email already exists.' }));
    component.form.name = 'Duplicate';
    component.form.email = 'existing@example.com';
    component.form.phone = '+91 90000 00000';
    component.form.password = 'password123';
    component.form.confirmPassword = 'password123';
    
    component.onSubmit();
    
    expect(mockToastService.error).toHaveBeenCalledWith('Email already exists.');
  });
});
