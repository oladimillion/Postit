'use strict';

export default (sequelize, DataTypes) => {
  const GroupMessages = sequelize.define('GroupMessages', {
    // id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   primaryKey: true,
    // },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please login in first"
        },
      },
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please login in first"
        },
      },
    },
    messageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please login in first"
        },
      },
    },
  }, {
    setterMethods: {
      setIds() {
        this.setDataValues("userId", arguments[0]);
        this.setDataValues("groupId", arguments[1]);
        this.setDataValues("messageId", arguments[2]);
        return true;
      },
    }
  });

  return GroupMessages;
}