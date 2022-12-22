document.addEventListener("DOMContentLoaded", async () => {
  await getRequest();
});

//Functions
async function getLaunches() {
  const res = await fetch(`${window.location.origin}/v1/launches`);
  const launches = await res.json();
  return launches;
}

function sortAndFilter(launches) {
  const filteredLaunches = launches.filter((launch) => {
    return launch.upcoming === true;
  });
  const sortedLaunches = filteredLaunches.sort(
    (a, b) => a.flightNumber - b.flightNumber
  );
  return sortedLaunches;
}

function fillTable(launches) {
  const table = document.querySelector("tbody");
  launches.forEach((launch) => {
    const launchDate = new Date(launch.launchDate).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="color: red; cursor: pointer;" onclick="abortLaunch(this)">✖</td>
      <td>${launch.flightNumber}</td>
      <td>${launchDate}</td>
      <td>${launch.mission}</td>
      <td>${launch.rocket}</td>
      <td>${launch.target || ""}</td>
    `;
    table.appendChild(tr);
  });
}

async function abortLaunch(evt) {
  const tr = evt.parentElement;
  const flightNumber = tr.children[1].textContent;
  try {
    const response = await fetch(
      `${window.location.origin}/v1/launches/${flightNumber}`,
      {
        method: "DELETE",
      }
    );
    const result = await response.json();
    console.log(result);
    tr.remove();
  } catch (error) {
    return { ok: false };
  }
}

//Requests

async function getRequest() {
  const launches = sortAndFilter(await getLaunches());
  fillTable(launches);
}
