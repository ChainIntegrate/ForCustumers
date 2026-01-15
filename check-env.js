require('dotenv').config();
console.log('RPC:', process.env.RPC_URL);
console.log('PK loaded:', !!process.env.PRIVATE_KEY);
