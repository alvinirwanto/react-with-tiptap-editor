import Deviasi from '@/pages/deviasi/deviasi'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/deviasi/list')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Deviasi />
}
