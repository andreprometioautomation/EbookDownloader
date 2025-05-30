// pages/_app.js
import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>

      <Component {...pageProps} />
      
    </ChakraProvider>
  )
}

export default MyApp