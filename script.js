getRandomMeal();
const searchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search");
const mealPopup = document.getElementById("popup-container");
const popupCloseBtn = document.getElementById("close-popup");
const mealInfoEl = document.getElementById("meal-info");

async function getRandomMeal() {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  const respData = await resp.json();
  const randomMeal = respData.meals[0];

  addMeal(randomMeal);
  // console.log(randomMeal);
}
async function getMealById(id) {
  const fetchMealId = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );
  const Idresp = await fetchMealId.json();
  const dataRes = Idresp.meals[0];
  // console.log(Idresp);
  return dataRes;
}
// getMealBySearch(chocolate);
async function getMealBySearch(term) {
  const fetchMealSearch = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );
  const respData = await fetchMealSearch.json();
  const meals = respData.meals;
  // console.log(respData);
  return meals;
}
//manupulating the random meal
const mealsEl = document.getElementById("meal");
function addMeal(mealData) {
  const meal = document.createElement("div");
  meal.classList.add("meal");
  meal.innerHTML = `
    <img
    src="${mealData.strMealThumb}"
    alt="${mealData.strMeal}"
    />
    </div>
    <div class="meal-body">
    <h4>${mealData.strMeal}</h4>
    <button class="fav-btn">
    <i class="far fa-solid fa-heart btncolor" id="btncolor"></i>
    </button>
    </div>`;

  //adding event listener in far fa-heart icon
  meal.querySelector(".fav-btn").addEventListener("click", (e) => {
    // alert("hello");
    // const btncolor = document.getElementById("btncolor");
    // btncolor.classList.toggle("active");

    const parentContainer = e.currentTarget.parentNode;
    btn = parentContainer.querySelector(".active");
    if (
      parentContainer.querySelector(".btncolor").classList.contains("active") ==
      true
    ) {
      removeMealFromLS(mealData.idMeal);
      // btncolor.classList.remove("active");
      parentContainer.querySelector(".btncolor").classList.remove("active");
    } else {
      mealInfoEl.innerHTML = "";
      showMealInfo(mealData);
      addMealToLS(mealData.idMeal);
      // btncolor.classList.add("active");
      console.log(e.currentTarget.parentNode);
      parentContainer.querySelector(".btncolor").classList.add("active");
    }
    // console.log(btncolor);
    fetchFavMeals();
  });
  mealsEl.appendChild(meal);
}

//this function shows the information of meals
function showMealInfo(mealData) {
  mealInfoEl.innerHTML = "";
  const mealEl = document.createElement("div");
  const ingredients = [];
  //get ingredients and measures
  for (let i = 1; i < 20; i++) {
    if (mealData["strIngredient" + i]) {
      ingredients.push(
        `${mealData["strIngredient" + i]} - ${mealData["strMeasure" + i]}`
      );
    } else {
      break;
    }
  }
  // console.log(ingredients);
  mealEl.innerHTML = `<h1>${mealData.strMeal}</h1>
<img
  src="${mealData.strMealThumb}"
  alt=""
  srcset=""
/>
<p>
 ${mealData.strInstructions}
</p>
<h3> Ingredients:</h3>
<ul>
${ingredients.map((ing) => `<li>${ing}</li>`).join(" ")};
</ul>`;
  mealInfoEl.appendChild(mealEl);

  //show the popup
  mealPopup.style.display = "flex";
}
popupCloseBtn.addEventListener("click", () => {
  mealPopup.style.display = "none";
});
//function to addMeal in lc
function addMealToLS(mealId) {
  let mealIds = getMealsFromLS();
  // console.log(mealIds);
  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}
//function to removeMeal form LC
function removeMealFromLS(mealId) {
  let mealIds = getMealsFromLS();
  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds.filter((id) => id !== mealId))
  );
}
//function to getMeals from LC
function getMealsFromLS() {
  let mealIds = JSON.parse(localStorage.getItem("mealIds"));
  // console.log(mealIds);
  return mealIds === null ? [] : mealIds;
}

//function to fetch array form lc and form array which will be used to fetch data using id
const favoriteContainer = document.getElementById("fav-meal");
async function fetchFavMeals() {
  favoriteContainer.innerHTML = "";
  let mealIds = getMealsFromLS();
  for (let i = 0; i < mealIds.length; i++) {
    let mealId = mealIds[i];
    let meal = await getMealById(mealId);
    addMealToFav(meal);
    // meals[i];
    // console.log(meal);
  }
  //add them to the screen
}

//manupulating the favorite meals
function addMealToFav(mealData) {
  const favMeal = document.createElement("li");
  favMeal.innerHTML = `
  <img
  src="${mealData.strMealThumb}"
  alt="${mealData.strMeal}"
  /><span>${mealData.strMeal}</span>
  <button><i class="fa-solid fa-xmark"></i></button>
  `;
  favMeal.addEventListener("click", () => {
    showMealInfo(mealData);
    console.log(mealData);
  });
  const btn = favMeal.querySelector("button");
  btn.addEventListener("click", (e) => {
    removeMealFromLS(mealData.idMeal);
    fetchFavMeals();
  });
  favoriteContainer.appendChild(favMeal);
}

fetchFavMeals();

// const random = meal.querySelector(".meal-header");
searchBtn.addEventListener("click", async () => {
  // //clean container
  mealsEl.innerHTML = "";
  const searchVal = searchTerm.value;
  // console.log(searchVal);
  // console.log(await getMealBySearch(searchVal));
  const mealFch = await getMealBySearch(searchVal);

  if (mealFch) {
    for (const element of mealFch) {
      console.log(element);
      addMeal(element);
    }
  }
});
