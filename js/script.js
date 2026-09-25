// Fonction qui normalise le texte :
const normalizeText = (text) => {
    return text
        .trim()  // enlève les espaces en début/fin de chaîne
        .toLowerCase()  // Passage en minuscules
        .normalize("NFD")  // sépare é en e + son accent, par ex.
        .replace(/[\u0300-\u036f]/g, "");  // enlève les accents
};

// Fonction qui filtre les fiches par mot-clé
const filterByKeyword = (menuItems, searchText) => {
    const search = normalizeText(searchText);  // normalise le texte saisi par l'utilisateur

    for (const item of menuItems) {  // Pour chaque page du menu
        const keywords = (item.dataset.keywords ?? "")  // liste les tags du menu ; utilise une chaîne vide s'il n'y a pas de mot-clé ""
            .split("|")  // en les séparant (séparateur donné dans le html)
            .map(normalizeText);  // en normalisant le texte

        const matches = keywords.some(keyword => keyword.includes(search));  // vérifie qu'au moins un mot-clé contient la saisie utilisateur

        item.hidden = search !== "" && !matches;  // cache le lien vers la page si la saisie n'est pas vide et que le texte utilisateur n'est pas dans les keywords
    }
};


const filterByProblem = (menuItems, selectedValue) => {  // Filtre les fiches par problème rencontré
    const allowedTags = new Set(  // liste les tags correspondant au problème sélectionné
        selectedValue  // en les prenant un par un
            .split("|")  // et en séparant les tags
            .filter(tag => tag !== "")  // sous réserve qu'il y en ait un
    );

    for (const item of menuItems) {  // pour chaque lien vers les pages
        const tag = item.dataset.tag ?? "";  // établit le dataset ("" si vide)

        item.hidden =  // cache le lien
            allowedTags.size > 0 &&  // si la liste des tags n'est pas vide
            !allowedTags.has(tag);  // et si un tag correspondant à la demande est contenu dans la liste des tags
    }
};


const searchForm = document.getElementById("search");  // récupère le formulaire de recherche
const searchInput = document.getElementById("index");  // récupère la zone de saisie
const menuItems = document.querySelectorAll(".main-menu__list > li");  // récupère la liste des liens vers les pages
const problemSelect = document.getElementById("problems");  // récupère la liste de choix des problèmes

searchForm.addEventListener("submit", (event) => {  // écoute l'envoi du formulaire
   event.preventDefault();   // empêche de recharger toute la page si on eppuie sur Entrée
});

searchInput.addEventListener("input", () => {  // écoute la saisie utilisateur
    problemSelect.value = "";  // Réinitialise la liste des problèmes
    filterByKeyword(menuItems, searchInput.value);  // lance le filtre
});

problemSelect.addEventListener("change", () => {  // écoute la liste de choix de problème
    searchInput.value = "";  // Réinitialise la liste des problèmes
    filterByProblem(menuItems, problemSelect.value); // filtre la liste des problèmes selon le problème rencontré
});
