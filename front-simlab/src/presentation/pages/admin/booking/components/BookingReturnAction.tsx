import { BookingView } from '@/application/booking/BookingView'
import { BookingStatus } from '@/domain/booking/BookingStatus'
import { Button } from '@/presentation/components/ui/button';
import React from 'react'
import { NavLink } from 'react-router-dom';

const BookingReturnAction: React.FC<{ booking: BookingView }> = ({ booking }) => {
    if (booking.status === BookingStatus.Draft) {
        return (
            <NavLink to={`/panel/peminjaman/${booking.id}/manage`}>
                <Button size="sm">Lanjutkan</Button>
            </NavLink>
        );
    }
    return (
        <>
            {/* {booking.isRequestorCanReturn && (

            )} */}
            <NavLink to={`/panel/peminjaman/${booking.id}/detail`}>
                <Button variant="secondary" size="sm">Detail</Button>
            </NavLink>
        </>
    )
}

export default BookingReturnAction