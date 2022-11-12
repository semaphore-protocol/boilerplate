/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
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
