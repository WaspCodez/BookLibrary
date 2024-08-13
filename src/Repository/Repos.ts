import { useUserStore } from '../storeToken/storedToken';

class Repos {

  async get(resource: string) {
    const store = useUserStore();
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + store.token
      }
    };
    let response = await fetch(resource, requestOptions);

    if (!response.ok)
      throw Error(`${await response.text()}`);

    return await response.json();
  }

  async add(resource: string, body?: object) {
    const store = useUserStore();
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + store.token
      },
      body: JSON.stringify(body)
    };
    let response = await fetch(resource, requestOptions);

    if (!response.ok)
      throw Error(`${await response.text()}`);

  }


  async post(resource: string, body?: object) {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
    let response = await fetch(resource, requestOptions);

    if (!response.ok)
      throw Error(`${await response.text()}`);

    return await response.json();

  }

  async put(resource: string, body: object) {
    const store = useUserStore();
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + store.token
      },
      body: JSON.stringify(body)
    };
    let response = await fetch(resource, requestOptions);

    if (!response.ok)
      throw Error(`${await response.text()}`);



  }

  async delete(resource: string) {
    const store = useUserStore();
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + store.token
      }
    };
    let response = await fetch(resource, requestOptions);

    if (!response.ok)
      throw Error(`${await response.text()}`);


  }
}

export default new Repos();