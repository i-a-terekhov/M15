const CategoryModel = require("../models/category.model");
const CategoryNormalizer = require("../normalizers/category.normalizer");

class CategoryController {
    static async getCategories(req, res) {
        try {
            const categories = await CategoryModel.find().lean();

            const normalized = categories.map((item) =>
                CategoryNormalizer.normalize(item)
            );

            return res.json(normalized);
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: true,
                message: "Ошибка сервера при получении категорий",
            });
        }
    }
}

module.exports = CategoryController;