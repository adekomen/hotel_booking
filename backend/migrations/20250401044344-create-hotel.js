import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    await queryInterface.createTable('Hotels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      country: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      star_rating: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      has_wifi: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      has_pool: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      has_restaurant: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      has_parking: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      has_gym: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Hotels');
  }
};