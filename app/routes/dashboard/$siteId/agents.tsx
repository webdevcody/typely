import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/$siteId/agents')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/agents"!</div>
}
