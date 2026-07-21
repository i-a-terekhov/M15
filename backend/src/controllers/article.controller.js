const ArticleModel = require("../models/article.model");
const ArticleNormalizer = require("../normalizers/article.normalizer");
const CategoryModel = require("../models/category.model");
const CommentModel = require("../models/comment.model");

class ArticleController {

    static async getArticles(req, res) {
        try {
            const itemsPerPage = 8;
            const page = Math.max(1, parseInt(req.query.page, 10) || 1);

            const filter = {};

            if (req.query.categories) {
                const categories = Array.isArray(req.query.categories)
                    ? req.query.categories
                    : [req.query.categories];

                const categoryModels = await CategoryModel.find({
                    url: {$in: categories}
                });

                const categoryModelsIds = categoryModels.map((item) => item.id);
                filter.category = {$in: categoryModelsIds};
            }

            const [articles, articlesCount] = await Promise.all([
                ArticleModel.find(filter)
                    .populate("category")
                    .limit(itemsPerPage)
                    .skip(itemsPerPage * (page - 1)),
                ArticleModel.countDocuments(filter),
            ]);

            const normalizedArticles = articles.map((item) =>
                ArticleNormalizer.normalize(item)
            );

            res.json({
                count: articlesCount,
                pages: Math.ceil(articlesCount / itemsPerPage),
                items: normalizedArticles,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                error: true,
                message: "Ошибка сервера при получении статей",
            });
        }
    }

    static async getTopArticles(req, res) {
        try {
            let articles = await ArticleModel.find()
                .populate("category")
                .limit(4)
                .lean();

            articles = articles.map((item) => ArticleNormalizer.normalize(item));
            res.json(articles);
        } catch (err) {
            console.error(err);
            res.status(500).json({
                error: true,
                message: "Ошибка сервера при получении топовых статей",
            });
        }
    }

    static async getRelatedArticles(req, res) {
        try {
            const {url} = req.params;
            if (!url) {
                return res
                    .status(400)
                    .json({error: true, message: "Не передан параметр url"});
            }

            const article = await ArticleModel.findOne({url});
            if (!article) {
                return res
                    .status(404)
                    .json({error: true, message: "Статья не найдена"});
            }

            let articles = await ArticleModel.find({
                category: article.category.toString(),
                _id: {$ne: article._id},
            })
                .populate("category")
                .limit(2)
                .lean();

            articles = articles.map((item) => ArticleNormalizer.normalize(item));
            res.json(articles);
        } catch (err) {
            console.error(err);
            res.status(500).json({
                error: true,
                message: "Ошибка сервера при получении связанных статей",
            });
        }
    }

    static async getArticle(req, res) {
        try {
            const {url} = req.params;
            if (!url) {
                return res
                    .status(400)
                    .json({error: true, message: "Не передан параметр url"});
            }

            let article = await ArticleModel.findOne({url}).populate('category');
            if (!article) {
                return res
                    .status(404)
                    .json({ error: true, message: "Статья не найдена" });
            }

            // Загружаем только первые 3 комментария и общее количество параллельно
            const [comments, commentsCount] = await Promise.all([
                CommentModel.find({article: article._id})
                    .populate('user')
                    .sort({date: -1})
                    .limit(3),
                CommentModel.countDocuments({article: article._id})
            ]);

            article.comments = comments;
            article.commentsCount = commentsCount;

            res.json(ArticleNormalizer.normalize(article, true));
        } catch (err) {
            console.error(err);
            res.status(500).json({
                error: true,
                message: "Ошибка сервера при получении статьи",
            });
        }
    }
}

module.exports = ArticleController;