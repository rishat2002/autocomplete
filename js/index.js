const inputForm = document.querySelector('.container__form')
const inputDropList = document.querySelector('.container__dropList')
let inputValue;
const mass = Array.from(document.querySelectorAll('.container__dropItem'))
const containerRepoList = document.querySelector('.container__repoList')

function sendRequest(url) {
    const headers = {
        'Content-Type': 'application/json'
    }
    return fetch(url).then(response => {
        return response.json();
    })
}
const debounce = (fn, debounceTime) => {
let timeout;
  return function () {
    const fnCall = () => { fn.apply(this, arguments) }
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, debounceTime)
  };
};


function addEventOnRepoItem(dropItem, dataItem) {
    dropItem.addEventListener('click', () => {
        const repoItem = document.createElement('li')
        repoItem.classList.add('container__repoItem')
        const listWithDescription = document.createElement('ul')
        const repoItemName = document.createElement('li')
        repoItemName.classList.add('container__repoItem-name')
        const repoItemOwner = document.createElement('li')
        repoItemOwner.classList.add('container__repoItem-owner')
        const repoItemStars = document.createElement('li')
        repoItemStars.classList.add('container__repoItem-stars')
        const deleteButton = document.createElement('button')
        deleteButton.classList.add('container__deleteRepoItem')
        addEventDeleteRepoItem(deleteButton)
        repoItemName.textContent = 'Name:' + dataItem.name;
        repoItemOwner.textContent = 'Owner:' + dataItem.owner.login
        repoItemStars.textContent = 'Stars:' + dataItem.stargazers_count
        containerRepoList.appendChild(repoItem);
        repoItem.appendChild(listWithDescription);
        repoItem.appendChild(deleteButton)
        listWithDescription.appendChild(repoItemName)
        listWithDescription.appendChild(repoItemOwner)
        listWithDescription.appendChild(repoItemStars)
        while (inputDropList.firstChild) {
            inputDropList.removeChild(inputDropList.firstChild);
        }
        inputForm.value=''
    })

}

function autocomplete(evt) {
    inputValue = evt.target.value;
    if (inputValue.length !== 0) {
        const requestURL = 'https://api.github.com/search/repositories?q=' + inputValue;
        sendRequest(requestURL).then(data => {
                while (inputDropList.firstChild) {
                    inputDropList.removeChild(inputDropList.firstChild);
                }
                if (data.items.length > 5) {
                    for (let i = 0; i < 5; i++) {
                        const dropItem = document.createElement('li')
                        dropItem.classList.add('container__dropItem')
                        dropItem.textContent = data.items[i].name
                        inputDropList.appendChild(dropItem)
                        addEventOnRepoItem(dropItem, data.items[i])
                    }
                } else {}
            })
            .catch(err => console.log(err))
    } else {
        while (inputDropList.firstChild) {
            inputDropList.removeChild(inputDropList.firstChild);
        }
    }
}

function addEventDeleteRepoItem(deleteButton) {
    deleteButton.addEventListener('click', () => {
        deleteButton.parentNode.remove()
    })
}

inputForm.addEventListener('input', debounce(autocomplete,500))
