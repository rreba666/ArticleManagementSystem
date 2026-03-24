import { article, articleCategory } from '../models/index.js'
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';

// 获取全部文章
export const getAllArticles = async (req, res) => {
    try {
        let { page = 1, pageSize = 3, keyword = '', cate_id } = req.query
        page = parseInt(page)
        pageSize = parseInt(pageSize)
        let offset = (page - 1) * pageSize
        let where = {}
        if (keyword) {
            where.title = {
                [Op.like]: `%${keyword}%`
            }
        }
        if (cate_id) {
            where.cate_id = parseInt(cate_id)
        }

        const { count, rows } = await article.findAndCountAll({
            where,
            include: [{
                model: articleCategory,
                as: 'cate',
                attributes: ['id', 'cate_name']
            }],
            order: [['date', 'DESC']],
            limit: pageSize,
            offset: offset,
        })
        const categories = await articleCategory.findAll()

        res.json({
            code: 20000,
            msg: '获取成功',
            data: rows,
            total: count,
            page: parseInt(page),
            categories,
            pageSize: parseInt(pageSize),
            totalPages: Math.ceil(count / pageSize)
        })

    } catch (e) {
        console.error('获取文章失败:', e);
        res.status(500).json({ code: 50000, msg: e.message });

    }
}

// 获取指定文章
export const getArticleById = async (req, res) => {

    try {
        let { id } = req.query
        
        let task = await article.findByPk(Number(id))

        if (task) {
            res.json({
                code: 20000,
                data: task
            });
        }
        else {
            res.json({
                code: 20001,
                msg: '文章不存在'
            });
        }
    }

    catch (error) {
        res.json({ code: 50000, msg: error.message });

    }
}

// 新增文章
export const createArticle = async (req, res) => {
    try {
        let { title, text, cate_id } = req.body
        if (!title || !text) {
            // 删除上传的文件
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return res.json({ code: 40001, msg: '标题和内容不能为空' });
        }
        const existingArticle = await article.findOne({
            where: { title: title.trim() }
        })
        if (existingArticle) {
            if (req.file) {
                fs.unlinkSync(req.file.path)
            }
            return res.json({
                code: 20003,
                msg: '添加失败，文章不能重名'
            })
        }

        let imgPath = null
        if (req.file) {
            let { originalname, destination, filename } = req.file
            let ext = path.extname(originalname)
            let newFilename = filename + ext //获取后缀名
            let newPath = path.join(destination, newFilename)

            fs.renameSync(req.file.path, newPath)
            imgPath = `/upload/${newFilename}`
        }
        const newArticle = await article.create({
            title,
            text,
            cate_id,
            img: imgPath,
            date: Math.floor(Date.now() / 1000)
        });
        res.json({
            code: 20000,
            msg: '添加成功',
            data: newArticle
        })

    }
    catch (err) {
        console.log('添加错误:', err);
        // 出错时删除已上传的文件
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path)
        }
        res.json({ code: 50000, msg: err.message })
    }


}

// 更新文章
export const updateArticle = async (req, res) => {
    try {
        const { id } = req.query;
        const { title, text, cate_id } = req.body;

        const articleData = await article.findByPk(id);
        if (!articleData) {
            // 删除上传的临时文件
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return res.json({ code: 20001, msg: '文章不存在' });
        }

        const updateData = {};

        if (title !== undefined && title !== null && title.trim() !== '') {
            updateData.title = title.trim();
        }
        if (text !== undefined && text !== null && text.trim() !== '') {
            updateData.text = text.trim();
        }
        if (cate_id !== undefined && cate_id !== null && cate_id !== '') {
            updateData.cate_id = parseInt(cate_id);
        }

        // 处理图片更新
        if (req.file) {
            // 保存新图片
            const { originalname, destination, filename } = req.file;
            const ext = path.extname(originalname);
            const newFilename = filename + ext;
            const newPath = path.join(destination, newFilename);
            fs.renameSync(req.file.path, newPath);
            updateData.img = `/upload/${newFilename}`;
        }

        // 如果没有更新内容
        if (Object.keys(updateData).length === 0) {
            return res.json({ code: 40001, msg: '没有需要更新的内容' });
        }

        // 执行更新
        await articleData.update(updateData);

        res.json({
            code: 20000,
            msg: '更新成功',
            data: articleData
        });

    } catch (e) {
        console.error('更新失败:', e);
        // 出错时删除上传的临时文件
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ code: 50000, msg: e.message });
    }

}

// 删除文章
export const delArticle = async (req, res) => {
    try {
        let { id } = req.query
        const result = await article.destroy({ where: { id: parseInt(id) } });
        if (result === 0) {
            return res.json({ code: 20002, msg: '删除失败，文章不存在' });
        }
        res.json({
            code: 20000, msg: '删除成功'
        })
    }
    catch (err) {
        res.status(500).json({ code: 50000, msg: err.message });
    }






}