import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const title = 'Upcoming Service Projects';

        res.render('projects', { title, projects });
    } catch (error) {
        console.error("Error fetching projects for route:", error);
        res.status(500).send("Internal Server Error");
    }
};

const showProjectDetailsPage = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);

        if (!project) {
            return res.status(404).send("Project not found");
        }

        const categories = await getCategoriesByProjectId(projectId);

        const title = 'Project Details';
        res.render('project', { title, project, categories });
    } catch (error) {
        console.error("Error fetching project details:", error);
        res.status(500).send("Internal Server Error");
    }
};

export { showProjectsPage, showProjectDetailsPage };