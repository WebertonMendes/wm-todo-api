import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class UsersTable1667920798298 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'tb_users',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: `uuid_generate_v4()`,
            },
            {
              name: 'email',
              type: 'varchar',
              isUnique: true,
            },
            {
              name: 'password',
              type: 'varchar',
            },
            {
              name: 'is_active',
              type: 'boolean',
              default: 'true',
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'now()',
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'now()',
            },
          ],
        }),
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('tb_users');
    }
}
