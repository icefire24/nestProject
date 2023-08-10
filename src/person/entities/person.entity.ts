import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'person',
})
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
