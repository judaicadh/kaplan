// global.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Add your environment variable names here
      NODE_ENV: string;
      PORT: string;
      // ... other environment variables
    }
  }
}

export {};


