import sequelize from "../config/database.js"
import initModels from "./auto/init-models.js"

const models = initModels(sequelize)

export const article = models.article
export const articleCategory = models.article_category

export { sequelize }