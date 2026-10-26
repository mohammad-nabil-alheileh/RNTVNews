/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../src/App';

beforeEach(() => {
  jest.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => [],
  } as Response);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders Home with its empty state when dev.to returns no stories', async () => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });

  const texts = renderer.root
    .findAll(node => typeof node.props.children === 'string')
    .map(node => node.props.children);
  expect(texts).toContain('No stories right now');
});
