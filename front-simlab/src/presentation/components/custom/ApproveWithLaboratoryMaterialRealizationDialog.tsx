import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { ApiResponse } from '@/shared/Types'
import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
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
import { ScrollArea } from '@/presentation/components/ui/scroll-area'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { PracticumSchedulingView } from '@/application/practicum-scheduling/PracticumSchedulingView'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Input } from '../ui/input'

interface ApproveWithLaboratoryMaterialRealizationDialogProps {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  handleSave: (information: string, materials: number[]) => Promise<void>,
  practicumScheduling: PracticumSchedulingView | undefined
}

const ApproveWithLaboratoryMaterialRealizationDialog: React.FC<ApproveWithLaboratoryMaterialRealizationDialogProps> = ({
  open,
  onOpenChange,
  handleSave,
  practicumScheduling
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [information, setInformation] = useState<string>('')
  const [materialQuantities, setMaterialQuantities] = useState<number[]>([])
  const { errors, processErrors } = useValidationErrors()

  const handleQuantityChange = (index: number, value: string) => {
    // Allow only digits
    let newValue = value.replace(/\D/g, '');

    // Remove leading zeros but keep a single zero if all digits were zeros
    newValue = newValue.replace(/^0+(?=\d)/, '');

    // If empty, default to "0"
    if (newValue === '') newValue = '0';

    // Convert to number before saving
    const numericValue = Number(newValue);

    setMaterialQuantities(prev => {
      const next = [...(prev ?? [])];
      next[index] = numericValue;
      return next;
    });
  };

  const onSubmit = async () => {
    setIsSubmitting(true)
    try {
      await handleSave(information, materialQuantities)
    } catch (e) {
      const error = e as ApiResponse
      toast.error(error.message || 'Gagal Submit')
      if (error.errors) {

        processErrors(error.errors)
        console.log(error);
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    // initialize/reset quantities whenever the dialog opens or the scheduling changes
    if (!practicumScheduling) {
      setMaterialQuantities([])
      return
    }

    const quantities = practicumScheduling.practicumSchedulingMaterials?.map(m => m.quantity ?? 0) ?? []
    setMaterialQuantities(quantities)
  }, [open, practicumScheduling])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Konfirmasi Verifikasi</DialogTitle>
          <DialogDescription>Apakah Anda yakin ingin melanjutkan proses verifikasi?</DialogDescription>
        </DialogHeader>
        <ScrollArea className='h-full max-h-[70vh]'>
          <div className="flex flex-col gap-5 p-1">
            {practicumScheduling && (
              <div className='flex flex-col gap-2'>
                <Label htmlFor="reason">Konfirmasi Ketersediaan Bahan</Label>
                {errors['materials'] && (
                  <p className=" text-xs italic text-red-500">{errors['materials']}</p>
                )}
                <div className='rounded-md border'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          No
                        </TableHead>
                        <TableHead>
                          Nama Bahan
                        </TableHead>
                        <TableHead>
                          Jumlah yang Diajukan
                        </TableHead>
                        <TableHead>
                          Jumlah yang Dapat Disediakan
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {practicumScheduling.practicumSchedulingMaterials?.map((material, index) => (
                        <TableRow key={material.id ?? index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{material.laboratoryMaterial?.materialName}</TableCell>
                          <TableCell>{material.quantity} {material.laboratoryMaterial?.unit}</TableCell>
                          <TableCell>
                            <Input
                              type='number'
                              placeholder='Jumlah'
                              value={String(materialQuantities?.[index]) || 0}
                              onChange={e => handleQuantityChange(index, e.target.value)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                </div>
              </div>
            )}
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
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Batal</Button>
          </DialogClose>
          <Button type="button" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Memproses...' : 'Verifikasi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ApproveWithLaboratoryMaterialRealizationDialog