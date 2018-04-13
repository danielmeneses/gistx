import GitHub from 'github-base';
import { getToken } from '../lib/helpers';

let token = getToken();
let github = null;
if (token)
  github = new GitHub({
    token
  });

export default github;
