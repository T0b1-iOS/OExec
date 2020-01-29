/* tslint:disable:no-bitwise */
import {RegisterState} from './types';
import {truncateNumKeepSign, updateStatusRegisters} from './helper';

function operationFinish(regState: RegisterState, val: number): void {
  console.log('val: ' + val + ' ' + val.toString(16));
  regState.a = truncateNumKeepSign(val);
  updateStatusRegisters(regState, val);
}

export function ADD(regState: RegisterState, ram: Array<number>): boolean {
  operationFinish(regState, regState.a + ram[regState.br2]);
  return true;
}

export function ADDI(regState: RegisterState, ram: Array<number>): boolean {
  operationFinish(regState, regState.a + regState.br2);
  return true;
}

export function SUB(regState: RegisterState, ram: Array<number>): boolean {
  operationFinish(regState, regState.a - ram[regState.br2]);
  return true;
}

export function SUBI(regState: RegisterState, ram: Array<number>): boolean {
  operationFinish(regState, regState.a - regState.br2);
  return true;
}

export function MUL(regState: RegisterState, ram: Array<number>): boolean {
  operationFinish(regState, regState.a * ram[regState.br2]);
  return true;
}

export function MULI(regState: RegisterState, ram: Array<number>): boolean {
  operationFinish(regState, regState.a * regState.br2);
  return true;
}

export function DIV(regState: RegisterState, ram: Array<number>): boolean {
  operationFinish(regState, (regState.a / ram[regState.br2]) | 0);
  return true;
}

export function DIVI(regState: RegisterState, ram: Array<number>): boolean {
  operationFinish(regState, (regState.a / regState.br2) | 0);
  return true;
}

export function MOD(regState: RegisterState, ram: Array<number>): boolean {
  const divider = ram[regState.br2];
  const div = (regState.a / divider) | 0;

  operationFinish(regState,  regState.a - (div * divider));
  return true;
}

export function MODI(regState: RegisterState, ram: Array<number>): boolean {
  const divider = regState.br2;
  const div = (regState.a / divider) | 0;

  operationFinish(regState,  regState.a - (div * divider));
  return true;
}

function cmpImpl(regState: RegisterState, val: number) {
  regState.z = false;
  regState.n = false;
  if (regState.a === val) {
    regState.z = true;
  } else if (regState.a < val) {
    regState.n = true;
  }
}

export function CMP(regState: RegisterState, ram: Array<number>): boolean {
  cmpImpl(regState, ram[regState.br2]);
  return true;
}

export function CMPI(regState: RegisterState, ram: Array<number>): boolean {
  cmpImpl(regState, regState.br2);
  return true;
}
