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

// --- Eventlyssnare ---

// När sökformuläret skickas
searchFormEl.addEventListener("submit", (event) => {
	event.preventDefault();

	// Validera sökfältet
	if (validateSearchInput()) {
		getRecipes();
	}
});

// --- Funktioner ---

// Validerar sökfältet
function validateSearchInput() {
	// Rensa tidigare felmeddelanden
	errorEl.textContent = "";

	// Kontrollera om en sökfras har angivits
	if (searchInputEl.value.trim() === "") {
		errorEl.textContent = "Du måste ange en sökfras!";
		return false;
	} else {
		return true;
	}
}

// Hämtar recept från API
async function getRecipes() {
	// Variabel för sökfrasen
	const searchInput = searchInputEl.value.trim();

	// Hämta data med fetch
	try {
		const response = await fetch(`https://dummyjson.com/recipes/search?q=${searchInput}`);
		const data = await response.json();

		renderRecipe(data.recipes[0]);
	} catch (error) {
		console.error("Något gick fel: " + error);
	}
}

// Visar receptet på sidan
function renderRecipe(recipe) {
	// Rensa tidigare recept
	recipeSectionEl.innerHTML = "";

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
