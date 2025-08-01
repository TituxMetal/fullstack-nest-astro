/**
 * Example Domain Entity Implementation
 *
 * This demonstrates the standard pattern for creating domain entities
 * in Clean Architecture + DDD implementation.
 *
 * This is a working example that shows:
 * - Domain entity with business logic
 * - Value objects for type safety
 * - Immutable design patterns
 * - Business rule validation
 * - Clean interfaces
 */

/**
 * Value Objects for type safety and validation
 */
export class EntityId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('EntityId cannot be empty')
    }
  }

  getValue(): string {
    return this.value
  }

  equals(other: EntityId): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}

export class Email {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  constructor(private readonly value: string) {
    if (!value || !Email.EMAIL_REGEX.test(value)) {
      throw new Error('Invalid email format')
    }
  }

  getValue(): string {
    return this.value
  }

  equals(other: Email): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}

export class Name {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Name cannot be empty')
    }
    if (value.trim().length > 100) {
      throw new Error('Name cannot exceed 100 characters')
    }
  }

  getValue(): string {
    return this.value
  }

  equals(other: Name): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}

/**
 * Example Domain Entity - Contains business logic and identity
 *
 * This demonstrates:
 * - Entities have identity (using value objects)
 * - Contain business behavior, not just data
 * - No dependencies on frameworks or infrastructure
 * - Immutable design with controlled mutations
 * - Rich domain behavior methods
 */
export class ExampleEntity {
  constructor(
    private readonly id: EntityId,
    private readonly email: Email,
    private readonly name: Name,
    private readonly createdAt: Date,
    private isActive: boolean = true
  ) {
    this.validateCreationRules()
  }

  // Factory method for creating new entities
  static create(email: string, name: string): ExampleEntity {
    const id = new EntityId(`entity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
    const emailVO = new Email(email)
    const nameVO = new Name(name)
    const createdAt = new Date()

    return new ExampleEntity(id, emailVO, nameVO, createdAt, true)
  }

  // Factory method for reconstituting from persistence
  static fromPersistence(
    id: string,
    email: string,
    name: string,
    createdAt: Date,
    isActive: boolean
  ): ExampleEntity {
    const idVO = new EntityId(id)
    const emailVO = new Email(email)
    const nameVO = new Name(name)

    return new ExampleEntity(idVO, emailVO, nameVO, createdAt, isActive)
  }

  // Getter methods - expose only what's needed
  getId(): EntityId {
    return this.id
  }

  getEmail(): Email {
    return this.email
  }

  getName(): Name {
    return this.name
  }

  getCreatedAt(): Date {
    return this.createdAt
  }

  isEntityActive(): boolean {
    return this.isActive
  }

  // Business logic methods - this is where domain behavior lives
  activate(): void {
    if (this.isActive) {
      throw new Error('Entity is already active')
    }
    this.isActive = true
  }

  deactivate(): void {
    if (!this.isActive) {
      throw new Error('Entity is already inactive')
    }
    this.isActive = false
  }

  // Domain-specific business rules
  canPerformAction(): boolean {
    return this.isActive && this.isValidForAction()
  }

  // Business method - update name with business rules
  updateName(newName: string): ExampleEntity {
    const nameVO = new Name(newName)

    // Business rule: cannot change name if entity is inactive
    if (!this.isActive) {
      throw new Error('Cannot update name of inactive entity')
    }

    return new ExampleEntity(this.id, this.email, nameVO, this.createdAt, this.isActive)
  }

  // Business method - check if entity was created recently
  isRecentlyCreated(daysThreshold: number = 7): boolean {
    const threshold = new Date()
    threshold.setDate(threshold.getDate() - daysThreshold)
    return this.createdAt >= threshold
  }

  private isValidForAction(): boolean {
    // Business rules for performing actions
    return this.name.getValue().length > 0 && this.isRecentlyCreated(30)
  }

  private validateCreationRules(): void {
    if (!this.createdAt) {
      throw new Error('CreatedAt is required')
    }

    if (this.createdAt > new Date()) {
      throw new Error('CreatedAt cannot be in the future')
    }
  }

  // Equality based on identity
  equals(other: ExampleEntity): boolean {
    return this.id.equals(other.id)
  }

  // Convert to persistence format
  toPersistence(): {
    id: string
    email: string
    name: string
    createdAt: Date
    isActive: boolean
  } {
    return {
      id: this.id.getValue(),
      email: this.email.getValue(),
      name: this.name.getValue(),
      createdAt: this.createdAt,
      isActive: this.isActive
    }
  }

  // For debugging/logging
  toString(): string {
    return `ExampleEntity(id=${this.id.getValue()}, email=${this.email.getValue()}, name=${this.name.getValue()})`
  }
}

/**
 * Example Value Objects that might be used:
 *
 * export class TemplateId {
 *   constructor(private readonly value: string) {
 *     if (!value || value.trim().length === 0) {
 *       throw new Error('TemplateId cannot be empty');
 *     }
 *   }
 *
 *   getValue(): string {
 *     return this.value;
 *   }
 *
 *   equals(other: TemplateId): boolean {
 *     return this.value === other.value;
 *   }
 * }
 */

/**
 * Example Usage in Use Cases:
 *
 * class SomeUseCase {
 *   constructor(private repository: TemplateRepository) {}
 *
 *   async execute(id: string): Promise<void> {
 *     const entity = await this.repository.findById(id);
 *     if (!entity) {
 *       throw new Error('Entity not found');
 *     }
 *
 *     if (entity.canPerformAction()) {
 *       entity.activate();
 *       await this.repository.save(entity);
 *     }
 *   }
 * }
 */
