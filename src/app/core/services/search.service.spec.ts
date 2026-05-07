import { TestBed } from '@angular/core/testing';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should filter packages based on rating', () => {
    const mockPackages = [
      { id: '1', rating: 4.5, price: 1000 },
      { id: '2', rating: 3.5, price: 2000 }
    ] as any[];

    service.updateFilters({ minRating: 4 });
    const filtered = service.filterPackages(mockPackages);
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('1');
  });

  it('should validate price range correctly', () => {
    service.updateFilters({ minPrice: 5000, maxPrice: 3000 });
    expect(service.validationError()).toBe('Minimum price cannot be greater than maximum price.');

    service.updateFilters({ minPrice: 2000, maxPrice: 6000 });
    expect(service.validationError()).toBeNull();
  });

  it('should clear all filters to defaults', () => {
    service.updateFilters({ query: 'Wedding', minRating: 4 });
    service.clearFilters();

    expect(service.filters().query).toBeUndefined();
    expect(service.filters().minRating).toBeUndefined();
  });
});
