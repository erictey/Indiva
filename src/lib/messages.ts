import type { MotivationalMessage } from './types';

export const motivationalMessages: MotivationalMessage[] = [
  {
    id: 'm1',
    text: 'Your values are your anchor — let them guide your choices today.',
    type: 'values',
  },
  {
    id: 'm2',
    text: 'Small, steady steps add up to something real. Keep going.',
    type: 'discipline',
  },
  {
    id: 'm3',
    text: "You chose this week's focus for a reason. Trust that choice.",
    type: 'consistency',
  },
  {
    id: 'm4',
    text: 'Showing up matters more than being perfect.',
    type: 'consistency',
  },
  {
    id: 'm5',
    text: 'Even on tough days, your values are still there, quietly shaping how you move.',
    type: 'values',
  },
  {
    id: 'm6',
    text: "Progress doesn't have to be loud to be real.",
    type: 'encouragement',
  },
  {
    id: 'm7',
    text: "You don't need to do it perfectly — just do the next kind thing for yourself.",
    type: 'discipline',
  },
  {
    id: 'm8',
    text: 'This is your week. Be gentle with yourself while you grow.',
    type: 'discipline',
  },
  {
    id: 'm9',
    text: 'The promises you keep to yourself are worth protecting.',
    type: 'consistency',
  },
  {
    id: 'm10',
    text: "You picked something small and meaningful — that's the whole point.",
    type: 'encouragement',
  },
  {
    id: 'm11',
    text: 'When things get heavy, let your values be your compass.',
    type: 'values',
  },
  {
    id: 'm12',
    text: "You don't need more intensity. You just need another honest day.",
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
