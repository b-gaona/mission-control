async function getPlanets(){return(await fetch("http://localhost:3000/v1/planets")).json()}async function fillSelect(t){const e=document.querySelector("#target");t.forEach(t=>{const n=document.createElement("option");n.value=t.keplerName,n.textContent=t.keplerName,e.appendChild(n)})}function validateForm(t){const e=new FormData(t);for(const[t,n]of e)if(!n)return!1;return!0}async function submitLaunch(t){const e=[...new FormData(t)].flatMap(t=>t),n={[e[0]]:e[1],[e[2]]:e[3],[e[4]]:e[5],[e[6]]:e[7]};try{const t=await fetch("http://localhost:3000/v1/launches",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)}),e=await t.json();console.log(e)}catch(t){console.log(t)}}function addSpinner(t){const e=document.querySelector(".spinner");e.style.display="flex",setTimeout(()=>{e.style.display="none",t.reset()},3e3)}async function postRequest(){const t=document.querySelector("#form");t.addEventListener("submit",async e=>{e.preventDefault(),validateForm(t)?(await submitLaunch(t),addSpinner(t)):console.log("No validado")})}async function getRequest(){planets=await getPlanets(),await fillSelect(planets)}document.addEventListener("DOMContentLoaded",async()=>{await getRequest(),await postRequest()});
//# sourceMappingURL=launches.js.map
