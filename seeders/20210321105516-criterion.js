'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Criteria', [{
        nama_kriteria: 'Kedisiplinan',
        bobot_kriteria: '20',
        sifat_kriteria: 'benefit',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        nama_kriteria: 'Kerjasama',
        bobot_kriteria: '15',
        sifat_kriteria: 'benefit',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        nama_kriteria: 'Inisiatif',
        bobot_kriteria: '15',
        sifat_kriteria: 'benefit',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        nama_kriteria: 'Kinerja',
        bobot_kriteria: '20',
        sifat_kriteria: 'benefit',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        nama_kriteria: 'Tanggung Jawab',
        bobot_kriteria: '20',
        sifat_kriteria: 'benefit',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        nama_kriteria: 'Prestasi',
        bobot_kriteria: '10',
        sifat_kriteria: 'benefit',
        created_at: new Date(),
        updated_at: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Criteria', null, {});
  }
};
