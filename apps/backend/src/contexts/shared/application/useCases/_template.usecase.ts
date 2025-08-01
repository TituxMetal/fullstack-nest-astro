/**
 * Example Use Case Implementation
 *
 * This demonstrates the standard pattern for creating use cases
 * in the Application layer of Clean Architecture + DDD implementation.
 *
 * This shows:
 * - Application layer orchestrating domain operations
 * - Proper dependency injection with repository interfaces
 * - Input/output DTOs for application boundaries
 * - Business workflow coordination
 * - Error handling and validation
 */

import { Injectable } from '@nestjs/common'

import { Email, EntityId, ExampleEntity } from '~/contexts/shared/domain/entities/_template.entity'
import {
  ExampleAlreadyExistsError,
  ExampleNotFoundError,
  type ExampleRepository,
  type ExampleSearchCriteria,
  ExampleStatus
} from '~/contexts/shared/domain/repositories/_template.repository'

/**
 * DTOs for application boundaries
 */
export interface CreateExampleInput {
  email: string
  name: string
}

export interface UpdateExampleInput {
  id: string
  name?: string
}

export interface ExampleOutput {
  id: string
  email: string
  name: string
  isActive: boolean
  createdAt: Date
}

export interface SearchExampleInput {
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
 * Create Example Use Case
 */
@Injectable()
export class CreateExampleUseCase {
  constructor(private readonly exampleRepository: ExampleRepository) {}

  async execute(input: CreateExampleInput): Promise<ExampleOutput> {
    // Input validation
    this.validateCreateInput(input)

    // Business rule: Check if email already exists
    const emailVO = new Email(input.email)
    const existingEntity = await this.exampleRepository.findByEmail(emailVO)

    if (existingEntity) {
      throw new ExampleAlreadyExistsError(emailVO)
    }

    // Create new entity using domain factory
    const newEntity = ExampleEntity.create(input.email, input.name)

    // Persist the entity
    const savedEntity = await this.exampleRepository.save(newEntity)

    // Return DTO
    return this.mapToOutput(savedEntity)
  }

  private validateCreateInput(input: CreateExampleInput): void {
    if (!input.email || input.email.trim().length === 0) {
      throw new Error('Email is required')
    }

    if (!input.name || input.name.trim().length === 0) {
      throw new Error('Name is required')
    }

    // Additional validation will be done by value objects
  }

  private mapToOutput(entity: ExampleEntity): ExampleOutput {
    return {
      id: entity.getId().getValue(),
      email: entity.getEmail().getValue(),
      name: entity.getName().getValue(),
      isActive: entity.isEntityActive(),
      createdAt: entity.getCreatedAt()
    }
  }
}

/**
 * Get Example Use Case
 */
@Injectable()
export class GetExampleUseCase {
  constructor(private readonly exampleRepository: ExampleRepository) {}

  async execute(id: string): Promise<ExampleOutput> {
    const entityId = new EntityId(id)
    const entity = await this.exampleRepository.findById(entityId)

    if (!entity) {
      throw new ExampleNotFoundError(entityId)
    }

    return this.mapToOutput(entity)
  }

  private mapToOutput(entity: ExampleEntity): ExampleOutput {
    return {
      id: entity.getId().getValue(),
      email: entity.getEmail().getValue(),
      name: entity.getName().getValue(),
      isActive: entity.isEntityActive(),
      createdAt: entity.getCreatedAt()
    }
  }
}

/**
 * Update Example Use Case
 */
@Injectable()
export class UpdateExampleUseCase {
  constructor(private readonly exampleRepository: ExampleRepository) {}

  async execute(input: UpdateExampleInput): Promise<ExampleOutput> {
    // Find existing entity
    const entityId = new EntityId(input.id)
    const existingEntity = await this.exampleRepository.findById(entityId)

    if (!existingEntity) {
      throw new ExampleNotFoundError(entityId)
    }

    // Apply business logic updates
    let updatedEntity = existingEntity

    if (input.name) {
      // Use domain method for name update (includes business rules)
      updatedEntity = existingEntity.updateName(input.name)
    }

    // Persist changes
    const savedEntity = await this.exampleRepository.save(updatedEntity)

    return this.mapToOutput(savedEntity)
  }

  private mapToOutput(entity: ExampleEntity): ExampleOutput {
    return {
      id: entity.getId().getValue(),
      email: entity.getEmail().getValue(),
      name: entity.getName().getValue(),
      isActive: entity.isEntityActive(),
      createdAt: entity.getCreatedAt()
    }
  }
}

/**
 * Search Examples Use Case
 */
@Injectable()
export class SearchExamplesUseCase {
  constructor(private readonly exampleRepository: ExampleRepository) {}

  async execute(input: SearchExampleInput): Promise<ExampleOutput[]> {
    const criteria: ExampleSearchCriteria = {
      name: input.name,
      email: input.email,
      isActive: input.isActive,
      createdAfter: input.createdAfter,
      createdBefore: input.createdBefore,
      status: input.status,
      limit: input.limit || 50,
      offset: input.offset || 0
    }

    const entities = await this.exampleRepository.findByCriteria(criteria)

    return entities.map(entity => this.mapToOutput(entity))
  }

  private mapToOutput(entity: ExampleEntity): ExampleOutput {
    return {
      id: entity.getId().getValue(),
      email: entity.getEmail().getValue(),
      name: entity.getName().getValue(),
      isActive: entity.isEntityActive(),
      createdAt: entity.getCreatedAt()
    }
  }
}

/**
 * Activate Example Use Case
 */
@Injectable()
export class ActivateExampleUseCase {
  constructor(private readonly exampleRepository: ExampleRepository) {}

  async execute(id: string): Promise<ExampleOutput> {
    const entityId = new EntityId(id)
    const entity = await this.exampleRepository.findById(entityId)

    if (!entity) {
      throw new ExampleNotFoundError(entityId)
    }

    // Apply domain business logic
    entity.activate()

    // Persist changes
    const savedEntity = await this.exampleRepository.save(entity)

    return this.mapToOutput(savedEntity)
  }

  private mapToOutput(entity: ExampleEntity): ExampleOutput {
    return {
      id: entity.getId().getValue(),
      email: entity.getEmail().getValue(),
      name: entity.getName().getValue(),
      isActive: entity.isEntityActive(),
      createdAt: entity.getCreatedAt()
    }
  }
}

/**
 * Delete Example Use Case
 */
@Injectable()
export class DeleteExampleUseCase {
  constructor(private readonly exampleRepository: ExampleRepository) {}

  async execute(id: string): Promise<void> {
    const entityId = new EntityId(id)

    // Check if entity exists
    const exists = await this.exampleRepository.exists(entityId)
    if (!exists) {
      throw new ExampleNotFoundError(entityId)
    }

    // Business rule: Only inactive entities can be deleted
    const entity = await this.exampleRepository.findById(entityId)
    if (entity && entity.isEntityActive()) {
      throw new Error('Cannot delete active entity. Deactivate it first.')
    }

    // Perform deletion
    const deleted = await this.exampleRepository.delete(entityId)
    if (!deleted) {
      throw new Error('Failed to delete entity')
    }
  }
}

/**
 * Application Service - Coordinates multiple use cases
 */
@Injectable()
export class ExampleApplicationService {
  constructor(
    private readonly createUseCase: CreateExampleUseCase,
    private readonly getUseCase: GetExampleUseCase,
    private readonly updateUseCase: UpdateExampleUseCase,
    private readonly searchUseCase: SearchExamplesUseCase,
    private readonly activateUseCase: ActivateExampleUseCase,
    private readonly deleteUseCase: DeleteExampleUseCase
  ) {}

  async createExample(input: CreateExampleInput): Promise<ExampleOutput> {
    return await this.createUseCase.execute(input)
  }

  async getExample(id: string): Promise<ExampleOutput> {
    return await this.getUseCase.execute(id)
  }

  async updateExample(input: UpdateExampleInput): Promise<ExampleOutput> {
    return await this.updateUseCase.execute(input)
  }

  async searchExamples(input: SearchExampleInput): Promise<ExampleOutput[]> {
    return await this.searchUseCase.execute(input)
  }

  async activateExample(id: string): Promise<ExampleOutput> {
    return await this.activateUseCase.execute(id)
  }

  async deleteExample(id: string): Promise<void> {
    return await this.deleteUseCase.execute(id)
  }

  /**
   * Complex business workflow example
   */
  async createAndActivateExample(input: CreateExampleInput): Promise<ExampleOutput> {
    // Create the example
    const created = await this.createExample(input)

    // Automatically activate it (business workflow)
    const activated = await this.activateExample(created.id)

    return activated
  }
}
