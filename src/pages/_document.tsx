// Components:
import StyledComponentsRegistry from '@/lib/registry'
import {
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document'

// Functions:
const Document = () => (
  <Html lang='en'>
    <Head />
    <body>
      <StyledComponentsRegistry>
        <Main />
        <NextScript />
      </StyledComponentsRegistry>
    </body>
  </Html>
)

// Exports:
export default Document
