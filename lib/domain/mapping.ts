export type BrandMappingStatus = "draft" | "approved" | "retired";

export type BrandMapping = {
  id: string;
  brandId: string;
  sku: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  status: BrandMappingStatus;
  approvedBy: string | null;
};

function timestamp(value: string) {
  return new Date(value).getTime();
}

export function resolveBrandMapping(mappings: BrandMapping[], sku: string, eventAt: string): BrandMapping | null {
  const eventTime = timestamp(eventAt);

  const candidates = mappings
    .filter((mapping) => mapping.sku === sku)
    .filter((mapping) => mapping.status === "approved" && Boolean(mapping.approvedBy))
    .filter((mapping) => {
      const startsAt = timestamp(mapping.effectiveFrom);
      const endsAt = mapping.effectiveTo ? timestamp(mapping.effectiveTo) : Number.POSITIVE_INFINITY;
      return startsAt <= eventTime && eventTime < endsAt;
    })
    .sort((left, right) => timestamp(right.effectiveFrom) - timestamp(left.effectiveFrom));

  return candidates[0] ?? null;
}

export function filterMappedSkuEvents<T extends { sku: string; eventAt: string }>(
  events: T[],
  mappings: BrandMapping[],
  brandId: string
) {
  return events.filter((event) => resolveBrandMapping(mappings, event.sku, event.eventAt)?.brandId === brandId);
}
