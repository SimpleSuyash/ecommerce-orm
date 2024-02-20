9 // import important parts of sequelize library
const { Model, DataTypes, DECIMAL, INTEGER } = require('sequelize');
// import our database connection from config.js
const sequelize = require('../config/connection');

// Initialize Product model (table) by extending off Sequelize's Model class
class Product extends Model {}

// set up fields and rules for Product model
Product.init(
  {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, 
      allowNull: false
    },
    product_name:{
      type: DataTypes.STRING,
      allowNull: false,
      allowNull: false,
      validate:{
        notNull:{
          msg:"Product name is required!"
        },
        notEmpty:{
          msg: "Please provide Product name!"
        }
      }
    },
    price:{
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        // isDecimal: true
        isDecimal:{
          msg: "Price must be a decimal value!"
        },
        notNull:{
          msg:"Price is required!"
        },
        notEmpty:{
          msg: "Please provide price value!"
        },
        min:{
          args: [0],
          msg:"Price must be greater than or equal to 0!"
        }
      }
      //validates that the value is a decimal
    },
    stock:{
      type:DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      validate:{
        isInt:{
          msg: "Stock must be an integer value!"
        },
        notNull:{
          msg:"Stock is required!"
        },
        notEmpty:{
          msg: "Please provide stock value!"
        },
        min:{
          args: [0],
          msg:"Stock must be greater than or equal to 0!"
        }
      }
    },
    category_id:{
      type: DataTypes.INTEGER,
      references: {
        model: "category",
        key: "id"
      }
    }

  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product',
  }
);

module.exports = Product;
