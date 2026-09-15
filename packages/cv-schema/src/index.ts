import { z } from 'zod';

export const TEMPLATE_IDS = ['classic', 'modern', 'minimal'] as const;
export const PROFILE_TYPES = ['tech', 'non-tech'] as const;

export const FONT_OPTIONS = [
  { id: 'inter', label: 'Inter', stack: "'Inter', system-ui, sans-serif", source: 'google' },
  { id: 'roboto', label: 'Roboto', stack: "'Roboto', system-ui, sans-serif", source: 'google' },
  { id: 'lato', label: 'Lato', stack: "'Lato', system-ui, sans-serif", source: 'google' },
  {
    id: 'source-sans',
    label: 'Source Sans 3',
    stack: "'Source Sans 3', system-ui, sans-serif",
    source: 'google',
  },
  {
    id: 'merriweather',
    label: 'Merriweather',
    stack: "'Merriweather', Georgia, serif",
    source: 'google',
  },
  {
    id: 'source-serif',
    label: 'Source Serif 4',
    stack: "'Source Serif 4', Georgia, serif",
    source: 'google',
  },
  { id: 'times', label: 'Times New Roman', stack: "'Times New Roman', Times, serif", source: 'system' },
  { id: 'calibri', label: 'Calibri', stack: "Calibri, 'Trebuchet MS', sans-serif", source: 'system' },
] as const;

export type FontId = (typeof FONT_OPTIONS)[number]['id'];

const linkSchema = z.object({
  label: z.string().min(1).max(60),
  url: z.string().url(),
});

const dateRangeSchema = z.object({
  start: z.string().regex(/^\d{4}-\d{2}$/, 'Format YYYY-MM').optional().or(z.literal('')),
  end: z
    .union([z.string().regex(/^\d{4}-\d{2}$/), z.literal('current'), z.literal('')])
    .optional(),
});

export const experienceSchema = dateRangeSchema.extend({
  jobTitle: z.string().min(1),
  company: z.string().min(1),
  location: z.string().optional().default(''),
  bullets: z.array(z.string().min(1)).default([]),
});

export const educationSchema = dateRangeSchema.extend({
  degree: z.string().min(1),
  institution: z.string().min(1),
  details: z.string().optional().default(''),
});

export const techGroupSchema = z.object({
  category: z.string().min(1),
  items: z.array(z.string().min(1)).default([]),
});

export const languageSchema = z.object({
  name: z.string().min(1),
  level: z.string().min(1),
});

export const referenceSchema = z.object({
  name: z.string().min(1),
  role: z.string().optional().default(''),
  contact: z.string().optional().default(''),
});

export const personalSchema = z.object({
  fullName: z.string().min(1, 'Required'),
  headline: z.string().optional().default(''),
  city: z.string().optional().default(''),
  country: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  email: z.string().email().optional().or(z.literal('')).default(''),
  links: z.array(linkSchema).default([]),
});

export const metaSchema = z.object({
  templateId: z.enum(TEMPLATE_IDS),
  fontId: z.string().default('inter'),
  profileType: z.enum(PROFILE_TYPES),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#1f2937'),
});

export const cvSchema = z.object({
  meta: metaSchema,
  personal: personalSchema,
  profile: z.string().optional().default(''),
  skills: z.array(z.string().min(1)).default([]),
  experience: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  technologies: z.array(techGroupSchema).default([]),
  languages: z.array(languageSchema).default([]),
  abilities: z.array(z.string().min(1)).default([]),
  references: z.array(referenceSchema).default([]),
});

export type CV = z.infer<typeof cvSchema>;
export type Personal = z.infer<typeof personalSchema>;
export type ExperienceItem = z.infer<typeof experienceSchema>;
export type EducationItem = z.infer<typeof educationSchema>;
export type TechGroup = z.infer<typeof techGroupSchema>;
export type LanguageItem = z.infer<typeof languageSchema>;
export type ReferenceItem = z.infer<typeof referenceSchema>;
export type CVMeta = z.infer<typeof metaSchema>;
export type ProfileType = (typeof PROFILE_TYPES)[number];
export type TemplateId = (typeof TEMPLATE_IDS)[number];

export const emptyCV = (): CV =>
  cvSchema.parse({
    meta: { templateId: 'classic', fontId: 'inter', profileType: 'tech', accentColor: '#1f2937' },
    personal: { fullName: '' },
  });
