import {ComponentRef, forwardRef} from '@angular/core';

export class RegisterState {
  a = 0;
  ip = 0;
  op = 0;
  br2 = 0;
  z = false;
  n = false;
  v = false;
  executing = true;
}

export type InstructionExecutor =  (regState: RegisterState, ram: Array<number>) => boolean;

export class Instruction {
  constructor(public mnemonic: string,
              public opCode: number,
              public executor: InstructionExecutor,
              public immediateOperand: boolean = true,
              public noOperand: boolean = false) { }
}
