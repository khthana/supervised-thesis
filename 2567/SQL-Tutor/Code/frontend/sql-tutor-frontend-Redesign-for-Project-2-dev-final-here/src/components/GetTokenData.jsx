import jwt from 'jsonwebtoken';

export default function GetTokenData(token, Val) {
  try {
    const decoded = jwt.decode(token);
    if (Val === 'accountID') {
      // console.log('accountID', decoded.accountID, typeof decoded.accountID);
      return String(decoded.accountID);
    } else if (Val === 'email') {
      return decoded.email;
    } else if (Val === 'role') {
      return String(decoded.role);
    } else if (Val === 'username') {
      return decoded.username;
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}
