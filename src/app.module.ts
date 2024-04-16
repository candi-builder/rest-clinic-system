import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { UserManagementModule } from './user-management/user-management.module';

@Module({
  imports: [CommonModule, UserManagementModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
