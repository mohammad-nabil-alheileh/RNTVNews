import { RowFocus } from '../../types/layout';

const ROWS_AHEAD = 5;
const ROWS_BEHIND = 2;

export function isRowInWindow(index: number, { row, movingDown }: RowFocus) {
  const distance = index - row;
  return movingDown
    ? distance >= -ROWS_BEHIND && distance <= ROWS_AHEAD
    : distance >= -ROWS_AHEAD && distance <= ROWS_BEHIND;
}
