import { Sequelize } from "sequelize";
// 连接数据库
const sequelize = new Sequelize('articlemanagementsystem', 'root', '', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: false,  // 设为 true 可以看到生成的 SQL 语句
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: false,  // 不自动添加 createdAt/updatedAt
        freezeTableName: true // 模型名与表名一致
    }
})

// 测试数据库连接
try {
    await sequelize.authenticate()
    console.log('数据库连接成功')
} catch (error) {
    console.error('数据库连接失败:', error)
}

export default sequelize