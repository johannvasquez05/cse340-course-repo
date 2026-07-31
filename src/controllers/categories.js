import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    getCategoriesByServiceProjectId,
    updateCategoryAssignments
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';

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

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByServiceProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];

    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];

    await updateCategoryAssignments(projectId, categoryIdsArray);

    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

export { showCategoryDetailsPage, showCategoriesPage, showAssignCategoriesForm, processAssignCategoriesForm };