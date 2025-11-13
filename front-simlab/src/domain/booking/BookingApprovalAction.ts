export enum BookingApprovalAction {
    RequestBooking = 'request_booking',
    VerifiedByHead = 'verified_by_head',
    VerifiedByLaboran = 'verified_by_laboran',
    ReturnedByRequestor = 'returned_by_requestor',
    ReturnConfirmedByLaboran = 'return_confirmed_by_laboran',
    Finish = 'finish'
}