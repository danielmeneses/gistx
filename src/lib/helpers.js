import auth from '../../config/main';

export const generateUniqueId = () => {
  return Math.random()
    .toString(36)
    .substr(2, 9);
};

export const shouldComponentUpdate = (nextProps, currentProps) => {
  const keys = Object.keys(currentProps);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (typeof currentProps[key] === 'function') continue;
    if (currentProps[key] !== nextProps[key]) return true;
  }
  return false;
};

export const getToken = () => {
  let token = null;
  // test universal version first
  if (auth.token) token = auth.token;
  // try non universal
  else
    try {
      token = window.localStorage.getItem(auth.localStorage.tokenKeyName);
    } catch (e) {}

  return token;
};

export const objToQueryString = obj => {
  const query = [];
  Object.keys(obj).reduce((all, key, index) => {
    let item = '';
    if (index > 0) item += '&';
    item += `${key}=${obj[key]}`;
    query.push(item);
    return query;
  }, query);
  return query.join('&');
};
