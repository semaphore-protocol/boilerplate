import { extendTheme } from "@chakra-ui/react"
import styles from "./styles"
import colors from "./colors"
import components from "./components"

const config = {
    colors,
    styles,
    components
}

export default extendTheme(config)
