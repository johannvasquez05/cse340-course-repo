CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename) 
VALUES
(
    'BrightFuture Builders', 
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 
    'info@brightfuturebuilders.org', 
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers', 
    'An urban farming collective promoting food sustainability and education in local neighborhoods.', 
    'contact@greenharvest.org', 
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers', 
    'A volunteer coordination group supporting local charities and service initiatives.', 
    'hello@unityserve.org', 
    'unityserve-logo.png'
);

CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT fk_organization FOREIGN KEY (organization_id) REFERENCES organization(organization_id) ON DELETE CASCADE
);

INSERT INTO project (organization_id, title, description, location, date)
VALUES
-- BrightFuture Builders (ID 1)
(1, 'Community Center Renovation', 'Repairing the roof and walls', 'Downtown Plaza', '2026-09-15'),
(1, 'Housing Assistance', 'Building homes for families', 'East Side', '2026-10-01'),
(1, 'School Playground Build', 'Installing new safety equipment', 'Central Elementary', '2026-10-20'),
(1, 'Library Expansion', 'Constructing new reading rooms', 'City Library', '2026-11-15'),
(1, 'Park Bench Installation', 'Building custom wooden benches', 'West Park', '2026-08-20'),
 
-- GreenHarvest Growers (ID 2)
(2, 'Urban Garden Plot', 'Clearing land for vegetables', 'North District', '2026-08-30'),
(2, 'Tree Planting Initiative', 'Planting 50 native trees', 'River Basin', '2026-09-10'),
(2, 'Compost Education', 'Teaching residents to compost', 'Community Center', '2026-09-15'),
(2, 'Greenhouse Repair', 'Maintaining the structure', 'Botanical Garden', '2026-10-15'),
(2, 'Seed Exchange Fair', 'Community seed swap', 'Town Square', '2026-11-20'),
 
-- UnityServe Volunteers (ID 3)
(3, 'Weekly Soup Kitchen', 'Serving meals to the homeless', 'Main Street', '2026-12-31'),
(3, 'Elderly Tech Support', 'Teaching smartphone usage', 'Senior Center', '2026-09-26'),
(3, 'After-School Tutoring', 'Math and reading help', 'Youth Club', '2026-12-15'),
(3, 'Neighborhood Clean-up', 'Picking up litter', 'Downtown Area', '2026-10-12'),
(3, 'Charity Gala Support', 'Managing logistics', 'Grand Hotel', '2026-12-05');

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
);

INSERT INTO category (name) VALUES
('Construction & Repair'),
('Environment & Agriculture'),
('Community Support'),
('Education & Tech');

INSERT INTO project_category (project_id, category_id) VALUES
-- BrightFuture Builders Projects (Construction)
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), 

-- GreenHarvest Growers Projects (Environment & Education)
(6, 2), 
(7, 2), 
(8, 2), (8, 4), -- Compost Education fits Environment AND Education
(9, 2), 
(10, 2), (10, 3), -- Seed Exchange fits Environment AND Community

-- UnityServe Volunteers Projects (Community & Education)
(11, 3), 
(12, 4), (12, 3), -- Elderly Tech fits Education AND Community
(13, 4), (13, 3), -- Tutoring fits Education AND Community
(14, 2), (14, 3), -- Clean-up fits Environment AND Community
(15, 3);