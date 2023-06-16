import { Global, Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
@Global()
@Module({
  controllers: [TestController],
  providers: [TestService],
  exports: [TestService],
})
export class TestModule {}
