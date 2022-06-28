import { SystemStyleObject } from "@chakra-ui/react"
import { Styles } from "@chakra-ui/theme-tools"

const styles: Styles = {
    global: (): SystemStyleObject => ({
        body: {
            bg: "blackAlpha.100",
            color: "blackAlpha.900"
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
