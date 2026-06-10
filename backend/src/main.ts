import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 3000);

  // Security
  app.use(helmet());
  app.use(compression());
  app.use(morgan('combined'));

  // CORS
  app.enableCors({
    origin: config.get('FRONTEND_URL', '*'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // Global prefix + versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // Global pipes / filters / interceptors
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('SRE EDU OS API')
    .setDescription('Production School ERP REST API — 26 Modules')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth').addTag('Users').addTag('Branches').addTag('Students')
    .addTag('Staff').addTag('Attendance').addTag('Fees').addTag('Academics')
    .addTag('Timetable').addTag('Exam').addTag('Library').addTag('Transport')
    .addTag('Notifications').addTag('Reports')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(port);
  console.log(`\n🚀 SRE EDU OS API running at http://localhost:${port}/api/v1`);
  console.log(`📖 Swagger docs:  http://localhost:${port}/api/docs\n`);
}
bootstrap();
