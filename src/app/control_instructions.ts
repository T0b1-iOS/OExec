import {RegisterState} from './types';
import {updateStatusRegisters} from './helper';

export function JMP(regState: RegisterState, ram: Array<number>): boolean {
  regState.ip = regState.br2;
  return true;
}

export function JMPZ(regState: RegisterState, ram: Array<number>): boolean {
  if (regState.z) {
    regState.ip = regState.br2;
  }
  return true;
}

export function JMPNZ(regState: RegisterState, ram: Array<number>): boolean {
  if (!regState.z) {
    regState.ip = regState.br2;
  }
  return true;
}

export function JMPN(regState: RegisterState, ram: Array<number>): boolean {
  if (regState.n) {
    regState.ip = regState.br2;
  }
  return true;
}

export function JMPNN(regState: RegisterState, ram: Array<number>): boolean {
  if (!regState.n) {
    regState.ip = regState.br2;
  }
  return true;
}

export function JMPP(regState: RegisterState, ram: Array<number>): boolean {
  if (!regState.z && !regState.n) {
    regState.ip = regState.br2;
  }
  return true;
}

export function JMPNP(regState: RegisterState, ram: Array<number>): boolean {
  if (regState.z || regState.n) {
    regState.ip = regState.br2;
  }
  return true;
}
