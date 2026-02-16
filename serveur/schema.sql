CREATE TABLE utilisateur (
    id_mail TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    statut TEXT NOT NULL
);


CREATE TABLE sondage (
    id_sondage TEXT PRIMARY KEY,
    titre TEXT NOT NULL,
    text_description TEXT NOT NULL,
    date_creation TEXT NOT NULL,
    date_expiration TEXT NOT NULL,
    statut TEXT NOT NULL,

    id_mail TEXT,
    FOREIGN KEY (id_mail) REFERENCES utilisateur(id_mail)
);


CREATE TABLE option_sondage (
    id_option TEXT PRIMARY KEY,
    text_description TEXT NOT NULL,

    id_sondage TEXT NOT NULL,
    FOREIGN KEY (id_sondage) REFERENCES sondage(id_sondage)
);



CREATE TABLE vote (
    id_vote TEXT PRIMARY KEY,
    vote INTEGER NOT NULL DEFAULT 0,

    id_mail TEXT,
    id_option TEXT NOT NULL,

    FOREIGN KEY (id_mail) REFERENCES utilisateur(id_mail),
    FOREIGN KEY (id_option) REFERENCES option_sondage(id_option)
);


