import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    getCategoriesByServiceProjectId,
    updateCategoryAssignments,
    insertCategory,
    updateCategory
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

const showNewCategoryForm = (req, res) => {
    res.render('new-category', { title: 'Create New Category', error: null });
};

const processNewCategoryForm = async (req, res) => {
    const { name } = req.body;

    if (!name || name.length < 3 || name.length > 100) {
        return res.render('new-category', {
            title: 'Create New Category',
            error: 'Category name must be between 3 and 100 characters.'
        });
    }

    try {
        await insertCategory(name);

        req.flash('success', 'Category created successfully.');
        res.redirect('/categories');

    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).send("Error creating category");
    }
};

const showEditCategoryForm = async (req, res) => {
    try {
        const category = await getCategoryById(req.params.id);
        if (!category) return res.status(404).send("Category not found");

        res.render('edit-category', { title: 'Edit Category', category, error: null });
    } catch (error) {
        console.error("Error fetching category for edit:", error);
        res.status(500).send("Internal Server Error");
    }
};

const processEditCategoryForm = async (req, res) => {
    const { name } = req.body;
    const categoryId = req.params.id;

    if (!name || name.length < 3 || name.length > 100) {
        return res.render('edit-category', {
            title: 'Edit Category',
            category: { category_id: categoryId, name },
            error: 'Category name must be between 3 and 100 characters.'
        });
    }

    try {
        await updateCategory(categoryId, name);

        req.flash('success', 'Category updated successfully.');
        res.redirect('/categories');

    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).send("Error updating category");
    }
};
export {
    showCategoryDetailsPage,
    showCategoriesPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
};