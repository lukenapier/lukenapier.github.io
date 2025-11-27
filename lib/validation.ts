import type { BuildState, ValidationResult, VoltageClass } from "@/types";

function formatVoltageRange(classes: VoltageClass[]): string {
  if (classes.length === 1) return classes[0];
  return classes.join("–");
}

export function evaluateBuild(state: BuildState): ValidationResult[] {
  const results: ValidationResult[] = [];
  const { selectedBattery, selectedEsc, selectedDriveKit } = state;

  if (selectedBattery || selectedEsc || selectedDriveKit) {
    if (!(selectedBattery && selectedEsc && selectedDriveKit)) {
      results.push({
        id: "missing-powertrain",
        ruleId: "powertrain-complete",
        severity: "warning",
        message:
          "Your powertrain is incomplete. Add a battery, ESC, and drive kit to make this board rideable.",
        hint: "Fix this in the Powertrain section.",
      });
    }
  }

  if (selectedBattery && selectedEsc && selectedDriveKit) {
    const batteryClass = selectedBattery.voltageClass;
    const escSupport = selectedEsc.supportedVoltageClasses;
    const driveSupport = selectedDriveKit.supportedVoltageClasses;
    const matchesBattery = escSupport.includes(batteryClass) && driveSupport.includes(batteryClass);

    if (!matchesBattery) {
      results.push({
        id: "voltage-mismatch",
        ruleId: "voltage-class-consistency",
        severity: "warning",
        message: `Voltage mismatch: Battery (${batteryClass}) is not fully compatible with ESC (${formatVoltageRange(
          escSupport
        )}) and Drive Kit (${formatVoltageRange(driveSupport)}).`,
        relatedIds: [selectedBattery.id, selectedEsc.id, selectedDriveKit.id],
        hint: "Choose powertrain parts that share a voltage class.",
      });
    }
  }

  return results;
}
