import { big } from '@icehunter/big-package';
import { small } from './small';

export const bigAndSmall = (): string => {
  return [small(), big()].join(' ');
};
