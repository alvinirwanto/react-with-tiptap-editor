import React from 'react'
import { Skeleton } from './skeleton'

export default function SkeletonViewPage() {
    return (
        <div className='bg-white w-full h-full relative p-6 rounded-xl'>
            <div className='grid grid-cols-[1fr_2fr] gap-10'>
                <Skeleton className='bg-gray-200 h-[450px] rounded-br-[100px]'></Skeleton>
                <div className='flex flex-col gap-4'>
                    <div className='flex justify-end gap-2'>
                        <Skeleton className='bg-gray-200 w-[150px] h-[40px]'></Skeleton>
                        <Skeleton className='bg-gray-200 w-[150px] h-[40px]'></Skeleton>
                    </div>
                    <Skeleton className='bg-gray-200 w-full h-[70px]'></Skeleton>
                    <Skeleton className='bg-gray-200 w-[40%] h-[30px]'></Skeleton>
                    <Skeleton className='bg-gray-200 w-full h-[250px]'></Skeleton>
                </div>
            </div>
        </div>
    )
}
