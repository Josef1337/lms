// Microsoft 365 product icons, supplied by the project owner and cut from one
// strip at 128x128 with a transparent background. They are trademarks of
// Microsoft Corporation and identify the apps being taught (the footer says
// so); the academy's own brand mark stays separate.
import type { Visual } from '@/types/content'
import copilot from '@/assets/apps/copilot.png'
import excel from '@/assets/apps/excel.png'
import onedrive from '@/assets/apps/onedrive.png'
import onenote from '@/assets/apps/onenote.png'
import outlook from '@/assets/apps/outlook.png'
import powerpoint from '@/assets/apps/powerpoint.png'
import teams from '@/assets/apps/teams.png'
import word from '@/assets/apps/word.png'

export const COPILOT_LOGO = copilot

/** Visuals that stand for a Microsoft 365 app get that app's icon. */
export const APP_LOGOS: Partial<Record<Visual, string>> = {
	copilot,
	chat: copilot,
	word,
	excel,
	powerpoint,
	outlook,
	teams,
}

/** The suite, in the order the icons were supplied. */
export const SUITE_APPS = [
	{ key: 'copilot', label: 'Copilot', src: copilot },
	{ key: 'word', label: 'Word', src: word },
	{ key: 'excel', label: 'Excel', src: excel },
	{ key: 'teams', label: 'Teams', src: teams },
	{ key: 'powerpoint', label: 'PowerPoint', src: powerpoint },
	{ key: 'onenote', label: 'OneNote', src: onenote },
	{ key: 'outlook', label: 'Outlook', src: outlook },
	{ key: 'onedrive', label: 'OneDrive', src: onedrive },
] as const
