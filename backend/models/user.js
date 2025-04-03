import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export default class User extends Model {
  static associate(models) {
    User.hasMany(models.Booking, {
      foreignKey: 'user_id',
      as: 'bookings',
    });

    User.belongsToMany(models.Hotel, {
      through: 'Favorites',
      foreignKey: 'user_id',
      as: 'favorite_hotels',
    });
  }
}

User.init({
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  sexe: {
    type: DataTypes.ENUM('Masculin', 'Féminin'),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'simple-user'),
    allowNull: false,
    defaultValue: 'simple-user'
  }
}, {
  sequelize,
  modelName: 'User',
});