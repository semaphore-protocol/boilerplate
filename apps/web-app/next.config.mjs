/** @type {import('next').NextConfig} */

import withPWA from "next-pwa"
import fs from "fs"

if (!fs.existsSync("./.env")) {
    // eslint-disable-next-line global-require
    require("dotenv").config({ path: "../../.env" })
}

const nextConfig = withPWA({
    dest: "public",
    disable: process.env.NODE_ENV === "development"
})({
    env: {
        INFURA_API_KEY: process.env.INFURA_API_KEY,
        ETHEREUM_PRIVATE_KEY: process.env.ETHEREUM_PRIVATE_KEY
    }
})

export default nextConfig
