'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Employee_rankings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pegawai_id: {
        type: Sequelize.INTEGER
      },
      nilai_kedisiplinan: {
        type: Sequelize.INTEGER
      },
      nilai_kerjasama: {
        type: Sequelize.INTEGER
      },
      nilai_inisiatif: {
        type: Sequelize.INTEGER
      },
      nilai_kinerja: {
        type: Sequelize.INTEGER
      },
      nilai_tanggungJawab: {
        type: Sequelize.INTEGER
      },
      nilai_prestasi: {
        type: Sequelize.INTEGER
      },
      normalisasi_kedisiplinan: {
        type: Sequelize.FLOAT
      },
      normalisasi_kerjasama: {
        type: Sequelize.FLOAT
      },
      normalisasi_inisiatif: {
        type: Sequelize.FLOAT
      },
      normalisasi_kinerja: {
        type: Sequelize.FLOAT
      },
      normalisasi_tanggungJawab: {
        type: Sequelize.FLOAT
      },
      normalisasi_prestasi: {
        type: Sequelize.FLOAT
      },
      nilai_akhir_kedisiplinan: {
        type: Sequelize.FLOAT
      },
      nilai_akhir_kerjasama: {
        type: Sequelize.FLOAT
      },
      nilai_akhir_inisiatif: {
        type: Sequelize.FLOAT
      },
      nilai_akhir_kinerja: {
        type: Sequelize.FLOAT
      },
      nilai_akhir_tanggungJawab: {
        type: Sequelize.FLOAT
      },
      nilai_akhir_prestasi: {
        type: Sequelize.FLOAT
      },
      total: {
        type: Sequelize.FLOAT
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      } 
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Employee_rankings');
  }
};