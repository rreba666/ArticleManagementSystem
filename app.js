import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { sequelize } from './models/index.js'
import router from './router/articleRoutes.js'

//获取当前文件的绝对路径和所在目录（固定格式）
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(express.static(path.join(__dirname, 'public')))

// 路由
app.use('/', router);

// 404 处理
app.use((req, res) => {
    res.status(404).json({
        code: 404,
        msg: '接口不存在'
    });
});

// 错误处理
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        code: 500,
        msg: '服务器错误'
    });
});


const PORT = 3333;

try {
    await sequelize.sync({ alter: false });
    app.listen(PORT, () => {
        console.log(`服务器运行在 http://localhost:${PORT}`);
    });
} catch (err) {
    console.error('数据库同步失败:', err);
}