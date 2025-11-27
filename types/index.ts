export type Protocol = "i2c" | "spi" | "uart" | "analog" | "digital";

export type ComponentCategory =
  | "sensor"
  | "communication"
  | "power"
  | "actuator"
  | "misc";

export interface Microcontroller {
  id: string;
  name: string;
  voltage: number;
  gpioCount: number;
  protocols: Protocol[];
  maxCurrent: number;
  notes?: string;
}

export interface Component {
  id: string;
  name: string;
  category: ComponentCategory;
  voltage: number;
  protocol: Protocol;
  estimatedCurrent: number;
  requiredPins: number;
  i2cAddress?: string;
  vendor?: string;
  description?: string;
}

export interface BuildState {
  microcontroller?: Microcontroller;
  components: Component[];
}

export type ValidationSeverity = "error" | "warning";

export interface ValidationResult {
  id: string;
  ruleId: string;
  severity: ValidationSeverity;
  message: string;
  relatedIds?: string[];
}
