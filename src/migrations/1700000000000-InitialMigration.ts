import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class InitialMigration1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'login',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'version',
            type: 'int',
            default: 1,
          },
          {
            name: 'createdAt',
            type: 'bigint',
          },
          {
            name: 'updatedAt',
            type: 'bigint',
          },
        ],
      }),
      true,
    );

    // Create artists table
    await queryRunner.createTable(
      new Table({
        name: 'artists',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'grammy',
            type: 'boolean',
          },
        ],
      }),
      true,
    );

    // Create albums table
    await queryRunner.createTable(
      new Table({
        name: 'albums',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'year',
            type: 'int',
          },
          {
            name: 'artistId',
            type: 'uuid',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create tracks table
    await queryRunner.createTable(
      new Table({
        name: 'tracks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'duration',
            type: 'int',
          },
          {
            name: 'artistId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'albumId',
            type: 'uuid',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create enum type for favorites
    await queryRunner.query(
      `CREATE TYPE "favorite_type_enum" AS ENUM('artist', 'album', 'track')`,
    );

    // Create favorites table
    await queryRunner.createTable(
      new Table({
        name: 'favorites',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['artist', 'album', 'track'],
            enumName: 'favorite_type_enum',
          },
          {
            name: 'entityId',
            type: 'uuid',
          },
        ],
      }),
      true,
    );

    // Create foreign keys
    await queryRunner.createForeignKey(
      'albums',
      new TableForeignKey({
        columnNames: ['artistId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'artists',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'tracks',
      new TableForeignKey({
        columnNames: ['artistId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'artists',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'tracks',
      new TableForeignKey({
        columnNames: ['albumId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'albums',
        onDelete: 'SET NULL',
      }),
    );

    // Create unique index for favorites
    await queryRunner.createIndex(
      'favorites',
      new TableIndex({
        columnNames: ['type', 'entityId'],
        isUnique: true,
      }),
    );

    // Enable UUID extension (if not already enabled)
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('favorites', true);
    await queryRunner.query(`DROP TYPE IF EXISTS "favorite_type_enum"`);
    await queryRunner.dropTable('tracks', true);
    await queryRunner.dropTable('albums', true);
    await queryRunner.dropTable('artists', true);
    await queryRunner.dropTable('users', true);
  }
}
