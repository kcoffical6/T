// Basic persist configuration
import storage from "redux-persist/lib/storage";
import { encryptTransform } from "redux-persist-transform-encrypt";

const encryptor = encryptTransform({
  secretKey: process.env.SECRET_KEY_REDUX || "my-super-secret-key",
  onError: (_error) => {
    // console.error("Encryption error:", error);
  },
});

export const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only persist the auth reducer
  version: 1,
  transforms: [encryptor],
};
