import ReactDOM from "react-dom"
import App from "./App"
import { ChakraProvider } from "@chakra-ui/react"
import theme from "./styles"

const app = document.getElementById("app")

ReactDOM.render(
    <ChakraProvider theme={theme}>
        <App />
    </ChakraProvider>,
    app
)
