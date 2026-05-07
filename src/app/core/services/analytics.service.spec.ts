import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';
import { MockApiService } from './mock-api.service';
import { of } from 'rxjs';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let mockApiSpy: jasmine.SpyObj<MockApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MockApiService', ['getAdminBookings', 'getVendorServices']);

    TestBed.configureTestingModule({
      providers: [
        AnalyticsService,
        { provide: MockApiService, useValue: spy }
      ]
    });
    service = TestBed.inject(AnalyticsService);
    mockApiSpy = TestBed.inject(MockApiService) as jasmine.SpyObj<MockApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should compile admin analytics data accurately', (done) => {
    const mockBookings = [
      { id: '1', totalAmount: 100000, status: 'confirmed', eventDate: '2026-05-10' },
      { id: '2', totalAmount: 50000, status: 'completed', eventDate: '2026-06-15' }
    ] as any[];

    mockApiSpy.getAdminBookings.and.returnValue(of(mockBookings));

    service.getAdminAnalytics().subscribe(data => {
      expect(data.totalRevenue).toBe(150000);
      expect(data.bookingCountByStatus['confirmed']).toBe(1);
      expect(data.bookingCountByStatus['completed']).toBe(1);
      expect(data.averageBookingValue).toBe(75000);
      done();
    });
  });

  it('should compile vendor analytics data accurately', (done) => {
    const mockServices = [
      { id: 'vs1', name: 'Deluxe Catering', rating: 4.8, totalReviews: 120 }
    ] as any[];

    mockApiSpy.getVendorServices.and.returnValue(of(mockServices));

    service.getVendorAnalytics('v1').subscribe(data => {
      expect(data.totalEarnings).toBe(850000);
      expect(data.topPerformingService.name).toBe('Deluxe Catering');
      done();
    });
  });
});
