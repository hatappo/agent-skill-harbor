import { z } from 'zod';

const collectorSchema = z.object({
	exclude_forks: z.boolean().default(true),
	excluded_repos: z.array(z.string()).default([]),
	include_origin_repos: z.boolean().default(true),
	included_extra_repos: z.array(z.string()).default([]),
	history_limit: z.number().default(50),
});

const skillSchema = z.object({
	fresh_period_days: z.number().default(7),
});

const catalogSchema = z.object({
	skill: skillSchema.default(() => skillSchema.parse({})),
});

export const settingsSchema = z.object({
	collector: collectorSchema.default(() => collectorSchema.parse({})),
	catalog: catalogSchema.default(() => catalogSchema.parse({})),
});

export type SettingsConfig = z.infer<typeof settingsSchema>;
