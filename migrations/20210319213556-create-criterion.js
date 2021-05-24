'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Criteria', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama_kriteria: {
        allowNull: false,
        type: Sequelize.STRING
      },
      bobot_kriteria: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      sifat_kriteria: {
        allowNull: false,
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Criteria');
  }
};