import db from './db.js';

/**
 * Fetches all categories from the database.
 */
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

export { getAllCategories };