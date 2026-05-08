import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  const currentUserSignal = signal({ id: 'c1', name: 'Rajesh Kumar', role: 'customer' as const });

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', [], {
      currentUser: currentUserSignal
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
    service.addNotification({
      targetUserId: 'c1',
      targetRole: 'customer',
      type: 'booking',
      title: 'Test Notification',
      message: 'This is a test message.'
    });
    const active = service.activeNotifications();
    expect(active.length).toBeGreaterThan(0);
    expect(active[0].title).toBe('Test Notification');
    expect(active[0].isRead).toBeFalse();
  });

  it('should mark all notifications as read', () => {
    service.addNotification({
      targetUserId: 'c1',
      targetRole: 'customer',
      type: 'booking',
      title: 'Unread',
      message: 'Unread message.'
    });
    service.markAllAsRead();
    const active = service.activeNotifications();
    expect(active.every(n => n.isRead)).toBeTrue();
    expect(service.unreadCount()).toBe(0);
  });

  it('should delete specified notification', () => {
    service.addNotification({
      targetUserId: 'c1',
      targetRole: 'customer',
      type: 'booking',
      title: 'Test Del',
      message: 'Del message.'
    });
    const id = service.activeNotifications()[0].id;
    service.deleteNotification(id);
    expect(service.activeNotifications().find(n => n.id === id)).toBeUndefined();
  });
});
