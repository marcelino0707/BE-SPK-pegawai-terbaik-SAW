'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Employee_ranking }) {
      // define association here
      this.hasMany(Employee_ranking, {foreignKey: 'pegawai_id'})
    }
  };
  Employee.init({
    nama_pegawai: { 
      type: DataTypes.STRING,
      allowNull: false,
      field: 'nama_pegawai',
      validate: {
        // notNull: true,
        // {msg: 'Pegawai harus memiliki nama', args: true},
        notEmpty: 
        {msg: 'Nama pegawai tidak boleh kosong'},
      },
      
    },
    nik: {
      type: DataTypes.INTEGER,
      unique: {args: true, msg: 'NIK telah terdaftar'},
      allowNull: false,
      field: 'nik',
      validate: {
        // notNull:
        // {msg: 'Pegawai harus memiliki NIK'},
        notEmpty: 
        {msg: 'NIK pegawai tidak boleh kosong'},
        // isInt: 
        // {msg: 'NIK harus berupa angka' }
      },
    }
  }, {
    sequelize,
    modelName: 'Employee',

    // Fitur SoftDelete
    paranoid: true,

    // Custom name column
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });
  return Employee;
};