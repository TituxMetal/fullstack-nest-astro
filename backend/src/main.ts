import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'

import { AppModule } from '~/app.module'

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())

  await app.listen(process.env.PORT ?? 3000)
}

bootstrap()
