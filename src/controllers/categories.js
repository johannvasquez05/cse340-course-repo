import { getAllCategories, getCategoryById, getProjectsByCategoryId } from '../models/categories.js';

const showCategoriesPage = async (req, res) => {
    try {
        const categories = await getAllCategories();
        const title = 'Project Categories';

        res.render('categories', { title, categories });
    } catch (error) {
        console.error("Error fetching categories for route:", error);
        res.status(500).send("Internal Server Error");
    }
};

const showCategoryDetailsPage = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const category = await getCategoryById(categoryId);
        const projects = await getProjectsByCategoryId(categoryId);

        if (!category) {
            return res.status(404).send("Category not found");
        }

        res.render('category', {
            title: category.name,
            category,
            projects
        });
    } catch (error) {
        console.error("Error fetching category details:", error);
        res.status(500).send("Internal Server Error");
    }
};

export { showCategoryDetailsPage, showCategoriesPage };