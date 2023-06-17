import { Global, Module, NestModule } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { myMideware } from 'src/aop/midware';
@Global()
@Module({
  controllers: [TestController],
  providers: [TestService],
  exports: [TestService],
})
export class TestModule implements NestModule {
  configure(consumer) {
    consumer.apply(myMideware).forRoutes(TestController);
  }
}
