import { sql } from './db'; // Restart nodemon
import { RELEASE_STEPS } from './constants';
import { createReleaseSchema, updateReleaseSchema } from './validation';

// Helper to format rows from json_agg
const formatRelease = (release: any) => ({
  ...release,
  tickets: release.tickets || []
});

export const resolvers = {
  Query: {
    getReleases: async () => {
      const result = await sql`
        SELECT r.*, 
          COALESCE(json_agg(t.* ORDER BY t."createdAt") FILTER (WHERE t.id IS NOT NULL), '[]') as tickets
        FROM releases r
        LEFT JOIN tickets t ON r.id = t.release_id
        GROUP BY r.id
        ORDER BY r."createdAt" DESC
      `;
      return result.map(formatRelease);
    },
    getRelease: async (_: any, { id }: { id: string }) => {
      const result = await sql`
        SELECT r.*, 
          COALESCE(json_agg(t.* ORDER BY t."createdAt") FILTER (WHERE t.id IS NOT NULL), '[]') as tickets
        FROM releases r
        LEFT JOIN tickets t ON r.id = t.release_id
        WHERE r.id = ${id}
        GROUP BY r.id
      `;
      return result.length ? formatRelease(result[0]) : null;
    }
  },
  Mutation: {
    createRelease: async (_: any, { input }: { input: any }) => {
      const parsed = createReleaseSchema.parse(input);
      const result = await sql`
        INSERT INTO releases (name, date, "additionalInfo", status, "createdAt", "updatedAt")
        VALUES (${parsed.name}, ${parsed.date}, ${parsed.additionalInfo || null}, 0, NOW(), NOW())
        RETURNING *
      `;
      
      const newRelease = result[0];
      
      const freshRelease = await sql`
        SELECT r.*, COALESCE(json_agg(t.* ORDER BY t."createdAt") FILTER (WHERE t.id IS NOT NULL), '[]') as tickets
        FROM releases r LEFT JOIN tickets t ON r.id = t.release_id WHERE r.id = ${newRelease.id} GROUP BY r.id
      `;
      return formatRelease(freshRelease[0]);
    },
    updateRelease: async (_: any, { input }: { input: any }) => {
      const parsed = updateReleaseSchema.parse(input);
      const releaseResult = await sql`
        SELECT r.*, COALESCE(json_agg(t.*) FILTER (WHERE t.id IS NOT NULL), '[]') as tickets
        FROM releases r LEFT JOIN tickets t ON r.id = t.release_id WHERE r.id = ${parsed.id} GROUP BY r.id
      `;
      if (!releaseResult.length) throw new Error("Release not found");

      const release = releaseResult[0];
      let additionalInfo = parsed.additionalInfo !== undefined ? parsed.additionalInfo : release.additionalInfo;

      const tickets = release.tickets;
      const completedCount = tickets.filter((t: any) => t.is_completed).length;
      let status = 0;
      if (completedCount > 0) {
        status = completedCount === tickets.length ? 2 : 1;
      }

      const result = await sql`
        UPDATE releases 
        SET "additionalInfo" = ${additionalInfo || null}, 
            status = ${status}, 
            "updatedAt" = NOW()
        WHERE id = ${parsed.id}
        RETURNING *
      `;
      
      return { ...result[0], tickets };
    },
    updateTicket: async (_: any, { id, isCompleted, title }: { id: string, isCompleted?: boolean, title?: string }) => {
      const current = await sql`SELECT * FROM tickets WHERE id = ${id}`;
      if (!current.length) throw new Error("Ticket not found");
      
      const newIsCompleted = isCompleted !== undefined ? isCompleted : current[0].is_completed;
      const newTitle = title !== undefined ? title : current[0].title;

      const result = await sql`
        UPDATE tickets 
        SET is_completed = ${newIsCompleted}, title = ${newTitle} 
        WHERE id = ${id} 
        RETURNING *
      `;
      
      const releaseId = result[0].release_id;
      const ticketsResult = await sql`SELECT * FROM tickets WHERE release_id = ${releaseId}`;
      const completedCount = ticketsResult.filter((t: any) => t.is_completed).length;
      let status = 0;
      if (completedCount > 0) status = completedCount === ticketsResult.length ? 2 : 1;
      await sql`UPDATE releases SET status = ${status} WHERE id = ${releaseId}`;
      
      return result[0];
    },
    deleteTicket: async (_: any, { id }: { id: string }) => {
      const current = await sql`SELECT release_id FROM tickets WHERE id = ${id}`;
      if (!current.length) return false;
      const releaseId = current[0].release_id;

      await sql`DELETE FROM tickets WHERE id = ${id}`;

      // Update status
      const ticketsResult = await sql`SELECT * FROM tickets WHERE release_id = ${releaseId}`;
      const completedCount = ticketsResult.filter((t: any) => t.is_completed).length;
      let status = 0;
      if (completedCount > 0) status = completedCount === ticketsResult.length ? 2 : 1;
      await sql`UPDATE releases SET status = ${status} WHERE id = ${releaseId}`;

      return true;
    },
    createTicket: async (_: any, { releaseId, title }: { releaseId: string, title: string }) => {
      const result = await sql`
        INSERT INTO tickets (release_id, title, is_completed)
        VALUES (${releaseId}, ${title}, false)
        RETURNING *
      `;
      
      // Update status to ongoing/planned based on new ticket
      const ticketsResult = await sql`SELECT * FROM tickets WHERE release_id = ${releaseId}`;
      const completedCount = ticketsResult.filter((t: any) => t.is_completed).length;
      let status = 0;
      if (completedCount > 0) status = completedCount === ticketsResult.length ? 2 : 1;
      await sql`UPDATE releases SET status = ${status} WHERE id = ${releaseId}`;

      return result[0];
    },
    deleteRelease: async (_: any, { id }: { id: string }) => {
      await sql`DELETE FROM releases WHERE id = ${id}`;
      return true;
    }
  }
};
