/**
 * Example Infrastructure Repository Implementation
 *
 * This demonstrates the standard pattern for implementing repository interfaces
 * in the Infrastructure layer of Clean Architecture + DDD implementation.
 *
 * This shows:
 * - Infrastructure layer implementing domain contracts
 * - Proper data mapping between domain and persistence models
 * - Framework-specific code (NestJS, Prisma)
 * - Error handling and logging
 * - Transaction management examples
 */

import { Injectable } from '@nestjs/common'
import { type User as PrismaUser } from '@prisma/client'

import { Email, EntityId, ExampleEntity } from '~/contexts/shared/domain/entities/_template.entity'
import {
  ExampleAlreadyExistsError,
  type ExampleRepository,
  ExampleRepositoryError,
  type ExampleSearchCriteria,
  ExampleStatus
} from '~/contexts/shared/domain/repositories/_template.repository'
import { PrismaService } from '~/prisma/prisma.service'

/**
 * Prisma Repository Implementation
 *
 * This implements the domain repository interface using Prisma ORM
 * for database operations while maintaining clean architecture principles.
 */
@Injectable()
export class PrismaExampleRepository implements ExampleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: EntityId): Promise<ExampleEntity | null> {
    try {
      const prismaUser = await this.prisma.user.findUnique({
        where: { id: id.getValue() }
      })

      return prismaUser ? this.mapToDomain(prismaUser) : null
    } catch (error) {
      this.handleError('findById', error)
      const errorMessage =
        error instanceof Error ? error : new Error('Unknown error during findById')
      throw new ExampleRepositoryError(
        `Failed to find entity by ID: ${id.getValue()}`,
        errorMessage
      )
    }
  }

  async findByEmail(email: Email): Promise<ExampleEntity | null> {
    try {
      const prismaUser = await this.prisma.user.findUnique({
        where: { email: email.getValue() }
      })

      return prismaUser ? this.mapToDomain(prismaUser) : null
    } catch (error) {
      this.handleError('findByEmail', error)
      const errorMessage =
        error instanceof Error ? error : new Error('Unknown error during findByEmail')
      throw new ExampleRepositoryError(
        `Failed to find entity by email: ${email.getValue()}`,
        errorMessage
      )
    }
  }

  async findByCriteria(criteria: ExampleSearchCriteria): Promise<ExampleEntity[]> {
    try {
      const whereClause = this.buildWhereClause(criteria)

      const prismaUsers = await this.prisma.user.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: criteria.limit,
        skip: criteria.offset
      })

      return prismaUsers.map(user => this.mapToDomain(user))
    } catch (error) {
      this.handleError('findByCriteria', error)
      const errorMessage =
        error instanceof Error ? error : new Error('Unknown error during findByCriteria')
      throw new ExampleRepositoryError('Failed to find entities by criteria', errorMessage)
    }
  }

  async findAll(): Promise<ExampleEntity[]> {
    try {
      const prismaUsers = await this.prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
      })

      return prismaUsers.map(user => this.mapToDomain(user))
    } catch (error) {
      this.handleError('findAll', error)
      const errorMessage =
        error instanceof Error ? error : new Error('Unknown error during findAll')
      throw new ExampleRepositoryError('Failed to find all entities', errorMessage)
    }
  }

  async save(entity: ExampleEntity): Promise<ExampleEntity> {
    try {
      const persistenceData = this.mapToPersistence(entity)

      const savedUser = await this.prisma.user.upsert({
        where: { id: entity.getId().getValue() },
        update: {
          username: persistenceData.username,
          blocked: persistenceData.blocked,
          confirmed: persistenceData.confirmed,
          updatedAt: new Date()
        },
        create: persistenceData
      })

      return this.mapToDomain(savedUser)
    } catch (error) {
      // Handle unique constraint violations
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        (error as { code: string }).code === 'P2002'
      ) {
        const email = new Email(entity.getEmail().getValue())
        throw new ExampleAlreadyExistsError(email)
      }

      this.handleError('save', error)
      const errorMessage = error instanceof Error ? error : new Error('Unknown error during save')
      throw new ExampleRepositoryError(
        `Failed to save entity: ${entity.getId().getValue()}`,
        errorMessage
      )
    }
  }

  async delete(id: EntityId): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id: id.getValue() }
      })
      return true
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        (error as { code: string }).code === 'P2025'
      ) {
        // Prisma "Record not found" error
        return false
      }
      this.handleError('delete', error)
      const errorMessage = error instanceof Error ? error : new Error('Unknown error during delete')
      throw new ExampleRepositoryError(`Failed to delete entity: ${id.getValue()}`, errorMessage)
    }
  }

  async exists(id: EntityId): Promise<boolean> {
    try {
      const count = await this.prisma.user.count({
        where: { id: id.getValue() }
      })
      return count > 0
    } catch (error) {
      this.handleError('exists', error)
      const errorMessage =
        error instanceof Error ? error : new Error('Unknown error during exists check')
      throw new ExampleRepositoryError(
        `Failed to check entity existence: ${id.getValue()}`,
        errorMessage
      )
    }
  }

  async count(criteria?: ExampleSearchCriteria): Promise<number> {
    try {
      const whereClause = criteria ? this.buildWhereClause(criteria) : {}

      return await this.prisma.user.count({
        where: whereClause
      })
    } catch (error) {
      this.handleError('count', error)
      const errorMessage = error instanceof Error ? error : new Error('Unknown error during count')
      throw new ExampleRepositoryError('Failed to count entities', errorMessage)
    }
  }

  // Domain-specific methods

  async findActiveEntities(): Promise<ExampleEntity[]> {
    try {
      const prismaUsers = await this.prisma.user.findMany({
        where: {
          blocked: false,
          confirmed: true
        },
        orderBy: { createdAt: 'desc' }
      })

      return prismaUsers.map(user => this.mapToDomain(user))
    } catch (error) {
      this.handleError('findActiveEntities', error)
      const errorMessage =
        error instanceof Error ? error : new Error('Unknown error during findActiveEntities')
      throw new ExampleRepositoryError('Failed to find active entities', errorMessage)
    }
  }

  async findCreatedAfter(date: Date): Promise<ExampleEntity[]> {
    try {
      const prismaUsers = await this.prisma.user.findMany({
        where: {
          createdAt: {
            gte: date
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return prismaUsers.map(user => this.mapToDomain(user))
    } catch (error) {
      this.handleError('findCreatedAfter', error)
      const errorMessage =
        error instanceof Error ? error : new Error('Unknown error during findCreatedAfter')
      throw new ExampleRepositoryError(
        `Failed to find entities created after: ${date.toISOString()}`,
        errorMessage
      )
    }
  }

  async findByStatus(status: ExampleStatus): Promise<ExampleEntity[]> {
    try {
      const whereClause = this.mapStatusToWhereClause(status)

      const prismaUsers = await this.prisma.user.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' }
      })

      return prismaUsers.map(user => this.mapToDomain(user))
    } catch (error) {
      this.handleError('findByStatus', error)
      const errorMessage =
        error instanceof Error ? error : new Error('Unknown error during findByStatus')
      throw new ExampleRepositoryError(`Failed to find entities by status: ${status}`, errorMessage)
    }
  }

  async findRecentlyCreated(daysThreshold: number = 7): Promise<ExampleEntity[]> {
    const threshold = new Date()
    threshold.setDate(threshold.getDate() - daysThreshold)

    return this.findCreatedAfter(threshold)
  }

  // Private mapping methods

  /**
   * Map Prisma model to Domain entity
   */
  private mapToDomain(prismaUser: PrismaUser): ExampleEntity {
    return ExampleEntity.fromPersistence(
      prismaUser.id,
      prismaUser.email,
      prismaUser.username, // Map username to name
      prismaUser.createdAt,
      !prismaUser.blocked && prismaUser.confirmed // Calculate isActive
    )
  }

  /**
   * Map Domain entity to Prisma model data
   */
  private mapToPersistence(entity: ExampleEntity): Omit<PrismaUser, 'updatedAt'> {
    const persistenceData = entity.toPersistence()

    return {
      id: persistenceData.id,
      email: persistenceData.email,
      username: persistenceData.name, // Map name to username
      firstName: null, // Would be extracted from name in real implementation
      lastName: null, // Would be extracted from name in real implementation
      hash: 'example_hash', // Would need proper password hashing in real implementation
      confirmed: persistenceData.isActive,
      blocked: !persistenceData.isActive,
      createdAt: persistenceData.createdAt
    }
  }

  /**
   * Build WHERE clause for search criteria
   */
  private buildWhereClause(criteria: ExampleSearchCriteria): Record<string, unknown> {
    const where: Record<string, unknown> = {}

    if (criteria.name) {
      where.username = {
        contains: criteria.name,
        mode: 'insensitive'
      }
    }

    if (criteria.email) {
      where.email = {
        contains: criteria.email,
        mode: 'insensitive'
      }
    }

    if (criteria.isActive !== undefined) {
      where.blocked = !criteria.isActive
      where.confirmed = criteria.isActive
    }

    if (criteria.createdAfter) {
      where.createdAt = {
        gte: criteria.createdAfter
      }
    }

    if (criteria.createdBefore) {
      where.createdAt = {
        ...((where.createdAt as Record<string, unknown>) || {}),
        lte: criteria.createdBefore
      }
    }

    if (criteria.status) {
      const statusClause = this.mapStatusToWhereClause(criteria.status)
      Object.assign(where, statusClause)
    }

    return where
  }

  /**
   * Map domain status to database WHERE clause
   */
  private mapStatusToWhereClause(status: ExampleStatus): Record<string, unknown> {
    switch (status) {
      case ExampleStatus.ACTIVE:
        return { blocked: false, confirmed: true }
      case ExampleStatus.INACTIVE:
        return { blocked: true }
      case ExampleStatus.PENDING:
        return { confirmed: false, blocked: false }
      case ExampleStatus.SUSPENDED:
        return { blocked: true }
      default:
        return {}
    }
  }

  /**
   * Error handling and logging
   */
  private handleError(method: string, error: unknown): void {
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: error && typeof error === 'object' && 'code' in error ? error.code : undefined,
      stack: error instanceof Error ? error.stack : undefined
    }

    console.error(`PrismaExampleRepository.${method} error:`, errorDetails)

    // In a real application, you would use a proper logging service:
    // this.logger.error(`Repository error in ${method}`, error);
  }

  /**
   * Transaction example
   */
  async saveWithTransaction(entity: ExampleEntity): Promise<ExampleEntity> {
    try {
      return await this.prisma.$transaction(async tx => {
        const persistenceData = this.mapToPersistence(entity)

        const savedUser = await tx.user.upsert({
          where: { id: entity.getId().getValue() },
          update: {
            username: persistenceData.username,
            blocked: persistenceData.blocked,
            confirmed: persistenceData.confirmed,
            updatedAt: new Date()
          },
          create: persistenceData
        })

        return this.mapToDomain(savedUser)
      })
    } catch (error) {
      this.handleError('saveWithTransaction', error)
      const errorMessage =
        error instanceof Error ? error : new Error('Unknown error during saveWithTransaction')
      throw new ExampleRepositoryError(
        `Failed to save entity with transaction: ${entity.getId().getValue()}`,
        errorMessage
      )
    }
  }

  /**
   * Bulk operations example
   */
  async saveMany(entities: ExampleEntity[]): Promise<ExampleEntity[]> {
    try {
      const results: ExampleEntity[] = []

      await this.prisma.$transaction(async tx => {
        for (const entity of entities) {
          const persistenceData = this.mapToPersistence(entity)

          const savedUser = await tx.user.upsert({
            where: { id: entity.getId().getValue() },
            update: {
              username: persistenceData.username,
              blocked: persistenceData.blocked,
              confirmed: persistenceData.confirmed,
              updatedAt: new Date()
            },
            create: persistenceData
          })

          results.push(this.mapToDomain(savedUser))
        }
      })

      return results
    } catch (error) {
      this.handleError('saveMany', error)
      const errorMessage =
        error instanceof Error ? error : new Error('Unknown error during saveMany')
      throw new ExampleRepositoryError('Failed to save multiple entities', errorMessage)
    }
  }
}
