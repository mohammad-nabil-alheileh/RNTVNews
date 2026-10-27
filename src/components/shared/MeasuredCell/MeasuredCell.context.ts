import { createContext } from 'react';
import { RecordCell } from './MeasuredCell.types';

export const MeasuredCellContext = createContext<RecordCell>(() => {});
