BEGIN;

CREATE TABLE public.organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

CREATE TABLE public.project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES public.organization(organization_id)
);

CREATE TABLE public.category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE public.project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES public.project(project_id),
    FOREIGN KEY (category_id) REFERENCES public.category(category_id)
);

INSERT INTO public.organization (name, description, contact_email, logo_filename)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit organization focused on improving community infrastructure through sustainable building projects.',
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

INSERT INTO public.project (organization_id, title, description, location, date)
VALUES
(1, 'Community Center Renovation', 'Renovate a community center to improve public facilities.', 'Rexburg, Idaho', '2026-11-14'),
(1, 'Playground Construction', 'Build a safe playground for local children.', 'Idaho Falls, Idaho', '2026-11-21'),
(1, 'School Painting Project', 'Paint classrooms and improve school facilities.', 'Rexburg, Idaho', '2026-12-05'),
(1, 'Community Garden Structures', 'Build raised garden beds and supporting structures.', 'Rigby, Idaho', '2026-12-12'),
(1, 'Home Repair Assistance', 'Help families with minor home repairs.', 'Idaho Falls, Idaho', '2027-01-09'),
(2, 'Urban Garden Planting', 'Plant vegetables in a community garden.', 'Rexburg, Idaho', '2026-11-14'),
(2, 'Neighborhood Composting', 'Teach residents how to compost organic waste.', 'Idaho Falls, Idaho', '2026-11-28'),
(2, 'Food Sustainability Workshop', 'Teach families how to grow their own food.', 'Rigby, Idaho', '2026-12-05'),
(2, 'Community Harvest Day', 'Harvest produce for local food donations.', 'Rexburg, Idaho', '2026-12-19'),
(2, 'School Garden Project', 'Help students create a sustainable school garden.', 'Idaho Falls, Idaho', '2027-01-16'),
(3, 'Community Food Drive', 'Collect food donations for local families.', 'Rexburg, Idaho', '2026-11-21'),
(3, 'Senior Support Day', 'Assist older adults with daily activities.', 'Idaho Falls, Idaho', '2026-11-28'),
(3, 'Winter Clothing Donation', 'Collect warm clothing for people in need.', 'Rigby, Idaho', '2026-12-12'),
(3, 'Neighborhood Cleanup', 'Organize volunteers to clean public spaces.', 'Rexburg, Idaho', '2027-01-09'),
(3, 'Community Outreach Event', 'Connect volunteers with local service opportunities.', 'Idaho Falls, Idaho', '2027-01-23');

INSERT INTO public.category (name)
VALUES
('Construction'),
('Environment'),
('Community Service');

INSERT INTO public.project_category (project_id, category_id)
SELECT p.project_id, c.category_id
FROM public.project AS p
JOIN public.category AS c
    ON c.name = CASE p.organization_id
        WHEN 1 THEN 'Construction'
        WHEN 2 THEN 'Environment'
        WHEN 3 THEN 'Community Service'
    END;

COMMIT;
