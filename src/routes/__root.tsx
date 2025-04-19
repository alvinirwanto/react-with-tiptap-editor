import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import Navbar from '@/components/navbar'

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <React.Fragment>
            <Navbar />
            <div className='h-full py-4 px-6 overflow-auto bg-gray-100'>
                <Outlet />
            </div>
        </React.Fragment>
    )
}
