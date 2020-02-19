import {Component, OnInit} from '@angular/core';
import {CPU} from './CPU';
import {instructionList} from './opcodes';
import {Assembler} from './Assembler';
import {changedRam} from './transport_instructions';
import {faAngleLeft, faAngleRight} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;

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

  asThreeDigitHex(num: number) {
    return ('000' + (num.toString(16))).substr(-3).toUpperCase();
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

  public pageLeft() {
    this.ramViewOff -= 0x100;
    if (this.ramViewOff < 0) {
      this.ramViewOff = 0;
    }
  }
  public pageRight() {
    this.ramViewOff += 0x100;
    if (this.ramViewOff > 0xFF00) {
      this.ramViewOff = 0;
    }
  }

  public fromCharCode(c): string {
    return String.fromCharCode(c);
  }
}
