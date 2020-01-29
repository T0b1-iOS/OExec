/* tslint:disable:no-bitwise */
import {RegisterState} from './types';

export function updateStatusRegisters(regState: RegisterState, result: number) {
  regState.z = ((result & 0xFFFF) === 0);
  regState.n = (((result & 0xFFFF) >> 15) === 1);
  regState.v = (result > 0xFFFF);
}

export function truncateNumKeepSign(val: number): number {
  let tmp = (val & 0xFFFF);
  console.log('tmp: ' + tmp + ' ' + tmp.toString(16));
  if (val < 0) {
    tmp |= (1 << 15);
  }
  console.log('tmp2: ' + tmp + ' ' + tmp.toString(16));
  return tmp;
}
