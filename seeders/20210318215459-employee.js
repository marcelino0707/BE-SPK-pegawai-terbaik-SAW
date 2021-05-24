'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Employees', [{
        nama_pegawai: 'Dennis Ritchie',
        nik: 123,
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        nama_pegawai: 'Mark Zuckerberg',
        nik: 234,
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        nama_pegawai: 'Steve Wozniak',
        nik: 345,
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        nama_pegawai: 'Bill Gates',
        nik: 456,
        created_at: new Date(),
        updated_at: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Employees', null, {});
  }
};
