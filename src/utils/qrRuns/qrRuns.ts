import qrcode from 'qrcode-generator';

export interface QrRun {
  row: number;
  column: number;
  length: number;
}

export interface QrMatrix {
  size: number;
  runs: QrRun[];
}

export function qrRuns(text: string): QrMatrix {
  const qr = qrcode(0, 'M');
  qr.addData(text);
  qr.make();
  const size = qr.getModuleCount();
  const runs: QrRun[] = [];
  for (let row = 0; row < size; row++) {
    let start = -1;
    for (let column = 0; column <= size; column++) {
      const dark = column < size && qr.isDark(row, column);
      if (dark && start < 0) {
        start = column;
      } else if (!dark && start >= 0) {
        runs.push({ row, column: start, length: column - start });
        start = -1;
      }
    }
  }
  return { size, runs };
}
