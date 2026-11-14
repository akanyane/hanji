import { QueryClient } from '@tanstack/react-query'

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      // Data comes from the local IndexedDB, not the network: `networkMode: 'always'`
      // stops Query from pausing queries while the device is offline.
      // `staleTime: Infinity` because the cache only changes when we write
      // ourselves (and then we invalidate the key explicitly).
      queries: { networkMode: 'always', staleTime: Infinity, retry: false },
      mutations: { networkMode: 'always' },
    },
  })
}
