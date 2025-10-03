  import Header from '@/presentation/components/Header'
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'
import React, { useEffect, useRef, useState } from 'react'
import { useBooking } from '@/application/booking/hooks/useBooking';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/presentation/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/application/hooks/useAuth';
import { Label } from '@/presentation/components/ui/label';
import { Input } from '@/presentation/components/ui/input';
import { BookingInputDTO } from '@/application/booking/dto/BookingDTO';
import { useValidationErrors } from '@/presentation/hooks/useValidationError';
import { ApiResponse } from '@/shared/Types';
import BookingDateTimeRangePicker from '@/presentation/components/custom/BookingDateTimePicker';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { toast } from 'sonner';
import { Textarea } from '@/presentation/components/ui/textarea';
// import { useLaboratoryRoom } from '@/application/laboratory-room/hooks/useLaboratoryRoom';
import { BookingType } from '@/domain/booking/BookingType';
import { Combobox } from '@/presentation/components/custom/combobox';

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
  console.log(user);
  

  const {
    laboratoryRoom,
    getData: getLaboratories
  } = useLaboratoryRoom({
    currentPage: 1,
    perPage: 9999,
    searchTerm: '',
    setTotalPages() { },
    setTotalItems() { }
  })

  const {
    create,
    isStillHaveDraftBooking,
    isHasDraftBooking
  } = useBooking({})

  const [formData, setFormData] = useState<BookingInputDTO>({
    phone_number: '',
    purpose: '',
    supporting_file: null,
    activity_name: '',
    supervisor: null,
    supervisor_email: null,
    start_time: undefined,
    end_time: undefined,
    booking_type: '',
    ruangan_laboratorium_id: undefined,
    total_participant: 0,
    participant_list: ''
  })

  const { errors, processErrors } = useValidationErrors()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    isStillHaveDraftBooking()
    getLaboratories()
  }, [])

  useEffect(() => {
    if (isHasDraftBooking) {
      navigate('/404')
    }
  }, [isHasDraftBooking, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'supporting_file' && (e.target as HTMLInputElement).files) {
      setFormData((prev) => ({ ...prev, supporting_file: (e.target as HTMLInputElement).files ? (e.target as HTMLInputElement).files![0] : null }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

  };

  const handleDateTimeChange = (e: { target: { name: "start_time" | "end_time"; value: Date } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await create(formData);
      toast.success(res.message)
      if (res.data?.bookingType === BookingType.Room) {
        navigate(`/panel/peminjaman/`)
      } else {
        navigate(`/panel/peminjaman/${res.data?.id}/manage`)
      }
    } catch (e) {
      const error = e as ApiResponse
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
              <div className="flex flex-col gap-2">
                <Label htmlFor='purpose'>
                  Tujuan Peminjaman <span className="text-red-500">*</span>
                </Label>
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
              <div className="flex flex-col gap-2">
                <Label htmlFor='activity_name'>
                  Judul Proyek / Penelitian <span className="text-red-500">*</span>
                </Label>
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
              <div className="flex flex-col gap-2">
                <Label htmlFor='supporting_file'>
                  Surat Pengantar / Berkas Pendukung <span className="text-red-500">*</span>
                </Label>
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
              <div className="flex flex-col gap-2">
                <Label htmlFor='supervisor'>
                  Dosen Pembimbing
                </Label>
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
              <div className="flex flex-col gap-2">
                <Label htmlFor='supervisor_email'>
                  Email Dosen Pembimbing
                </Label>
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
              <div className="flex flex-col gap-2 md:col-span-2">
                <BookingDateTimeRangePicker
                  startDateTime={formData.start_time}
                  endDateTime={formData.end_time}
                  onChange={handleDateTimeChange} />
                {errors['start_time'] && (
                  <p className="mt-1 text-xs italic text-red-500">{errors['start_time']}</p>
                )}
                {errors['end_time'] && (
                  <p className="mt-1 text-xs italic text-red-500">{errors['end_time']}</p>
                )}
              </div>
              {(formData['booking_type'] === 'room' || formData['booking_type'] === 'room_n_equipment') && (
                <div className="flex flex-col gap-2 md:col-span-2">
                  <Label htmlFor='ruangan_laboratorium_id'>
                    Ruangan <span className="text-red-500">*</span>
                  </Label>
                  <Combobox
                    options={laboratoryRoom}
                    value={formData.ruangan_laboratorium_id?.toString() || ''}
                    onChange={(val) => {
                      setFormData((prev) => ({
                        ...prev,
                        ruangan_laboratorium_id: val ? Number(val) : undefined
                      }))
                    }}
                    placeholder="Pilih ruangan"
                    optionLabelKey='name'
                    optionValueKey='id'
                  />
                  {errors['ruangan_laboratorium_id'] && (
                    <p className="mt-1 text-xs italic text-red-500">{errors['ruangan_laboratorium_id']}</p>
                  )}
                </div>
              )}
              <div className="flex flex-col gap-2 ">
                <Label htmlFor='booing_type'>
                  Jenis Peminjaman <span className="text-red-500">*</span>
                </Label>
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
              <div className="flex flex-col gap-2">
                <Label htmlFor='total_participant'>
                  Jumlah Partisipan <span className="text-red-500">*</span>
                </Label>
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
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor='testing_type'>
                  List Partisipan
                </Label>
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
