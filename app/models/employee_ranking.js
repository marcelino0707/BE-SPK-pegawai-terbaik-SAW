'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee_ranking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Employee }) {
      this.belongsTo(Employee, {foreignKey: 'pegawai_id'})
    }
  };
  Employee_ranking.init({
    pegawai_id: DataTypes.INTEGER,
    nilai_kedisiplinan: DataTypes.INTEGER,
    nilai_kerjasama: DataTypes.INTEGER,
    nilai_inisiatif: DataTypes.INTEGER,
    nilai_kinerja: DataTypes.INTEGER,
    nilai_tanggungJawab: DataTypes.INTEGER,
    nilai_prestasi: DataTypes.INTEGER,
    normalisasi_kedisiplinan: DataTypes.FLOAT,
    normalisasi_kerjasama: DataTypes.FLOAT,
    normalisasi_inisiatif: DataTypes.FLOAT,
    normalisasi_kinerja: DataTypes.FLOAT,
    normalisasi_tanggungJawab: DataTypes.FLOAT,
    normalisasi_prestasi: DataTypes.FLOAT,
    nilai_akhir_kedisiplinan: DataTypes.FLOAT,
    nilai_akhir_kerjasama: DataTypes.FLOAT,
    nilai_akhir_inisiatif: DataTypes.FLOAT,
    nilai_akhir_kinerja: DataTypes.FLOAT,
    nilai_akhir_tanggungJawab: DataTypes.FLOAT,
    nilai_akhir_prestasi: DataTypes.FLOAT,
    total: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Employee_ranking',
    
    // Fitur SoftDelete
    paranoid: true,

    // Custom name column
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });
  return Employee_ranking;
};