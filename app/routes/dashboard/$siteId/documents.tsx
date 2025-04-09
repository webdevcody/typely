import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/$siteId/documents')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/documents"!</div>
}
