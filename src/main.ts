import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { EntityNotFoundExceptionFilter } from './errors/entity-not-found.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new EntityNotFoundExceptionFilter());

  const swaggerOptions = new DocumentBuilder()
    .setTitle('To-Do List API')
    .setDescription('API Documentation "To-Do List"')
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api/v1/docs', app, swaggerDocument);

  await app.listen(process.env.PORT || 3333);

  console.log(`🚀 API: http://localhost:${process.env.APP_PORT}/api/v1/`);
  console.log(`📝 DOC: http://localhost:${process.env.APP_PORT}/api/v1/docs`);
}
bootstrap();
