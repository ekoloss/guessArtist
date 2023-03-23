import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { configModule } from '@app/utils';
import { UserController } from './user.controller';

@Module({
  imports: [configModule()],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
