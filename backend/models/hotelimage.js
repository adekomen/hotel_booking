import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export default class HotelImage extends Model {
  static associate(models) {
    HotelImage.belongsTo(models.Hotel, {
      foreignKey: 'hotel_id',
      as: 'hotel'
    });
  }
}

HotelImage.init({
  hotel_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  is_primary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'HotelImage',
});

export { HotelImage };