import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class article extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "标题"
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "描述"
    },
    date: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('unix_timestamp'),
      comment: "时间"
    },
    img: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "封面"
    },
    cate_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'article_category',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'article',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "article_article_category_id_fk",
        using: "BTREE",
        fields: [
          { name: "cate_id" },
        ]
      },
    ]
  });
  }
}
