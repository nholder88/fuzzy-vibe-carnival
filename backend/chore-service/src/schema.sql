-- Drop existing table if it exists

DROP TABLE IF EXISTS chores;

-- Chores table schema

CREATE TABLE IF NOT EXISTS chores (id SERIAL PRIMARY KEY,
                                                     title VARCHAR(100) NOT NULL,
                                                                        description TEXT, assigned_to VARCHAR(50),
                                                                                                      household_id VARCHAR(50) NOT NULL,
                                                                                                                               status VARCHAR(20) CHECK (status IN ('pending',
                                                                                                                                                                    'in_progress',
                                                                                                                                                                    'completed')) NOT NULL,
                                                                                                                                                                                  due_date TIMESTAMP,
                                                                                                                                                                                           priority VARCHAR(10) CHECK (priority IN ('low',
                                                                                                                                                                                                                                    'medium',
                                                                                                                                                                                                                                    'high')) NOT NULL,
                                                                                                                                                                                                                                             recurring VARCHAR(20) CHECK (recurring IN ('none',
                                                                                                                                                                                                                                                                                        'daily',
                                                                                                                                                                                                                                                                                        'weekly',
                                                                                                                                                                                                                                                                                        'monthly')) DEFAULT 'none',
                                                                                                                                                                                                                                                                                                            completed_at TIMESTAMP,
                                                                                                                                                                                                                                                                                                                         created_by VARCHAR(50),
                                                                                                                                                                                                                                                                                                                                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                                                                                                                                                                                                                                                                                                                                 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

-- Index for household_id to optimize household-specific queries

CREATE INDEX IF NOT EXISTS idx_chores_household ON chores(household_id);

-- Index for assigned_to to optimize queries for a user's chores

CREATE INDEX IF NOT EXISTS idx_chores_assigned_to ON chores(assigned_to);

-- Index for due_date to optimize sorting by due date

CREATE INDEX IF NOT EXISTS idx_chores_due_date ON chores(due_date);