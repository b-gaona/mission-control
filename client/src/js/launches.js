document.addEventListener("DOMContentLoaded", async () => {
  await getRequest();
  await postRequest();
});

//Functions
async function getPlanets() {
  const res = await fetch("http://localhost:3000/v1/planets");
  const planets = res.json();
  return planets;
}

async function fillSelect(planets) {
  const planetsSelect = document.querySelector("#target");
  planets.forEach((planet) => {
    const option = document.createElement("option");
    option.value = planet.keplerName;
    option.textContent = planet.keplerName;
    planetsSelect.appendChild(option);
  });
}

function validateForm(form) {
  const launchData = new FormData(form);
  for (const [key, value] of launchData) {
    if (!value) {
      return false;
    }
  }
  return true;
}

async function submitLaunch(form) {
  const launchData = [...new FormData(form)];

  const array = launchData.flatMap((element) => {
    return element;
  });

  const object = {
    [array[0]]: array[1],
    [array[2]]: array[3],
    [array[4]]: array[5],
    [array[6]]: array[7],
  };

  try {
    const response = await fetch("http://localhost:3000/v1/launches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(object),
    });
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

function addSpinner(form) {
  const spinner = document.querySelector(".spinner");
  spinner.style.display = "flex";
  setTimeout(() => {
    spinner.style.display = "none";
    form.reset();
  }, 3000);
}

//Requests
async function postRequest() {
  const form = document.querySelector("#form");
  form.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    if (!validateForm(form)) {
      console.log("No validado");
      return;
    }
    await submitLaunch(form);
    addSpinner(form);
  });
}

async function getRequest() {
  planets = await getPlanets();
  await fillSelect(planets);
}
