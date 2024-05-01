import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { UploadFileModule } from './upload-file/upload-file.module';
import { MulterModule } from '@nestjs/platform-express';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { GatewayModule } from './webSockets/gateway/gateway.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    ConfigModule.forRoot( {isGlobal: true} ),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forRootAsync(
      {
        imports: [ConfigModule , GatewayModule],
        useFactory: (configService: ConfigService) => ({
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          synchronize: true,
          entities: [__dirname + '/**/*.entity{.js, .ts}']
        }),
        inject: [ConfigService]
      }
    ),
    MulterModule.register({ dest: './uploads' }),
    UserModule,
    AuthModule,
    PostsModule,
    RoomModule,
    UploadFileModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
