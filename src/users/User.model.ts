import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../utils/DBCONNECTION';

// Define the attributes for the User model
interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  forgetotp: number | null;
  forgetotpexptime: Date | null;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public forgetotp!: number;
  public forgetotpexptime!: Date



  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the User model
User.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  forgetotpexptime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  forgetotp: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

}, {
  sequelize,
  tableName: 'users',
});

export default User;
