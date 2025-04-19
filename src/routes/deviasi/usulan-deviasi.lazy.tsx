import UsulanDeviasi from '@/pages/deviasi/usulan-deviasi'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/deviasi/usulan-deviasi')({
    component: RouteComponent,
})

function RouteComponent() {
    return <UsulanDeviasi />
}
