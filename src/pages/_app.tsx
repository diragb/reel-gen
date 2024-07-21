// Typescript:
import type { AppProps } from 'next/app'

// Styles:
import '@/styles/globals.css'
import { Toaster } from '@/components/ui/toaster'

// Functions:
const App = ({ Component, pageProps }: AppProps) => (
  <main>
    <Component {...pageProps} />
    <Toaster />
  </main>
)

// Exports:
export default App
