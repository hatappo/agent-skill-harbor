import { z } from 'zod';

export const labelIntentValues = ['neutral', 'info', 'success', 'warn', 'danger'] as const;

export const labelIntentSchema = z.enum(labelIntentValues);

export type LabelIntent = z.infer<typeof labelIntentSchema>;
