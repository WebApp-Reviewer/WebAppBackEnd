// this file holds your frontend network request adapters
// think about each function as a service that provides data
// to your React UI through AJAX calls

// for example, if we need to display a list of users
// we'd probably want to define a getUsers service like this:

/* 
  export async function getUsers() {
    let data = false;
    try {
      const response = await fetch('/api/users');
      data = await response.json();
      if (data.error) {
        throw data.error;
      }
    } catch(err) {
      console.error(err)
    }
    return data && data.users;
  }
*/


export const getAPIHealth = async() => {
  let data = false;

  try {
    const response = await fetch('/api/health');
    data = await response.json();

    if (data.error) {
      throw data.error;
    }
  } catch (err) {
    console.error(err);
  }
console.log('HAH', data);
  return data;
}
