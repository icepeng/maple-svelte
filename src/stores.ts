import { writable } from 'svelte/store';
import type { SkillData } from './skill-data';

export const layers = writable<SkillData[]>([]);
