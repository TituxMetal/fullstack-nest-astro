export interface EntityId {
  value: string
}

export interface ValueObject<T> {
  value: T
  equals(other: ValueObject<T>): boolean
}

export interface DomainEvent {
  eventType: string
  aggregateId: string
  eventData: unknown
  occurredAt: Date
}
