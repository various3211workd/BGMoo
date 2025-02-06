# BGMoo

## USAGE

### 1. 音楽ファイルを/public/audio/<設定する情景>/配下に配置する

```shell
# 例：

public/audio/悲しい/sad1.mp3
public/audio/悲しい/sad2.mp3
public/audio/楽しい/happy1.mp3
public/audio/街並み_ファンタジー/sample1.mp3
public/audio/街並み_ファンタジー/sample2.mp3

...

```

### 2. audio-samples.json を作成する

```shell
$ python get-audio-samples.py
```

### 3. package などのインストール

```shell
$ npm i
```

### 4. 実行

```shell
$ npm run dev
```
