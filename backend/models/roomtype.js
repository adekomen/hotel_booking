import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export default class RoomType extends Model {
  static associate(models) {
    RoomType.hasMany(models.Room, {
      foreignKey: 'room_type_id',
      as: 'rooms'
    });
  }
}

RoomType.init({
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  base_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'RoomType',
});