export interface PollOption {
  id: string;
  text: string;
}

export interface Poll {
    id_sondage: string;
    titre: string;
    text_description: string;
    date_creation: string;
    date_expiration: string;
    statut: string;
    id_mail: string | null;
    options: PollOption[];
}