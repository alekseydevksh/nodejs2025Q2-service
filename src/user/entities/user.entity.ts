import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  VersionColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

const bigintTransformer = {
  to: (value: number): string => value?.toString(),
  from: (value: string | number) =>
    typeof value === 'string' ? Number.parseInt(value, 10) : value,
};

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  login: string;

  @Column({ type: 'text' })
  @Exclude()
  password: string;

  @VersionColumn()
  version: number;

  @Column({ type: 'bigint', transformer: bigintTransformer })
  createdAt: number;

  @Column({ type: 'bigint', transformer: bigintTransformer })
  updatedAt: number;

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = Date.now();
  }

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
