/** @type {import('next').NextConfig} */

const dotenv = require("dotenv")

dotenv.config({ path: "../../.env" })

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    env: {
        ETHEREUM_PRIVATE_KEY: process.env.ETHEREUM_PRIVATE_KEY,
        ETHEREUM_URL: process.env.ETHEREUM_URL,
        CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS
    },
    publicRuntimeConfig: {
        ETHEREUM_CHAIN_ID: process.env.ETHEREUM_CHAIN_ID,
        CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS
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
