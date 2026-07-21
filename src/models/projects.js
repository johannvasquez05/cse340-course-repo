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

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            date
        FROM project
        WHERE organization_id = $1
        ORDER BY date;
    `;
    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId };