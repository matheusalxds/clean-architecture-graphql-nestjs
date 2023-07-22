import { DataSource } from 'typeorm';
import { DataType, IBackup, IMemoryDb, newDb } from 'pg-mem';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { Repository } from 'typeorm/repository/Repository';
import { v4 as uuid } from 'uuid';

export const PgTestHelper = {
  db: null as unknown as IMemoryDb,
  connection: null as DataSource,
  backup: null as unknown as IBackup,
  async connect(entities?: any[]) {
    this.db = newDb();
    this.db.registerExtension('uuid-ossp', (schema) => {
      schema.registerFunction({
        name: 'uuid_generate_v4',
        returns: DataType.uuid,
        implementation: () => uuid(),
        impure: true,
      });
    });
    this.db.public.registerFunction({
      implementation: () => 'test',
      name: 'current_database',
    });
    this.db.public.registerFunction({
      implementation: () => 'test',
      name: 'version',
    });
    this.connection = await this.db.adapters.createTypeormDataSource({
      type: 'postgres',
      entities: entities,
      logging: false,
    });
    await this.initialize();
    await this.sync();
    this.backup = this.db.backup();
  },
  getRepository<Entity>(name: EntityTarget<Entity>): Repository<Entity> {
    return this.connection.getRepository(name);
  },
  async initialize() {
    await this.connection.initialize();
  },
  async disconnect() {
    await this.connection.destroy();
  },
  restore() {
    this.backup.restore();
  },
  async sync() {
    await this.connection.synchronize();
  },
};

// import { IBackup, IMemoryDb, newDb } from 'pg-mem';
// import { EntityTarget, Repository } from 'typeorm';
//
// export const PgTestHelper = {
//   db: null as unknown as IMemoryDb,
//   connection: null as any,
//   backup: null as unknown as IBackup,
//   async connect(entities?: any[]) {
//     this.db = newDb();
//     this.db.public.registerFunction({
//       implementation: () => 'test',
//       name: 'current_database',
//     });
//     this.connection = await this.db.adapters.createTypeormDataSource({
//       type: 'postgres',
//       entities: entities ?? ['src/infra/db/pg/entities/index.ts'],
//     });
//     await this.sync();
//     this.backup = this.db.backup();
//   },
//   restore() {
//     this.backup.restore();
//   },
//   async disconnect() {
//     await this.connection.close();
//   },
//   async sync() {
//     await this.connection.synchronize();
//   },
//   getRepository<Entity>(name: EntityTarget<Entity>): Repository<Entity> {
//     return this.connection.getRepository(name);
//   },
// };
