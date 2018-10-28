// https://medium.freecodecamp.org/environment-settings-in-javascript-apps-c5f9744282b6
const baseUrl = window.location.hostname === 'localhost'
  ? 'http://localhost:8080'
  : 'https://heig-vd-ga-server.herokuapp.com';


const defaultSearch = 'octocat';
const searchForm = document.getElementById('search-form');
let chart = null;
let token = readCookie('access_token');

window.onload = onPageLoaded();

function onPageLoaded(){
  sendCodeToServer(getGitHubCodeFromURL());
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function sendCodeToServer(code) {
  if ((token === undefined || token === null)) {
    if (code !== undefined && code !== null) {

      fetch(`http://localhost:3000/githubredirect?code=${code}`)
        .then(data => data.json()
          .then(data => {
            let stringToken = data.access_token;
            document.cookie = `access_token=${stringToken}`;
            this.token = readCookie('access_token');

            // start loading

            // maj de la liste des repos
            handleRepoList();

            // end loading
          }));
    }
  }
}

// extracts the Githubcode parameter from url
function getGitHubCodeFromURL() {
  let url_string = window.location.href;
  let url = new URL(url_string);
  let code = url.searchParams.get("code");
  return code
}

function getRepos() {
  return fetch(`http://localhost:3000/auth/myrepos?access_token=${token}`)
    .then(res => res.json());
}

function getIssues(fullname) {
  return fetch(`http://localhost:3000/auth/${fullname}/issues?access_token=${token}`)
  .then(res => res.json());
}

function getCollaborators(fullname) {
  return fetch(`http://localhost:3000/auth/${fullname}/contributors?access_token=${token}`)
  .then(res => res.json());
}

function handleRepoList() {

  // si on est pas login on return
  if((token === undefined || token === null)){
    updatePlaceholder('You must login first !')
    return;
  }

  return getRepos().then(repos => {
      updatePlaceholder('');
      console.log(`We got the user's repos : ${JSON.stringify(repos)}`);

      updateUserReposList(repos);

    })
    .catch(err => {
      updatePlaceholder('Oups, an error occured. Sorry, this app sucks...', 'text-error');
      console.error('Cannot fetch data', err)
    })
}

function updatePlaceholder(content, className = 'text-secondary') {
  const placeholder = document.getElementById('placeholder');
  placeholder.className = className;
  placeholder.innerHTML = content;
}

function updateUserReposList(repos){
  //create selection field
  let parent = document.getElementById('UserReposListHolder');
  let select = document.createElement("SELECT");
  select.setAttribute("id", "UserReposList");
  parent.appendChild(select);

  // create a selectionnable list of user owned repos
  repos.forEach(repo => {
    console.log(`Repo : ${repo.name}`);
    let option = document.createElement("option");
    option.setAttribute("value", repo.full_name);

    let text = document.createTextNode(repo.name);
    option.appendChild(text);

    document.getElementById("UserReposList").appendChild(option);
  });

  // listen to change event
  select.addEventListener("change", handleChangeRepoSelected)
}

// hangle che event of changing selected repo
function handleChangeRepoSelected(){

  // get the selected repository
  let select = document.getElementById('UserReposList');
  let selectedRepo = select.options[select.selectedIndex].value;
  let filteredData = null;

  // pass it to the server to get the collaborators working on it
  getCollaborators(selectedRepo)
    .then(data => {

      // filter the needed data
      filteredData = data.map(collaborator => {

        let filteredCollaborator = {};//new Object();
        filteredCollaborator.login = collaborator.login;
        filteredCollaborator.contributions = collaborator.contributions;
        filteredCollaborator.issueClosed = 0;
        return filteredCollaborator;
      });
    })
    .then(a => {

      // once we have the collaborators, we can track their solved issues
      getIssues(selectedRepo)
        .then(data => {

          // foreach issus we increment the assignee's issueClosed counter
          data.forEach(issue => {
            for(let i = 0; i < filteredData.length; ++i){
              if(issue.assignee.login === filteredData[i].login){
                ++filteredData[i].issueClosed;
              }
            }
          })
    })
    .then(data => {
      //console.log(`Chart gonna be updates with data : ${JSON.stringify(filteredData)}`);
      // once all the data is packed we update the charts;
      updateChart(filteredData, 'bar');
      //console.log('update done');
    })});
}

function updateChart(collaborators, chartType){
  const chartContributors = document.getElementById('chart-issues');
  const ctx = chartContributors.getContext('2d');

  const options = {
    type: chartType,
    data: {
      labels: collaborators.map(coll => coll.login),
      datasets: [{
        data: collaborators.map(coll => coll.issueClosed),
        backgroundColor: [
          'rgba(255,0,255,1)',
          'rgba(0,255,255,1)',
        ]
      }],
    },
    options: {
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          ticks: {
            fontFamily: "'Roboto Mono'",
            fontSize: 12,
          },
          gridLines: {
            display: false,
          }
        }],
        yAxes: [{
          ticks: {
            fontFamily: "'Roboto Mono'",
            beginAtZero: true,
          }
        }]
      },
    }
  }

  if (!chart) {
    chart = new Chart(ctx, options);
  } else {
    chart.data.labels = options.data.labels;
    chart.data.datasets = options.data.datasets;
    chart.update();
  }

}

handleRepoList();

/*
function getUser(username) {
  return fetch(`${baseUrl}/users/${username}`)
    .then(res => res.json());
}

function getLanguages(username) {
  return fetch(`${baseUrl}/languages/${username}`)
    .then(res => res.json());
}

function getGithubColors() {
  return fetch('data/github-colors.json')
    .then(res => res.json());
}

function updateChart({ labels, data, backgroundColor }) {
  const chartLanguages = document.getElementById('chart-languages');
  const ctx = chartLanguages.getContext('2d');
  const options = {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor,
      }],
    },
    options: {
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          ticks: {
            fontFamily: "'Roboto Mono'",
            fontSize: 12,
          },
          gridLines: {
            display: false,
          }
        }],
        yAxes: [{
          ticks: {
            fontFamily: "'Roboto Mono'",
          }
        }]
      },
    }
  }

  if (!chart) {
    chart = new Chart(ctx, options);
  } else {
    chart.data.labels = options.data.labels;
    chart.data.datasets = options.data.datasets;
    chart.update();
  }
}

function updateProfile(user) {
  const avatar = document.getElementById('user-avatar');
  const name = document.getElementById('user-name');
  const login = document.getElementById('user-login');
  avatar.src = user.avatar_url;
  avatar.alt = `avatar of ${user.name}`;
  name.innerHTML = user.name;
  login.innerHTML = user.login;
}


function handleSearch(username) {
  updatePlaceholder('Loading...');

  return Promise.all([
    getUser(username),
    getLanguages(username),
    getGithubColors(),
  ])
    .then(([user, languages, colors]) => {
      updatePlaceholder('');

      const labels = Object.keys(languages);
      const data = labels.map(label => languages[label]);
      const backgroundColor = labels.map(label => {
        const color = colors[label] ? colors[label].color : null
        return color || '#000';
      })

      updateProfile(user);
      updateChart({ labels, data, backgroundColor });
    })
    .catch(err => {
      updatePlaceholder('Oups, an error occured. Sorry, this app sucks...', 'text-error');
      console.error('Cannot fetch data', err)
    })
}

searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const username = this.elements['username'].value;
  if (!username) {
    return;
  }
  handleSearch(username);
});

handleSearch(defaultSearch);
*/
