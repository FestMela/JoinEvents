import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmService } from '../../shared/components/confirm-dialog';

interface StaffMember {
  id: string;
  name: string;
  role: 'Employee' | 'Manager' | 'Labour';
  phone: string;
  email: string;
  salary: number;
  salaryType: 'Monthly' | 'Daily' | 'Hourly';
  salaryCalculationDate: number;
  status: 'Active' | 'On Leave';
  joinedDate: string;
  avatar?: string;
}

interface PaymentRecord {
  id: string;
  staffName: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending';
}

@Component({
  selector: 'app-vendor-staff',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-staff.html',
  styleUrl: './vendor-staff.css'
})
export class VendorStaff {
  private toast = inject(ToastService);
  private confirmService = inject(ConfirmService);

  // Staff Data
  staffList = signal<StaffMember[]>([
    { id: '1', name: 'Rahul Verma', role: 'Manager', phone: '9876543210', email: 'rahul@example.com', salary: 25000, salaryType: 'Monthly', salaryCalculationDate: 1, status: 'Active', joinedDate: '2023-05-15' },
    { id: '2', name: 'Sneha Kapur', role: 'Employee', phone: '9876543211', email: 'sneha@example.com', salary: 35000, salaryType: 'Monthly', salaryCalculationDate: 1, status: 'Active', joinedDate: '2023-08-20' },
    { id: '3', name: 'Amit Singh', role: 'Labour', phone: '9876543212', email: 'amit@example.com', salary: 1200, salaryType: 'Daily', salaryCalculationDate: 1, status: 'On Leave', joinedDate: '2024-01-10' }
  ]);

  payments = signal<PaymentRecord[]>([
    { id: 'p1', staffName: 'Rahul Verma', amount: 25000, date: '2024-03-01', status: 'Paid' },
    { id: 'p2', staffName: 'Sneha Kapur', amount: 35000, date: '2024-03-01', status: 'Paid' },
    { id: 'p3', staffName: 'Amit Singh', amount: 28000, date: '2024-03-01', status: 'Pending' }
  ]);

  // Form State
  showForm = signal(false);
  showSalaryForm = signal(false);
  isEditing = signal(false);
  currentStaff = signal<Partial<StaffMember>>({
    status: 'Active',
    role: 'Employee',
    salaryType: 'Monthly',
    salaryCalculationDate: 1
  });

  // Salary Process State
  selectedStaff = signal<StaffMember | null>(null);
  bonus = signal(0);
  deductions = signal(0);
  payoutMonth = signal(new Date().toLocaleString('default', { month: 'long' }));

  // KPI Signals
  totalMonthlySalary = signal(88000);
  activeStaffCount = signal(2);

  openAddForm() {
    this.isEditing.set(false);
    this.currentStaff.set({ 
      status: 'Active', 
      role: 'Employee',
      salaryType: 'Monthly',
      salaryCalculationDate: 1,
      joinedDate: new Date().toISOString().split('T')[0] 
    });
    this.showForm.set(true);
  }

  editStaff(staff: StaffMember) {
    this.isEditing.set(true);
    this.currentStaff.set({ ...staff });
    this.showForm.set(true);
  }

  openSalaryModal(staff: StaffMember) {
    this.selectedStaff.set(staff);
    this.bonus.set(0);
    this.deductions.set(0);
    this.showSalaryForm.set(true);
  }

  get netPayable(): number {
    const staff = this.selectedStaff();
    if (!staff) return 0;
    return staff.salary + this.bonus() - this.deductions();
  }

  saveStaff() {
    const data = this.currentStaff() as StaffMember;
    if (!data.name || !data.role || !data.salary) {
      this.toast.error('Please fill all required fields');
      return;
    }

    if (this.isEditing()) {
      this.staffList.update(list => list.map(s => s.id === data.id ? data : s));
      this.toast.success('Staff details updated successfully');
    } else {
      data.id = Math.random().toString(36).substr(2, 9);
      this.staffList.update(list => [data, ...list]);
      this.toast.success('New staff member added');
    }
    this.showForm.set(false);
    this.updateKPIs();
  }

  async deleteStaff(id: string) {
    const confirmed = await this.confirmService.ask({
      title: 'Remove Staff Member',
      message: 'This action will permanently remove the staff member from your directory. Do you want to continue?',
      confirmText: 'Remove Member',
      type: 'danger'
    });

    if (confirmed) {
      this.staffList.update(list => list.filter(s => s.id !== id));
      this.toast.success('Staff member removed');
      this.updateKPIs();
    }
  }

  toggleStatus(id: string) {
    this.staffList.update(list => list.map(s => {
      if (s.id === id) {
        const newStatus = s.status === 'Active' ? 'On Leave' : 'Active';
        return { ...s, status: newStatus as any };
      }
      return s;
    }));
    this.updateKPIs();
  }

  processPayment() {
    const staff = this.selectedStaff();
    if (!staff) return;

    const net = this.netPayable;
    const newPayment: PaymentRecord = {
      id: 'p' + Math.random().toString(36).substr(2, 5),
      staffName: staff.name,
      amount: net,
      date: new Date().toISOString().split('T')[0],
      status: 'Paid'
    };
    
    this.payments.update(p => [newPayment, ...p]);
    this.toast.success(`Salary of ₹${net.toLocaleString('en-IN')} processed for ${staff.name}`);
    this.showSalaryForm.set(false);
  }

  private updateKPIs() {
    const list = this.staffList();
    this.activeStaffCount.set(list.filter(s => s.status === 'Active').length);
    this.totalMonthlySalary.set(list.reduce((acc, s) => acc + (s.salary || 0), 0));
  }

  getInitials(name: string) {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'S';
  }
}
