import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { createRouter, RouterProvider } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'
import NotFound from './pages/not-found'
import QueryProvider from './context/query-provider'

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => <NotFound />
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  </StrictMode>,
)
