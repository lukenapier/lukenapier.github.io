import type {
  Battery,
  BuildPart,
  Deck,
  DriveKit,
  Esc,
  Offer,
  Remote,
  Trucks,
  Wheels,
} from "@/types";

export type PriceInfo = { value?: number; currency?: string };

export function capitalize(word?: string) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function formatDisplayName(part: BuildPart) {
  return `${part.brand} ${part.name}`;
}

export function formatPrice(value?: number, currency = "USD") {
  if (value === undefined) return undefined;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
}

function getPrimaryOffer(part?: BuildPart): Offer | undefined {
  if (!part || part.category === "deck") return undefined;
  if ("offers" in part) return part.offers?.[0];
  return undefined;
}

export function getPriceInfo(part?: BuildPart): PriceInfo {
  if (!part) return {};
  if (part.category === "deck") {
    return { value: part.priceValue, currency: part.priceCurrency };
  }

  const offer = getPrimaryOffer(part);
  return { value: offer?.priceUsd, currency: offer ? "USD" : undefined };
}

export function formatPriceDisplay(part?: BuildPart) {
  const { value, currency } = getPriceInfo(part);
  return formatPrice(value, currency) ?? "N/A";
}

export function formatNameWithPrice(part?: BuildPart) {
  if (!part) return "Not selected";
  const price = formatPriceDisplay(part);
  return `${formatDisplayName(part)}${price ? ` · ${price}` : ""}`;
}

export function getPriceValue(part?: BuildPart) {
  const { value } = getPriceInfo(part);
  return value;
}

export function getFlexLabel(deck: Deck) {
  if (deck.flex !== undefined) return `Flex ${deck.flex}`;
  return undefined;
}

export function formatWheelbase(deck: Deck) {
  if (deck.wheelbaseMinCm && deck.wheelbaseMaxCm) {
    return `${deck.wheelbaseMinCm.toFixed(1)}–${deck.wheelbaseMaxCm.toFixed(1)} cm`;
  }
  if (deck.wheelbaseMinCm) return `${deck.wheelbaseMinCm.toFixed(1)} cm`;
  return undefined;
}

export function formatDeckSummary(deck: Deck) {
  const flexLabel = getFlexLabel(deck);
  return [
    `${deck.lengthCm} cm`,
    deck.widthCm ? `${deck.widthCm} cm wide` : undefined,
    deck.style,
    flexLabel,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function formatTrucksSummary(trucks: Trucks) {
  return [`${trucks.hangerWidthMm}mm hanger`, `${trucks.baseplateAngleDeg}°`, trucks.type]
    .filter(Boolean)
    .join(" · ");
}

export function formatWheelsSummary(wheels: Wheels) {
  return [`${wheels.diameterMm}mm`, `${wheels.durometerA}A`, capitalize(wheels.type)]
    .filter(Boolean)
    .join(" · ");
}

export function formatBatterySummary(battery: Battery) {
  return [`${battery.cells}`, `${battery.capacityWh}Wh`, battery.voltageClass]
    .filter(Boolean)
    .join(" · ");
}

export function formatEscSummary(esc: Esc) {
  const motorLabel = esc.motorCount === "dual" ? "Dual" : "Single";
  return [
    `Supports ${esc.supportedVoltageClasses.join("/")}`,
    `${motorLabel} motor`,
    `${esc.maxContinuousCurrentA}A max`,
    esc.hasTelemetry ? "Telemetry" : undefined,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function formatDriveKitSummary(driveKit: DriveKit) {
  return [
    `${capitalize(driveKit.driveType)} drive`,
    `${driveKit.kv}KV`,
    `${capitalize(driveKit.characterTag)}`,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function formatRemoteSummary(remote: Remote) {
  return [
    `ESC: ${remote.escFamilies.join("/")}`,
    remote.hasTelemetry ? "Telemetry" : "No telemetry",
  ]
    .filter(Boolean)
    .join(" · ");
}

export function formatBoardName(deck?: Deck) {
  if (!deck) return "Custom Electric Longboard";
  return `${deck.name} Build`;
}
