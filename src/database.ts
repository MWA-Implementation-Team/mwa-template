import { database } from "./state.js";

database.exec(`
CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

const visitCountStmt = database.prepare(`
SELECT COUNT(*) AS visit_count FROM visits;
`);

export function getVisitCount(): number {
    const result = visitCountStmt.get()!;
    return result['visit_count'] as number;
}

const markVisitStmt = database.prepare(`
INSERT INTO visits DEFAULT VALUES;
`);

export function markVisit() {
    markVisitStmt.run();
}
