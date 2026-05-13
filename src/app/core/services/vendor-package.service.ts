import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { API_ROUTES } from '../constants/api.constants';
import { Observable } from 'rxjs';

export interface VendorPackageResponse {
  packages: any[];
  totalCount: number;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class VendorPackageService extends BaseApiService {

  getMyPackages(category?: string, status?: string, page: number = 1, pageSize: number = 20): Observable<VendorPackageResponse> {
    const params: any = { page, pageSize };
    if (category) params.category = category;
    if (status) params.status = status;
    return this.get<VendorPackageResponse>(API_ROUTES.VENDOR_PACKAGES.BASE, params, false);
  }

  getPackageById(id: string): Observable<any> {
    return this.get<any>(API_ROUTES.VENDOR_PACKAGES.BY_ID(id), undefined, false);
  }

  createPackage(payload: any): Observable<any> {
    return this.post<any>(API_ROUTES.VENDOR_PACKAGES.BASE, payload, false);
  }

  updatePackage(id: string, payload: any): Observable<any> {
    return this.put<any>(API_ROUTES.VENDOR_PACKAGES.BY_ID(id), payload, false);
  }

  deletePackage(id: string): Observable<any> {
    return this.delete<any>(API_ROUTES.VENDOR_PACKAGES.BY_ID(id), false);
  }

  toggleStatus(id: string, isActive: boolean): Observable<any> {
    return this.patch<any>(API_ROUTES.VENDOR_PACKAGES.STATUS(id), { isActive }, false);
  }

  getServiceCategories(): Observable<any> {
    return this.get<any>(API_ROUTES.SERVICE_CATEGORIES);
  }
}
