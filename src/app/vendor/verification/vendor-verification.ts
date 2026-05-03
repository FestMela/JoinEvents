import { Component } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

@Component({ selector: 'app-vendor-verification', imports: [TitleCasePipe], templateUrl: './vendor-verification.html', styleUrl: './vendor-verification.css' })
export class VendorVerification {
  readonly steps = [
    { label: 'Registration', desc: 'Account created and basic details submitted', status: 'done', icon: 'bi-person-check' },
    { label: 'Document Upload', desc: 'Business registration, GST, and other docs uploaded', status: 'done', icon: 'bi-file-earmark-check' },
    { label: 'Admin Review', desc: 'Our team is reviewing your submitted documents', status: 'active', icon: 'bi-eye' },
    { label: 'Verification Call', desc: 'A brief call with our vendor success team', status: 'pending', icon: 'bi-telephone' },
    { label: 'Go Live', desc: 'Your services are visible to customers and bookings open', status: 'pending', icon: 'bi-rocket-takeoff' },
  ];

  readonly docs = [
    { type: 'FSSAI License', name: 'fssai_license.pdf', status: 'approved', date: '2025-01-10' },
    { type: 'GST Certificate', name: 'gst_certificate.pdf', status: 'approved', date: '2025-01-10' },
    { type: 'Bank Account Details', name: 'bank_details.pdf', status: 'approved', date: '2025-01-10' },
  ];
}
