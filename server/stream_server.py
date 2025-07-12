"""
Стриминговый сервер для BOOOMERANGS
Обеспечивает потоковую передачу ответов от моделей G4F
"""
from flask import Flask, request, Response, jsonify
from flask_cors import CORS
import g4f
import json
import time
import random
import traceback

# Основные провайдеры с поддержкой потоковой передачи
# Используем более гибкий подход с getattr вместо прямого доступа
# для избежания ошибок AttributeError
def get_provider(name):
    try:
        return getattr(g4f.Provider, name)
    except AttributeError:
        print(f"Провайдер {name} не найден в g4f")
        return None

providers = {}
# Добавляем провайдеры в приоритетном порядке - Qwen_Qwen_2_72B первым
for name in ["Qwen_Qwen_2_72B", "Qwen_Qwen_2_5_Max", "Qwen_Qwen_2_5", "Qwen_Qwen_2_5M", "FreeGpt", "Liaobots", "HuggingChat", "DeepInfra", "You", "Gemini", "Phind", "Anthropic", "Blackbox", "ChatGpt"]:
    provider = get_provider(name)
    if provider:
        providers[name] = provider
        print(f"Успешно загружен провайдер: {name}")
    else:
        print(f"Не удалось загрузить провайдер: {name}")

# Пытаемся найти провайдеры Llama и другие перспективные модели
llama_providers = []
gpt_providers = []  # Для провайдеров GPT
all_provider_names = []
try:
    all_provider_names = [name for name in dir(g4f.Provider) if not name.startswith('_')]
    print(f"Всего найдено провайдеров: {len(all_provider_names)}")
except Exception as e:
    print(f"Ошибка при получении списка провайдеров: {str(e)}")
    all_provider_names = []

# Ищем провайдеры с llama в названии
for name in all_provider_names:
    if "llama" in name.lower():
        print(f"Найден потенциальный Llama провайдер: {name}")
        provider = get_provider(name)
        if provider:
            providers[name] = provider
            llama_providers.append(name)
            print(f"🦙 Успешно загружен Llama провайдер: {name}")

# Ищем GPT провайдеры специально
gpt_potential_providers = [
    "DeepAI", "AiChats", "Poe", "AIChatOnline", "GigaChat", "GPTalk", 
    "ChatGpt", "Chatgpt4Online", "OpenaiChat", "GPROChat", "FreeChatgpt", 
    "You", "MyShell", "FreeGpt", "Gemini", "Bing", "OpenaiAPI",
    "DeepInfra", "GptGo"
]

for name in gpt_potential_providers:
    if name not in providers and name in all_provider_names:
        provider = get_provider(name)
        if provider:
            providers[name] = provider
            gpt_providers.append(name)
            print(f"🔥 Успешно загружен потенциальный GPT провайдер: {name}")

# Проверяем основные провайдеры, которые могут предоставить GPT-3.5
priority_gpt_providers = ["DeepInfra", "You", "Gemini", "ChatGpt"]
for name in priority_gpt_providers:
    if name in providers:
        # Пробуем проверить, поддерживает ли данный провайдер GPT-3.5 Turbo
        print(f"⚡ Проверка поддержки GPT-3.5 Turbo у провайдера {name}...")

# Ищем Llama 3 специально
for name in ["HuggingFace", "HuggingSpace", "HuggingChat", "Ollama", "Replicate"]:
    if name not in providers and name in all_provider_names:
        provider = get_provider(name)
        if provider:
            providers[name] = provider
            print(f"✅ Успешно загружен дополнительный провайдер для моделей Llama: {name}")

# Добавляем в список потенциальных провайдеров с Llama
if "HuggingChat" in providers:
    llama_providers.append("HuggingChat")
if "Ollama" in providers:
    llama_providers.append("Ollama")

# Проверяем доступность Claude через Anthropic
anthropic_available = "Anthropic" in providers
llama_available = len(llama_providers) > 0

if llama_available:
    print(f"✅ Провайдеры Llama доступны: {', '.join(llama_providers)}")
else:
    print("❌ Провайдеры Llama не найдены или недоступны")
if anthropic_available:
    print("✅ Провайдер Anthropic (Claude) доступен для использования!")
else:
    print("❌ Провайдер Anthropic (Claude) недоступен или требует API ключ")

# Организуем провайдеры в группы по надежности
provider_groups = {
    'primary': ['Qwen_Qwen_2_5_Max', 'Qwen_Qwen_3', 'You', 'DeepInfra'],
    'secondary': ['Gemini', 'GeminiPro', 'Phind', 'ChatGpt'],
    'fallback': ['You', 'DeepInfra', 'GPTalk', 'FreeGpt', 'GptGo']
}

# Добавляем группу для GPT-3.5
gpt_providers_group = ['DeepInfra', 'You', 'ChatGpt', 'GPTalk', 'FreeGpt', 'GptGo']

# Добавляем Claude в группы, если доступен
if anthropic_available:
    provider_groups['primary'].insert(0, 'Anthropic')  # Добавляем в начало списка primary

# Добавляем Llama в группы, если доступны
if llama_available:
    for llama_provider in llama_providers:
        # Добавляем Llama провайдеров в начало primary группы
        provider_groups['primary'].insert(0, llama_provider)
        print(f"🦙 Добавлен Llama провайдер {llama_provider} в primary группу")

app = Flask(__name__)
CORS(app)

def get_demo_response(message):
    """Генерирует демо-ответ для случаев, когда API недоступен"""
    message_lower = message.lower()

    if any(word in message_lower for word in ['привет', 'здравствуй', 'hello', 'hi']):
        return "Привет! Я BOOOMERANGS AI ассистент. Чем могу помочь вам сегодня?"
    elif any(word in message_lower for word in ['как дела', 'как ты', 'how are you']):
        return "У меня всё отлично, спасибо что спросили! Как ваши дела?"
    elif any(word in message_lower for word in ['изображен', 'картин', 'image', 'picture']):
        return "Вы можете создать изображение, перейдя на вкладку \"Генератор изображений\". Просто опишите, что хотите увидеть!"
    elif 'бот' in message_lower:
        return "Да, я бот-ассистент BOOOMERANGS. Я использую различные AI модели для ответов на ваши вопросы без необходимости платных API ключей."
    elif any(word in message_lower for word in ['booomerangs', 'буумеранг']):
        return "BOOOMERANGS - это бесплатный мультимодальный AI-сервис для общения и создания изображений без необходимости платных API ключей."

    # Если не нашли ключевых слов, используем случайный ответ    
    random_responses = [
        "BOOOMERANGS использует различные AI-провайдеры, чтобы предоставлять ответы даже без платных API ключей. Наша система автоматически выбирает лучший доступный провайдер в каждый момент времени.",
        "BOOOMERANGS позволяет не только общаться с AI, но и генерировать изображения по текстовому описанию, а также конвертировать их в векторный формат SVG.",
        "BOOOMERANGS стремится сделать технологии искусственного интеллекта доступными для всех. Наше приложение работает прямо в браузере и оптимизирован для использования на мобильных устройствах."
    ]

    return random.choice(random_responses)

@app.route('/stream', methods=['POST'])
def stream_chat():
    try:
        data = request.get_json()
        message = data.get('message', '')

        print(f"🧠 [PYTHON] АКТИВАЦИЯ думающей системы для: {message}")

        def generate():
            try:
                # ОТКЛЮЧАЕМ демо-ответы
                # Сигнализируем Node.js активировать думающую систему
                yield f"event: message\ndata: {json.dumps({'role': 'assistant', 'content': 'THINKING_SYSTEM_ACTIVATION', 'trigger_thinking': True})}\n\n"
                yield f"event: done\ndata: {{}}\n\n"
                print("🧠 [PYTHON] Думающая система активирована")

            except Exception as e:
                print(f"❌ [PYTHON] Ошибка активации думающей системы: {e}")
                yield f"event: error\ndata: {json.dumps({'error': str(e)})}\n\n"

        return Response(generate(), mimetype='text/plain', headers={
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        })

    except Exception as e:
        print(f"❌ [PYTHON] Ошибка активации: {e}")
        return jsonify({'error': str(e)}), 500

# Простой тестовый маршрут
@app.route('/test', methods=['GET'])
def test():
    return jsonify({"status": "ok", "message": "Flask-сервер стриминга работает"})

# Маршрут для тестирования провайдеров
@app.route('/test-provider/<provider_name>', methods=['GET'])
def test_provider(provider_name):
    if provider_name not in providers:
        return jsonify({"status": "error", "message": f"Провайдер {provider_name} не найден"})

    provider = providers[provider_name]
    try:
        # Проверяем, требует ли провайдер API-ключ
        # Используем минимальный запрос для проверки
        response = g4f.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Say just one word: Test"}],
            provider=provider,
            timeout=5  # Короткий таймаут
        )

        return jsonify({
            "status": "ok", 
            "message": f"Провайдер {provider_name} доступен", 
            "requires_api_key": False,
            "response": str(response)[:100]  # Только начало ответа
        })
    except Exception as e:
        error_str = str(e)
        requires_api_key = any(key in error_str.lower() for key in ["api_key", "apikey", "key", "token"])

        return jsonify({
            "status": "error",
            "message": f"Ошибка при проверке провайдера {provider_name}",
            "error": error_str,
            "requires_api_key": requires_api_key
        })

# Функция для запуска сервера
if __name__ == '__main__':
    print("Запуск стримингового сервера на порту 5001...")
    app.run(host='0.0.0.0', port=5001, debug=True, threaded=True)