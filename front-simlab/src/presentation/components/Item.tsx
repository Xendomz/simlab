import React from 'react'

interface ItemProps {
    title: string,
    value: string | number | undefined | null,
    className?: string
}

const Item: React.FC<ItemProps> = ({ title, value, className }) => {
    return (
        <>
            <div className={`flex flex-col ${className}`}>
                <span className='font-semibold'>{title} </span>
                <span className='text-muted-foreground text-sm break-all'>{value ?? '-'}</span>
                {/* <span className="font-semibold">Keperluan</span>
                <div className='text-muted-foreground'>{booking.purpose}</div> */}
            </div>
        </>
    )
}

export default Item