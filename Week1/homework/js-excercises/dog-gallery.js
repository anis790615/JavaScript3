const url = "https://dog.ceo/api/breeds/image/random";

function showDog(imgSrc) {
  let list = document.querySelector("#dogPhoto");

  // list.innerHTML = ""; //I thought that the image should be replaced
  const li = document.createElement("li");
  const dogImage = document.createElement("img");
  dogImage.src = imgSrc;
  li.appendChild(dogImage);

  list.appendChild(li);
}
function getData() {
  const xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  xhr.open("GET", url);
  xhr.onload = () => {
    if (xhr.status < 400) {
      console.log(xhr.response);
      showDog(xhr.response.message);
    } else {
      console.log(`Error: ${xhr.status}`);
    }
  };
  xhr.onerror = () => console.log("An Error Occured");
  xhr.send();
}
function getDataAxios() {
  axios
    .get(url)
    .then((response) => {
      console.log(response);
      showDog(response.data.message);
    })
    .catch((err) => console.log(err));
}

document.getElementById("clickXHR").addEventListener("click", getData);
document.getElementById("clickAxios").addEventListener("click", getDataAxios);
