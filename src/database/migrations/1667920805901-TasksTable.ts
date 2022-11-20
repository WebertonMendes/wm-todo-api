import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TasksTable1667920805901 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'tb_tasks',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              default: `uuid_generate_v4()`,
            },
            {
              name: 'description',
              type: 'varchar',
            },
            {
              name: 'user_id',
              type: 'uuid',
            },
            {
              name: 'attachment',
              type: 'boolean',
              default: 'false',
            },
            {
              name: 'category_id',
              type: 'numeric',
              isNullable: true,
            },
            {
              name: 'is_finished',
              type: 'boolean',
              default: 'false',
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
          foreignKeys: [
            {
              name: 'fk_task_user',
              referencedColumnNames: ['id'],
              referencedTableName: 'tb_users',
              columnNames: ['user_id'],
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE',
            },
          ],
        }),
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('tb_tasks');
    }
}
