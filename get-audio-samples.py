import os
import eyed3
import json

folder_path = "public/audio"

audio_files = {}

for root, dirs, files in os.walk(folder_path):
    for file in files:
        if file.endswith(".mp3"):
            file_path = os.path.join(root, file)

            audio_file = eyed3.load(file_path)
            artist = "不明"
            if audio_file.tag is not None and audio_file.tag.artist:
                artist = audio_file.tag.artist

            category = os.path.basename(root)
            relative_path = os.path.relpath(file_path, folder_path) # /audioより後のパスを取得

            if category not in audio_files:
                audio_files[category] = []

            audio_files[category].append({
                "title": file,
                "artist": artist,
                "src": relative_path, # 先頭に/を追加
                "tag": ""
            })

print(json.dumps(audio_files, ensure_ascii=False, indent=2))

with open("public/audio-samples.json", "w") as f:
    json.dump(audio_files, f, ensure_ascii=False, indent=2)
