export const PRODUCT_EVENTS = {
  CREATED: 'product.created',
  UPDATED: 'product.updated',
  ACTIVATED: 'product.activated',
  DEACTIVATED: 'product.deactivated',
  BLOCKED: 'product.blocked',
  DISCONTINUED: 'product.discontinued',
  ARCHIVED: 'product.archived',
  STATUS_CHANGED: 'product.status.changed',
  GEOGRAPHY_MAPPED: 'product.geography.mapped',
  GEOGRAPHY_UNMAPPED: 'product.geography.unmapped',
} as const;

export type ProductEventType =
  (typeof PRODUCT_EVENTS)[keyof typeof PRODUCT_EVENTS];
