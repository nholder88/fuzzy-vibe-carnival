-- Seed data for household chores
 -- Create a UUID variable for household_id
DO $$
DECLARE
    household_uuid UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';  -- Using a fixed UUID for household 1
BEGIN

INSERT INTO chores (
    id,
    title,
    description,
    household_id,
    status,
    due_date,
    priority,
    recurring,
    created_at
) VALUES
    (
        gen_random_uuid(),
        'Vacuum Living Room',
        'Thoroughly vacuum the living room carpet and under furniture',
        household_uuid,
        'pending',
        CURRENT_TIMESTAMP + INTERVAL '2 days',
        'medium',
        'weekly',
        CURRENT_TIMESTAMP
    ),
    (
        gen_random_uuid(),
        'Take Out Trash',
        'Empty all trash bins and replace bags',
        household_uuid,
        'pending',
        CURRENT_TIMESTAMP + INTERVAL '1 day',
        'high',
        'daily',
        CURRENT_TIMESTAMP
    ),
    (
        gen_random_uuid(),
        'Clean Bathroom',
        'Clean toilet, shower, sink, and mop floor',
        household_uuid,
        'pending',
        CURRENT_TIMESTAMP + INTERVAL '3 days',
        'high',
        'weekly',
        CURRENT_TIMESTAMP
    ),
    (
        gen_random_uuid(),
        'Water Plants',
        'Water all indoor plants and check soil moisture',
        household_uuid,
        'pending',
        CURRENT_TIMESTAMP + INTERVAL '1 day',
        'medium',
        'daily',
        CURRENT_TIMESTAMP
    ),
    (
        gen_random_uuid(),
        'Clean Kitchen',
        'Wipe counters, clean stovetop, and sweep floor',
        household_uuid,
        'pending',
        CURRENT_TIMESTAMP + INTERVAL '1 day',
        'high',
        'daily',
        CURRENT_TIMESTAMP
    ),
    (
        gen_random_uuid(),
        'Change Air Filters',
        'Replace HVAC air filters throughout the house',
        household_uuid,
        'pending',
        CURRENT_TIMESTAMP + INTERVAL '30 days',
        'medium',
        'monthly',
        CURRENT_TIMESTAMP
    ),
    (
        gen_random_uuid(),
        'Dust Furniture',
        'Dust all surfaces including shelves, tables, and electronics',
        household_uuid,
        'pending',
        CURRENT_TIMESTAMP + INTERVAL '5 days',
        'low',
        'weekly',
        CURRENT_TIMESTAMP
    ),
    (
        gen_random_uuid(),
        'Clean Windows',
        'Clean all windows inside and out, including window sills',
        household_uuid,
        'pending',
        CURRENT_TIMESTAMP + INTERVAL '14 days',
        'low',
        'monthly',
        CURRENT_TIMESTAMP
    );

END $$;