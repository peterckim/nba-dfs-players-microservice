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
    **Content:** `{ count: 1, players: [ { id: 1, name: "Jrue Holiday", position: "SG", request: { type: "GET", url: "http://afternoon-temple-74443.herokuapp.com/players/1" } } ], meta: { next: { request: { type: "GET", url: "http://afternoon-temple-74443.herokuapp.com/players?page=1&size=1" } } } }`

- **Error Response:**

  - **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "Log in" }`

  OR

  - **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "You are unauthorized to make this request." }`

- **Sample Call:**

  ```javascript
    fetch("http://localhost:5000/players?page=0&size=1");
  });
  ```
