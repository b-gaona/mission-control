let limit = 15;
let page = 1;
let total;

document.addEventListener("DOMContentLoaded", async () => {
  await getRequest();
});

//Functions
async function getAllLaunches() {
  const res = await fetch(`http://localhost:3000/v1/launches`);
  return await res.json();
}

async function getLaunches() {
  const res = await fetch(
    `http://localhost:3000/v1/launches?limit=${limit}&page=${page}`
  );
  const launches = await res.json();
  const sortedLaunches = launches.sort(
    (a, b) => a.flightNumber - b.flightNumber
  );
  return sortedLaunches;
}

function fillTable(launches) {
  const table = document.querySelector("tbody");
  launches.forEach((launch) => {
    const launchDate = new Date(launch.launchDate).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="color: ${
        launch.success ? "green" : "red"
      }; cursor: pointer;" onclick="abortLaunch(this)">█</td>
      <td>${launch.flightNumber}</td>
      <td>${launchDate}</td>
      <td>${launch.mission}</td>
      <td>${launch.rocket}</td>
      <td>${launch.customers || ""}</td>
    `;
    table.appendChild(tr);
  });
}

function updatePaginator() {
  const arrows = document.querySelectorAll(".arrow");
  arrows[0].setAttribute("value", page - 1);
  arrows[1].setAttribute("value", page + 1);
  if (arrows[0].getAttribute("value") <= 0) {
    arrows[0].style.opacity = 0;
    arrows[0].style.pointerEvents = "none";
  } else {
    arrows[0].style.opacity = 1;
    arrows[0].style.pointerEvents = "auto";
  }
  if (arrows[1].getAttribute("value") >= Math.ceil((total/limit) +1)) {
    arrows[1].style.opacity = 0;
    arrows[1].style.pointerEvents = "none";
  } else {
    arrows[1].style.opacity = 1;
    arrows[1].style.pointerEvents = "auto";
  }
}

async function updatePage(evt) {
  if (evt.textContent === ">") {
    page++;
  } else {
    page--;
  }
  updatePaginator();
  updateHTML();
  fillTable(await getLaunches());
}

function updateHTML() {
  const table = document.querySelector("tbody");
  while (table.firstChild) {
    table.firstChild.remove();
  }
}

//Requests
async function getRequest() {
  const launches = await getLaunches();
  fillTable(launches);
  updatePaginator();
  total = (await getAllLaunches()).length;
}
