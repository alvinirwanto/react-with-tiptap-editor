import PengajuanEvent from '@/pages/event/pengajuan-event/pengajuan-event'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/event/pengajuan-event')({
    component: RouteComponent,
})

function RouteComponent() {
    return <PengajuanEvent />
}
