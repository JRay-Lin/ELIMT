const fs = require("fs").promises;
const path = require("path");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/drive"]; //Google Drive API
const TOKEN_PATH = path.join(__dirname, "auth", "token.json"); //TOKEN 儲存位置
const CREDENTIALS_PATH = path.join(__dirname, "auth", "credentials.json"); //Google API 認證

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH, "utf8"); // 使用 'utf8' 來直接獲取字串內容
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    console.log("No existing credentials found or failed to load", err);
    return null;
  }
}

async function saveCredentials(client) {
  try {
    const content = await fs.readFile(CREDENTIALS_PATH, "utf8");
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: "authorized_user",
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload, "utf8"); // 也指定 'utf8' 格式
  } catch (err) {
    console.log("Failed to save credentials", err);
  }
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials && client.credentials.refresh_token) {
    await saveCredentials(client);
  } else {
    console.log(
      "Authentication succeeded but no refresh token obtained. Make sure the app is authorized correctly and the consent screen is configured."
    );
  }
  return client;
}

module.exports = {
  authorize,
};
