import { Module } from '@nestjs/common';
import * as sql from 'mssql';

@Module({
  providers: [
    {
      provide: 'SQL_CONNECTION',
      useFactory: async () => {
        const config = {
          user: 'esteladb',
          password: 'esteladb',
          server: 'DESKTOP-QCUFJAC',
          database: 'odontologiadb',
          options: {
            encrypt: true,
            trustServerCertificate: true,
          },
        };
        const pool = new sql.ConnectionPool(config);
        await pool.connect();
        return pool;
      },
    },
  ],
  exports: ['SQL_CONNECTION'],
})
export class DatabaseModule {}