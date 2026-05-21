# ヨガ動画生成プロンプト集

都会の夜景を背景にした、5種目構成のリラックスヨガ動画用プロンプト。
Veo / Sora / Runway / Kling 等の動画生成AIに投入する想定。

---

## 全体設定（共通リファレンス）

### キャラクター
- 添付参照画像の女性（黒髪ロング、ナチュラルな美しさ、東アジア系）
- 同一人物として全カットを通して一貫させる（i2v/参照画像入力推奨）

### 衣装
- トップス: ブラック系の背中開き（オープンバック）ヨガトップ、上品なシルク調マット質感
- ボトムス: ハイウエストのショートタイツ or ライトグレー〜ブラックのレギンス（脚ラインを美しく見せる丈感）
- アクセサリー: 最小限（細チェーンネックレス程度）

### シチュエーション / 環境
- ロケーション: 高層階のラグジュアリー・ペントハウス。床は黒大理石もしくはダークウッド
- 背景: 大きな窓越しに広がる東京/上海風の都会夜景。摩天楼のネオン、紫・アンバー・白色光
- 照明: 室内は暖色のキーライト + 紫のアクセントライト、被写体の輪郭にリムライト
- 小物: ダークグレーのヨガマット、観葉植物、間接照明、低めのアロマキャンドル

### 撮影スタイル
- 映画的（cinematic）、シャロー被写界深度（f/2.0相当）、35mm シネルック
- カメラ: ゆっくりとした dolly / orbit / handheld の安定移動
- 色味: ティール&オレンジ寄り、夜景のネオンが映える色設計
- フレームレート: 24fps、4K想定

### 音楽
- 低BPM（60〜75）のローファイ・チル / アンビエント / ピアノ + ソフトパッド
- リバーブ深め、雨音や微かな都市環境音をうっすら重ねる

---

## シーン構成（合計 約 60〜90 秒）

### Scene 0 — オープニング（5〜8秒）
**プロンプト:**
> Cinematic slow dolly-in toward a young East Asian woman with long dark hair sitting on a dark grey yoga mat in a luxurious high-rise penthouse at night. Floor-to-ceiling windows reveal a glowing cityscape with neon skyscrapers in purple and amber tones. She wears an elegant open-back black yoga top and high-waisted shorts. Warm rim light hugs her silhouette. Shallow depth of field, 35mm anamorphic look, 24fps, ambient lo-fi atmosphere. She takes a slow deep breath, eyes softly closed.

---

### Scene 1 — ナヴァーサナ（Navasana / 舟のポーズ）約 10〜12秒
**プロンプト:**
> Same woman performing Navasana (Boat Pose) on a dark grey yoga mat in a night-lit luxury penthouse. She balances on her sit bones, legs lifted at 45 degrees, arms parallel to the floor, core engaged, spine elegantly long. Slow orbital camera moves from her side to a 3/4 front view. City night skyline glows softly behind the windows. Warm key light, purple rim accent. Calm steady breathing. Cinematic, shallow depth of field, 24fps.

---

### Scene 2 — バードドッグ（Bird Dog）約 10〜12秒
**プロンプト:**
> Same woman in Bird Dog pose on hands and knees, extending her right arm forward and left leg back in a perfectly straight horizontal line, gaze softly downward. Slow side-tracking dolly shot capturing her back muscles and elegant posture. Open-back yoga top reveals toned shoulder blades. Backdrop: shimmering night cityscape through huge windows. Subtle haze, warm ambient lighting with cool city-light spill. She smoothly switches to the opposite arm and leg. Cinematic, serene mood.

---

### Scene 3 — ドルフィンウォーク（Dolphin Walk）約 12〜15秒
**プロンプト:**
> Same woman performing Dolphin Walk: forearms grounded on the mat, hips lifted high in an inverted V, slowly walking her feet toward her elbows step by step. Strong shoulders and elongated legs emphasized. Camera: low-angle slow tracking from the side. Penthouse interior at night, neon-lit skyscrapers blurred in the deep background. Soft sweat sheen on skin, controlled rhythmic breathing. Cinematic 35mm look, gentle handheld micro-movement.

---

### Scene 4 — バシシュターサナ（Vasisthasana / 側板のポーズ）約 10〜12秒
**プロンプト:**
> Same woman in Vasisthasana (Side Plank Pose), supporting her body on the right hand and the side of the right foot, left arm extended straight up toward the ceiling, body forming a clean diagonal line. Open-back top reveals her sculpted back. Camera: slow arc from front to side, finishing on a low hero angle. Night cityscape glows beyond the windows, purple and amber bokeh. Warm rim light traces her silhouette. Calm, powerful, elegant mood.

---

### Scene 5 — ファラカアサナ（Phalakasana / プランクポーズ）約 10〜12秒
**プロンプト:**
> Same woman holding Phalakasana (High Plank), arms straight under shoulders, body in a perfect straight line from head to heels, core fully engaged. Top-down slow descending camera move, then transitions to a side profile shot capturing her toned arms and legs. Black marble floor reflects subtle city light. Penthouse windows show the glittering urban night. Cinematic, intimate, focused atmosphere with soft ambient music.

---

### Scene 6 — クロージング（5〜8秒）
**プロンプト:**
> Same woman returns to a calm seated pose (Sukhasana) on the yoga mat, hands resting on her knees in Gyan mudra, eyes closed, gentle smile. Camera slowly pulls back through the penthouse, revealing the full night skyline behind her. Warm candlelight in the foreground softly out of focus. Fade to black. Lo-fi ambient music gently fades out.

---

## 音楽トラック仕様（BGM 発注 / 選曲基準）

- ジャンル: Lo-fi Chill / Ambient Piano / Downtempo
- BPM: 60〜75
- キー: マイナー寄り（Am, Em, Dm 等）で落ち着いた印象
- 構成: イントロ（パッド）→ ピアノ主旋律 → ソフトビート → アウトロ（フェード）
- 推奨参考: Nujabes風、ENDLESS SUMMER系、Sleepy Fish 系
- ロイヤリティフリー素材例: Epidemic Sound / Artlist / YouTube Audio Library の "Lofi" カテゴリ

---

## 生成・編集ワークフロー（推奨）

1. **参照画像準備**: 添付写真を i2v 対応モデル（Kling 1.6 / Runway Gen-3 / Veo 3）に入力
2. **シーンごとに 5〜8 秒のクリップ生成**: 各シーン 2〜3 テイク作って良いものを採用
3. **編集**: DaVinci Resolve / Premiere で繋ぎ、シーン間に 0.5 秒程度のクロスディゾルブ
4. **カラーグレーディング**: ティール&オレンジ LUT 適用、ハイライトに紫を少し乗せる
5. **音楽合成**: BGM をベッドに敷き、ポーズ切り替えに合わせて微かな環境音アクセント
6. **テキスト/字幕**: 各ポーズ名（日本語 + サンスクリット）を画面下に上品なセリフ体で 2秒表示

---

## 注意事項

- 同一人物の一貫性は i2v / Character Reference 機能が必須
- ヨガポーズは AI が誤った関節屈曲を生成しがちなので、解剖学的に正しいリファレンス画像を別途用意
- 衣装の「上品なセクシーさ」は "elegant"・"refined"・"graceful" 系の英単語で抑制した方が破綻が少ない
