import { describe, expect, it } from 'vitest';
import { generateCaseSlice } from './generateCase';
import { estimatedDeathWindowLabel, murderNarrative } from './caseNarrative';

describe('case narrative', () => {
  it('knits generated murder facts into one human-readable statement', () => {
    const generated = generateCaseSlice('narrative-case');
    const narrative = murderNarrative(generated);

    expect(narrative).toContain(generated.victim.fullName);
    expect(narrative).toContain(generated.murder.timeOfDeath.exact.localTime);
    expect(narrative).not.toContain('None');
    expect(narrative.endsWith('.')).toBe(true);
  });

  it('formats the estimated time-of-death window without losing date rollover', () => {
    let rollover: ReturnType<typeof generateCaseSlice> | null = null;

    for (let index = 0; index < 10000; index += 1) {
      const generated = generateCaseSlice(`narrative-rollover-${index}`);
      const { start, end } = generated.murder.timeOfDeath.estimatedWindow;
      if (start.localDate !== end.localDate) {
        rollover = generated;
        break;
      }
    }

    expect(rollover).not.toBeNull();
    const label = estimatedDeathWindowLabel(rollover!);
    expect(label).toContain(rollover!.murder.timeOfDeath.estimatedWindow.start.localTime);
    expect(label).toContain(rollover!.murder.timeOfDeath.estimatedWindow.end.localTime);
  }, 30000);
});
