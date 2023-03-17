/** @type {import('next').NextConfig} */

const fs = require("fs")
const withPWA = require("next-pwa")

if (!fs.existsSync("./.env")) {
    // eslint-disable-next-line global-require
    require("dotenv").config({ path: "../../.env" })
}

const nextConfig = withPWA({
    dest: "public",
    disable: process.env.NODE_ENV === "development"
})({
    eslint: {
        ignoreDuringBuilds: true
    },
    reactStrictMode: true,
    swcMinify: true,
    env: {
        ETHEREUM_URL: process.env.ETHEREUM_URL,
        ETHEREUM_PRIVATE_KEY: process.env.ETHEREUM_PRIVATE_KEY,
        FEEDBACK_CONTRACT_ADDRESS: process.env.FEEDBACK_CONTRACT_ADDRESS,
        SEMAPHORE_CONTRACT_ADDRESS: process.env.SEMAPHORE_CONTRACT_ADDRESS
    },
    publicRuntimeConfig: {
        ETHEREUM_URL: process.env.ETHEREUM_URL,
        FEEDBACK_CONTRACT_ADDRESS: process.env.FEEDBACK_CONTRACT_ADDRESS,
        SEMAPHORE_CONTRACT_ADDRESS: process.env.SEMAPHORE_CONTRACT_ADDRESS,
        OPENZEPPELIN_AUTOTASK_WEBHOOK: process.env.OPENZEPPELIN_AUTOTASK_WEBHOOK,
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
})

module.exports = nextConfig
