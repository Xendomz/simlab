import React from 'react'

interface ItemProps {
    title: string | number | undefined | null,
    value: string | number | undefined | null,
    className?: string
}

const Item: React.FC<ItemProps> = ({ title, value, className }) => {
    return (
        <>
            <div className={`flex flex-col ${className}`}>
                <span className='font-semibold'>{title ?? '-'} </span>
                <span className='text-muted-foreground text-sm break-all'>{value ?? '-'}</span>
            </div>
        </>
    )
}

export default Item