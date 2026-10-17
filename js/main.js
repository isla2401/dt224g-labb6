"use strict";
/*
 * Laboration 6 - Receptsökaren
 * Namn: Isac Larsson
 */

// Hämta element från DOM
const searchFormEl = document.querySelector("#searchform");
const searchInputEl = document.querySelector("#search");

const recipeEl = document.querySelector("recipe");

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

		console.log(data);
	} catch (error) {
		console.error("Något gick fel: " + error);
	}
}
