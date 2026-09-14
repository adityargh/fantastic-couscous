import type { APIRoute } from 'astro';
import { CONTACT, FALLBACK_SITE, profileOf } from '../site';

/**
 * Ekspor JSON Resume (jsonresume.org/schema) dari sumber data yang sama.
 * Menjamin portabilitas: kalau situs ini dipensiunkan, isinya tetap dapat
 * dibaca alat lain tanpa penulisan ulang. Mitigasi risiko R7.
 */
export const GET: APIRoute = ({ site }) => {
  const p = profileOf('en');
  const body = {
    $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    basics: {
      name: p.name,
      label: p.headline,
      summary: p.positioning,
      url: (site ?? FALLBACK_SITE).href,
      location: { city: p.location },
      keywords: p.disciplines,
      profiles: CONTACT.social.map((s) => ({ network: s.label, url: s.url })),
    },
    work: p.experience.map((r) => ({
      name: r.company,
      position: r.title,
      location: r.location,
      startDate: r.start,
      ...(r.end === 'present' ? {} : { endDate: r.end }),
      summary: r.summary,
      highlights: r.achievements,
    })),
    education: p.education
      .filter((e) => e.kind === 'degree')
      .map((e) => ({ institution: e.institution, studyType: e.name, endDate: e.year })),
    certificates: p.education
      .filter((e) => e.kind === 'certification')
      .map((e) => ({ name: e.name, issuer: e.institution, date: e.year, url: e.url || undefined })),
    skills: p.skills.map((g) => ({
      name: g.domain,
      keywords: g.items.map((i) => i.name),
    })),
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
