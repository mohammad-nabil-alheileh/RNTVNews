/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from '../src/App';
import { loadSession } from '../src/api/sessionStore';

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => [],
  } as Response);
});

afterEach(() => {
  jest.restoreAllMocks();
});

async function renderApp() {
  await loadSession();
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  const texts = renderer.root
    .findAll(node => typeof node.props.children === 'string')
    .map(node => node.props.children);
  await ReactTestRenderer.act(async () => renderer.unmount());
  return texts;
}

test('shows the sign-in screen when no one is signed in', async () => {
  const texts = await renderApp();
  expect(texts).toContain('Sign in to TV News Reader');
  expect(texts).not.toContain('No stories right now');
});

test('renders Home with its empty state when signed in and dev.to returns no stories', async () => {
  await AsyncStorage.setItem(
    'session',
    JSON.stringify({ signedInAt: '2026-10-27T00:00:00.000Z' }),
  );
  const texts = await renderApp();
  expect(texts).toContain('No stories right now');
});
