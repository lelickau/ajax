/* const btn = document.querySelector('.btn')

function getUsers(cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://jsonplaceholder.typicode.com/users');

    xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText);
        cb(response);
    })

    xhr.addEventListener('error', () => {
        console.log('error');
    })
    xhr.send();
}



const createUser = (response) => {
    const container = document.querySelector('.container');
    response.forEach(user => {
        const card = document.createElement('p');
        
        const userName = document.createElement('button');
        userName.setAttribute('type', 'button');
        userName.setAttribute('data-user', user.id);
        userName.classList.add('btn', 'btn-light', 'open-info');
        userName.textContent = user.name;

        const info = infoList(user);

        card.appendChild(userName);
        card.appendChild(info);
        container.appendChild(card);

        userName.addEventListener('click', (e) => {
            e.preventDefault();
            e.target.nextSibling.style.display = 'block';
        })
    })
}

function infoList(user) {
    const info = document.createElement('p');
    info.classList.add('card');
    info.style.display = 'none';
    info.style.padding = '10px 10px';
    info.style.margin = '10px 10px';

    const username = document.createElement('h6');
    username.textContent = `NikName: ${user.username}`;

    const email = document.createElement('h6');
    email.textContent = `Email: ${user.email}`;

    const address = document.createElement('div');
    address.style.display = 'inline-block';
    address.style.fontWeight = '600';
    address.textContent = `Adress: `;

    const street = document.createElement('span');
    street.textContent = `St. ${user.address.street},`;

    const suite = document.createElement('span');
    suite.textContent = ` ${user.address.suite}`;

    const city = document.createElement('h6');
    city.textContent = `City: ${user.address.city}`;

    info.appendChild(username);
    info.appendChild(email);
    info.appendChild(city);
    address.appendChild(street);
    address.appendChild(suite);
    info.appendChild(address);

    return info;
}

btn.addEventListener('click', (e) => {
    e.preventDefault();
    getUsers(createUser);
})
 */


/* {
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "address": {
      "street": "Kulas Light",
      "suite": "Apt. 556",
      "city": "Gwenborough",
      "zipcode": "92998-3874",
      "geo": {
        "lat": "-37.3159",
        "lng": "81.1496"
      }
    },
    "phone": "1-770-736-8031 x56442",
    "website": "hildegard.org",
    "company": {
      "name": "Romaguera-Crona",
      "catchPhrase": "Multi-layered client-server neural-net",
      "bs": "harness real-time e-markets"
    }
  } */



//////////////////////////////////////////////////////////////////////////////

const apiUrl = 'https://jsonplaceholder.typicode.com/';
const usersListEl = document.querySelector('.users-list');
const userInfoEl = document.querySelector('.user-info');

//1 реализовать запрос получение пользователей
function getUsersHTTP(cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${apiUrl}users`);

    xhr.addEventListener('load', () => {
        if (xhr.status !== 200) {
            console.log('error', xhr.status);
            return;
        }
        const response = JSON.parse(xhr.responseText);
        cb(response);
    })

    xhr.send();
}
//2 реализовать обработчик ответа от сервера
function onGetUsersCallback(users) {
    if (!users.length) return;
    renderUsersList(users);
}
//3 рендер списка пользователей
function renderUsersList(users) {
    const fragment = users.reduce((acc, user) => acc + userListItem(user), '');
    //добавляем на страницу
    usersListEl.insertAdjacentHTML('afterbegin', fragment);

}

//4 генератор разметки пользовотеля
function userListItem(user) {
    return `
    <button type="button" class="list-group-item list-group-item-action" data-user-id=${user.id}>${user.name}</button>
    `
}

//5 повесить событие клика на список
usersListEl.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.dataset.userId) getUserInfoHTTP(e.target.dataset.userId, onGetUserInfoCallback);
})

//6 запрос на саервер получение инфы о пользователе
function getUserInfoHTTP(id, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${apiUrl}users/${id}`);

    xhr.addEventListener('load', () => {
        if (xhr.status !== 200) {
            console.log('error', xhr.status);
            return;
        }
        const response = JSON.parse(xhr.responseText);
        cb(response);
    })

    xhr.send();
}
//7 обработчик получения запроса от сервера
function onGetUserInfoCallback(user) {
    if (!user.id) {
        console.log('Not founded user');
        return;
    }
    renderUserInfo(user);
}
//8 рендеринг информации пользовотеля
function renderUserInfo(user) {
    userInfoEl.innerHTML = '';
    const template = userInfo(user);
    userInfoEl.insertAdjacentHTML('afterbegin', template);
}

//9 разметка на отдельного пользов-ля
function userInfo(user) {
    return `
    <div class="card border-dark mb-3">
        <div class="card-header">${user.name}</div>
        <div class="card-body text-dark">
            <h5 class="card-title">${user.email}</h5>
            <ul class="list-group list-group-flush">
                <li class="list-group-item"><b>Nickname:</b> ${user.username}</li>
                <li class="list-group-item"><b>Website:</b> ${user.website}</li>
                <li class="list-group-item"><b>Company:</b> ${user.company.name}</li>
                <li class="list-group-item"><b>City:</b> ${user.address.city}</li>
            </ul>
        </div>
        <div class="card-footer bg-transparent border-dark">${user.phone}</div>
    </div>
    `
}

getUsersHTTP(onGetUsersCallback);


//Создать форму добавления пользователя состоящую из следующих полей name, email, phone, website. При сабмите формы сделать POST запрос на сервер https://jsonplaceholder.typicode.com/users  После ответа от сервера добавлять полученного пользователя на страницу в список.

const userForm = document.forms['user-form'];

userForm.addEventListener('submit', onFormSubmit);

function onFormSubmit(e) {
    e.preventDefault();
    const inputs = [...userForm.elements].filter(
        (el) => el.nodeName !== "BUTTON"
    );
    const objValues = inputs.reduce((acc, input) => {
        acc[input.name] = input.value;
        return acc;
    }, {});
    addNewUserHTTP(objValues, onAddUserCallback);
}

function addNewUserHTTP(data, cb) {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", `${apiUrl}users`);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.addEventListener("load", () => {
        if (Math.floor(xhr.status / 100) !== 2) {
            console.log("Error", xhr.status);
            return;
        }

        const res = JSON.parse(xhr.responseText);
        cb(res);
    });

    xhr.send(JSON.stringify(data));
}

function onAddUserCallback(newUser) {
    if (!newUser.id) {
        return;
    }

    renderNewUserToList(newUser);
}

function renderNewUserToList(user) {
    const template = newUserListItem(user);
    usersListEl.insertAdjacentHTML("beforeend", template);
}

function newUserListItem(user) {
    return `
        <div class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${user.name || ""}</h5>
            <small>${user.phone || ""}</small>
        </div>
            <p class="mb-1">${user.email || ""}</p>
            <small>${user.website || ""}</small>
        </div>
    `;
}