import { userRole } from '@/domain/User/UserRole';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription
} from '@/presentation/components/ui/dialog'
import { Button } from '@/presentation/components/ui/button'
import { Combobox } from '@/presentation/components/custom/combobox';
import React, { useState } from 'react'
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useValidationErrors } from '@/presentation/hooks/useValidationError';
import { ApiResponse } from '@/shared/Types';
import { toast } from 'sonner';
import { useUserSelect } from '@/presentation/pages/admin/user/hooks/useUserSelect';

interface ApproveWithLaboranSelectDialogProps {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  handleSave: (laboran_id: number, information: string) => Promise<void>
}

const ApproveWithLaboranSelectDialog: React.FC<ApproveWithLaboranSelectDialogProps> = ({
  open,
  onOpenChange,
  handleSave
}) => {
  const [information, setInformation] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { errors, processErrors } = useValidationErrors()

  const { users: laborans, selectedUser: selectedLaboran, setSelectedUser: setSelectedLaboran } = useUserSelect({ role: userRole.Laboran })
  const onSubmit = async () => {
    if (!selectedLaboran) return;
    setIsSubmitting(true);
    try {
      await handleSave(Number(selectedLaboran), information);
      onOpenChange(false);
    } catch (e) {
      const error = e as ApiResponse
      toast.error(error.message || 'Gagal submit')

      if (error.errors) {
        processErrors(error.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pilih Laboran</DialogTitle>
          <DialogDescription>Verifikasi pengajuan dan berikan tugas kepada petugas laboran terkait untuk membantu pemohon tersebut. Silahkan pilih salah satu dari daftar laboran yang ada dibawah ini:</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="reason">Laboran Penanggung Jawab</Label>
            <div className="flex flex-col gap-1">
              <Combobox
                options={laborans}
                value={selectedLaboran.toString() || ''}
                onChange={(val) => setSelectedLaboran(Number(val))}
                placeholder="Pilih Laboran"
                optionLabelKey='name'
                optionValueKey='id'
              />
              {errors['laboran_id'] && (
                <p className=" text-xs italic text-red-500">{errors['laboran_id']}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="reason">Catatan (*optional)</Label>
            <div className="flex flex-col gap-1">
              <Textarea
                id="reason"
                value={information}
                onChange={e => setInformation(e.target.value)}
                placeholder="Masukkan Catatan"
                rows={4}
              />
              {errors['information'] && (
                <p className=" text-xs italic text-red-500">{errors['information']}</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Batal</Button>
          </DialogClose>
          <Button type="button" onClick={onSubmit} disabled={!selectedLaboran || isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ApproveWithLaboranSelectDialog