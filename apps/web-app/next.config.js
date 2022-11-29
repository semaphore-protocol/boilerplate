/** @type {import('next').NextConfig} */

const fs = require("fs")

if (!fs.existsSync("./.env")) {
    require("dotenv").config({ path: "../../.env" })
}

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    env: {
        ETHEREUM_URL: process.env.ETHEREUM_URL,
        ETHEREUM_PRIVATE_KEY: process.env.ETHEREUM_PRIVATE_KEY,
        CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS
    },
    publicRuntimeConfig: {
        GROUP_ID: process.env.GROUP_ID
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                fs: false
            }
        }

        return config
    }
}

module.exports = nextConfig
