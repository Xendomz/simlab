import Header from '@/presentation/components/Header'
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'
import React, { useEffect, useRef, useState } from 'react'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/presentation/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/application/hooks/useAuth';
import { Label } from '@/presentation/components/ui/label';
import { Input } from '@/presentation/components/ui/input';
import { useValidationErrors } from '@/presentation/hooks/useValidationError';
import { ApiResponse } from '@/shared/Types';
import BookingDateTimeRangePicker from '@/presentation/components/custom/BookingDateTimePicker';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { toast } from 'sonner';
import { Textarea } from '@/presentation/components/ui/textarea';
import { BookingType } from '@/domain/booking/BookingType';
import { Combobox } from '@/presentation/components/custom/combobox';
import { useLaboratoryRoomSelect } from '../laboratory-room/hooks/useLaboratoryRoomSelect';
import { useDepedencies } from '@/presentation/contexts/useDepedencies';
import { useBooking } from './context/BookingContext';
import { useBookingForm } from './hooks/useBookingForm';

const BookingCreatePage = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null)

  useGSAP(() => {
    if (!sectionRef.current) return

    const tl = gsap.timeline()
    tl.fromTo(sectionRef.current,
      {
        opacity: 0,
        y: 100
      },
      {
        opacity: 1,
        y: 0,
        duration: 1
      },
    )
  }, [])

  const { user } = useAuth()
  const { laboratoryRooms } = useLaboratoryRoomSelect()
  const { bookingService } = useDepedencies()
  const { isHasDraftBooking } = useBooking()

  const {
    formData,
    setFormData,
    handleChange,
    handleDateTimeChange
  } = useBookingForm()

  const { errors, processErrors } = useValidationErrors()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isHasDraftBooking) {
      navigate('/404')
    }
  }, [isHasDraftBooking])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await bookingService.createData(formData);
      toast.success(res.message)
      if (res.data?.bookingType === BookingType.Room) {
        navigate(`/panel/peminjaman/`)
      } else {
        navigate(`/panel/peminjaman/${res.data?.id}/manage`)
      }
    } catch (e) {
      const error = e as ApiResponse
      toast.error(error.message)
      if (error.errors) {
        processErrors(error.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Header title="Menu Peminjaman" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0" ref={sectionRef}>
        <Card>
          <CardHeader>
            <CardTitle>Ajukan Peminjaman</CardTitle>
            <CardAction>
              <NavLink to={'/panel/peminjaman'}>
                <Button>
                  Kembali
                  <ArrowLeft />
                </Button>
              </NavLink>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form className='grid md:grid-cols-2 gap-x-5 gap-y-4' onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <Label>
                  Nama Peminjam <span className="text-red-500">*</span>
                </Label>
                <Input
                  type='text'
                  value={user?.name}
                  placeholder='User'
                  disabled={true}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>
                  Nomor Identitas Peminjam <span className="text-red-500">*</span>
                </Label>
                <Input
                  type='text'
                  value={user?.identityNum}
                  placeholder='-'
                  disabled={true}
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label>
                  Program Studi <span className="text-red-500">*</span>
                </Label>
                <Input
                  type='text'
                  value={user?.studyProgram?.name}
                  placeholder='-'
                  disabled={true}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor='phone_number'>
                  Nomor Hp (Whatsapp) <span className="text-red-500">*</span>
                </Label>
                <div>
                  <Input
                    type='text'
                    id='phone_number'
                    name='phone_number'
                    onChange={handleChange}
                    placeholder='Nomor Hp'
                  />
                  {errors['phone_number'] && (
                    <p className="mt-1 text-xs italic text-red-500">{errors['phone_number']}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor='purpose'>
                  Tujuan Peminjaman <span className="text-red-500">*</span>
                </Label>
                <div>
                  <Input
                    type='text'
                    id='purpose'
                    name='purpose'
                    onChange={handleChange}
                    placeholder='Tujuan Peminjaman'
                  />
                  {errors['purpose'] && (
                    <p className="mt-1 text-xs italic text-red-500">{errors['purpose']}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor='activity_name'>
                  Judul Proyek / Penelitian <span className="text-red-500">*</span>
                </Label>
                <div>
                  <Input
                    type='text'
                    id='activity_name'
                    name='activity_name'
                    onChange={handleChange}
                    placeholder='Judul Proyek / Penelitian'
                  />
                  {errors['activity_name'] && (
                    <p className="mt-1 text-xs italic text-red-500">{errors['activity_name']}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor='supporting_file'>
                  Surat Pengantar / Berkas Pendukung
                </Label>
                <div>
                  <Input
                    type='file'
                    id='supporting_file'
                    name='supporting_file'
                    onChange={handleChange}
                  />
                  {errors['supporting_file'] && (
                    <p className="mt-1 text-xs italic text-red-500">{errors['supporting_file']}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor='supervisor'>
                  Dosen Pembimbing
                </Label>
                <div>
                  <Input
                    type='text'
                    id='supervisor'
                    name='supervisor'
                    onChange={handleChange}
                    placeholder='Dosen Pembimbing'
                  />
                  {errors['supervisor'] && (
                    <p className="mt-1 text-xs italic text-red-500">{errors['supervisor']}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor='supervisor_email'>
                  Email Dosen Pembimbing
                </Label>
                <div>
                  <Input
                    type='text'
                    id='supervisor_email'
                    name='supervisor_email'
                    onChange={handleChange}
                    placeholder='Email Dosen Pembimbing'
                  />
                  {errors['supervisor_email'] && (
                    <p className="mt-1 text-xs italic text-red-500">{errors['supervisor_email']}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label className="">Tanggal & Waktu</Label>
                <div>
                  <BookingDateTimeRangePicker
                    startDateTime={formData.start_time}
                    endDateTime={formData.end_time}
                    onChange={handleDateTimeChange} />
                  {errors['end_time'] && (
                    <p className="mt-1 text-xs italic text-red-500">{errors['end_time']}</p>
                  )}
                </div>
              </div>
              {(formData['booking_type'] === 'room' || formData['booking_type'] === 'room_n_equipment') && (
                <div className="flex flex-col gap-2 md:col-span-2">
                  <Label htmlFor='ruangan_laboratorium_id'>
                    Ruangan <span className="text-red-500">*</span>
                  </Label>
                  <div>
                    <Combobox
                      options={laboratoryRooms}
                      value={formData.laboratory_room_id?.toString() || ''}
                      onChange={(val) => {
                        setFormData((prev) => ({
                          ...prev,
                          laboratory_room_id: val ? Number(val) : null
                        }))
                      }}
                      placeholder="Pilih ruangan"
                      optionLabelKey='name'
                      optionValueKey='id'
                    />
                    {errors['laboratory_room_id'] && (
                      <p className="mt-1 text-xs italic text-red-500">{errors['laboratory_room_id']}</p>
                    )}
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-2 ">
                <Label htmlFor='booing_type'>
                  Jenis Peminjaman <span className="text-red-500">*</span>
                </Label>
                <div>
                  <Select
                    name='booking_type'
                    value={formData['booking_type']}
                    onValueChange={(value) =>
                      handleChange({
                        target: {
                          name: 'booking_type',
                          value: value
                        }
                      } as React.ChangeEvent<HTMLSelectElement>)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Jenis Peminjaman" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Jenis Peminjaman</SelectLabel>
                        <SelectItem value='room'>Peminjaman Ruangan</SelectItem>
                        <SelectItem value='room_n_equipment'>Peminjaman Ruangan dan Alat</SelectItem>
                        <SelectItem value='equipment'>Peminjaman Alat</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors['booking_type'] && (
                    <p className="mt-1 text-xs italic text-red-500">{errors['booking_type']}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor='total_participant'>
                  Jumlah Partisipan <span className="text-red-500">*</span>
                </Label>
                <div>
                  <Input
                    type='number'
                    id='total_participant'
                    name='total_participant'
                    onChange={handleChange}
                    placeholder='0'
                  />
                  {errors['total_participant'] && (
                    <p className="mt-1 text-xs italic text-red-500">{errors['total_participant']}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor='testing_type'>
                  List Partisipan
                </Label>
                <div>
                  <Textarea
                    name="participant_list"
                    id="participant_list"
                    onChange={handleChange}
                    placeholder='Keterangan'
                  >
                  </Textarea>
                  {errors['participant_list'] && (
                    <p className="mt-1 text-xs italic text-red-500">{errors['participant_list']}</p>
                  )}
                </div>
              </div>

              <div className='md:col-span-2 flex justify-end'>
                <Button type='submit' disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : 'Simpan'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default BookingCreatePage
