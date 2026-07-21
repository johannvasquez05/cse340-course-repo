import { getAllProjects } from '../models/projects.js';

const showProjectsPage = async (req, res) => {
    try {
        const projects = await getAllProjects();
        const title = 'Service Projects';

        res.render('projects', { title, projects });
    } catch (error) {
        console.error("Error fetching projects for route:", error);
        res.status(500).send("Internal Server Error");
    }
};

export { showProjectsPage };