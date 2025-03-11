
const { jwtDecode } = require("jwt-decode")

export const DecodedData = (token)=>{
    if (!token || typeof token !== 'string') {
        console.error('Invalid or missing token:', token); // Log the error for debugging
        return null;
      }
    const decoded = jwtDecode(token)
    return decoded
}
