import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { AuthModule } from '../auth/auth.module';
import { CustomerController } from './customer.controller';

@Module({
  controllers: [CustomerController],
  imports: [SharedModule, AuthModule],
})
export class CustomerModule {}
