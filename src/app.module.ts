import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestModule } from './test/test.module';
import { PersonModule } from './person/person.module';

@Module({
  imports: [TestModule, PersonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
