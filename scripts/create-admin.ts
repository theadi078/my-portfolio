/**
 * Creates (or updates) the admin user used to sign in at /admin/login.
 *
 *   npm run create-admin
 *
 * Credentials are read from .env.local:
 *   ADMIN_EMAIL=you@example.com
 *   ADMIN_PASSWORD=a-long-password
 *   ADMIN_NAME=Your Name
 *
 * You can also pass them inline:
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=secret npm run create-admin
 *
 * The script is safe to re-run. If the user already exists it will NOT be
 * overwritten unless you pass --force (which resets the password).
 */
import "dotenv/config";
import { config as loadEnv } from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

loadEnv({ path: ".env.local", override: true });

const force = process.argv.includes("--force");

function fail(message: string): never {
  console.error(`\n  ✗ ${message}\n`);
  process.exit(1);
}

async function main() {
  const uri = process.env.MONGODB_URI?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";
  const name = process.env.ADMIN_NAME?.trim() || "Admin";

  if (!uri) fail("MONGODB_URI is not set. Copy .env.example to .env.local and fill it in.");
  if (!email) fail("ADMIN_EMAIL is not set in .env.local.");
  if (!password) fail("ADMIN_PASSWORD is not set in .env.local.");
  if (password.length < 10) fail("ADMIN_PASSWORD must be at least 10 characters long.");
  if (!process.env.AUTH_SECRET?.trim()) {
    console.warn("  ! AUTH_SECRET is not set yet. Set it before signing in, or sessions will fail.");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);

  // Defined locally so this script does not import anything marked "server-only".
  const UserSchema = new mongoose.Schema(
    {
      name: String,
      email: { type: String, unique: true, lowercase: true, trim: true },
      passwordHash: String,
      role: { type: String, default: "admin" },
      lastLoginAt: Date,
    },
    { timestamps: true, collection: "users" },
  );
  const User = mongoose.models.User ?? mongoose.model("User", UserSchema);

  const existing = await User.findOne({ email });
  const passwordHash = await bcrypt.hash(password, 12);

  if (existing && !force) {
    console.log(
      `\n  • An admin with ${email} already exists (created ${existing.get("createdAt")?.toISOString?.() ?? "earlier"}).` +
        `\n    Nothing was changed. Re-run with --force to reset the password:` +
        `\n      npm run create-admin -- --force\n`,
    );
  } else if (existing) {
    existing.set({ name, passwordHash, role: "admin" });
    await existing.save();
    console.log(`\n  ✓ Password reset for ${email}.\n`);
  } else {
    await User.create({ name, email, passwordHash, role: "admin" });
    console.log(`\n  ✓ Admin created: ${email}\n    Sign in at /admin/login\n`);
  }

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("\n  ✗ Failed to create the admin user:\n", error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
