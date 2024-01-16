import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { User, UserSchema } from './user/models/user.model';
import { Role, RoleSchema } from './models/role.model';
import { Category, CategorySchema } from './models/category.model';
import { MailModule } from './mail/mail.module';
import { Logger } from 'winston';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/pinntag'),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      { name: Role.name, schema: RoleSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    AuthModule,
    UserModule,
    MailModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
