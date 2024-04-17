/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: ['images.data.gov.sg']
  },
  transpilePackages: ["@repo/ui"],
  output: 'standalone'
};
