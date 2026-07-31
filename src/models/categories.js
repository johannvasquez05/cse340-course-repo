import db from './db.js';

async function getAllCategories() {
    const sql = `SELECT * FROM category ORDER BY name ASC;`;

    try {
        const result = await db.query(sql);
        return result.rows;
    } catch (error) {
        console.error("Error in getAllCategories model:", error.message);
        throw error;
    }
}

const getCategoryById = async (id) => {
    const query = `SELECT * FROM category WHERE category_id = $1`;
    const result = await db.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name
        FROM category c
        JOIN project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
};

// Map both names to the same function to prevent controller import errors
const getCategoriesByServiceProjectId = getCategoriesByProjectId;

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT p.project_id, p.title
        FROM project p
        JOIN project_category pc ON p.project_id = pc.project_id
        WHERE pc.category_id = $1;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows;
};

const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
}

const updateCategoryAssignments = async (projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}

export { 
    getAllCategories, 
    getCategoryById, 
    getProjectsByCategoryId, 
    getCategoriesByProjectId, 
    getCategoriesByServiceProjectId, 
    updateCategoryAssignments
};