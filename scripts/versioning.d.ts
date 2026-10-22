export const CHANGELOG_PLACEHOLDER: string;
export function parseVersion(version: string): [number, number, number];
export function bumpVersion(version: string, kind: string): string;
export function versionCode(version: string): number;
export function apkName(version: string): string;
export function latestChangelogVersion(text: string): string | null;
export function changelogProblems(text: string, version: string): string[];
export function addChangelogEntry(text: string, version: string, date: string): string;
