## **Show Players**

Returns JSON data about all players.

- **URL**

  /players

- **Method:**

  `GET`

- **URL Params**

  None

* **Query Params**

  **Optional:**

  `page=[integer]`
  `size=[integer]`

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:** `{ count: 1, players: [ { id: 1, name: "Jrue Holiday", position: "SG", request: { type: "GET", url: "http://afternoon-temple-74443.herokuapp.com/players/1" } } ], meta: { next: { request: { type: "GET", url: "http://afternoon-temple-74443.herokuapp.com/players?page=2&size=1" } } } }`

- **Error Response:**

  - **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "Log in" }`

  OR

  - **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "You are unauthorized to make this request." }`

- **Sample Call:**

  ```javascript
  fetch("http://localhost:5000/players?page=0&size=1")
    .then(resp => resp.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));
  ```

## **Show Player**

Returns JSON data about a single player.

- **URL**

  /player/:id

- **Method:**

  `GET`

- **URL Params**

  **Required:**

  `id=[integer]`

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:** `{ id: 1, name: "Jrue Holiday", position: "SG", games: [ { id: 12072, date: "2020-01-06", price: 8000, opponent: "UTA", points: null, rebounds: null, assists: null, steals: null, blocks: null, turnovers: null }, { id: 11476, date: "2020-01-04", price: 8300, opponent: "SAC", points: 19, rebounds: 5, assists: 7, steals: 1, blocks: 0, turnovers: 3 }, { id: 11802, date: "2020-01-03", price: 8400, opponent: "LAL", points: 12, rebounds: 3, assists: 6, steals: 1, blocks: 1, turnovers: 3 }, { id: 10364, date: "2019-12-29", price: null, opponent: null, points: 25, rebounds: 2, assists: 5, steals: 0, blocks: 2, turnovers: 0 }, { id: 10048, date: "2019-12-28", price: null, opponent: null, points: 20, rebounds: 3, assists: 7, steals: 2, blocks: 1, turnovers: 3 }, { id: 9710, date: "2019-12-25", price: null, opponent: null, points: 20, rebounds: 4, assists: 8, steals: 6, blocks: 0, turnovers: 4 }, { id: 9562, date: "2019-12-23", price: null, opponent: null, points: 21, rebounds: 6, assists: 5, steals: 1, blocks: 0, turnovers: 2 }, { id: 9075, date: "2019-12-20", price: null, opponent: null, points: 25, rebounds: 8, assists: 4, steals: 0, blocks: 0, turnovers: 3 }, { id: 8693, date: "2019-12-18", price: null, opponent: null, points: 18, rebounds: 3, assists: 3, steals: 2, blocks: 0, turnovers: 2 }, { id: 8560, date: "2019-12-17", price: null, opponent: null, points: 21, rebounds: 5, assists: 6, steals: 1, blocks: 2, turnovers: 0 } ] }`

- **Error Response:**

  - **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "Log in" }`

  OR

  - **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "You are unauthorized to make this request." }`

- **Sample Call:**

  ```javascript
  fetch("http://localhost:5000/players/1")
    .then(resp => resp.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));
  ```
