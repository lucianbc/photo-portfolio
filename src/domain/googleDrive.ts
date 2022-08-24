import { Auth, drive_v3, google } from "googleapis";

type GoogleDriveKey = {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
};

const readDriveKey = (): GoogleDriveKey => {
  const GDRIVE_KEY = "GDRIVE_KEY";
  if (process.env[GDRIVE_KEY]) {
    return JSON.parse(process.env[GDRIVE_KEY]);
  } else {
    throw new Error();
  }
};

const googleDriveKey = readDriveKey();

const listStuff = async (creds: Auth.Credentials) => {
  const auth = new google.auth.OAuth2();
  auth.setCredentials(creds);
  const drive = new drive_v3.Drive({ auth });
  const list = await drive.files.list({
    q: "parents='1fvpSK4ZcXK_t42kfOciNFWC1CCk7xSen'",
  });
  console.debug("list here", JSON.stringify(list.data.files));
  console.debug("Total here", list.data.files.length);
};

const main = async () => {
  const jwtClient = new Auth.JWT(
    googleDriveKey.client_email,
    null,
    googleDriveKey.private_key,
    ["https://www.googleapis.com/auth/drive"]
  );
  const result = await jwtClient.authorize();
  await listStuff(result);
};

main();
console.debug("Hello world");
