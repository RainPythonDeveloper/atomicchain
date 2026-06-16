# -*- coding: utf-8 -*-
"""Прогон 8 кейсов качества через /api/generate: baseline vs решение. Сохраняет PNG + лог."""
import json, base64, time, urllib.request, os

API = "http://localhost:3000/api/generate"
OUT = os.path.join(os.path.dirname(__file__), "screenshots")
os.makedirs(OUT, exist_ok=True)

# Решение = промпт собранный как в store.ts: основной текст + стиль + модификаторы
CASES = {
    "q1": {  # Простая сцена (контроль)
        "base": "a futuristic city in the mountains at sunrise",
        "sol":  "a futuristic city in the mountains at sunrise, cinematic lighting, ultra detailed, wide angle shot, golden hour glow",
    },
    "q2": {  # Полная цепочка модификаторов
        "base": "a lone samurai standing in a rice field",
        "sol":  "a lone samurai standing in a rice field, photorealistic, dramatic low-angle wide shot, golden hour lighting, crimson and gold color palette, highly detailed, 8k",
    },
    "q3": {  # Неанглоязычный ввод (русский) -> проверка авто-перевода
        "base": "рыжий кот в скафандре космонавта плывёт в открытом космосе среди звёзд",
        "sol":  "рыжий кот в скафандре космонавта плывёт в открытом космосе среди звёзд, digital painting, cinematic lighting, ultra detailed",
    },
    "q4": {  # Абстрактное понятие
        "base": "freedom",
        "sol":  "freedom, conceptual art, surreal, dramatic lighting, vibrant colors, symbolic composition",
    },
    "q5": {  # Текст на картинке (слабость диффузии)
        "base": 'a neon sign on a brick wall that says "HELLO"',
        "sol":  'a neon sign on a brick wall that says "HELLO", photorealistic, night scene, neon glow, cinematic',
    },
    "q6": {  # Анатомия рук
        "base": "two people shaking hands, extreme close-up on the hands",
        "sol":  "two people shaking hands, extreme close-up on the hands, photorealistic, macro shot, studio lighting, highly detailed",
    },
    "q7": {  # Очень длинный промпт (6+ модификаторов)
        "base": "a dragon",
        "sol":  "a dragon, oil painting style, dramatic chiaroscuro lighting, low angle epic shot, made of molten lava and obsidian, ancient medieval era, deep red and black color palette, ultra detailed",
    },
    "q8": {  # Противоречивые модификаторы
        "base": "a mountain landscape with a lake",
        "sol":  "a mountain landscape with a lake, golden hour warm sunset lighting, bright midnight full moonlight, harsh midday sun",
    },
}

def gen(prompt):
    body = json.dumps({"prompt": prompt, "size": "1024x1024"}).encode()
    req = urllib.request.Request(API, data=body, headers={"Content-Type": "application/json"})
    t0 = time.time()
    with urllib.request.urlopen(req, timeout=120) as r:
        data = json.loads(r.read())
    dt = round(time.time() - t0, 1)
    return data, dt

log = {}
for cid, c in CASES.items():
    for variant in ("base", "sol"):
        prompt = c[variant]
        try:
            data, dt = gen(prompt)
            img = data.get("imageBase64")
            if img:
                path = os.path.join(OUT, f"{cid}_{variant}.png")
                open(path, "wb").write(base64.b64decode(img))
                log[f"{cid}_{variant}"] = {"latency": dt, "translated": data.get("translatedPrompt"), "ok": True}
                print(f"{cid}_{variant}: OK {dt}c  -> {os.path.basename(path)}")
            else:
                log[f"{cid}_{variant}"] = {"error": data.get("error"), "ok": False}
                print(f"{cid}_{variant}: ОШИБКА {data.get('error')}")
        except Exception as e:
            log[f"{cid}_{variant}"] = {"error": str(e), "ok": False}
            print(f"{cid}_{variant}: EXC {e}")

json.dump(log, open(os.path.join(OUT, "_latency_log.json"), "w"), ensure_ascii=False, indent=2)
print("\nЛог латентности сохранён. Перевод Q3:", log.get("q3_base", {}).get("translated"))
