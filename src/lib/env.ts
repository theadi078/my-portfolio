/** Central place for every environment variable the app reads. */
function optional(key: string) {
  const v = process.env[key];
  return v && v.trim().length > 0 ? v.trim() : undefined;
}

export const env = {
  mongoUri: optional("MONGODB_URI"),
  authSecret: optional("AUTH_SECRET"),
  cloudinary: {
    cloudName: optional("CLOUDINARY_CLOUD_NAME"),
    apiKey: optional("CLOUDINARY_API_KEY"),
    apiSecret: optional("CLOUDINARY_API_SECRET"),
    folder: optional("CLOUDINARY_FOLDER") ?? "portfolio",
  },
  siteUrl: optional("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000",
  github: { username: optional("GITHUB_USERNAME"), token: optional("GITHUB_TOKEN") },
  mail: {
    resendKey: optional("RESEND_API_KEY"),
    to: optional("CONTACT_NOTIFY_TO"),
    from: optional("CONTACT_NOTIFY_FROM"),
  },
};

export const isCloudinaryConfigured = Boolean(
  env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret,
);
export const isDatabaseConfigured = Boolean(env.mongoUri);
export const isGithubConfigured = Boolean(env.github.username);
