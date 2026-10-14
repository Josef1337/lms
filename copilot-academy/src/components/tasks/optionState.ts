// Answer states of one option in a choice task or a question set. A pick
// stays neutral until it is checked; only then does an option turn green
// (right) or red (a wrong pick). The card classes live with .option-card in
// main.css, so the final quiz uses the same look.

/** 'missed' is a right option the learner did not pick. */
export type OptionState = 'idle' | 'selected' | 'correct' | 'missed' | 'wrong' | 'muted'

export function optionState(picked: boolean, checked: boolean, correct: boolean): OptionState {
	if (!checked) return picked ? 'selected' : 'idle'
	if (correct) return picked ? 'correct' : 'missed'
	return picked ? 'wrong' : 'muted'
}

export const OPTION_CARD: Record<OptionState, string> = {
	idle: '',
	selected: 'option-card-selected',
	correct: 'option-card-correct',
	missed: 'option-card-correct',
	wrong: 'option-card-wrong',
	muted: 'option-card-muted',
}

/** Read after the option text, since the mark is hidden from screen readers. */
export const OPTION_SR: Partial<Record<OptionState, string>> = {
	correct: 'Doğru seçim.',
	missed: 'Doğru seçenek, seçilmedi.',
	wrong: 'Yanlış seçim.',
}
