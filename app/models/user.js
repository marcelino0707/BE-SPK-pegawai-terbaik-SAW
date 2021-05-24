'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    api_token: DataTypes.STRING,
    resetLink: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    
     // Fitur SoftDelete
     paranoid: true,

     // Custom name column
     createdAt: 'created_at',
     updatedAt: 'updated_at',
     deletedAt: 'deleted_at',
  });
  return User;
};