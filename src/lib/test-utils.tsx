import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const createWrapper = () => {
    const queryClient = new QueryClient()
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}
