import { BookingStepper } from '@/domain/booking/BookingStepper';
import { Time } from '@/domain/time/Time';

export type BookingStepperAPI = {
  id: number;
  role: string;
  status: string;
  information: string;
  approved_at?: string;
  approver?: string;
}

export function toDomain(api: BookingStepperAPI): BookingStepper {
  return new BookingStepper(
    api.id,
    api.role,
    api.status as "approved" | "rejected" | "pending" | "revision",
    api.information,
    api.approved_at ? new Time(api.approved_at) : undefined,
    api.approver ?? undefined
  );
}