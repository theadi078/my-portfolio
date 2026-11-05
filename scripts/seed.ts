/**
 * OPTIONAL demo seed.
 *
 *   npm run seed            # insert demo rows
 *   npm run seed -- --clear # remove every row this script created
 *
 * Everything inserted here is placeholder content so you can see how the
 * pages look before you have real content. Each demo row is prefixed with
 * "DEMO — " and is inserted as an UNPUBLISHED draft where the model supports
 * it, so nothing fake ever appears on your public site by accident.
 *
 * Delete the demo rows from the admin dashboard (or run with --clear) once
 * you have added your own content. This script never touches the User
 * collection and never overwrites an existing Profile.
 */
import "dotenv/config";
import { config as loadEnv } from "dotenv";
import mongoose from "mongoose";

loadEnv({ path: ".env.local", override: true });

import { Project } from "../src/models/Project";
import { Skill } from "../src/models/Skill";
import { Experience } from "../src/models/Experience";
import { Education } from "../src/models/Education";
import { Certification } from "../src/models/Certification";
import { Achievement } from "../src/models/Achievement";
import { TimelineEvent } from "../src/models/TimelineEvent";
import { Learning } from "../src/models/Learning";
import { Profile } from "../src/models/Profile";

const DEMO = "DEMO — ";
const clear = process.argv.includes("--clear");

async function main() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    console.error("\n  ✗ MONGODB_URI is not set. Copy .env.example to .env.local first.\n");
    process.exit(1);
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);

  if (clear) {
    const demoFilter = { $or: [{ title: /^DEMO — / }, { name: /^DEMO — / }, { topic: /^DEMO — / }, { company: /^DEMO — / }, { institution: /^DEMO — / }] };
    const results = await Promise.all(
      [Project, Skill, Experience, Education, Certification, Achievement, TimelineEvent, Learning].map((model) =>
        model.deleteMany(demoFilter as never),
      ),
    );
    const removed = results.reduce((total, r) => total + (r.deletedCount ?? 0), 0);
    console.log(`\n  ✓ Removed ${removed} demo row(s).\n`);
    await mongoose.disconnect();
    return;
  }

  // A Profile document must exist for the site to render. We only create an
  // empty shell if there is none — an existing profile is left untouched.
  const profile = await Profile.findOne();
  if (!profile) {
    await Profile.create({
      fullName: "Your Name",
      headline: "Software Engineer | Full Stack Developer",
      shortIntro: "Replace this introduction from Admin → Profile.",
      availabilityStatus: "Building • Learning • Growing",
      stats: [{ label: "Projects", value: "—" }],
    });
    console.log("  • Created an empty Profile document (edit it at /admin/profile).");
  } else {
    console.log("  • Profile already exists — left unchanged.");
  }

  await Project.create({
    title: `${DEMO}Task Board`,
    slug: "demo-task-board",
    shortDescription: "Placeholder project used to demonstrate the project layout. Delete it once you add your own.",
    fullDescription:
      "This is sample content. Every field you see here is editable from Admin → Projects, including the gallery, features and the problem/solution sections.",
    category: "Full Stack",
    technologies: ["Next.js", "TypeScript", "MongoDB"],
    features: ["Sample feature one", "Sample feature two"],
    problem: "Describe the problem your project solves.",
    solution: "Describe how you solved it.",
    architecture: "Describe the architecture.",
    process: "Describe how you built it.",
    challenges: "Describe the hard parts.",
    learnings: "Describe what you learned.",
    projectDate: new Date(),
    status: "Completed",
    featured: false,
    published: false, // draft — will not appear publicly
  });

  await Skill.insertMany(
    ["TypeScript", "React", "Node.js"].map((name, i) => ({
      name: `${DEMO}${name}`,
      category: i === 2 ? "Backend" : "Frontend",
      description: "Placeholder skill. Set your own proficiency label from the admin dashboard.",
      order: i,
      published: false,
    })),
  );

  await Experience.create({
    company: `${DEMO}Example Company`,
    position: "Software Engineer",
    employmentType: "Full-time",
    location: "Remote",
    startDate: new Date(),
    current: true,
    description: "Placeholder experience entry.",
    responsibilities: ["Sample responsibility"],
    technologies: ["TypeScript"],
    published: false,
  });

  await Education.create({
    institution: `${DEMO}Your College`,
    degree: "Your Degree",
    level: "Degree",
    fieldOfStudy: "Your Field",
    score: "—",
    scoreLabel: "CGPA",
    description: "Placeholder education entry.",
    published: false,
  });

  await Certification.create({
    name: `${DEMO}Sample Certification`,
    issuer: "Issuing Organisation",
    issueDate: new Date(),
    description: "Placeholder certification entry.",
    published: false,
  });

  await Achievement.create({
    title: `${DEMO}Sample Achievement`,
    description: "Placeholder achievement entry. Replace it with your own.",
    category: "Other",
    date: new Date(),
    published: false,
  });

  await TimelineEvent.insertMany([
    { title: `${DEMO}Started my degree`, kind: "Education", dateLabel: "Year 1", order: 0, published: false },
    { title: `${DEMO}First internship`, kind: "Internship", dateLabel: "Year 3", order: 1, published: false },
  ]);

  await Learning.create({
    topic: `${DEMO}System Design`,
    description: "Placeholder learning entry.",
    status: "Learning",
    published: false,
  });

  console.log(
    "\n  ✓ Demo rows inserted as unpublished drafts." +
      "\n    Open /admin/dashboard to edit or delete them, or run: npm run seed -- --clear\n",
  );

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("\n  ✗ Seeding failed:\n", error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
