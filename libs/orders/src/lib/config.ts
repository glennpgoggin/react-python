const apiUrl = process.env.NX_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error(
    '❌ NX_PUBLIC_API_URL is not set. Please define it in your environment variables.'
  );
}

export const BASE_API_URL = apiUrl;
