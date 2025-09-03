// api/get-key.js
// This is a Vercel Serverless Function that runs on the backend.

export default function handler(request, response) {
  // We can safely access process.env here because this code runs on the server.
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    // If the variable isn't set in Vercel project settings, return an error.
    response.status(500).json({ error: 'The API_KEY environment variable is not set on the server.' });
    return;
  }

  // Securely send the key to the client-side code that requests it.
  response.status(200).json({ apiKey });
}
