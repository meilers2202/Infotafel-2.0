/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true, // Aktiviert die Unterstützung für await auf oberster Ebene
    };
    return config;
  },
};

export default nextConfig;