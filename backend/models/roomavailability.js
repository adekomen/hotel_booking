import { Model, DataTypes } from 'sequelize';

export default class RoomAvailability extends Model {
  static associate(models) {
    RoomAvailability.belongsTo(models.Room, {
      foreignKey: 'room_id',
      as: 'room'
    });
  }
}

RoomAvailability.init({
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  is_available: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'RoomAvailability',
});

export { RoomAvailability };