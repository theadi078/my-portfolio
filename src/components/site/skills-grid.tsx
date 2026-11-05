import type { SkillDoc } from "@/models/Skill";

export function SkillsGrid({ skills }: { skills: SkillDoc[] }) {
  const grouped = new Map<string, SkillDoc[]>();
  for (const skill of skills) {
    const key = skill.category || "Other";
    grouped.set(key, [...(grouped.get(key) ?? []), skill]);
  }

  return (
    <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
      {[...grouped.entries()].map(([category, items]) => (
        <section key={category}>
          <h3 className="border-b border-line pb-2 text-[13px] font-medium text-ink">{category}</h3>
          <ul className="mt-3 space-y-2.5">
            {items.map((skill) => (
              <li key={skill._id} className="flex items-baseline justify-between gap-3">
                <span className="text-[14px] text-muted">
                  {skill.icon ? <span className="mr-1.5">{skill.icon}</span> : null}
                  {skill.name}
                </span>
                {skill.proficiencyLabel ? (
                  <span className="text-[12px] text-faint">{skill.proficiencyLabel}</span>
                ) : typeof skill.proficiency === "number" ? (
                  <span className="text-[12px] text-faint">{skill.proficiency}%</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
