import { getLessonRef, getModule } from '@/content'

// Short links such as #excel or #word-2 open a module or a lesson. Some hosts
// (embedded viewers, link shorteners) pass only a plain #anchor through, so a
// presenter can still send people straight to the right place.
const TOKEN = /^\/?([A-Za-z0-9._~-]+)\/?$/

/** The full route path for a short link, or null when it names nothing. */
export function resolveShortLink(path: string): string | null {
	const token = TOKEN.exec(path)?.[1]
	if (!token) return null
	const module = getModule(token)
	if (module) return `/modul/${module.id}`
	const ref = getLessonRef(token)
	if (ref) return `/modul/${ref.module.id}/ders/${ref.lesson.id}`
	return null
}
