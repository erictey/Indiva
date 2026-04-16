import type { MotivationalMessage } from './types';

export const motivationalMessages: MotivationalMessage[] = [
  {
    id: 'm1',
    text: 'Keep the system honest: values first, mission second.',
    type: 'values',
  },
  {
    id: 'm2',
    text: 'Small disciplined moves compound faster than vague intention.',
    type: 'discipline',
  },
  {
    id: 'm3',
    text: 'Stay with the week you chose.',
    type: 'consistency',
  },
  {
    id: 'm4',
    text: 'Consistency beats renegotiation.',
    type: 'consistency',
  },
  {
    id: 'm5',
    text: 'Your values govern the work, even on the messy days.',
    type: 'values',
  },
  {
    id: 'm6',
    text: 'Progress can be quiet and still be real.',
    type: 'encouragement',
  },
  {
    id: 'm7',
    text: 'Do the next right thing, not the perfect thing.',
    type: 'discipline',
  },
  {
    id: 'm8',
    text: 'This week is for execution, not reset.',
    type: 'discipline',
  },
  {
    id: 'm9',
    text: 'A clear promise to yourself is worth protecting.',
    type: 'consistency',
  },
  {
    id: 'm10',
    text: 'The mission is small on purpose so the follow-through can be real.',
    type: 'encouragement',
  },
  {
    id: 'm11',
    text: 'Let the values decide how you carry the pressure.',
    type: 'values',
  },
  {
    id: 'm12',
    text: 'You do not need more intensity today. You need another honest rep.',
    type: 'encouragement',
  },
];

export function getMessageForDate(dateIso: string) {
  const date = new Date(dateIso);
  const dayIndex = Number.isNaN(date.getTime())
    ? 0
    : Math.floor(date.getTime() / 86_400_000);

  return motivationalMessages[Math.abs(dayIndex) % motivationalMessages.length];
}
