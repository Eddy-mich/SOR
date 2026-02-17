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
  options: {
    id: string;
    text: string;
  }[];
}
