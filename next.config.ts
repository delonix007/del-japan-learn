import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Better error handling & stability
  onDemandEntries: {
    // Keep pages in memory longer
    maxInactiveAge: 60 * 1000,
    // Limit number of pages kept in memory
    pagesBufferLength: 2,
  },
};

export default nextConfig;
