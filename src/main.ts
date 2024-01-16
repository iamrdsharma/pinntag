import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { instance } from './logger/winston.logger';
import helmet from 'helmet';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: instance,
    }),
  });
  app.enableCors({
    origin: function (origin, callback) {
      if (1 || !origin) {
        if (origin != '') {
          callback(null, true);
        }
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  // app.use(cookieParser());
  app.use(helmet());

  //VALIDATION PIPES
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        var error = {};
        errors.map((item) => {
          var errMsg = '';
          Object.keys(item.constraints).forEach(function eachKey(key) {
            errMsg = item.constraints[key];
          });
          error[item.property] = errMsg;
        });
        return new BadRequestException([error]);
      },
    }),
  );
  const apiPath = 'api';
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Pinntag')
    .setDescription('Pinntag API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`/${apiPath}/docs`, app, document);
  await app.listen(3003);
}
bootstrap();
