export type VoltageClass = "6S" | "8S" | "10S" | "12S";

export type ComponentCategory =
  | "deck"
  | "trucks"
  | "wheels"
  | "battery"
  | "esc"
  | "drive_kit"
  | "remote";

export interface BoardComponent {
  id: string;
  brand: string;
  name: string;
  category: ComponentCategory;
  notes?: string;
  tags?: string[];
}

export interface Deck extends BoardComponent {
  category: "deck";
  lengthCm: number;
  style: "commuter" | "freeride" | "downhill" | "carver" | "cruiser";
  flex?: "stiff" | "medium" | "flexy";
}

export interface Trucks extends BoardComponent {
  category: "trucks";
  hangerWidthMm: number;
  baseplateAngleDeg: number;
  type: "RKP" | "PKP" | "DKP";
}

export interface Wheels extends BoardComponent {
  category: "wheels";
  diameterMm: number;
  durometerA: number;
  type: "street" | "all-terrain";
}

export interface Battery extends BoardComponent {
  category: "battery";
  capacityWh: number;
  voltageClass: VoltageClass;
  cells: string;
}

export interface Esc extends BoardComponent {
  category: "esc";
  supportedVoltageClasses: VoltageClass[];
  maxContinuousCurrentA: number;
  motorCount: "single" | "dual";
  hasTelemetry?: boolean;
}

export interface DriveKit extends BoardComponent {
  category: "drive_kit";
  kv: number;
  supportedVoltageClasses: VoltageClass[];
  driveType: "belt" | "gear" | "hub" | "direct";
  characterTag: "torque" | "balanced" | "speed";
}

export interface Remote extends BoardComponent {
  category: "remote";
  escFamilies: string[];
  hasTelemetry: boolean;
}

export interface BuildState {
  selectedDeck?: Deck;
  selectedTrucks?: Trucks;
  selectedWheels?: Wheels;
  selectedBattery?: Battery;
  selectedEsc?: Esc;
  selectedDriveKit?: DriveKit;
  selectedRemote?: Remote;
}

export type BuildPart =
  | Deck
  | Trucks
  | Wheels
  | Battery
  | Esc
  | DriveKit
  | Remote;

export type ValidationSeverity = "error" | "warning";

export interface ValidationResult {
  id: string;
  ruleId: string;
  severity: ValidationSeverity;
  message: string;
  relatedIds?: string[];
  hint?: string;
}

export interface CatalogData {
  decks: Deck[];
  trucks: Trucks[];
  wheels: Wheels[];
  batteries: Battery[];
  escs: Esc[];
  driveKits: DriveKit[];
  remotes: Remote[];
}
