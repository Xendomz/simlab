import { PracticumStepper } from '@/domain/practicum-scheduling/PracticumStepper';
import { PracticumStepperStatus } from '@/domain/practicum-scheduling/PracticumStepperStatus';
import { Time } from '@/domain/time/Time';

export type PracticumStepperAPI = {
  role: string;
  status: string;
  information: string | null;
  approved_at?: string;
  approver?: string;
}

export function toDomain(api: PracticumStepperAPI): PracticumStepper {
  return new PracticumStepper(
    api.role,
    api.status as PracticumStepperStatus,
    api.information,
    api.approved_at ? new Time(api.approved_at) : undefined,
    api.approver ?? undefined
  );
}