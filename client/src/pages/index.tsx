import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { Poll } from "../types/interfaces.ts";

/* =========================
   TYPES
========================= */

// interface Poll {
//   id_sondage: string;
//   text_description: string;
// }

/* =========================
   COMPONENT
========================= */

export default function Index() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [error, setError] = useState<string | null>(null);

  /* ===== FORM STATE ===== */
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [dateExpiration, setDateExpiration] = useState("");
  const [statut, setStatut] = useState("actif");
  const [email, setEmail] = useState("");

  /* =========================
     LOAD POLLS (GET)
  ========================= */

  const loadPolls = async () => {
    try {
      const response = await fetch("http://localhost:8000/polls");

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();
      setPolls(data);
    } catch {
      setError("Impossible de charger les sondages");
    }
  };

  useEffect(() => {
    loadPolls();
  }, []);

  /* =========================
     SUBMIT FORM (POST)
  ========================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    try {
      const response = await fetch("http://localhost:8000/polls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_sondage: crypto.randomUUID(),
          titre: titre,
          text_description: description,
          date_creation: new Date().toISOString().slice(0, 10),
          date_expiration: dateExpiration,
          statut: statut,
          id_mail: email || null,
        }),
      });
  
      if (!response.ok) {
        throw new Error();
      }
  
      // succès
    } catch {
      setError("Impossible de créer le sondage");
    }
  };
  

  /* =========================
     RENDER
  ========================= */

  return (
    <div>
      <main id="content">
      <h1>📊 Real-time polls</h1>
      <p>Click on a poll below to participate.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {polls.length === 0 && <p>Aucun sondage disponible</p>}

      <ul>
        {polls.map((poll) => (
          <li key={poll.id_sondage}>
            <Link to={`/poll/${poll.id_sondage}`}>
              {poll.text_description}
            </Link>

          </li>
        ))}
      </ul>
    </main>

      <hr />

      {/* ===== FORMULAIRE ===== */}
      <form onSubmit={handleSubmit}>
        <h2>Créer un sondage</h2>

        <div>
          <label>Titre</label><br />
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description</label><br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Date d’expiration</label><br />
          <input
            type="date"
            value={dateExpiration}
            onChange={(e) => setDateExpiration(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Statut</label><br />
          <select value={statut} onChange={(e) => setStatut(e.target.value)}>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
          </select>
        </div>

        <div>
          <label>Email (optionnel)</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <br />
        <button type="submit">Créer le sondage</button>
      </form>
    </div>
  );
}
