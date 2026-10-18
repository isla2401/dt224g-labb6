"use strict";
/*
 * Laboration 6 - Receptsökaren
 * Namn: Isac Larsson
 */

// Hämta element från DOM
const searchFormEl = document.querySelector("#searchform");
const searchInputEl = document.querySelector("#search");
const recipeSectionEl = document.querySelector("#recipe");
const errorEl = document.querySelector("#error");
const messageEl = document.querySelector("#message");

// --- Eventlyssnare ---

// När sökformuläret skickas
searchFormEl.addEventListener("submit", (event) => {
	// Förhindra att sidan laddas om
	event.preventDefault();

	// Rensa tidigare recept och felmeddelanden
	clearPage();

	// Validera sökfältet och hämta recept om valideringen lyckas
	if (validateSearchInput()) {
		getRecipe();
	}
});

// --- Funktioner ---

// Validerar sökfältet
function validateSearchInput() {
	// Kontrollera att en sökfras har angivits
	if (searchInputEl.value.trim() !== "") {
		return true;
	} else {
		errorEl.textContent = "Du måste ange en sökfras!";
		return false;
	}
}

// Rensar recept och felmeddelanden
function clearPage() {
	recipeSectionEl.innerHTML = "";
	errorEl.innerHTML = "";
	messageEl.innerHTML = "";
}

// Hämtar recept från API
async function getRecipe() {
	// Hämta data med fetch
	try {
		const response = await fetch(
			`https://dummyjson.com/recipes/search?q=${searchInputEl.value.trim()}`,
		);

		// Kontrollera att API-anropet lyckats
		if (!response.ok) {
			throw new Error("Kunde inte hämta recept.");
		}

		// Omvandla JSON till JavaScript-objekt
		const data = await response.json();

		// Kontrollera att sökfrasen genererade ett recept
		if (data.recipes.length === 0) {
			messageEl.innerHTML = "<p>Inga recept hittades, prova en annan sökfras</p>";
		} else {
			// Visa det första receptet som hittades
			renderRecipe(data.recipes[0]);
		}
	} catch (error) {
		// Skriv ut eventuella felmeddelanden från API-anropet
		console.error("Något gick fel: " + error);
		messageEl.innerHTML = "Något gick fel. Försök igen senare.";
	}
}

// Visar receptet på sidan
function renderRecipe(recipe) {
	// Skapa element i DOM
	const articleEl = document.createElement("article");

	const recipeImageEl = document.createElement("img");

	const recipeNameEl = document.createElement("h3");
	const ingredientsHeadingEl = document.createElement("h4");
	const instructionsHeadingEl = document.createElement("h4");

	const recipeInfoEl = document.createElement("div");
	const ingredientsListEl = document.createElement("ul");
	const instructionsListEl = document.createElement("ol");

	// Lägg till bildlänk
	recipeImageEl.src = recipe.image;

	// Skapa rubriktexter
	recipeNameEl.textContent = recipe.name;
	ingredientsHeadingEl.textContent = "Ingredients";
	instructionsHeadingEl.textContent = "Instructions";

	// Lägg till klass för styling av receptinformationen
	recipeInfoEl.classList.add("recipe-info");

	// Skapa receptinformationstext
	recipeInfoEl.innerHTML = `
	<p><strong>Servings:</strong> ${recipe.servings}</p>
    <p><strong>Prep time:</strong> ${recipe.prepTimeMinutes} minutes</p>
    <p><strong>Cooking time:</strong> ${recipe.cookTimeMinutes} minutes</p>
    <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
	`;

	// Skapa listpunkt för varje ingrediens
	recipe.ingredients.forEach((ingredient) => {
		const ingredientEl = document.createElement("li");
		ingredientEl.textContent = ingredient;
		ingredientsListEl.appendChild(ingredientEl);
	});

	// Skapa listpunkt för varje instruktion
	recipe.instructions.forEach((instruction) => {
		const instructionEl = document.createElement("li");
		instructionEl.textContent = instruction;
		instructionsListEl.appendChild(instructionEl);
	});

	// Lägg in elementen i article
	articleEl.appendChild(recipeNameEl);
	articleEl.appendChild(recipeImageEl);
	articleEl.appendChild(recipeInfoEl);
	articleEl.appendChild(ingredientsHeadingEl);
	articleEl.appendChild(ingredientsListEl);
	articleEl.appendChild(instructionsHeadingEl);
	articleEl.appendChild(instructionsListEl);

	// Lägg in article i recept-sektionen så att den visas på sidan
	recipeSectionEl.appendChild(articleEl);
}
