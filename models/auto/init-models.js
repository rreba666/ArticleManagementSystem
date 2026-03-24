import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _article from  "./article.js";
import _article_category from  "./article_category.js";

export default function initModels(sequelize) {
  const article = _article.init(sequelize, DataTypes);
  const article_category = _article_category.init(sequelize, DataTypes);

  article.belongsTo(article_category, { as: "cate", foreignKey: "cate_id"});
  article_category.hasMany(article, { as: "articles", foreignKey: "cate_id"});

  return {
    article,
    article_category,
  };
}
