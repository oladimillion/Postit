'use strict';

export default (sequelize, DataTypes) => {
  const Groups = sequelize.define('Groups', {
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please login in first"
        },
      },
    },
    groupName: {
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
      }
    },

  });

  // Groups.associate = (models) => {
  //   // 1 to many with board
  //   Groups.hasMany(models.Messages, {
  //     foreignKey: 'messageId',
  //   });

  //   Groups.belongsToMany(models.Users, {
  //     through: "UserGroups"
  //   });
  // }

  return Groups;
}