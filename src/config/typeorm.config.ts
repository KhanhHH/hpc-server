import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '123',
  database: 'hpc',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  // entities: ["src/**/**.entity{.ts,.js}"],
  synchronize: true,
};
