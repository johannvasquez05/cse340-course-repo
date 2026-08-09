import {
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject,
    addVolunteer,
    removeVolunteer,
    checkVolunteerStatus
} from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

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

        let isVolunteering = false;
        if (req.session.user) {
            isVolunteering = await checkVolunteerStatus(req.session.user.user_id, projectId);
        }

        const title = 'Project Details';
        res.render('project', { title, project, categories, isVolunteering });
    } catch (error) {
        console.error("Error fetching project details:", error);
        res.status(500).send("Internal Server Error");
    }
};

const processVolunteer = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.session.user.user_id;

        await addVolunteer(userId, projectId);

        req.flash('success', 'You have successfully signed up as a volunteer!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error("Error volunteering for project:", error);
        req.flash('error', 'There was an error signing up for this project.');
        res.redirect(`/project/${projectId}`);
    }
};

const processUnvolunteer = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.session.user.user_id;

        await removeVolunteer(userId, projectId);

        req.flash('success', 'You have been removed as a volunteer.');
        // Redirects back to the page the request came from (Details or Dashboard)
        res.redirect(req.get('Referrer') || `/project/${projectId}`);
    } catch (error) {
        console.error("Error removing volunteer status:", error);
        req.flash('error', 'There was an error removing your volunteer status.');
        res.redirect('back');
    }
};

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
};

const processNewProjectForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-project');
    }

    const { title, description, location, date, organizationId } = req.body;

    try {
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
};

const showEditProjectForm = async (req, res) => {
    try {
        const projectId = req.params.id;

        const project = await getProjectDetails(projectId);
        const organizations = await getAllOrganizations();

        if (!project) {
            return res.status(404).send("Project not found");
        }

        res.render('edit-project', {
            title: 'Edit Project',
            project,
            organizations
        });
    } catch (error) {
        console.error("Error displaying edit project form:", error);
        res.status(500).send("Internal Server Error");
    }
};

const processEditProjectForm = async (req, res) => {
    try {
        const projectId = req.params.id;

        const projectData = {
            title: req.body.title,
            date: req.body.date,
            location: req.body.location,
            description: req.body.description,
            organization_id: req.body.organization_id
        };

        await updateProject(projectId, projectData);

        req.flash('success', 'Project updated successfully.');
        res.redirect(`/project/${projectId}`);

    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).send("Internal Server Error");
    }
};

export {
    showProjectsPage,
    showProjectDetailsPage,
    processVolunteer,
    processUnvolunteer,
    projectValidation,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm
};