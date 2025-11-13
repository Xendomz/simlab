import { BookingApprovalAction } from '@/domain/booking/BookingApprovalAction';
import { BookingStepper } from '@/domain/booking/BookingStepper';
import { BookingStepperStatus } from '@/domain/booking/BookingStepperStatus';
import { Time } from '@/domain/time/Time';

export type BookingStepperAPI = {
  id: number;
  role: string;
  action: string;
  status: string;
  description: string;
  information: string;
  approved_at?: string;
  approver?: string;
}

export function toDomain(api: BookingStepperAPI): BookingStepper {
  return new BookingStepper(
    api.id,
    api.role,
    api.action as BookingApprovalAction,
    api.status as BookingStepperStatus,
    api.description,
    api.information,
    api.approved_at ? new Time(api.approved_at) : undefined,
    api.approver ?? undefined
  );
}