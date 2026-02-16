
import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import { DatabaseSync, type SQLOutputValue } from "node:sqlite";

/* =========================
   DATABASE
========================= */

const db = new DatabaseSync("polls.db");

/* =========================
   INTERFACES DB
========================= */

export interface PollRow {
  id_sondage: string;
  titre: string;
  text_description: string;
  date_creation: string;
  date_expiration: string;
  statut: string;
  id_mail: string | null;

  [key: string]: SQLOutputValue;
}

export interface PollOptionRow {
  id_option: string;
  text_description: string;
  id_sondage: string;

  [key: string]: SQLOutputValue;
}

/* =========================
   INTERFACES API
========================= */

export interface PollOption {
  id: string;
  text: string;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  expiresAt: string;
  statut: string;
  options: PollOption[];
}

/* =========================
   TYPE GUARDS
========================= */

export function isPollRow(
  obj: Record<string, SQLOutputValue>,
): obj is PollRow {
  return (
    typeof obj.id_sondage === "string" &&
    typeof obj.titre === "string" &&
    typeof obj.text_description === "string" &&
    typeof obj.date_creation === "string" &&
    typeof obj.date_expiration === "string" &&
    typeof obj.statut === "string"
  );
}

export function isPollOptionRow(
  obj: Record<string, SQLOutputValue>,
): obj is PollOptionRow {
  return (
    typeof obj.id_option === "string" &&
    typeof obj.text_description === "string" &&
    typeof obj.id_sondage === "string"
  );
}

/* =========================
   CONVERSIONS DB → API
========================= */

export function pollOptionRowToApi(
  row: PollOptionRow,
): PollOption {
  return {
    id: row.id_option,
    text: row.text_description,
  };
}

export function pollRowToApi(
  row: PollRow,
  optionRows: PollOptionRow[],
): Poll {
  return {
    id: row.id_sondage,
    title: row.titre,
    description: row.text_description,
    createdAt: row.date_creation,
    expiresAt: row.date_expiration,
    statut: row.statut,
    options: optionRows.map(pollOptionRowToApi),
  };
}

/* =========================
   ROUTER
========================= */

const router = new Router();

/* =========================
   TEST
========================= */

router.get("/", (ctx) => {
  ctx.response.body = "Hello world";
});

/* =========================
   POLLS
========================= */

// GET tous les sondages
router.get("/polls", (ctx) => {
  const polls = db.prepare("SELECT * FROM sondage").all();
  ctx.response.body = polls;
});

// GET un sondage + options (VERSION PROPRE)
router.get("/polls/:pollId", (ctx) => {
  const pollId = ctx.params.pollId;

  const pollRow = db.prepare(
    "SELECT * FROM sondage WHERE id_sondage = ?",
  ).get(pollId);

  if (!pollRow || !isPollRow(pollRow)) {
    ctx.response.status = 404;
    ctx.response.body = { error: "Sondage introuvable" };
    return;
  }

  const optionRows = db.prepare(
    "SELECT * FROM option_sondage WHERE id_sondage = ?",
  ).all(pollId).filter(isPollOptionRow);

  const pollApi = pollRowToApi(pollRow, optionRows);

  ctx.response.body = {
    success: true,
    data: pollApi,
  };
});

// POST créer un sondage
router.post("/polls", async (ctx) => {
  const b = await ctx.request.body.json();

  db.prepare(`
    INSERT INTO sondage
    (id_sondage, titre, text_description, date_creation, date_expiration, statut, id_mail)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    b.id_sondage,
    b.titre,
    b.text_description,
    b.date_creation,
    b.date_expiration,
    b.statut,
    b.id_mail ?? null,
  );

  ctx.response.status = 201;
});

/* =========================
   OPTIONS
========================= */

// POST ajouter une option à un sondage
router.post("/polls/:pollId/options", async (ctx) => {
  const b = await ctx.request.body.json();

  db.prepare(
    "INSERT INTO option_sondage VALUES (?, ?, ?)",
  ).run(
    b.id_option,
    b.text_description,
    ctx.params.pollId,
  );

  ctx.response.status = 201;
});

/* =========================
   APP
========================= */

const app = new Application();

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8000 });

console.log(" Serveur sur http://localhost:8000");
