import {RegisterState} from './types';
import {updateStatusRegisters} from './helper';
import {ElementRef} from '@angular/core';

const changedRam: Map<number, boolean> = new Map<number, boolean>();
export { changedRam };

export function LOAD(regState: RegisterState, ram: Array<number>): boolean {
  // tslint:disable-next-line:no-bitwise
  const res = (ram[regState.br2] & 0xFFFF);
  regState.a = res;
  updateStatusRegisters(regState, res);
  return true;
}

export function LOADI(regState: RegisterState, ram: Array<number>): boolean {
  // tslint:disable-next-line:no-bitwise
  const res = (regState.br2 & 0xFFFF);
  regState.a = res;
  updateStatusRegisters(regState, res);
  return true;
}

export function STORE(regState: RegisterState, ram: Array<number>): boolean {
  ram[regState.br2] = regState.a;
  changedRam.set(regState.br2, true);
  setTimeout(() => {
    changedRam.delete(regState.br2);
  }, 1500);
  return true;
}
