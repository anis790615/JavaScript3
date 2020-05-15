const url = 'https://dog.ceo/api/breeds/image/random';

function showDog(imgSrc) {
  let list = document.querySelector('#dogPhoto');

  // list.innerHTML = ""; //Initially I thought that each image should be replaced by the new one. Stasel clarified that they should be added, so I commented this out.
  const li = document.createElement('li');
  const dogImage = document.createElement('img');
  dogImage.src = imgSrc;
  li.appendChild(dogImage);

  list.appendChild(li);
}
function getData(link) {
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.open('GET', link);
  xhr.onload = () => {
    if (xhr.status < 400) {
      console.log(xhr.response);
      showDog(xhr.response.message);
    } else {
      console.log(`Error: ${xhr.status}`);
    }
  };
  xhr.onerror = () => console.log('An Error Occured');
  xhr.send();
}
function getDataAxios(link) {
  axios
    .get(link)
    .then(response => {
      console.log(response);
      showDog(response.data.message);
    })
    .catch(err => console.log(err));
}

document
  .getElementById('clickXHR')
  .addEventListener('click', () => getData(url));
document
  .getElementById('clickAxios')
  .addEventListener('click', () => getDataAxios(url));
