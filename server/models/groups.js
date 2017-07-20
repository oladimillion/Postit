'use strict';

export default (sequelize, DataTypes) => {
  const Groups = sequelize.define('Groups', {
    groupId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    group_name: {
      allowNull: false,
      unique: {
        msg: "Group name already exist"
      },
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Group name field cannot be empty"
        },
        len: {
          args: [6, 20],
          msg: "Group name should be between 6 and 20"
        },
        length: (msg) => {
          if (msg.length < 1) {
            throw new Error("Group name field cannot be empty");
          }
        }
      }
    },
    group_admin: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Make sure are logged in"
        },
        len: {
          args: [6, 20],
          msg: "Username should be between 6 and 20"
        },
        length: (msg) => {
          if (msg.length < 1) {
            throw new Error("Make sure are logged in");
          }
        }
      }
    },

  });
  return Groups;
}