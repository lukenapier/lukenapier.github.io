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
  name: string;
  category: ComponentCategory;
  description?: string;
  notes?: string;
  tags?: string[];
}

export interface Deck extends BoardComponent {
  category: "deck";
  lengthCm: number;
  wheelbaseCm?: number;
  widthCm?: number;
  flex?: "stiff" | "medium" | "flexy";
  mountStyle: "top-mount" | "drop-through" | "drop-deck";
  deckStyle?: "commuter" | "freeride" | "downhill" | "carver" | "cruiser";
}

export interface Trucks extends BoardComponent {
  category: "trucks";
  widthMm: number;
  truckType: "RKP" | "PKP";
  mountCompatibility: Array<"top-mount" | "drop-through">;
  baseplateAngleDeg?: number;
  axleDiameterMm?: number;
}

export interface Wheels extends BoardComponent {
  category: "wheels";
  diameterMm: number;
  hardnessA: number;
  contactPatchMm?: number;
  widthMm?: number;
  wheelType: "street" | "all-terrain";
  lipShape?: "square" | "rounded";
}

export interface Battery extends BoardComponent {
  category: "battery";
  capacityWh: number;
  voltageClass: VoltageClass;
  continuousDischargeA?: number;
  configuration?: string;
  cellFormat?: string;
  smartBms?: boolean;
}

export interface Esc extends BoardComponent {
  category: "esc";
  supportedVoltageClasses: VoltageClass[];
  maxContinuousCurrentA?: number;
  motorCount: "single" | "dual";
  connectors?: string[];
  hasBluetooth?: boolean;
  hasTelemetry?: boolean;
  waterproofRating?: string;
}

export interface DriveKit extends BoardComponent {
  category: "drive_kit";
  kv: number;
  supportedVoltageClasses: VoltageClass[];
  maxPowerW: number;
  profile: "high_torque" | "balanced" | "high_speed";
  driveType?: "belt" | "gear" | "hub" | "direct";
  ratio?: string;
  wheelCompatibility?: string;
}

export interface Remote extends BoardComponent {
  category: "remote";
  frequency: string;
  compatibleEscFamilies?: string[];
  triggerStyle?: "trigger" | "thumbwheel";
  hasTelemetry?: boolean;
  ridingModes?: number;
  waterproofRating?: string;
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
