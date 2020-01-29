import {Instruction, InstructionExecutor, RegisterState} from './types';
import * as TI from './transport_instructions';
import * as AI from './arithmetic_instructions';
import * as CI from './control_instructions';

const instructionList: Array<Instruction> = [
  new Instruction('LOAD', 1, TI.LOAD, false),
  new Instruction('LOADI', 2, TI.LOADI),
  new Instruction('STORE', 23, TI.STORE, false),

  new Instruction( 'ADD', 3, AI.ADD, false),
  new Instruction( 'ADDI', 4, AI.ADDI),
  new Instruction( 'SUB', 5, AI.SUB, false),
  new Instruction( 'SUBI', 6, AI.SUBI),
  new Instruction( 'MUL', 7, AI.MUL, false),
  new Instruction( 'MULI', 8, AI.MULI),
  new Instruction( 'DIV', 9, AI.DIV, false),
  new Instruction( 'DIVI', 10, AI.DIVI),
  new Instruction( 'MOD', 11, AI.MOD, false),
  new Instruction( 'MODI', 12, AI.MODI),
  new Instruction( 'CMP', 13, AI.CMP, false),
  new Instruction( 'CMPI', 14, AI.CMPI),

  new Instruction( 'JMP', 15, CI.JMP, false),
  new Instruction( 'JMPZ', 16, CI.JMPZ, false),
  new Instruction( 'JMPNZ', 17, CI.JMPNZ, false),
  new Instruction( 'JMPN', 18, CI.JMPN, false),
  new Instruction( 'JMPNN', 19, CI.JMPNN, false),
  new Instruction( 'JMPP', 20, CI.JMPP, false),
  new Instruction( 'JMPNP', 21, CI.JMPNP, false),

  new Instruction( 'HOLD', 22, emptyExecutor, false, true)
];

export { instructionList };

function emptyExecutor(regState: RegisterState, ram: Array<number>): boolean {
  // regState.a = 0x1337;
  // ram[0x1F] = 0x1337;
  console.log('executor ran');
  return false;
}

