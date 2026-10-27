const ALPHABET = 'bcdfghjkmnpqrstvwxz23456789';

export function randomCode(length: number): string {
  const values = new Uint32Array(length);
  const cryptoSource = (
    globalThis as {
      crypto?: { getRandomValues?: (array: Uint32Array) => void };
    }
  ).crypto;
  if (cryptoSource?.getRandomValues) {
    cryptoSource.getRandomValues(values);
  } else {
    for (let i = 0; i < length; i++) {
      values[i] = Math.floor(Math.random() * 0xffffffff);
    }
  }
  return Array.from(values, value => ALPHABET[value % ALPHABET.length]).join(
    '',
  );
}
