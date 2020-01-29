import {instructionList} from './opcodes';
import {InstructionExecutor, RegisterState} from './types';

export class CPU {
  regState = new RegisterState();
  ram: Array<number>;
  skipOperandFetch = false;
  speed = 1; // run cycle in Hz
  curStatus = 'HOLD';
  isReset = false;

  constructor() {
    this.ram = new Array(0xFFFF).fill(0);
    // prevent array size from changing
    if (Object.seal) {
      Object.seal(this.ram);
    }
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async run(step: boolean = false) {
    // tslint:disable-next-line:no-bitwise
    const delay = (1000 / this.speed) >> 0;
    this.isReset = false;
    this.regState.executing = true;
    console.log('Speed: ' + this.speed + ' Delay: ' + delay);
    while (true) {
      if (!this.regState.executing) {
        return;
      }

      console.log('fetch1');
      this.curStatus = 'FETCH OP';
      // fetch opcode & operand
      if (this.isReset || !this.fetch(true)) {
        this.regState.executing = false;
        this.curStatus = 'HOLD';
        return;
      }
      await this.delay(delay);
      console.log('fetch2');
      this.curStatus = 'FETCH OP2';
      if (this.isReset || !this.fetch(false)) {
        this.regState.executing = false;
        this.curStatus = 'HOLD';
        return;
      }
      await this.delay(delay);
      console.log('decode');
      this.curStatus = 'DECODE';
      const decodeResult = this.decode();
      if (this.isReset || decodeResult === false) {
        this.regState.executing = false;
        this.curStatus = 'HOLD';
        return;
      }
      await this.delay(delay);
      console.log('execute');
      this.curStatus = 'EXECUTE';
      if (this.isReset || (decodeResult as InstructionExecutor)(this.regState, this.ram) === false) {
        this.regState.executing = false;
        this.curStatus = 'HOLD';
      }

      if (step) {
        this.curStatus = 'BREAK';
        break;
      }

      await this.delay(delay);
      if (this.isReset) {
        this.regState.executing = false;
        this.curStatus = 'HOLD';
        return;
      }
    }
  }

  fetch(fetchOpCode: boolean): boolean {

    if (fetchOpCode) {
      // TODO: ip bounds check?
      this.regState.op = this.ram[this.regState.ip];
      let opCodeFound = false;
      for (const instruction of instructionList) {
        if (instruction.opCode !== this.regState.op) {
          continue;
        }

        opCodeFound = true;
        this.skipOperandFetch = instruction.noOperand;
      }

      this.regState.ip++;
      return opCodeFound;
    }

    if (!this.skipOperandFetch) {
      this.regState.br2 = this.ram[this.regState.ip];
      this.regState.ip++;
    }

    return true;
  }

  decode(): boolean|InstructionExecutor {
    for (const instruction of instructionList) {
      if (instruction.opCode !== this.regState.op) {
        continue;
      }
      return instruction.executor;
    }

    return false;
  }

  reset(): void {
    this.isReset = true;
    this.regState = new RegisterState();
    this.curStatus = 'HOLD';
    this.skipOperandFetch = false;

    this.ram = this.ram = new Array(0xFFFF).fill(0);
    if (Object.seal) {
      Object.seal(this.ram);
    }
  }
}
