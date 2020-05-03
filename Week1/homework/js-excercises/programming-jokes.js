const randomIssue = () => Math.floor(Math.random() * 2301) + 1; // Currently the latest issue on the website as of May is 2301, and the first issue is one, so a random number will be returned between them. Another option was to calculate the month difference between the current month and a reference month so the difference is added to the max number in the randomizer.
const url = `https://xkcd.now.sh/?comic=`;
function showJoke(issue) {
  const joke = `
      <img
          src=${issue.img}
          alt=${issue.alt}
        />
        <p>#${issue.num} - ${issue.title}</p>
      `;
  document.querySelector('#joke').innerHTML = joke;
}
function getData() {
  const xhr = new XMLHttpRequest();
  const endpoint = url + randomIssue();
  xhr.responseType = 'json';
  xhr.open('GET', endpoint);
  xhr.onload = () => {
    if (xhr.status < 400) {
      console.log(xhr.response);
      showJoke(xhr.response);
    } else {
      console.log(`Error: ${xhr.status}`);
    }
  };
  xhr.onerror = () => console.log('An Error Occured');
  xhr.send();
}
function getDataAxios() {
  const endpoint = url + randomIssue();
  console.log(endpoint);
  axios
    .get(endpoint)
    .then(response => {
      console.log(response);
      showJoke(response.data);
    })
    .catch(err => console.log(err));
}

// document.getElementById('click').addEventListener('click', getData);
document.getElementById('click').addEventListener('click', getDataAxios);
