import {instructionList} from './opcodes';
import {truncateNumKeepSign} from './helper';

export class AssembleOutput {
  // lineNumbers: instruction addr -> line idx
  constructor(public machineCode: Array<number>,
              public lineNumbers: Map<number, number>,
              public lines: Array<string>) {
  }
}

export class Assembler {
  assemble(input: string): AssembleOutput {
    const output = new AssembleOutput(new Array<number>(), new Map<number, number>(), new Array<string>());
    const locations = new Map<string, number>();
    const locationMapping = new Map<string, Array<number>>();

    const lines = input.split('\n');
    output.lines = lines;
    for (let lineIdx = 0; lineIdx < lines.length; ++lineIdx) {
      let line = lines[lineIdx];
      // remove comments
      {
        const n = line.indexOf(';');
        if (n !== -1) {
         line = line.substr(0, n);
        }
      }
      // remove trailing & leading spaces
      line = line.trim();

      // location
      {
        const n = line.indexOf(':');
        if (n !== -1) {
          const locName = line.substr(0, n).toLowerCase();
          line = line.substring(n).trim();

          // TODO: assemble error if duplicate location
          if (!locations.has(locName)) {
            locations.set(locName, output.machineCode.length);
          }
        }
      }

      const components = line.split(' ');
      if (components.length < 1) {
        continue;
      }

      let opCode = 0;
      let secondValue = -1;
      for (let component of components) {
        if (component.trim().length === 0) {
          continue;
        }

        if (opCode === 0) {
          // search for mnemonic
          component = component.toUpperCase();
          for (const instruction of instructionList) {
            if (instruction.mnemonic === component) {
              opCode = instruction.opCode;
              if (instruction.noOperand) {
                secondValue = 0;
                break;
              }
            }
          }
        } else {
          // address or immediate
          // tslint:disable-next-line:radix
          secondValue = parseInt(component);
          if (isNaN(secondValue)) {
            secondValue = 0;
            const locName = component.trim().toLowerCase();
            if (!locationMapping.has(locName)) {
              locationMapping.set(locName, new Array<number>());
            }

            // insert location to be filled later (+1 because of the opcode)
            locationMapping.get(locName).push(output.machineCode.length + 1);
          } else if (isNaN(secondValue) || secondValue > 0xFFFF) {
            secondValue = -1;
          }
          secondValue = truncateNumKeepSign(secondValue);
        }
      }

      if (opCode === 0 || secondValue === -1) {
        continue;
      }

      output.lineNumbers.set(output.machineCode.length, lineIdx);
      output.machineCode.push(opCode);

      // HOLD instruction
      if (opCode !== 22) {
        output.lineNumbers.set(output.machineCode.length, lineIdx);
        output.machineCode.push(secondValue);
      }
    }

    // map locations
    for (const [location, fillPositions] of locationMapping) {
      if (!locations.has(location)) {
        // TODO: assemble error
        continue;
      }

      const pos = locations.get(location);
      for (const fillPos of fillPositions) {
        output.machineCode[fillPos] = pos;
      }
    }

    return output;
  }
}
