import Event from '@/pages/event/event'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/event/list')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Event />
}
