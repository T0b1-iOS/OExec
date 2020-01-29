import {Component, OnInit} from '@angular/core';
import {CPU} from './CPU';
import {instructionList} from './opcodes';
import {Assembler} from './Assembler';
import { FormsModule } from '@angular/forms';
import {changedRam} from './transport_instructions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  name = 'Tobi';
  ramViewOff = 0;
  numbers: Array<number>;

  cpu = new CPU();
  assembler = new Assembler();

  lines: Array<string>;
  lineMapping: Map<number, number>;
  displayLines = false;

  constructor() {
    this.numbers = Array(16).fill(0).map((x, i) => i);
  }

  ngOnInit() { }

  shiftLeft(num: number, shift): number {
    // tslint:disable-next-line:no-bitwise
    return (num << shift);
  }

  asFourDigitHex(num: number) {
    return ('0000' + (num.toString(16))).substr(-4).toUpperCase();
  }

  assemble(value: string): void {
    const instructions = new Assembler().assemble(value);
    console.log(instructions);
    this.cpu.ram.splice(0, instructions.machineCode.length, ...instructions.machineCode);
    this.lines = instructions.lines;
    this.lineMapping = instructions.lineNumbers;
    this.displayLines = true;
  }

  startEdit(): void {
    this.displayLines = false;
  }

  resetCPU(): void {
    this.cpu.reset();
    this.displayLines = false;
  }

  mapOPToMnemonic(opCode: number): string | null {
    for (const instruction of instructionList) {
      if (instruction.opCode !== opCode) {
        continue;
      }

      return instruction.mnemonic;
    }
    return null;
  }

  br2IsAddress(): boolean {
    for (const instruction of instructionList) {
      if (instruction.opCode === this.cpu.regState.op) {
        return !instruction.immediateOperand;
      }
    }
    return false;
  }

  isRamHighlighted(addr: number): boolean {
    return changedRam.has(addr);
  }

  changeCPUSpeed(event): void {
    // tslint:disable-next-line:radix
    const val = parseInt(event.target.value);
    console.log('Changing CPU Speed: ' + val);
    if (!isNaN(val) && val > 0) {
      this.cpu.speed = val;
    }
  }
}
