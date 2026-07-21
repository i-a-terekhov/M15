const CommentModel = require("../models/comment.model");
const ValidationUtils = require("../utils/validation.utils");
const mongoose = require('mongoose');
const CommentNormalizer = require("./../normalizers/comment.normalizer");
const UserCommentActionModel = require("../models/user-comment-action.model");
const config = require("../config/config");
const UserCommentActionNormalizer = require("../normalizers/user-comment-action.normalizer");
const ArticleModel = require("../models/article.model");

class CommentController {
    static async addComment(req, res) {
        try {
            const {error} = ValidationUtils.addCommentValidation(req.body);

            if (error) {
                console.log(error.details);
                return res.status(400).json({error: true, message: error.details[0].message});
            }

            if (!req.user || !req.user.id) {
                return res
                    .status(401)
                    .json({error: true, message: "Необходима авторизация"});
            }

            if (!req.body.article || !mongoose.Types.ObjectId.isValid(req.body.article)) {
                return res.status(400).json({
                    error: true,
                    message: "Некорректный идентификатор статьи",
                });
            }

            let comment = new CommentModel();
            comment.text = req.body.text;
            comment.date = new Date();
            comment.user = new mongoose.Types.ObjectId(req.user.id);
            comment.article = new mongoose.Types.ObjectId(req.body.article);

            await comment.save();

            res.status(201).json({error: false, message: "Комментарий добавлен!"});
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: true,
                message: "Ошибка сервера при добавлении комментария",
            });
        }
    }

    static async getComments(req, res) {
        try {
            const {article} = req.query;

            if (!article) {
                return res.status(400)
                    .json({error: true, message: "Не передан параметр article"});
            }

            if (!mongoose.Types.ObjectId.isValid(article)) {
                return res.status(400).json({
                    error: true,
                    message: "Некорректный идентификатор article",
                });
            }

            const loadCount = 10;
            const rawOffset = parseInt(req.query.offset, 10);
            const offset = Number.isNaN(rawOffset) || rawOffset < 0 ? 0 : rawOffset;

            // Используем Promise.all для параллельной загрузки комментариев и их количества
            const [comments, allCount] = await Promise.all([
                CommentModel.find({article})
                    .populate('user')
                    .sort({date: -1})
                    .skip(offset)
                    .limit(loadCount),
                CommentModel.countDocuments({article})
            ]);

            return res.json({
                allCount: allCount,
                comments: comments.map(item => CommentNormalizer.normalize(item))
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: true,
                message: "Ошибка сервера при получении комментариев",
            });
        }
    }

    static async applyActionComment(req, res) {
        try {
            const {error} = ValidationUtils.applyActionCommentValidation(req.body);

            if (error) {
                console.log(error.details);
                return res.status(400).json({error: true, message: error.details[0].message});
            }

            if (!req.user || !req.user.id) {
                return res
                    .status(401)
                    .json({error: true, message: "Необходима авторизация"});
            }

            const {id} = req.params;
            if (!id) {
                return res.status(400)
                    .json({error: true, message: "Не передан параметр id"});
            }

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    error: true,
                    message: "Некорректный идентификатор комментария",
                });
            }

            let comment = await CommentModel.findOne({_id: id}).populate('user');
            if (!comment) {
                return res.status(404)
                    .json({error: true, message: "Комментарий не найден"});
            }

            let commentUserAction = await UserCommentActionModel.findOne({
                comment: id,
                user: req.user.id,
                action: req.body.action
            }).populate('user');

            if (commentUserAction) {
                if (commentUserAction.action === config.userCommentActions.violate) {
                    return res.status(400)
                        .json({error: true, message: "Это действие уже применено к комментарию"});
                } else {
                    await UserCommentActionModel.deleteOne({_id: commentUserAction._id});

                    if (commentUserAction.action === config.userCommentActions.like) {
                        if (comment.likesCount > 0) {
                            comment.likesCount -= 1;
                        }
                    } else if (commentUserAction.action === config.userCommentActions.dislike) {
                        if (comment.dislikesCount > 0) {
                            comment.dislikesCount -= 1;
                        }
                    }
                    await comment.save();

                    return res.status(200).json({error: false, message: "Успешное действие!"});
                }
            }

            commentUserAction = new UserCommentActionModel();
            commentUserAction.user = new mongoose.Types.ObjectId(req.user.id);
            commentUserAction.comment = new mongoose.Types.ObjectId(id);
            commentUserAction.action = req.body.action;

            const result = await commentUserAction.save();
            if (result) {
                if (commentUserAction.action === config.userCommentActions.like) {
                    let dislikeCommentUserAction = await UserCommentActionModel.findOne({
                        comment: id,
                        user: req.user.id,
                        action: config.userCommentActions.dislike
                    });
                    if (dislikeCommentUserAction) {
                        await UserCommentActionModel.deleteOne({_id: dislikeCommentUserAction._id});
                        if (comment.dislikesCount > 0) {
                            comment.dislikesCount -= 1;
                        }
                    }
                    comment.likesCount += 1;
                } else if (commentUserAction.action === config.userCommentActions.dislike) {
                    let likeCommentUserAction = await UserCommentActionModel.findOne({
                        comment: id,
                        user: req.user.id,
                        action: config.userCommentActions.like
                    });
                    if (likeCommentUserAction) {
                        await UserCommentActionModel.deleteOne({_id: likeCommentUserAction._id});
                        if (comment.likesCount > 0) {
                            comment.likesCount -= 1;
                        }
                    }
                    comment.dislikesCount += 1;
                } else if (commentUserAction.action === config.userCommentActions.violate) {
                    comment.violatesCount += 1;
                }

                await comment.save();
            }

            res.status(200).json({error: false, message: "Успешное действие!"});
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: true,
                message: "Ошибка сервера при применении действия к комментарию",
            });
        }
    }

    static async getCommentActions(req, res) {
        try {
            const {id} = req.params;
            if (!id) {
                return res.status(400)
                    .json({error: true, message: "Не передан параметр id"});
            }

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    error: true,
                    message: "Некорректный идентификатор комментария",
                });
            }

            if (!req.user || !req.user.id) {
                return res
                    .status(401)
                    .json({error: true, message: "Необходима авторизация"});
            }

            let commentUserActions = await UserCommentActionModel.find({
                comment: id,
                user: req.user.id,
                action: {$ne: config.userCommentActions.violate}
            }).lean();

            commentUserActions = commentUserActions.map(item => UserCommentActionNormalizer.normalize(item));

            res.json(commentUserActions);
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: true,
                message:
                    "Ошибка сервера при получении действий пользователя по комментарию",
            });
        }
    }

    static async getArticleCommentActions(req, res) {
        try {
            const {articleId} = req.query;

            if (!articleId) {
                return res.status(400)
                    .json({error: true, message: "Не передан параметр articleId для article"});
            }

            if (!mongoose.Types.ObjectId.isValid(articleId)) {
                return res.status(400).json({
                    error: true,
                    message: "Некорректный идентификатор articleId",
                });
            }

            if (!req.user || !req.user.id) {
                return res
                    .status(401)
                    .json({ error: true, message: "Необходима авторизация" });
            }

            let article = await ArticleModel.findOne({_id: articleId});
            if (!article) {
                return res.status(404)
                    .json({error: true, message: "Статья не найдена"});
            }

            let comments = await CommentModel.find({article: articleId}).sort({date: -1});
            if (!comments || comments.length === 0) {
                return res.json([]);
            }

            let commentUserActions = await UserCommentActionModel.find({
                comment: comments.map((item) => item._id.toString()),
                user: req.user.id,
                action: { $ne: config.userCommentActions.violate },
            }).lean();

            commentUserActions = commentUserActions.map(item => UserCommentActionNormalizer.normalize(item));

            res.json(commentUserActions);
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: true,
                message:
                    "Ошибка сервера при получении действий пользователя по комментариям статьи",
            });
        }
    }
}

module.exports = CommentController;