import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class cretaeCustomerTable1638156739744 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'customer',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'supplier_id',
            type: 'int',
            isNullable: false,
          },

          {
            name: 'account_code',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'debtor_no',
            type: 'varchar',
            length: '200',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '200',
            isNullable: false,
          },
          {
            name: 'mobile_no',
            type: 'varchar',
            length: '15',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'datetime',
            isNullable: true,
          },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey(
      'customer',
      new TableForeignKey({
        columnNames: ['supplier_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'supplier',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('customer');
    const customerForeignKeySupplier = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('supplier_id') !== -1,
    );
    await queryRunner.dropForeignKey('customer', customerForeignKeySupplier);

    await queryRunner.dropTable('customer', true);
  }
}
