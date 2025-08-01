/**
 * Example Repository Interface Implementation
 *
 * This demonstrates the standard pattern for creating repository interfaces
 * in the Domain layer of Clean Architecture + DDD implementation.
 *
 * This shows:
 * - Domain repository interface with no infrastructure dependencies
 * - Proper use of domain entities and value objects
 * - Business-focused query methods
 * - Clean separation between domain contracts and implementation
 */

import { type Email, type EntityId, type ExampleEntity } from '../entities/_template.entity'

/**
 * Repository Interface - Defines data access contracts
 *
 * Rules:
 * - Lives in Domain layer (no infrastructure dependencies)
 * - Defines WHAT operations are needed, not HOW they're implemented
 * - Uses domain objects (entities, value objects) as parameters/return types
 * - Implementation will be provided by Infrastructure layer
 * - Should be focused on business needs, not technical storage details
 */
export interface ExampleRepository {
  // Basic CRUD operations

  /**
   * Find entity by its unique identifier
   * @param id - The unique identifier
   * @returns The entity if found, null otherwise
   */
  findById(id: EntityId): Promise<ExampleEntity | null>

  /**
   * Find entity by email
   * @param email - The email to search for
   * @returns The entity if found, null otherwise
   */
  findByEmail(email: Email): Promise<ExampleEntity | null>

  /**
   * Find multiple entities by criteria
   * @param criteria - Search criteria
   * @returns Array of entities matching criteria
   */
  findByCriteria(criteria: ExampleSearchCriteria): Promise<ExampleEntity[]>

  /**
   * Find all entities (use with caution for large datasets)
   * @returns All entities
   */
  findAll(): Promise<ExampleEntity[]>

  /**
   * Save entity (create or update)
   * @param entity - The entity to save
   * @returns The saved entity
   */
  save(entity: ExampleEntity): Promise<ExampleEntity>

  /**
   * Delete entity by id
   * @param id - The unique identifier
   * @returns True if deleted, false if not found
   */
  delete(id: EntityId): Promise<boolean>

  /**
   * Check if entity exists
   * @param id - The unique identifier
   * @returns True if exists, false otherwise
   */
  exists(id: EntityId): Promise<boolean>

  /**
   * Count entities matching criteria
   * @param criteria - Search criteria (optional)
   * @returns Number of entities
   */
  count(criteria?: ExampleSearchCriteria): Promise<number>

  // Domain-specific query methods

  /**
   * Find active entities only
   * @returns Array of active entities
   */
  findActiveEntities(): Promise<ExampleEntity[]>

  /**
   * Find entities created after a specific date
   * @param date - The date threshold
   * @returns Array of entities
   */
  findCreatedAfter(date: Date): Promise<ExampleEntity[]>

  /**
   * Find entities by status
   * @param status - The status to filter by
   * @returns Array of entities with matching status
   */
  findByStatus(status: ExampleStatus): Promise<ExampleEntity[]>

  /**
   * Find recently created entities
   * @param daysThreshold - Number of days to look back
   * @returns Array of recently created entities
   */
  findRecentlyCreated(daysThreshold?: number): Promise<ExampleEntity[]>
}

/**
 * Search criteria interface for flexible querying
 */
export interface ExampleSearchCriteria {
  name?: string
  email?: string
  isActive?: boolean
  createdAfter?: Date
  createdBefore?: Date
  status?: ExampleStatus
  limit?: number
  offset?: number
}

/**
 * Domain-specific enums/types
 */
export enum ExampleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}

/**
 * Repository Exception Types
 */
export class ExampleRepositoryError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(message)
    this.name = 'ExampleRepositoryError'
  }
}

export class ExampleNotFoundError extends ExampleRepositoryError {
  constructor(id: EntityId) {
    super(`Example entity with ID ${id.getValue()} not found`)
    this.name = 'ExampleNotFoundError'
  }
}

export class ExampleAlreadyExistsError extends ExampleRepositoryError {
  constructor(email: Email) {
    super(`Example entity with email ${email.getValue()} already exists`)
    this.name = 'ExampleAlreadyExistsError'
  }
}

/**
 * Usage Example in Use Cases:
 *
 * export class GetExampleUseCase {
 *   constructor(private repository: ExampleRepository) {}
 *
 *   async execute(id: EntityId): Promise<ExampleEntity> {
 *     const entity = await this.repository.findById(id);
 *     if (!entity) {
 *       throw new ExampleNotFoundError(id);
 *     }
 *     return entity;
 *   }
 * }
 */

/**
 * Implementation Note:
 *
 * This interface will be implemented in the Infrastructure layer, for example:
 *
 * apps/backend/src/contexts/shared/infrastructure/repositories/PrismaExampleRepository.ts
 *
 * The implementation will handle:
 * - Database connection via Prisma
 * - Data mapping between domain entities and database models
 * - Error handling and logging
 * - Transaction management
 */
