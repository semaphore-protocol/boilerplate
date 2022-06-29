import { SystemStyleObject } from "@chakra-ui/react"
import { Styles } from "@chakra-ui/theme-tools"

const styles: Styles = {
    global: (): SystemStyleObject => ({
        body: {
            bg: "white",
            color: "text.700"
        },
        "body, #app": {
            minHeight: "100vh"
        },
        "#app": {
            display: "flex",
            flexDirection: "column"
        }
    })
}

export default styles
