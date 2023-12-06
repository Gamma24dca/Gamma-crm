import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
var serviceAccount = require('../../firebase.key.json');

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'gamma-crm.appspot.com',
});

const Bucket = getStorage().bucket();

export const uploadImg = async (filePath) => {
  const [file] = await Bucket.upload(filePath, { public: true });
  return file.publicUrl();
};
