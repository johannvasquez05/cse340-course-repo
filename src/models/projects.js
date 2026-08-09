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

const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT 
            p.project_id, 
            p.title, 
            p.description, 
            p.date, 
            p.location, 
            p.organization_id, 
            o.name AS organization_name
        FROM project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date ASC
        LIMIT $1;
    `;
    const queryParams = [number_of_projects];
    const result = await db.query(query, queryParams);
    return result.rows;
};

const getProjectDetails = async (id) => {
    const query = `
        SELECT 
            p.project_id, 
            p.title, 
            p.description, 
            p.date, 
            p.location, 
            p.organization_id, 
            o.name AS organization_name
        FROM project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;
    const queryParams = [id];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows[0] : null;
};

const createProject = async (title, description, location, date, organizationId) => {
    const query = `
        INSERT INTO project (title, description, location, date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}

const updateProject = async (projectId, projectData) => {
    const { title, date, location, description, organization_id } = projectData;

    const query = `
        UPDATE project
        SET title = $1, date = $2, location = $3, description = $4, organization_id = $5
        WHERE project_id = $6
        RETURNING *;
    `;

    const values = [title, date, location, description, organization_id, projectId];
    const result = await db.query(query, values);

    if (result.rowCount === 0) {
        throw new Error("Project not found or no changes made.");
    }

    return result.rows[0];
};

async function addVolunteer(userId, projectId) {
    // Replaced MySQL's "INSERT IGNORE" with Postgres's "ON CONFLICT DO NOTHING"
    // Note: This requires a unique constraint on (user_id, project_id) in your database schema.
    const sql = `
        INSERT INTO project_volunteers (user_id, project_id) 
        VALUES ($1, $2) 
        ON CONFLICT DO NOTHING
    `;
    return db.query(sql, [userId, projectId]);
}

async function removeVolunteer(userId, projectId) {
    // Replaced ? with $1 and $2
    const sql = 'DELETE FROM project_volunteers WHERE user_id = $1 AND project_id = $2';
    return db.query(sql, [userId, projectId]);
}

async function getVolunteeredProjects(userId) {
    // Replaced ? with $1 and adapted the return object for the 'pg' library
    const sql = `
        SELECT p.* 
        FROM project p
        JOIN project_volunteers pv ON p.project_id = pv.project_id
        WHERE pv.user_id = $1
    `;
    const result = await db.query(sql, [userId]);
    return result.rows;
}

async function checkVolunteerStatus(userId, projectId) {
    // Replaced ? with $1 and $2, and adapted the return object
    const sql = 'SELECT * FROM project_volunteers WHERE user_id = $1 AND project_id = $2';
    const result = await db.query(sql, [userId, projectId]);
    return result.rows.length > 0;
}
export {
    getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails, createProject, updateProject, addVolunteer,
    removeVolunteer,
    getVolunteeredProjects,
    checkVolunteerStatus
};