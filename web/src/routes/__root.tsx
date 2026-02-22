import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRootRoute, Outlet } from '@tanstack/react-router'

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
        </LocationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  ),
})

export { Route }
