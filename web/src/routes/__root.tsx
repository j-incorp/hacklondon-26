import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import { LocationProvider } from '@/components/location/location-provider'
import { ThemeProvider } from '@/components/theme/theme-provider'

const queryClient = new QueryClient()

const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <LocationProvider>
          <div className="p-2 flex gap-2">
            <Link to="/" className="[&.active]:font-bold">
              Home
            </Link>{' '}
            <Link to="/about" className="[&.active]:font-bold">
              About
            </Link>
            <Link to="/game" className="[&.active]:font-bold">
              Game
            </Link>
          </div>
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
