import db from './db.js';

async function getAllProjects() {
    const sql = `
        SELECT p.*, o.name AS organization_name 
        FROM project p 
        JOIN organization o ON p.organization_id = o.organization_id
        ORDER BY p.date ASC;
    `;

    try {
        const result = await db.query(sql);
        return result.rows;
    } catch (error) {
        console.error("Error in getAllProjects model:", error.message);
        throw error;
    }
}

export { getAllProjects };