import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const cors = require('cors');
  const app = await NestFactory.create(AppModule);
  app.use(cors());

  // const allowed_origins = [...HOST_WEB.split(';')];
  const allowed_origins = ['http://localhost:5173'];

  app.enableCors({ origin: allowed_origins });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.enableCors({
    origin: [process.env.FRONT_WEB_URL, 'http://localhost:3001'],
    methods: ['GET, PUT, PATCH, POST, DELETE'],
    credentials: true,
  });

  // app.use(helmet())
  // app.use(new CustomCorsMiddleware().use)

  SwaggerModule.setup(
    'doc/api',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Cornext API')
        .setVersion('1.0')
        .addBearerAuth()
        .build(),
    ),
  );

  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('docs', app, document);

  await app.listen(3000).catch((e) => {
    console.log(e);
  });
}
bootstrap();
