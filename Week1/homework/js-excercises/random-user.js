const url = "https://www.randomuser.me/api";

function displayCard(person) {
  const card = `
      <div class="info">
          <ul>
            <li>Name: ${person.name.first} ${person.name.last}</li>
            <li>Age: ${person.dob.age}</li>
            <li>Country: ${person.location.country}</li>
            <li>Email: ${person.email}</li>
            <li>Mobile: ${person.cell}</li>
          </ul>
        </div>
        <div class="photo">
          <img src=${person.picture.large} alt="" />
        </div>
      `;
  document.querySelector(".card").innerHTML = card;
}
function getData() {
  const xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  xhr.open("GET", url);
  xhr.onload = () => {
    if (xhr.status < 400) {
      console.log(xhr.response);
      displayCard(xhr.response.results[0]);
    } else {
      console.log(`Error: ${xhr.status}`);
    }
  };
  xhr.onerror = () => console.log("An Error Occured");
  xhr.send();
}
function getDataAxios() {
  axios.get(url);
  then((response) => {
    console.log(response);
    displayCard(response.data.results[0]);
  }).catch((err) => console.log(err));
}

document.getElementById("click").addEventListener("click", getData);
// document.getElementById('click').addEventListener('click', getDataAxios);
