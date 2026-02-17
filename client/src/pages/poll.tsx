import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


import { isPoll } from "../types/guards.ts";
import { Poll } from "../types/interfaces.ts";

const API_URL = "http://localhost:8000";

/* =========================
   STATE DU COMPOSANT
========================= */

type PollState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "loaded"; poll: Poll };


export default function PollPage() {
  const { selectedPoll } = useParams<{ selectedPoll: string }>();

  const [pollState, setPollState] = useState<PollState>({
    status: "loading",
  });

  useEffect(() => {
    if (!selectedPoll) return;

    setPollState({ status: "loading" });

    (async () => {
      try {
        const resp = await fetch(`${API_URL}/polls/${selectedPoll}`);

        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status}`);
        }

        const json = await resp.json();

        if (!isPoll(json.data)) {
          throw new Error("Données invalides");
        }

        setPollState({
          status: "loaded",
          poll: json.data,
        });
      } catch (err) {
        setPollState({
          status: "error",
          error:
            err instanceof Error ? err.message : "Erreur inconnue",
        });
      }
    })();
  }, [selectedPoll]);


  if (pollState.status === "loading") {
    return <p>⏳ Chargement du sondage…</p>;
  }

  if (pollState.status === "error") {
    return <p style={{ color: "red" }}>{pollState.error}</p>;
  }

  const { poll } = pollState;

  return (
    <main>
      <h1>{poll.title}</h1>
      <p>{poll.description}</p>

      <h3>Options</h3>
      <ul>
        {poll.options.map((opt) => (
          <li key={opt.id}>{opt.text}</li>
        ))}
      </ul>
    </main>
  );
}
