const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class ProductTag extends Model {}

ProductTag.init(

  {
    id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    product_id:{
      type: DataTypes.INTEGER,
      allowNull: false,      
      references: {
        model: "product",
        key: "id"
      },
      validate:{
        notNull:{
          msg:"Product Id is required!"
        }
      }
    },
    tag_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tag",
        key: "id"
      },
      validate:{
        notNull:{
          msg:"Tag id is required!"
        }
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

module.exports = ProductTag;
