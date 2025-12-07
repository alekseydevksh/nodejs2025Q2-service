import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { User } from '../user/entities/user.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';
import { Favorite } from '../favorites/entities/favorites.entity';

config();

const isDockerContainer = existsSync('/.dockerenv');

const getRequiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const getDbHost = (): string => {
  const dbHost = getRequiredEnv('POSTGRES_HOST');
  if (!isDockerContainer && dbHost === 'postgres') {
    return 'localhost';
  }
  return dbHost;
};

export const typeormConfig: DataSourceOptions = {
  type: 'postgres',
  host: getDbHost(),
  port: Number.parseInt(getRequiredEnv('POSTGRES_PORT'), 10),
  username: getRequiredEnv('POSTGRES_USER'),
  password: getRequiredEnv('POSTGRES_PASSWORD'),
  database: getRequiredEnv('POSTGRES_DB'),
  entities: [User, Artist, Album, Track, Favorite],
  migrations: [
    join(__dirname, '../migrations/*.ts'),
    join(__dirname, '../migrations/*.js'),
  ],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
};

const dataSource = new DataSource(typeormConfig);
export default dataSource;
