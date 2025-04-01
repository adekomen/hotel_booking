import { Model, DataTypes } from 'sequelize';

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
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  profile_picture: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  preferred_language: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'fr'
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'User',
});