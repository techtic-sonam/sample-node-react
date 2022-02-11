import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerAddress } from './address.entity';
import { Contract } from './contract.entity';
import { Supplier } from './supplier.entity';

export enum UserStatus {
  active = 'Active',
}

@Entity('customer')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  supplier_id: number;

  @Column()
  account_code: string;

  @Column()
  debtor_no: string;

  @Column()
  status: string;

  @Column()
  mobile_no: string;

  @CreateDateColumn({ select: false })
  public created_at: Date;

  @UpdateDateColumn({ select: false })
  public updated_at: Date;

  @DeleteDateColumn({ select: false })
  public deleted_at: Date;

  @ManyToOne((type) => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @OneToMany(() => CustomerAddress, (cusAdd) => cusAdd.customer_data)
  customer_address: CustomerAddress[];

  @OneToMany(() => Contract, (contract) => contract.customer)

  contracts: Contract[]
}
