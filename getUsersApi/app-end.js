
const apiUrl = 'https://jsonplaceholder.typicode.com/';
const usersListEl = document.querySelector('.users-list');
const userInfoEl = document.querySelector('.user-info');

//1 запрос получение и отправку пользовате(-лей/-ля)
function http() {
    return {
        get(url, cb){
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url);
        
                xhr.addEventListener('load', () => {
        
                    if (Math.floor(xhr.status / 100) !== 2) {
                        cb(`Error: ${xhr.status}`, xhr);
                        return;
                    }
        
                    const response = JSON.parse(xhr.responseText);
                    cb(null, response);
                })
        
                xhr.addEventListener('error', () => {
                    cb(`Error: ${xhr.status}`, xhr);
                })
        
                xhr.send();
            } catch (error) {
                cb(error)
            }
        },
        post(url, body, headers, cb){
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', url);
        
                xhr.addEventListener('load', () => {
        
                    if (Math.floor(xhr.status / 100) !== 2) {
                        cb(`Error: ${xhr.status}`, xhr);
                        return;
                    }
        
                    const response = JSON.parse(xhr.responseText);
                    cb(null, response);
                })
        
                xhr.addEventListener('error', () => {
                    cb(`Error: ${xhr.status}`, xhr);
                })

                if (headers) {
                    Object.entries(headers).forEach(([key, value]) => {
                        xhr.setRequestHeader(key, value);
                    })
                }
        
                xhr.send(JSON.stringify(body));
            } catch (error) {
                cb(error)
            }
        },
    }
}

const myHttp = http();
myHttp.get(`${apiUrl}users`, onGetUsersCallback);

//2 реализовать обработчик ответа от сервера
function onGetUsersCallback(err, res) {
    if (err) {
        console.log(err);
        return;
    }
    if (!res.length) return;
    renderUsersList(res);
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

// POST Создать форму добавления пользователя состоящую из следующих полей name, email, phone, website. При сабмите формы сделать POST запрос на сервер https://jsonplaceholder.typicode.com/users  После ответа от сервера добавлять полученного пользователя на страницу в список.

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

    myHttp.post('https://jsonplaceholder.typicode.com/users', objValues, {"Content-Type": "application/json"}, onAddUserCallback);
}

function onAddUserCallback(err, newUser) {
    if (err) {
        console.log(err);
        return;
    }
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