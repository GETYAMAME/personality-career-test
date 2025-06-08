# Vercel へのデプロイ手順

このプロジェクトを Vercel にデプロイするための手順です。

## 前提条件

- GitHub アカウント
- Vercel アカウント

## 手順

### 1. GitHub リポジトリの作成

1. [GitHub](https://github.com/)にログインします。
2. 右上の「+」ボタンをクリックし、「New repository」を選択します。
3. リポジトリ名を入力します（例：personality-career-test）。
4. 「Create repository」ボタンをクリックします。

### 2. ローカルリポジトリを GitHub にプッシュ

以下のコマンドを実行して、ローカルリポジトリを GitHub にプッシュします。
`<username>`と`<repository>`は、実際の GitHub ユーザー名とリポジトリ名に置き換えてください。

```bash
git remote add origin https://github.com/<username>/<repository>.git
git branch -M main
git push -u origin main
```

### 3. Vercel でのデプロイ

1. [Vercel](https://vercel.com/)にアクセスし、アカウントを作成またはログインします。
2. 「New Project」ボタンをクリックします。
3. 「Import Git Repository」セクションで、先ほど作成した GitHub リポジトリを選択します。
4. プロジェクト名を確認し、必要に応じて変更します。
5. 「Deploy」ボタンをクリックします。

デプロイが完了すると、プロジェクトの URL が表示されます。この URL にアクセスすると、デプロイされたアプリケーションを確認できます。

## 注意事項

- EmailJS を使用するには、実際の EmailJS アカウントを作成し、以下のファイルの設定を変更する必要があります：

  - `index.html`: `emailjs.init("YOUR_USER_ID")` の部分を実際のユーザー ID に変更
  - `script.js`: `emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)` の部分を実際のサービス ID とテンプレート ID に変更

- LINE 友だち追加機能を使用するには、実際の LINE 公式アカウントを作成し、以下のファイルの設定を変更する必要があります：
  - `script.js`: `const LINE_FRIEND_URL = "https://line.me/R/ti/p/@908enhf"` の部分を実際の LINE 公式アカウントの URL に変更
