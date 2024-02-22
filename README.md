<div align=center>
  <img width =256 src="https://github.com/JRay9487/Electrical-laboratory-Notebook/assets/65828051/d791f893-5773-4dd9-b2ad-94e0f721e5b8"/>
  <h3>ELIMT</h3>
  <p>簡單，適合各大專院校實驗室使用的電子系統</p>
  <br><br>

</div>



## 架構 
  由Express結合ReactJS 形成簡易免安裝網頁應用程式，透過SQLite儲存基本用戶、檔案資訊，並透過Google Cloud API 串連雲端硬碟，將檔案儲存在雲端中，減低儲存相關設備開銷。前端頁面使用MUI(Material UI) 減低開發難度，並可自行更成喜歡的顯示風格。
  
  ![project](https://github.com/JRay9487/Electrical-laboratory-Notebook/assets/65828051/987ebe11-90a0-4d03-b816-3cd93b66f3bd)

<div>
  <br>
</div>

## 功能
  主要功能開發完成，檔案搜尋過濾功能正在開發。
  
  - [x] 前後端及資料庫系統架構
  - [x] 網頁內容模組化切換
  - [x] 程式功能
    - [x] 個人帳號介面
    - [x] 常用鏈接
    - [x] 系統設定
    - [x] 使用者管理
    - [x] 實驗紀錄簿
      - [x] 實驗記錄上傳
        - [x] 上傳功能
        - [x] 上傳歷史紀錄
      - [x] 實驗記錄簽核
        - [x] 簽核功能
        - [x] 簽核歷史

    
<div>
  <br>
</div>

## 下載及使用
  ### 注意事項
  * 如果遇到任何問題，歡迎使用[ issues ](https://github.com/JRay9487/ELIMT/issues)回報。
  * 本專案在Node.js v18.16.0下開發，其他版本相容性目前尚不知。
  * 系統將使用3000(ReactJS)、3001(Express)連接埠，如果有佔用可能需要手動調整。
  * 第一次使用必須至[localhost:3000/oauth](localhost:3000/oauth)進行Google 雲端授權驗證。
  * 系統預設獲取最新200筆上傳資料，如需增加或減少需至`settings.json`設定。
  * **ELIMT 電子系統為專有軟體（Proprietary software）受中華民國 著作權法保護，購買者僅被授權對程式部分內容，包括項目類別、功能、顯示方法及系統設定等進行更改，禁止移除一切可能包含版權告示之內容，任何違反契約之行為本人將保留法律追訴權。**


  ### 已知Bug
  * 在MacOS Sonoma 14.2.1, Safari 17.2.1（19617.1.17.11.12）下， ```@google-cloud/local-auth```可能無法進行本地驗證，建議使用Chrome瀏覽器。


  ### 安裝方法
  1. 下載 [Node.js v18.16.0](https://nodejs.org/en)
  2. 如果安裝Node.js 在輸入 ```Node -v```，應會出現版本資訊 
  3. 下載本項目資料至電腦
  4. 使用CLI 進入項目資料夾，並輸入 ```npm run install-app```，下載所有專案需求模組
  5. 使用 ```node server.js```，啟動系統
  6. 預設登入帳號為admin 密碼為lab12345，可透過此管理帳號新增其他用戶(開發中)，或使用[DB Browser for SQLite](https://sqlitebrowser.org/)，編輯資料庫中的`users` 資料表。
  7. 第一次登入必須先授權Google Drive API，切換網頁至```localhost:3000/oauth```。


