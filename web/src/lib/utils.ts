import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Snippet } from 'svelte';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(...inputs));
}

export type WithoutChildrenOrChild<T> = Omit<T, 'children' | 'child'>;
