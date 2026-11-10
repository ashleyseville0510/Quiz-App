import { afterEach, expect, test, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import App, { getQuestionsForLevel } from './App';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  window.localStorage.clear();
});

test('keeps a five-question level, records missed levels, and lets the player retry', () => {
  vi.useFakeTimers();
  window.localStorage.clear();
  render(<App />);
  const questions = getQuestionsForLevel(1);

  fireEvent.change(screen.getByLabelText(/your player name/i), { target: { value: 'Alex' } });
  fireEvent.click(screen.getByRole('button', { name: /start level 1/i }));
  expect(screen.getByRole('timer').textContent).toBe('01:30');
  expect(screen.getByText(/alex/i)).toBeDefined();
  act(() => vi.advanceTimersByTime(5000));
  expect(screen.getByRole('timer').textContent).toBe('01:25');

  expect(screen.getByRole('heading', { name: questions[0].prompt })).toBeDefined();
  fireEvent.click(screen.getByRole('button', { name: new RegExp(`${questions[0].correct}$`) }));
  expect(screen.getByText(/right!/i)).toBeDefined();
  expect(screen.getAllByText('100', { exact: true }).length).toBe(2);
  fireEvent.click(screen.getByRole('button', { name: /next/i }));

  expect(screen.getByRole('heading', { name: questions[1].prompt })).toBeDefined();
  const wrongAnswer = questions[1].answers.find((answer) => answer !== questions[1].correct);
  fireEvent.click(screen.getByRole('button', { name: new RegExp(`${wrongAnswer}$`) }));
  expect(screen.getByText(/not quite/i)).toBeDefined();
  expect(screen.getAllByText('100', { exact: true }).length).toBe(2);
  expect(screen.getByText(/level 1 · easy/i, { selector: '.player-level span' })).toBeDefined();

  for (const question of questions.slice(2)) {
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByRole('heading', { name: question.prompt })).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: new RegExp(`${question.correct}$`) }));
  }
  fireEvent.click(screen.getByRole('button', { name: /next/i }));

  expect(screen.getByRole('heading', { name: /try this level again, alex/i })).toBeDefined();
  expect(screen.getByText(/level 1 is marked for retry/i)).toBeDefined();
  fireEvent.click(screen.getByRole('button', { name: /choose a level/i }));
  expect(screen.getByRole('option', { name: /level 1 · retry/i })).toBeDefined();
  expect(screen.getByRole('option', { name: /level 2 · selected/i }).disabled).toBe(false);
  fireEvent.change(screen.getByRole('combobox', { name: /choose level/i }), { target: { value: '1' } });
  fireEvent.click(screen.getByRole('button', { name: /start level 1/i }));
  expect(screen.getByRole('heading', { name: questions[0].prompt })).toBeDefined();
  expect(screen.getByText(/level 1 · easy/i, { selector: '.player-level span' })).toBeDefined();
  expect(screen.getByRole('timer').textContent).toBe('01:30');
});

test.each([
  { level: 1, difficulty: 'easy' },
  { level: 30, difficulty: 'easy' },
  { level: 31, difficulty: 'medium' },
  { level: 60, difficulty: 'medium' },
  { level: 61, difficulty: 'hard' },
  { level: 100, difficulty: 'hard' },
])('uses the $difficulty question set at level $level', ({ level, difficulty }) => {
  window.localStorage.setItem('littleQuizUnlockedLevel', String(level));
  window.localStorage.setItem('littleQuizSelectedLevel', String(level));
  render(<App />);

  fireEvent.change(screen.getByLabelText(/your player name/i), { target: { value: 'Riley' } });
  fireEvent.click(screen.getByRole('button', { name: new RegExp(`start level ${level}`, 'i') }));

  expect(screen.getByText(new RegExp(`QUESTION 01 / 05 · ${difficulty.toUpperCase()} ROUND`), { selector: '.eyebrow' })).toBeDefined();
  expect(screen.getByText(new RegExp(`LEVEL ${level} · ${difficulty.toUpperCase()}`), { selector: '.player-level span' })).toBeDefined();
  expect(screen.getByRole('heading', { name: getQuestionsForLevel(level)[0].prompt })).toBeDefined();
});

test('gives every level five unique questions with no repeats across levels', () => {
  const questionsByLevel = Array.from({ length: 100 }, (_, index) => getQuestionsForLevel(index + 1));
  const allPrompts = questionsByLevel.flat().map((question) => question.prompt);

  expect(questionsByLevel.every((questions) => questions.length === 5)).toBe(true);
  expect(allPrompts.length).toBe(500);
  expect(new Set(allPrompts).size).toBe(500);
  expect(questionsByLevel.every((questions) => new Set(questions.map((question) => question.category)).size === 5)).toBe(true);
});
