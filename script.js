class Livre {
    constructor(id, titre, auteur, genres, dateDeSortie, langues, synopsis= "", couverture="") {
        this.id = id;
        this.titre = titre;
        this.auteur = auteur;
        this.genres = genres;
        this.dateDeSortie = dateDeSortie;
        this.langues = langues;
        this.statut = "a-lire";
        this.couverture = couverture;
        this.avis = [];
        this.synopsis = synopsis;
    }
}

const livre1 = new Livre(1, "Le Petit Prince", "Antoine de Saint-Exupéry", ["Fiction", "Enfants"], new Date("1943-04-06"), ["Français", "Anglais"], "Un pilote tombé en panne dans le désert rencontre un petit prince venu d'une autre planète.", "image/Le petit prince.jpg");
const livre2 = new Livre(2, "1984", "George Orwell", ["Dystopie", "Science-fiction"], new Date("1949-06-08"), ["Anglais"]);
const livre3 = new Livre(3, "Le Seigneur des Anneaux", "J.R.R. Tolkien", ["Fantasy", "Aventure"], new Date("1954-07-29"), ["Anglais"]);
const livre4 = new Livre(4, "Harry Potter à l'école des sorciers", "J.K. Rowling", ["Fantasy", "Aventure"], new Date("1997-06-26"), ["Anglais"]);
const livre5 = new Livre(5, "Le Comte de Monte-Cristo", "Alexandre Dumas", ["Aventure", "Historique"], new Date("1844-08-28"), ["Français"]);
const livre6 = new Livre(6, "Le Hobbit", "J.R.R. Tolkien", ["Fantasy", "Aventure"], new Date("1937-09-21"), ["Anglais"]);
const livre7 = new Livre(7, "Les Misérables", "Victor Hugo", ["Historique", "Drame"], new Date("1862-04-03"), ["Français"]);
const livre8 = new Livre(8, "Lakestone, Tome 1", "Sarah Rivens", ["Dark Romance"], new Date("2024-01-12"), ["Français"]);

const livres = [livre1, livre2, livre3, livre4, livre5, livre6, livre7, livre8];

function sauvegarder() {
    const donnees = {};
    livres.forEach((livre) => {
        donnees[livre.id] = { statut: livre.statut, avis: livre.avis };
    });
    localStorage.setItem("bibliotheque", JSON.stringify(donnees));
}

function charger() {
    const texte = localStorage.getItem("bibliotheque");
    if (!texte) return;

    const donnees = JSON.parse(texte);
    livres.forEach((livre) => {
        const sauvegarde = donnees[livre.id];
        if (!sauvegarde) return;
        livre.statut = sauvegarde.statut;
        livre.avis = sauvegarde.avis;
    });
}

charger();


const listeLivre = document.getElementById("listeLivre")
const vueListe = document.getElementById("vueListe");
const ficheLivre = document.getElementById("ficheLivre");

let livresAffiches = livres;

function afficherLivres(tableau) {
    livresAffiches = tableau;
    listeLivre.innerHTML = "";

    tableau.forEach((livre) => {
        const ligne = document.createElement("div");
        ligne.className = `ligne ${livre.statut}`;

        // Miniature : image si elle existe, sinon bloc avec l'initiale
        let miniature;
        if (livre.couverture) {
            miniature = document.createElement("img");
            miniature.src = livre.couverture;
            miniature.alt = `Couverture de ${livre.titre}`;
        } else {
            miniature = document.createElement("div");
            miniature.textContent = livre.titre.charAt(0);
        }
        miniature.className = "miniature";
        miniature.addEventListener("click", () => afficherFiche(livre));

        // Texte
        const texte = document.createElement("div");
        texte.className = "texte";

        const titre = document.createElement("h2");
        titre.textContent = livre.titre;
        titre.addEventListener("click", () => afficherFiche(livre));

        const auteur = document.createElement("p");
        auteur.className = "auteur";
        auteur.textContent = `${livre.auteur} · ${livre.dateDeSortie.getFullYear()}`;

        const genres = document.createElement("p");
        genres.className = "genres";
        genres.textContent = livre.genres.join(" / ");

        texte.appendChild(titre);
        texte.appendChild(auteur);
        texte.appendChild(genres);

        // Actions
        const actions = document.createElement("div");
        actions.className = "actions";

        const badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = livre.statut === "deja-lu" ? "Lu" : "À lire";

        const boutonALire = document.createElement("button");
        boutonALire.textContent = "à lire";
        boutonALire.addEventListener("click", () => {
            livre.statut = "a-lire";
            afficherLivres(livresAffiches);
        });

        const boutonStatut = document.createElement("button");
        boutonStatut.className = "statut";
        boutonStatut.textContent = livre.statut === "deja-lu" ? "✓ Lu" : "À lire";
        boutonStatut.addEventListener("click", () => {
            livre.statut = livre.statut === "deja-lu" ? "a-lire" : "deja-lu";
            sauvegarder();
            afficherLivres(livresAffiches);
        });

        actions.appendChild(boutonStatut);

        ligne.appendChild(miniature);
        ligne.appendChild(texte);
        ligne.appendChild(actions);
        listeLivre.appendChild(ligne);
    });
}
afficherLivres(livres);


const filtre = document.getElementById("filtres");

const boutonTous = document.createElement("button");
boutonTous.textContent = "Tous";
filtre.appendChild(boutonTous);

boutonTous.addEventListener("click", () => {
  listeLivre.innerHTML = "";
  afficherLivres(livres);
});

const boutonALireFiltre = document.createElement("button");
boutonALireFiltre.textContent = "À lire";
filtre.appendChild(boutonALireFiltre);

boutonALireFiltre.addEventListener("click", () => {
  const aLire = livres.filter((livre) => livre.statut === "a-lire");
  listeLivre.innerHTML = "";
  afficherLivres(aLire);
});

const boutonDejaLuFiltre = document.createElement("button");
boutonDejaLuFiltre.textContent = "Déjà lu";
filtre.appendChild(boutonDejaLuFiltre);

boutonDejaLuFiltre.addEventListener("click", () => {
  const dejaLu = livres.filter((livre) => livre.statut === "deja-lu");
  listeLivre.innerHTML = "";
  afficherLivres(dejaLu);
});

const genres = [...new Set(livres.flatMap((livre) => livre.genres))];

genres.forEach((genre) => {
    const bouton = document.createElement("button");
    bouton.textContent = genre;
    filtre.appendChild(bouton);

    bouton.addEventListener("click", () => {
        const livresFiltres = livres.filter((livre) => livre.genres.includes(genre));
        listeLivre.innerHTML = "";
        afficherLivres(livresFiltres);
    });
});

function afficherFiche(livre) {
    vueListe.hidden = true;
    ficheLivre.hidden = false;
    ficheLivre.innerHTML = "";

    const retour = document.createElement("button");
    retour.textContent = "← Retour";
    retour.addEventListener("click", () => {
        ficheLivre.hidden = true;
        vueListe.hidden = false;
        afficherLivres(livresAffiches);
    });
    ficheLivre.appendChild(retour);

    const titre = document.createElement("h2");
    titre.textContent = livre.titre;
    ficheLivre.appendChild(titre);

    if (livre.couverture) {
        const image = document.createElement("img");
        image.src = livre.couverture;
        image.alt = `Couverture de ${livre.titre}`;
        image.width = 200;
        ficheLivre.appendChild(image);
    }

    const infos = document.createElement("p");
    infos.textContent = `${livre.auteur} - ${livre.genres.join(", ")} - ${livre.dateDeSortie.getFullYear()} - ${livre.langues.join(", ")}`;
    ficheLivre.appendChild(infos);

    const synopsis = document.createElement("p");
    synopsis.textContent = livre.synopsis || "Pas de synopsis pour le moment.";
    ficheLivre.appendChild(synopsis);

    // --- Avis ---
    const titreAvis = document.createElement("h3");
    titreAvis.textContent = "Avis";
    ficheLivre.appendChild(titreAvis);

    livre.avis.forEach((avis) => {
        const p = document.createElement("p");
        p.textContent = `${avis.note}/5 - ${avis.commentaire}`;
        ficheLivre.appendChild(p);
    });

    const inputNote = document.createElement("input");
    inputNote.type = "number";
    inputNote.min = 1;
    inputNote.max = 5;
    inputNote.placeholder = "Note (1 à 5)";

    const inputCommentaire = document.createElement("textarea");
    inputCommentaire.placeholder = "Ton commentaire";

    const boutonAvis = document.createElement("button");
    boutonAvis.textContent = "Publier l'avis";
    boutonAvis.addEventListener("click", () => {
        const note = Number(inputNote.value);
        const commentaire = inputCommentaire.value.trim();
        if (note < 1 || note > 5 || commentaire === "") return;

        livre.avis.push({ note: note, commentaire: commentaire, date: new Date() });
        sauvegarder();
        afficherFiche(livre);
    });

    ficheLivre.appendChild(inputNote);
    ficheLivre.appendChild(inputCommentaire);
    ficheLivre.appendChild(boutonAvis);
}


