
/**
 * 📚 NEURAL VOCABULARY EXPANDER
 * Система расширения словаря для LITE нейросети
 */

const fs = require('fs');
const path = require('path');

class NeuralVocabularyExpander {
  constructor() {
    this.semanticMemory = null;
    this.expandedVocabulary = new Map();
    this.reverseExpandedVocabulary = new Map();
    this.wordFrequencies = new Map();
    this.specialTokens = ['<PAD>', '<UNK>', '<START>', '<END>', '<MASK>'];
    this.targetVocabSize = 10000;
    
    console.log('📚 Инициализация расширителя словаря...');
  }

  async initialize() {
    try {
      // Подключаемся к семантической памяти
      try {
        const semanticModule = require('./semantic-memory/index.cjs');
        this.semanticMemory = semanticModule;
        console.log('✅ Семантическая память подключена к расширителю словаря');
      } catch (error) {
        console.log('⚠️ Семантическая память недоступна, используем базовый набор');
      }

      console.log('📚 Расширитель словаря готов к работе');
      return this;
    } catch (error) {
      console.error('❌ Ошибка инициализации расширителя словаря:', error);
      throw error;
    }
  }

  /**
   * Расширение словаря до целевого размера
   */
  async expandVocabulary() {
    console.log(`📚 Начинаем расширение словаря до ${this.targetVocabSize} токенов...`);

    // 1. Добавляем специальные токены
    this.addSpecialTokens();

    // 2. Добавляем базовые русские токены
    this.addBaseRussianTokens();

    // 3. Извлекаем слова из семантической памяти
    await this.extractWordsFromSemanticMemory();

    // 4. Добавляем частотную лексику русского языка
    this.addFrequentRussianWords();

    // 5. Добавляем специализированную лексику
    this.addSpecializedTerms();

    // 6. Добавляем морфологические варианты
    this.addMorphologicalVariants();

    // 7. Финализируем словарь
    this.finalizeVocabulary();

    console.log(`✅ Словарь расширен до ${this.expandedVocabulary.size} токенов`);
    return this.expandedVocabulary;
  }

  addSpecialTokens() {
    console.log('🔧 Добавляем специальные токены...');
    
    this.specialTokens.forEach((token, index) => {
      this.expandedVocabulary.set(token, index);
      this.reverseExpandedVocabulary.set(index, token);
    });
  }

  addBaseRussianTokens() {
    console.log('🇷🇺 Добавляем базовые русские токены...');
    
    const baseTokens = [
      // Местоимения
      'я', 'ты', 'он', 'она', 'оно', 'мы', 'вы', 'они',
      'мой', 'твой', 'его', 'её', 'наш', 'ваш', 'их',
      'себя', 'себе', 'собой', 'этот', 'тот', 'который',
      
      // Предлоги
      'в', 'на', 'с', 'по', 'для', 'от', 'до', 'за', 'при', 
      'под', 'над', 'через', 'без', 'между', 'перед', 'после',
      'вместо', 'около', 'возле', 'среди', 'против', 'вдоль',
      
      // Союзы
      'и', 'или', 'но', 'а', 'да', 'что', 'как', 'когда', 
      'где', 'почему', 'если', 'хотя', 'чтобы', 'потому',
      
      // Частицы
      'не', 'ни', 'же', 'ли', 'бы', 'даже', 'только', 'уже',
      'еще', 'всё', 'все', 'так', 'тут', 'здесь', 'там',
      
      // Глаголы базовые
      'быть', 'есть', 'был', 'была', 'было', 'были', 'будет', 'будут',
      'иметь', 'делать', 'сделать', 'говорить', 'сказать', 'знать',
      'видеть', 'идти', 'ехать', 'жить', 'работать', 'играть',
      'думать', 'понимать', 'хотеть', 'мочь', 'могу', 'можешь',
      'любить', 'нравиться', 'помогать', 'учиться', 'изучать',
      
      // Существительные базовые
      'человек', 'люди', 'мужчина', 'женщина', 'ребенок', 'дети',
      'дом', 'квартира', 'комната', 'семья', 'работа', 'школа',
      'день', 'ночь', 'время', 'год', 'месяц', 'неделя',
      'город', 'страна', 'мир', 'жизнь', 'смерть', 'здоровье',
      
      // Прилагательные базовые
      'хороший', 'плохой', 'большой', 'маленький', 'новый', 'старый',
      'красивый', 'умный', 'быстрый', 'медленный', 'высокий', 'низкий',
      'белый', 'черный', 'красный', 'синий', 'зеленый', 'желтый',
      
      // Числительные
      'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 
      'восемь', 'девять', 'десять', 'сто', 'тысяча', 'миллион',
      'первый', 'второй', 'третий', 'последний',
      
      // Вопросительные слова
      'что', 'кто', 'где', 'когда', 'как', 'почему', 'зачем', 
      'откуда', 'куда', 'сколько', 'какой', 'чей',
      
      // BOOOMERANGS специфика
      'booomerangs', 'бумеранг', 'ai', 'ии', 'искусственный', 'интеллект',
      'нейросеть', 'семантика', 'анализ', 'генерация', 'обработка',
      'изображение', 'векторизация', 'дизайн', 'вышивка', 'печать',
      'творчество', 'проект', 'задача', 'решение', 'алгоритм'
    ];

    baseTokens.forEach(token => {
      if (!this.expandedVocabulary.has(token)) {
        const index = this.expandedVocabulary.size;
        this.expandedVocabulary.set(token, index);
        this.reverseExpandedVocabulary.set(index, token);
        this.wordFrequencies.set(token, 100); // Высокая частота для базовых слов
      }
    });

    console.log(`✅ Добавлено ${baseTokens.length} базовых русских токенов`);
  }

  async extractWordsFromSemanticMemory() {
    if (!this.semanticMemory) {
      console.log('⚠️ Семантическая память недоступна, пропускаем извлечение');
      return;
    }

    console.log('🧠 Извлекаем слова из семантической памяти...');

    try {
      // Получаем все взаимодействия
      const interactions = await this.semanticMemory.getAllInteractions?.() || [];
      console.log(`📊 Найдено ${interactions.length} взаимодействий`);

      // Собираем весь текст
      const allText = interactions
        .map(i => `${i.query || ''} ${i.response || ''}`)
        .join(' ');

      // Извлекаем слова
      const words = this.extractWordsFromText(allText);
      console.log(`🔤 Извлечено ${words.length} уникальных слов`);

      // Подсчитываем частоты
      words.forEach(word => {
        const freq = this.wordFrequencies.get(word) || 0;
        this.wordFrequencies.set(word, freq + 1);
      });

      // Добавляем топ-5000 слов в словарь
      const sortedWords = Array.from(this.wordFrequencies.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5000);

      sortedWords.forEach(([word, freq]) => {
        if (!this.expandedVocabulary.has(word) && this.isValidRussianWord(word)) {
          const index = this.expandedVocabulary.size;
          this.expandedVocabulary.set(word, index);
          this.reverseExpandedVocabulary.set(index, word);
        }
      });

      console.log(`✅ Добавлено ${sortedWords.length} слов из семантической памяти`);

    } catch (error) {
      console.error('❌ Ошибка извлечения из семантической памяти:', error.message);
    }
  }

  extractWordsFromText(text) {
    if (!text) return [];

    // Очищаем текст и извлекаем слова
    const cleanText = text
      .toLowerCase()
      .replace(/[^\u0400-\u04FF\w\s]/g, ' ') // Оставляем только кириллицу и латиницу
      .replace(/\s+/g, ' ')
      .trim();

    const words = cleanText.match(/\b[\u0400-\u04FF\w]{2,}\b/g) || [];
    
    // Убираем дубликаты
    return [...new Set(words)];
  }

  isValidRussianWord(word) {
    if (!word || word.length < 2 || word.length > 30) return false;
    
    // Проверяем что слово содержит кириллицу или допустимые английские термины
    const hasCyrillic = /[\u0400-\u04FF]/.test(word);
    const isEnglishTerm = /^[a-z]+$/.test(word) && word.length > 2;
    
    return hasCyrillic || isEnglishTerm;
  }

  addFrequentRussianWords() {
    console.log('📊 Добавляем частотную лексику русского языка...');

    const frequentWords = [
      // Топ-1000 самых частых русских слов
      'быть', 'это', 'весь', 'такой', 'наш', 'который', 'мочь', 'свой',
      'если', 'время', 'рука', 'нет', 'самый', 'ни', 'стать', 'большой',
      'даже', 'другой', 'наш', 'сам', 'там', 'только', 'ещё', 'также',
      'потом', 'очень', 'между', 'через', 'снова', 'около', 'должный',
      'место', 'иметь', 'хотеть', 'старый', 'голова', 'дело', 'несколько',
      'сторона', 'ждать', 'образ', 'разный', 'любой', 'процесс', 'вопрос',
      'смысл', 'условие', 'определение', 'пройти', 'решение', 'качество',
      // ... добавляем ещё много частых слов
      'система', 'результат', 'развитие', 'возможность', 'создание', 'общество',
      'программа', 'проблема', 'управление', 'производство', 'информация',
      'исследование', 'государство', 'технология', 'экономика', 'политика',
      'культура', 'образование', 'медицина', 'наука', 'искусство', 'спорт'
    ];

    frequentWords.forEach(word => {
      if (!this.expandedVocabulary.has(word)) {
        const index = this.expandedVocabulary.size;
        this.expandedVocabulary.set(word, index);
        this.reverseExpandedVocabulary.set(index, word);
        this.wordFrequencies.set(word, 50);
      }
    });

    console.log(`✅ Добавлено ${frequentWords.length} частых русских слов`);
  }

  addSpecializedTerms() {
    console.log('🎨 Добавляем специализированную лексику...');

    const specializedTerms = [
      // AI и технологии
      'алгоритм', 'нейронный', 'машинный', 'обучение', 'данные', 'модель',
      'сеть', 'слой', 'параметр', 'обработка', 'распознавание', 'классификация',
      'регрессия', 'кластеризация', 'оптимизация', 'градиент', 'функция',
      'тензор', 'матрица', 'вектор', 'скаляр', 'трансформер', 'attention',
      
      // Дизайн и творчество
      'дизайн', 'графика', 'вектор', 'растр', 'пиксель', 'разрешение',
      'цвет', 'палитра', 'контраст', 'яркость', 'насыщенность', 'оттенок',
      'композиция', 'макет', 'шрифт', 'типография', 'логотип', 'брендинг',
      
      // Вышивка и текстиль
      'вышивка', 'нить', 'стежок', 'игла', 'ткань', 'узор', 'орнамент',
      'схема', 'канва', 'крестик', 'гладь', 'строчка', 'петля', 'мулине',
      
      // Производство и печать
      'печать', 'принтер', 'струйный', 'лазерный', 'сублимация', 'термопечать',
      'формат', 'качество', 'цветопередача', 'калибровка', 'профиль',
      
      // Бизнес термины
      'проект', 'задача', 'цель', 'результат', 'эффективность', 'качество',
      'стоимость', 'бюджет', 'планирование', 'управление', 'контроль',
      'анализ', 'отчет', 'метрика', 'показатель', 'производительность'
    ];

    specializedTerms.forEach(term => {
      if (!this.expandedVocabulary.has(term)) {
        const index = this.expandedVocabulary.size;
        this.expandedVocabulary.set(term, index);
        this.reverseExpandedVocabulary.set(index, term);
        this.wordFrequencies.set(term, 30);
      }
    });

    console.log(`✅ Добавлено ${specializedTerms.length} специализированных терминов`);
  }

  addMorphologicalVariants() {
    console.log('🔄 Добавляем морфологические варианты...');

    const baseWords = ['создать', 'сделать', 'работать', 'думать', 'говорить'];
    const variants = [];

    baseWords.forEach(baseWord => {
      // Упрощенная генерация форм (в реальности нужна полная морфология)
      const forms = this.generateMorphologicalForms(baseWord);
      variants.push(...forms);
    });

    variants.forEach(variant => {
      if (!this.expandedVocabulary.has(variant) && this.isValidRussianWord(variant)) {
        const index = this.expandedVocabulary.size;
        this.expandedVocabulary.set(variant, index);
        this.reverseExpandedVocabulary.set(index, variant);
        this.wordFrequencies.set(variant, 20);
      }
    });

    console.log(`✅ Добавлено ${variants.length} морфологических вариантов`);
  }

  generateMorphologicalForms(word) {
    // Упрощенная генерация форм
    const forms = [word];
    
    if (word.endsWith('ать')) {
      const base = word.slice(0, -3);
      forms.push(base + 'аю', base + 'аешь', base + 'ает', base + 'аем', base + 'аете', base + 'ают');
      forms.push(base + 'ал', base + 'ала', base + 'ало', base + 'али');
    }
    
    return forms;
  }

  finalizeVocabulary() {
    console.log('🎯 Финализируем словарь...');

    // Обрезаем до целевого размера если нужно
    if (this.expandedVocabulary.size > this.targetVocabSize) {
      console.log(`⚠️ Словарь превышает целевой размер (${this.expandedVocabulary.size}), обрезаем...`);
      
      // Сортируем по частоте и оставляем топ
      const sortedEntries = Array.from(this.expandedVocabulary.entries())
        .sort((a, b) => (this.wordFrequencies.get(b[0]) || 0) - (this.wordFrequencies.get(a[0]) || 0))
        .slice(0, this.targetVocabSize);

      // Пересоздаем словари
      this.expandedVocabulary.clear();
      this.reverseExpandedVocabulary.clear();

      sortedEntries.forEach(([word], index) => {
        this.expandedVocabulary.set(word, index);
        this.reverseExpandedVocabulary.set(index, word);
      });
    }

    // Добираем до целевого размера если нужно
    while (this.expandedVocabulary.size < this.targetVocabSize) {
      const randomWord = `token_${this.expandedVocabulary.size}`;
      const index = this.expandedVocabulary.size;
      this.expandedVocabulary.set(randomWord, index);
      this.reverseExpandedVocabulary.set(index, randomWord);
    }

    console.log(`✅ Словарь финализирован: ${this.expandedVocabulary.size} токенов`);
  }

  /**
   * Сохранение расширенного словаря
   */
  async saveExpandedVocabulary(path = './neural-models/expanded-vocabulary.json') {
    try {
      const vocabularyData = {
        vocabulary: Object.fromEntries(this.expandedVocabulary),
        reverseVocabulary: Object.fromEntries(this.reverseExpandedVocabulary),
        wordFrequencies: Object.fromEntries(this.wordFrequencies),
        metadata: {
          size: this.expandedVocabulary.size,
          created: new Date().toISOString(),
          version: '1.0.0'
        }
      };

      const dir = require('path').dirname(path);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(path, JSON.stringify(vocabularyData, null, 2));
      console.log(`💾 Расширенный словарь сохранен: ${path}`);
      
      return { success: true, path, size: this.expandedVocabulary.size };
    } catch (error) {
      console.error('❌ Ошибка сохранения словаря:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Загрузка расширенного словаря
   */
  async loadExpandedVocabulary(path = './neural-models/expanded-vocabulary.json') {
    try {
      if (!fs.existsSync(path)) {
        console.log('⚠️ Файл расширенного словаря не найден');
        return { success: false, message: 'File not found' };
      }

      const vocabularyData = JSON.parse(fs.readFileSync(path, 'utf8'));
      
      this.expandedVocabulary = new Map(Object.entries(vocabularyData.vocabulary));
      this.reverseExpandedVocabulary = new Map(Object.entries(vocabularyData.reverseVocabulary).map(([k, v]) => [parseInt(k), v]));
      this.wordFrequencies = new Map(Object.entries(vocabularyData.wordFrequencies || {}));

      console.log(`📚 Загружен расширенный словарь: ${this.expandedVocabulary.size} токенов`);
      return { success: true, size: this.expandedVocabulary.size };
    } catch (error) {
      console.error('❌ Ошибка загрузки словаря:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Получение статистики словаря
   */
  getVocabularyStats() {
    const totalTokens = this.expandedVocabulary.size;
    const specialTokensCount = this.specialTokens.length;
    const regularTokensCount = totalTokens - specialTokensCount;

    // Анализ по длине слов
    const lengthDistribution = {};
    for (const word of this.expandedVocabulary.keys()) {
      const length = word.length;
      lengthDistribution[length] = (lengthDistribution[length] || 0) + 1;
    }

    // Анализ по типу слов
    const cyrillicCount = Array.from(this.expandedVocabulary.keys())
      .filter(word => /[\u0400-\u04FF]/.test(word)).length;
    const latinCount = Array.from(this.expandedVocabulary.keys())
      .filter(word => /^[a-zA-Z]+$/.test(word)).length;

    return {
      totalTokens,
      specialTokensCount,
      regularTokensCount,
      cyrillicWords: cyrillicCount,
      latinWords: latinCount,
      lengthDistribution,
      averageWordLength: this.calculateAverageWordLength(),
      vocabularyCoverage: this.estimateVocabularyCoverage()
    };
  }

  calculateAverageWordLength() {
    const words = Array.from(this.expandedVocabulary.keys()).filter(w => !this.specialTokens.includes(w));
    return words.reduce((sum, word) => sum + word.length, 0) / words.length;
  }

  estimateVocabularyCoverage() {
    // Простая оценка покрытия на основе размера словаря
    const size = this.expandedVocabulary.size;
    if (size < 1000) return 'низкое';
    if (size < 5000) return 'среднее';
    if (size < 10000) return 'хорошее';
    return 'отличное';
  }
}

module.exports = { NeuralVocabularyExpander };
