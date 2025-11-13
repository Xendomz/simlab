import { BookingApproval } from '@/domain/booking/BookingApproval';
import { Time } from '@/domain/time/Time';
import { BookingApprovalAction } from '@/domain/booking/BookingApprovalAction';
import { BookingApprovalStatus } from '@/domain/booking/BookingApprovalStatus';

export type BookingApprovalAPI = {
  id: number;
  role: string;
  action: string;
  status: string;
  description: string;
  information: string;
  approved_at?: string;
  approver?: string;
}

export function toDomain(api: BookingApprovalAPI): BookingApproval {
  return new BookingApproval(
    api.id,
    api.role,
    api.action as BookingApprovalAction,
    api.status as BookingApprovalStatus,
    api.description,
    api.information,
    api.approved_at ? new Time(api.approved_at) : undefined,
    api.approver ?? undefined
  );
}