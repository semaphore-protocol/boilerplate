import { ChakraProvider } from "@chakra-ui/react"
import type { AppProps } from "next/app"
import theme from "../styles/index"

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider theme={theme}>
            <Component {...pageProps} />
        </ChakraProvider>
    )
}
