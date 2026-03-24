import express from 'express';
import upload from '../config/upload.js'
import { getAllArticles, getArticleById, createArticle, updateArticle, delArticle } from '../controllers/articleController.js'

const router = express.Router();

router.get('/getArticles', getAllArticles)
router.get('/getArticleById', getArticleById)
router.post('/createArticle', upload.single('img'), createArticle)
router.post('/updateArticle', upload.single('img'), updateArticle)
router.delete('/delArticle', delArticle)


export default router;