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
  else
    // try non universal
    try {
      token = window.localStorage.getItem(auth.localStorage.tokenKeyName);
    } catch (e) {}

  return token;
};
