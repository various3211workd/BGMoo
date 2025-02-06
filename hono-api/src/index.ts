// src/index.ts

import { Hono } from 'hono'
import { cors } from "hono/cors"
import { SendGeminiAPI } from './sendGeminiAPI.js'
import { serve } from '@hono/node-server'

const app = new Hono()

// CORS を有効化（適用範囲を明確に指定）
app.use(cors())

// 期待する JSON を正しく受け取り、レスポンスを返す
app.post('/', async (c) => {
  try {
    const requestBody = await c.req.json();
    console.log("Received Request:", requestBody);

    const response = await SendGeminiAPI(requestBody.text, requestBody.emosionList);
    console.log("SendGeminiAPI Response:", response);

    return c.json(response);
  } catch (error) {
    console.error("Error in / endpoint:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

import dotenv from 'dotenv';
dotenv.config();

app.post("/exchange_token", async (c) => {
  const { code, redirectUri } = await c.req.json();

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET_ID!,
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const data = await response.json();

  if (data.error) {
    return c.json({ success: false, error: data.error_description }, 400);
  }

  // 取得した access_token を使用して Google のユーザー情報を取得
  const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${data.access_token}`,
    },
  });

  const userInfo = await userInfoResponse.json();

  // ユーザー情報から一意な userId (sub) を取得
  const userId = userInfo.sub;
  const idToken = data.id_token;

  // Firebase の ID トークンを取得
  return c.json({ success: true, access_token: idToken, userId });
});



import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth"; // Firebase Admin SDK

import serviceAccount from './serviceAccountKey.json'; // JSONファイルをインポート

// サービスアカウントの認証情報を直接指定して初期化
initializeApp({
  credential: cert(serviceAccount), // これで認証情報を使用
});

// Firebase Admin SDK の初期化
//initializeApp();
const db = getFirestore();

app.post("/save_sample_musics", async (c) => {
  const { userId, token, sampleMusics } = await c.req.json();

  // Firebase Auth を使って token を検証
  try {
    // token を検証してユーザー情報を取得
    /*
    const decodedToken = await getAuth().verifyIdToken(token);
    console.log("decodedToken: ", decodedToken)

    // token が valid であれば、userId をチェックして Firestore にデータを保存
    if (decodedToken.uid !== userId) {
      return c.json({ success: false, error: "Invalid userId" }, 400);
    }
    */

    // Firestore の sampleMusics コレクションにデータを保存
    await db.collection("users").doc(userId).collection("sampleMusics").add({
      musics: sampleMusics,
      createdAt: new Date(),
    });

    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 400);
  }
});



app.post("/get_sample_musics", async (c) => {
  const { userId, token } = await c.req.json();
  console.log("token: ",token)

  // Firebase Auth を使って token を検証
  try {
    // token を検証してユーザー情報を取得
    
    /*
    const decodedToken = await getAuth().verifyIdToken(token);

    // token が valid であれば、userId をチェック
    if (decodedToken.uid !== userId) {
      return c.json({ success: false, error: "Invalid userId" }, 400);
    }
    */

    // Firestore から sampleMusics コレクションのデータを取得
    const snapshot = await db.collection("users").doc(userId).collection("sampleMusics").get();

    if (snapshot.empty) {
      return c.json({ success: false, error: "No sample musics found" }, 404);
    }

    // データを整形して返す
    const sampleMusics = snapshot.docs.map(doc => doc.data());
    return c.json({ success: true, sampleMusics });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 400);
  }
});



app.post("/get_references", async (c) => {
  const { userId, token } = await c.req.json();

  console.log("userId: ", userId)

  try {
    const snapshot = await db.collection("users").doc(userId).collection("references").orderBy("createdAt", "desc").get();
  
  const latestDoc = snapshot.docs[0];
  const references = latestDoc.data().references;

    if (snapshot.empty) {
      return c.json({ success: false, error: "No sample musics found" }, 404);
    }

    // データを整形して返す
    //const references = snapshot.docs.map(doc => doc.data());
    console.log("references: ", references)

    return c.json({ success: true, references: references });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 400);
  }
});


app.post("/save_references", async (c) => {
  const { userId, token, references } = await c.req.json();

  // Firebase Auth を使って token を検証
  try {

    // Firestore の sampleMusics コレクションにデータを保存
    await db.collection("users").doc(userId).collection("references").doc("references").set({
      references: references,
      createdAt: new Date(),
    }, { merge: true });

    /*
    await db.collection("users").doc(userId).collection("references").add({
      references: references,
      createdAt: new Date(),
    });
    */

    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 400);
  }
});


// ポート設定
const port = 8080
console.log(`Server is running on http://localhost:${port}`);

// サーバー起動
serve({
  fetch: app.fetch,
  port
});
