export default (sequelize, DataTypes) => {
  const UserGroups = sequelize.define('UserGroups', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "unique",
    },
    groupId: {
      allowNull: false,
      unique: "unique",
      type: DataTypes.INTEGER,
    }
  });
  return UserGroups;
}