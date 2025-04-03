import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export default class Favorite extends Model {
  static associate(models) {
    Favorite.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    Favorite.belongsTo(models.Hotel, {
      foreignKey: 'hotel_id',
      as: 'hotel'
    });
  }
}

Favorite.init({
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  hotel_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Favorite',
});