// Récupère les données dans le fichier data.json ----------------------------------------------------------------------
const getMenuData = async () => {
    // initialisation des données
    const dataPath = "./data/data.json";
    const response = await fetch(dataPath);

    // vérification de la réponse HTTP
    if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
    }

    // transformation du json en objet JS
    const data = await response.json();

    return data;
}


// Génère les liens vers les pages -------------------------------------------------------------------------------------
const generateMenu = (pagesData) => {
    // récupération du conteneur
    const container = document.querySelector(".main-menu__list");
    container.innerHTML = "";
    let fragment = document.createDocumentFragment();

    // génération des liens
    for (const pageData of pagesData) {
        const newLink = generatePageLink(pageData);
        fragment.appendChild(newLink);
    }

    // injection dans le html
    container.appendChild(fragment);
};


// Génère le lien vers une page ----------------------------------------------------------------------------------------
const generatePageLink = (pageData) => {
    // création des balises
    const element = document.createElement("li");
    const link = document.createElement("a");
    link.classList.add("btn", "index-btn");
    link.href = `./pages/${pageData.tag}.html`;
    link.textContent = pageData.title;

    element.appendChild(link);

    // renvoi du code HTML
    return element;
};


// Génère les options du select ----------------------------------------------------------------------------------------
const generateProblems = (problemsData) => {
    // récupération du conteneur
    const selectForm = document.getElementById("problems");
    const fragment = document.createDocumentFragment();

    // création des catégories
    for (const categoryData of problemsData) {
        const categoryLink = generateProblemCategory(categoryData);
        fragment.appendChild(categoryLink);
    }

    // injection dans le HTML
    selectForm.appendChild(fragment);
};


// Génère une catégorie d'options de sélection -------------------------------------------------------------------------
const generateProblemCategory = (categoryData) => {
    // création du code HTML
    const category = document.createElement("optgroup");
    category.label = categoryData.category;

    // création des problèmes dans la catégorie
    for (const problemData of categoryData.problems) {
        const problem = generateOption(problemData);
        category.appendChild(problem);
    }

    // renvoi du code HTML
    return category;
};


// Génère une option de sélection --------------------------------------------------------------------------------------
const generateOption = (problemData) => {
    // création du code HTML
    const problem = document.createElement("option");
    problem.value = problemData.tags.join(",");
    problem.textContent = problemData.title;

    // renvoi du code HTML
    return problem;
};


// Normalise un texte --------------------------------------------------------------------------------------------------
const normalizeText = (text) => {
    return text
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
};


// Récupère les tags depuis la recherche par index ---------------------------------------------------------------------
const getTagsFromIndexSearch = (indexData, searchText) => {
    const normalizedSearch = normalizeText(searchText);

    if (!normalizedSearch) {
        return null;
    }

    const matchingTags = new Set();

    for (const entry of indexData) {
        const word = normalizeText(entry.word);

        if (word.includes(normalizedSearch)) {
            for (const tag of entry.tags) {
                matchingTags.add(tag);
            }
        }
    }

    return matchingTags;
};


// Récupère les tags depuis la recherche par problème ------------------------------------------------------------------
const getTagsFromProblems = (selectedValue) => {
    if (!selectedValue) {
        return null;
    }

    return new Set(
        selectedValue
            .split(",")
            .map(tag => tag.trim())
            .filter(tag => tag !== "")
    );
};


// Affiche le menu filtré ----------------------------------------------------------------------------------------------
const filterMenu = (menuData, searchValue, problemValue) => {
    const textTags = getTagsFromIndexSearch(menuData.index, searchValue);
    const problemTags = getTagsFromProblems(problemValue);

    let allowedTags = textTags || problemTags;

    if (!allowedTags) {
        generateMenu(menuData.pages);
        return;
    }

    const filteredPages = menuData.pages.filter(page => allowedTags.has(page.tag))
    generateMenu(filteredPages);
}


/* =====================================================================================================================
PROGRAMME PRINCIPAL
===================================================================================================================== */
const main = async () => {
    const menuData = await getMenuData();

    generateMenu(menuData.pages);
    generateProblems(menuData.problemCategories);

    const searchInput = document.getElementById("index");
    const problemSelect = document.getElementById("problems");

    searchInput.addEventListener("input", () => {
        problemSelect.value = "";
        filterMenu(menuData, searchInput.value, problemSelect.value);
    });

    problemSelect.addEventListener("change", () => {
        searchInput.value = ""
        filterMenu(menuData, searchInput.value, problemSelect.value);
    });
};

main();
