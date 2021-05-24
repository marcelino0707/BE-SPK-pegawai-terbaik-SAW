'use strict';
const bycrypt = require('bcrypt')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bycrypt.hash('spk123!', 10) 
    const hashedPasswordTest = await bycrypt.hash('asd123', 10) 
    //10 => salt
    await queryInterface.bulkInsert('Users', [{
      email: 'ahongcool39@gmail.com',
      username: 'admin',
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date()
  },{
      email: 'test@gmail.com',
      username: 'test',
      password: hashedPasswordTest,
      created_at: new Date(),
      updated_at: new Date()
  }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
