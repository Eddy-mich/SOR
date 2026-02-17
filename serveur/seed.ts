import { Database } from "jsr:@db/sqlite";

// Ouvre la base
const db = new Database("polls.db");

// Active les clés étrangères
db.exec("PRAGMA foreign_keys = ON;");

// Nettoyage (ordre important)
db.exec("DELETE FROM vote;");
db.exec("DELETE FROM option_sondage;");
db.exec("DELETE FROM sondage;");
db.exec("DELETE FROM utilisateur;");

// =============================
// UTILISATEURS
// =============================
db.exec(`
INSERT INTO utilisateur (id_mail, nom, prenom, statut) VALUES
('jean@mail.com', 'Dupont', 'Jean', 'actif'),
('marie@mail.com', 'Martin', 'Marie', 'actif'),
('paul@mail.com', 'Durand', 'Paul', 'actif'),
('lucie@mail.com', 'Bernard', 'Lucie', 'actif'),
('admin@mail.com', 'Admin', 'Super', 'admin');
`);

// =============================
// SONDAGES
// =============================
db.exec(`
INSERT INTO sondage (
    id_sondage,
    titre,
    text_description,
    date_creation,
    date_expiration,
    statut,
    id_mail
) VALUES
('s1', 'Langage préféré', 'Quel langage préférez-vous ?', '2026-02-17', '2026-03-01', 'ouvert', 'admin@mail.com'),
('s2', 'Framework Web', 'Quel framework utilisez-vous ?', '2026-02-18', '2026-03-05', 'ouvert', 'admin@mail.com'),
('s3', 'Base de données', 'Quelle base préférez-vous ?', '2026-02-19', '2026-03-10', 'ouvert', 'admin@mail.com');
`);

// =============================
// OPTIONS
// =============================
db.exec(`
INSERT INTO option_sondage (id_option, text_description, id_sondage) VALUES
('o1', 'JavaScript', 's1'),
('o2', 'Python', 's1'),
('o3', 'Java', 's1'),
('o4', 'C#', 's1'),

('o5', 'React', 's2'),
('o6', 'Vue', 's2'),
('o7', 'Angular', 's2'),
('o8', 'Svelte', 's2'),

('o9', 'SQLite', 's3'),
('o10', 'MySQL', 's3'),
('o11', 'PostgreSQL', 's3'),
('o12', 'MongoDB', 's3');
`);

// =============================
// VOTES
// =============================
db.exec(`
INSERT INTO vote (id_vote, vote, id_mail, id_option) VALUES
('v1', 1, 'jean@mail.com', 'o2'),
('v2', 1, 'marie@mail.com', 'o1'),
('v3', 1, 'paul@mail.com', 'o2'),
('v4', 1, 'lucie@mail.com', 'o3'),

('v5', 1, 'jean@mail.com', 'o5'),
('v6', 1, 'marie@mail.com', 'o6'),
('v7', 1, 'paul@mail.com', 'o5'),
('v8', 1, 'lucie@mail.com', 'o7'),

('v9', 1, 'jean@mail.com', 'o11'),
('v10', 1, 'marie@mail.com', 'o10'),
('v11', 1, 'paul@mail.com', 'o11'),
('v12', 1, 'lucie@mail.com', 'o9');
`);

console.log("Base remplie avec succès ✅");

db.close();
