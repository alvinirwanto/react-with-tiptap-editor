import TitlePage from '@/components/title-page'
import React from 'react'
import { PiUsersFill } from 'react-icons/pi';


interface LayoutPengajuanEventProps {
    title: string;
    prefix?: React.ReactNode
    children: React.ReactNode
}

export default function LayoutPengajuanEvent({
    title,
    prefix,
    children
}: Readonly<LayoutPengajuanEventProps>) {
    return (
        <div className='flex flex-col space-y-2'>
            <TitlePage
                title={title}
                tag="h2"
                size="md"
                prefix={
                    prefix ? <>{prefix}</> : <PiUsersFill className='text-3xl text-blue-pnm' />
                }
            />
            <div className='h-[calc(100vh-210px)] overflow-auto px-1 pb-4'>
                {children}
            </div>
        </div>
    )
}
