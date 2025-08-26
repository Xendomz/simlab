import { BookingApproval } from '@/domain/booking/BookingApproval';
import { Time } from '@/domain/time/Time';
import { UserApi, toDomain as toUser } from '../user/UserApi';

export type BookingApprovalAPI = {
  id: number;
  booking_id: number;
  role: string;
  approver_id: number | null;
  approved: number | boolean;
  information: string;
  created_at: string;
  updated_at: string;
  approver?: UserApi;
}

export function toDomain(api: BookingApprovalAPI): BookingApproval {
  return new BookingApproval(
    api.id,
    api.booking_id,
    api.role,
    api.approver_id ?? 0,
    Boolean(api.approved),
    api.information,
    new Time(api.created_at),
    new Time(api.updated_at),
    api.approver ? toUser(api.approver) : undefined
  );
}