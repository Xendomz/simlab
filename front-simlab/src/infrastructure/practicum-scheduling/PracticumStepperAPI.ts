import { PracticumStepper } from '@/domain/practicum-scheduling/PracticumStepper';
import { Time } from '@/domain/time/Time';

export type PracticumStepperAPI = {
  id: number;
  role: string;
  status: string;
  information: string;
  approved_at?: string;
  approver?: string;
}

export function toDomain(api: PracticumStepperAPI): PracticumStepper {
  return new PracticumStepper(
    api.id,
    api.role,
    api.status as "approved" | "rejected" | "pending",
    api.information,
    api.approved_at ? new Time(api.approved_at) : undefined,
    api.approver ?? undefined
  );
}