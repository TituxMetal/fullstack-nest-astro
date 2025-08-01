/**
 * Example Controller Implementation
 *
 * This demonstrates the standard pattern for creating controllers
 * in the Infrastructure layer of Clean Architecture + DDD implementation.
 *
 * This shows:
 * - Infrastructure layer handling HTTP concerns
 * - Proper delegation to application services
 * - Request/response mapping
 * - Error handling and HTTP status codes
 * - Validation and serialization
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  ValidationPipe
} from '@nestjs/common'

import {
  ExampleApplicationService,
  type CreateExampleInput,
  type ExampleOutput,
  type SearchExampleInput,
  type UpdateExampleInput
} from '~/contexts/shared/application/useCases/_template.usecase'
import {
  ExampleAlreadyExistsError,
  ExampleNotFoundError,
  ExampleRepositoryError,
  ExampleStatus
} from '~/contexts/shared/domain/repositories/_template.repository'

/**
 * DTOs for HTTP requests/responses
 */
export class CreateExampleDto {
  email: string
  name: string
}

export class UpdateExampleDto {
  name?: string
}

export class ExampleResponseDto {
  id: string
  email: string
  name: string
  isActive: boolean
  createdAt: Date
}

export class SearchExampleQueryDto {
  name?: string
  email?: string
  isActive?: string // Will be converted to boolean
  status?: ExampleStatus
  limit?: string // Will be converted to number
  offset?: string // Will be converted to number
}

/**
 * Example Controller - Handles HTTP requests and responses
 *
 * Responsibilities:
 * - HTTP routing and method handling
 * - Request validation and parsing
 * - Delegating to application services
 * - Response mapping and serialization
 * - HTTP-specific error handling
 */
@Controller('examples')
export class ExampleController {
  constructor(private readonly exampleApplicationService: ExampleApplicationService) {}

  /**
   * Create new example
   * POST /examples
   */
  @Post()
  async create(@Body(ValidationPipe) dto: CreateExampleDto): Promise<ExampleResponseDto> {
    try {
      const input: CreateExampleInput = {
        email: dto.email,
        name: dto.name
      }

      const output = await this.exampleApplicationService.createExample(input)
      return this.mapToResponseDto(output)
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Get example by ID
   * GET /examples/:id
   */
  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<ExampleResponseDto> {
    try {
      const output = await this.exampleApplicationService.getExample(id)
      return this.mapToResponseDto(output)
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Search examples with filtering
   * GET /examples?name=value&isActive=true&limit=10
   */
  @Get()
  async search(@Query() query: SearchExampleQueryDto): Promise<ExampleResponseDto[]> {
    try {
      const input: SearchExampleInput = {
        name: query.name,
        email: query.email,
        isActive: query.isActive ? query.isActive === 'true' : undefined,
        status: query.status,
        limit: query.limit ? parseInt(query.limit, 10) : 50,
        offset: query.offset ? parseInt(query.offset, 10) : 0
      }

      const outputs = await this.exampleApplicationService.searchExamples(input)
      return outputs.map(output => this.mapToResponseDto(output))
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Update example
   * PUT /examples/:id
   */
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) dto: UpdateExampleDto
  ): Promise<ExampleResponseDto> {
    try {
      const input: UpdateExampleInput = {
        id,
        name: dto.name
      }

      const output = await this.exampleApplicationService.updateExample(input)
      return this.mapToResponseDto(output)
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Delete example
   * DELETE /examples/:id
   */
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    try {
      await this.exampleApplicationService.deleteExample(id)
      return { message: 'Example deleted successfully' }
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Activate example
   * POST /examples/:id/activate
   */
  @Post(':id/activate')
  async activate(@Param('id', ParseUUIDPipe) id: string): Promise<ExampleResponseDto> {
    try {
      const output = await this.exampleApplicationService.activateExample(id)
      return this.mapToResponseDto(output)
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Create and activate example (complex workflow)
   * POST /examples/create-and-activate
   */
  @Post('create-and-activate')
  async createAndActivate(
    @Body(ValidationPipe) dto: CreateExampleDto
  ): Promise<ExampleResponseDto> {
    try {
      const input: CreateExampleInput = {
        email: dto.email,
        name: dto.name
      }

      const output = await this.exampleApplicationService.createAndActivateExample(input)
      return this.mapToResponseDto(output)
    } catch (error) {
      this.handleError(error)
    }
  }

  // Helper methods

  /**
   * Map application output to response DTO
   */
  private mapToResponseDto(output: ExampleOutput): ExampleResponseDto {
    return {
      id: output.id,
      email: output.email,
      name: output.name,
      isActive: output.isActive,
      createdAt: output.createdAt
    }
  }

  /**
   * Centralized error handling with proper HTTP status codes
   */
  private handleError(error: unknown): never {
    // Domain-specific errors
    if (error instanceof ExampleNotFoundError) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND)
    }

    if (error instanceof ExampleAlreadyExistsError) {
      throw new HttpException(error.message, HttpStatus.CONFLICT)
    }

    if (error instanceof ExampleRepositoryError) {
      throw new HttpException(
        'Internal server error during data operation',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }

    // Validation errors (from value objects or use cases)
    if (
      error instanceof Error &&
      (error.message.includes('Email') ||
        error.message.includes('Name') ||
        error.message.includes('required'))
    ) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }

    // Business rule violations
    if (
      error instanceof Error &&
      (error.message.includes('Cannot') ||
        error.message.includes('already') ||
        error.message.includes('inactive'))
    ) {
      throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY)
    }

    // Generic server error for unexpected exceptions
    console.error('Unexpected controller error:', error)
    throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

/**
 * Alternative Controller Patterns:
 */

/**
 * Query-only controller for read operations
 */
@Controller('examples/queries')
export class ExampleQueryController {
  constructor(private readonly exampleApplicationService: ExampleApplicationService) {}

  @Get('active')
  async getActiveExamples(): Promise<ExampleResponseDto[]> {
    try {
      const input: SearchExampleInput = { isActive: true }
      const outputs = await this.exampleApplicationService.searchExamples(input)
      return outputs.map(output => this.mapToResponseDto(output))
    } catch (error) {
      this.handleError(error)
    }
  }

  @Get('recent')
  async getRecentExamples(@Query('days') days?: string): Promise<ExampleResponseDto[]> {
    try {
      const daysThreshold = days ? parseInt(days, 10) : 7
      const createdAfter = new Date()
      createdAfter.setDate(createdAfter.getDate() - daysThreshold)

      const input: SearchExampleInput = { createdAfter }
      const outputs = await this.exampleApplicationService.searchExamples(input)
      return outputs.map(output => this.mapToResponseDto(output))
    } catch (error) {
      this.handleError(error)
    }
  }

  private mapToResponseDto(output: ExampleOutput): ExampleResponseDto {
    return {
      id: output.id,
      email: output.email,
      name: output.name,
      isActive: output.isActive,
      createdAt: output.createdAt
    }
  }

  private handleError(error: any): never {
    if (error instanceof ExampleNotFoundError) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND)
    }

    console.error('Query controller error:', error)
    throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

/**
 * Command-only controller for write operations
 */
@Controller('examples/commands')
export class ExampleCommandController {
  constructor(private readonly exampleApplicationService: ExampleApplicationService) {}

  @Post('create')
  async create(@Body(ValidationPipe) dto: CreateExampleDto): Promise<ExampleResponseDto> {
    try {
      const input: CreateExampleInput = {
        email: dto.email,
        name: dto.name
      }

      const output = await this.exampleApplicationService.createExample(input)
      return this.mapToResponseDto(output)
    } catch (error) {
      this.handleError(error)
    }
  }

  @Post('bulk-create')
  async bulkCreate(@Body(ValidationPipe) dtos: CreateExampleDto[]): Promise<ExampleResponseDto[]> {
    try {
      const results: ExampleResponseDto[] = []

      for (const dto of dtos) {
        const input: CreateExampleInput = {
          email: dto.email,
          name: dto.name
        }

        const output = await this.exampleApplicationService.createExample(input)
        results.push(this.mapToResponseDto(output))
      }

      return results
    } catch (error) {
      this.handleError(error)
    }
  }

  private mapToResponseDto(output: ExampleOutput): ExampleResponseDto {
    return {
      id: output.id,
      email: output.email,
      name: output.name,
      isActive: output.isActive,
      createdAt: output.createdAt
    }
  }

  private handleError(error: unknown): never {
    if (error instanceof ExampleAlreadyExistsError) {
      throw new HttpException(error.message, HttpStatus.CONFLICT)
    }

    if (error instanceof Error && error.message.includes('required')) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }

    console.error('Command controller error:', error)
    throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
  }
}
