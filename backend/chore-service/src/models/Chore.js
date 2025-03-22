const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Chore {
    static async findAll(householdId = null) {
        let query = 'SELECT * FROM chores';
        let params = [];

        if (householdId) {
            query += ' WHERE household_id = $1';
            params.push(householdId);
        }

        query += ' ORDER BY due_date ASC';

        try {
            const result = await db.query(query, params);
            return result.rows;
        } catch (error) {
            console.error('Error fetching chores:', error);
            throw error;
        }
    }

    static async findById(id) {
        const query = 'SELECT * FROM chores WHERE id = $1';
        try {
            const result = await db.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error(`Error fetching chore ${id}:`, error);
            throw error;
        }
    }

    static async create(choreData) {
        const {
            title,
            description,
            assigned_to,
            household_id,
            status,
            due_date,
            priority,
            recurring,
            created_by
        } = choreData;

        const id = uuidv4();
        const created_at = new Date().toISOString();
        const updated_at = created_at;

        const query = `
      INSERT INTO chores (
        id, title, description, assigned_to, household_id, status, 
        due_date, priority, recurring, completed_at, created_by, 
        created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

        const params = [
            id,
            title,
            description || '',
            assigned_to || null,
            household_id,
            status || 'pending',
            due_date ? new Date(due_date).toISOString() : null,
            priority || 'medium',
            recurring || 'none',
            null, // completed_at
            created_by,
            created_at,
            updated_at
        ];

        try {
            const result = await db.query(query, params);
            return result.rows[0];
        } catch (error) {
            console.error('Error creating chore:', error);
            throw error;
        }
    }

    static async update(id, updateData) {
        // First get the current chore
        const currentChore = await this.findById(id);
        if (!currentChore) {
            throw new Error('Chore not found');
        }

        // Prepare update fields and values
        const updates = [];
        const values = [];
        let paramIndex = 1;

        Object.keys(updateData).forEach(key => {
            if (key !== 'id' && key !== 'created_at') {
                updates.push(`${key} = $${paramIndex}`);
                if (key === 'due_date' && updateData[key]) {
                    values.push(new Date(updateData[key]).toISOString());
                } else {
                    values.push(updateData[key]);
                }
                paramIndex++;
            }
        });

        // Always update the updated_at timestamp
        updates.push(`updated_at = $${paramIndex}`);
        values.push(new Date().toISOString());
        paramIndex++;

        // Check if status is being changed to completed and update completed_at if so
        if (updateData.status === 'completed' && currentChore.status !== 'completed') {
            updates.push(`completed_at = $${paramIndex}`);
            values.push(new Date().toISOString());
            paramIndex++;
        } else if (updateData.status && updateData.status !== 'completed' && currentChore.status === 'completed') {
            // If status is changing from completed to something else, clear completed_at
            updates.push(`completed_at = $${paramIndex}`);
            values.push(null);
            paramIndex++;
        }

        // Add id as the last parameter
        values.push(id);

        const query = `
      UPDATE chores
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

        try {
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error(`Error updating chore ${id}:`, error);
            throw error;
        }
    }

    static async delete(id) {
        const query = 'DELETE FROM chores WHERE id = $1 RETURNING *';
        try {
            const result = await db.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error(`Error deleting chore ${id}:`, error);
            throw error;
        }
    }

    // Method to find recurring chores that need to be recreated
    static async findDueRecurringChores() {
        const query = `
      SELECT * FROM chores 
      WHERE recurring != 'none' 
      AND status = 'completed' 
      AND completed_at IS NOT NULL
    `;

        try {
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error finding recurring chores:', error);
            throw error;
        }
    }

    // Method to clone a chore for recurrence
    static async cloneForRecurrence(chore) {
        // Calculate the next due date based on the recurrence pattern
        const newDueDate = this.calculateNextDueDate(chore.due_date, chore.recurring);

        const newChoreData = {
            title: chore.title,
            description: chore.description,
            assigned_to: chore.assigned_to,
            household_id: chore.household_id,
            status: 'pending',
            due_date: newDueDate,
            priority: chore.priority,
            recurring: chore.recurring,
            created_by: chore.created_by
        };

        return this.create(newChoreData);
    }

    // Helper method to calculate next due date based on recurrence pattern
    static calculateNextDueDate(baseDateStr, recurrencePattern) {
        if (!baseDateStr) return null;

        const baseDate = new Date(baseDateStr);
        const newDate = new Date(baseDate);

        switch (recurrencePattern) {
            case 'daily':
                newDate.setDate(baseDate.getDate() + 1);
                break;
            case 'weekly':
                newDate.setDate(baseDate.getDate() + 7);
                break;
            case 'monthly':
                newDate.setMonth(baseDate.getMonth() + 1);
                break;
            default:
                return null;
        }

        return newDate.toISOString();
    }
}

module.exports = Chore; 