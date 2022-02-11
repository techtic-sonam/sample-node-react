import { Exclude } from 'class-transformer';
import { PasswordTransformer } from 'src/shared/dto/password.transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Roles } from './role.entity';
@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Exclude()
  @Column({
    select: false,
    name: 'password',
    length: 255,
    transformer: new PasswordTransformer(),
  })
  password: string;

  @Column()
  role_id: number;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;

  @DeleteDateColumn()
  public deleted_at: Date;

  @OneToOne(() => Roles)
  @JoinColumn({ name: 'role_id' })
  roles: Roles;
}
