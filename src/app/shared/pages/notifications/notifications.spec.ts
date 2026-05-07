import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NotificationsPage } from './notifications';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmService } from '../../components/confirm-dialog';
import { of } from 'rxjs';

describe('NotificationsPageComponent', () => {
  let component: NotificationsPage;
  let fixture: ComponentFixture<NotificationsPage>;
  let notifServiceSpy: jasmine.SpyObj<NotificationService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let confirmServiceSpy: jasmine.SpyObj<ConfirmService>;

  beforeEach(async () => {
    const notifSpy = jasmine.createSpyObj('NotificationService', ['activeNotifications', 'markAllAsRead', 'deleteNotification', 'unreadCount']);
    const authSpy = jasmine.createSpyObj('AuthService', ['currentUser', 'getRole']);
    const confirmSpy = jasmine.createSpyObj('ConfirmService', ['ask']);

    notifSpy.activeNotifications.and.returnValue([
      { id: 'n1', type: 'booking', title: 'Confirmed', message: 'Confirmed booking', isRead: false, createdAt: new Date().toISOString() }
    ]);
    authSpy.currentUser.and.returnValue({ id: 'c1', name: 'Rajesh', role: 'customer' });
    authSpy.getRole.and.returnValue('customer');

    await TestBed.configureTestingModule({
      imports: [NotificationsPage],
      providers: [
        { provide: NotificationService, useValue: notifSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: ConfirmService, useValue: confirmSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsPage);
    component = fixture.componentInstance;
    notifServiceSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    confirmServiceSpy = TestBed.inject(ConfirmService) as jasmine.SpyObj<ConfirmService>;
    fixture.detectChanges();
  });

  it('should create and load active notifications', () => {
    expect(component).toBeTruthy();
    const list = component.filteredNotifications();
    expect(list.length).toBe(1);
    expect(list[0].category).toBe('Booking');
  });

  it('should apply categories list based on role', () => {
    expect(component.categories()).toContain('All');
    expect(component.categories()).toContain('Booking');
  });

  it('should call markAllAsRead on the service when requested', () => {
    component.markAllAsRead();
    expect(notifServiceSpy.markAllAsRead).toHaveBeenCalled();
  });

  it('should call deleteNotification on service', () => {
    component.deleteNotification('n1');
    expect(notifServiceSpy.deleteNotification).toHaveBeenCalledWith('n1');
  });
});
