import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import { LocationProvider } from '@/components/location/location-provider'
import { ThemeProvider } from '@/components/theme/theme-provider'

const queryClient = new QueryClient()

const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <LocationProvider>
          <hr />
          <Outlet />
          <TanStackRouterDevtools />
          <ReactQueryDevtools initialIsOpen={false} />
        </LocationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  ),
})

export { Route }
