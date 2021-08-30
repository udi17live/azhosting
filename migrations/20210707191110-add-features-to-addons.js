'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'Addons',
      'features',
     Sequelize.STRING
    );
  }
};
