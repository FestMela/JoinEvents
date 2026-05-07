import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', [], {
      currentUser: () => ({ id: 'c1', name: 'Rajesh Kumar', role: 'customer' })
    });

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: AuthService, useValue: spy }
      ]
    });
    service = TestBed.inject(NotificationService);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create notifications for the active user', () => {
    service.triggerNotification('c1', 'booking', 'Test Notification', 'This is a test message.');
    const active = service.activeNotifications();
    expect(active.length).toBeGreaterThan(0);
    expect(active[0].title).toBe('Test Notification');
    expect(active[0].isRead).toBeFalse();
  });

  it('should mark all notifications as read', () => {
    service.triggerNotification('c1', 'booking', 'Unread', 'Unread message.');
    service.markAllAsRead();
    const active = service.activeNotifications();
    expect(active.every(n => n.isRead)).toBeTrue();
    expect(service.unreadCount()).toBe(0);
  });

  it('should delete specified notification', () => {
    service.triggerNotification('c1', 'booking', 'Test Del', 'Del message.');
    const id = service.activeNotifications()[0].id;
    service.deleteNotification(id);
    expect(service.activeNotifications().find(n => n.id === id)).toBeUndefined();
  });
});
