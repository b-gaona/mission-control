async function getLaunches(){const t=await fetch("http://localhost:3000/v1/launches");return await t.json()}function sortAndFilter(t){return t.filter(t=>!0===t.upcoming).sort((t,n)=>t.flightNumber-n.flightNumber)}function fillTable(t){const n=document.querySelector("tbody");t.forEach(t=>{const e=new Date(t.launchDate).toLocaleDateString("es-MX",{year:"numeric",month:"long",day:"numeric"}),o=document.createElement("tr");o.innerHTML=`\n      <td style="color: red; cursor: pointer;" onclick="abortLaunch(this)">✖</td>\n      <td>${t.flightNumber}</td>\n      <td>${e}</td>\n      <td>${t.mission}</td>\n      <td>${t.rocket}</td>\n      <td>${t.target||""}</td>\n    `,n.appendChild(o)})}async function abortLaunch(t){const n=t.parentElement,e=n.children[1].textContent;try{const t=await fetch("http://localhost:3000/v1/launches/"+e,{method:"DELETE"}),o=await t.json();console.log(o),n.remove()}catch(t){return{ok:!1}}}async function getRequest(){fillTable(sortAndFilter(await getLaunches()))}document.addEventListener("DOMContentLoaded",async()=>{await getRequest()});
//# sourceMappingURL=upcoming.js.map
