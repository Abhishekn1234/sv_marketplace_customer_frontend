import { getAuth } from "firebase/auth";

const auth = getAuth();

async function getToken() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not logged in");
  }

  const token = await user.getIdToken();

  console.log("Firebase ID Token:", token);
}

getToken();

export default getToken;