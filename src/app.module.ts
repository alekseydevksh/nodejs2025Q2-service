import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { existsSync } from 'node:fs';
import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { FavoritesModule } from './favorites/favorites.module';
import { LoggingModule } from './common/logging/logging.module';
import { User } from './user/entities/user.entity';
import { Artist } from './artist/entities/artist.entity';
import { Album } from './album/entities/album.entity';
import { Track } from './track/entities/track.entity';
import { Favorite } from './favorites/entities/favorites.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isDockerContainer = existsSync('/.dockerenv');
        let dbHost = configService.get('POSTGRES_HOST');

        // Convert 'postgres' to 'localhost' when running locally (not in Docker)
        if (!isDockerContainer && dbHost === 'postgres') {
          dbHost = 'localhost';
        }

        return {
          type: 'postgres',
          host: dbHost,
          port: configService.get('POSTGRES_PORT'),
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DB'),
          entities: [User, Artist, Album, Track, Favorite],
          synchronize: false,
          logging: configService.get('NODE_ENV') === 'development',
          retryAttempts: 20,
          retryDelay: 5000,
          extra: {
            connect_timeout: 10000,
          },
        };
      },
      inject: [ConfigService],
    }),
    LoggingModule,
    UserModule,
    TrackModule,
    ArtistModule,
    AlbumModule,
    FavoritesModule,
  ],
})
export class AppModule {}
