import './App.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { PagedAdGrid } from './compoments/PagedAdGrid/PagedAdGrid'

const queryClient = new QueryClient({})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PagedAdGrid />
    </QueryClientProvider>
  )
}

export default App
