import { Sequelize, DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      room_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Rooms',
          key: 'id'
        }
      },
      check_in_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      check_out_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isAfterCheckIn(value) {
            if (this.check_in_date && value <= this.check_in_date) {
              throw new Error("La date de départ doit être après la date d'arrivée.");
            }
          },
        },
      },
      adults: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      children: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
        allowNull: false,
        defaultValue: 'pending'
      },
      payment_status: {
        type: DataTypes.ENUM('pending', 'paid', 'refunded', 'failed'),
        allowNull: false,
        defaultValue: 'pending'
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Bookings');
  }
};