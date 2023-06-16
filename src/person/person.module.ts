import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { TestModule } from 'src/test/test.module';

@Module({
  // imports: [TestModule],
  controllers: [PersonController],
  providers: [
    {
      provide: 'personService',
      useClass: PersonService,
    },
  ],
})
export class PersonModule {}
