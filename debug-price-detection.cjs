/**
 * Отладка детекции цен на сайте booomerangs.ru
 */

async function testPriceDetection() {
  console.log('🔍 === ДИАГНОСТИКА ДЕТЕКЦИИ ЦЕН ===\n');
  
  try {
    // Загружаем HTML
    console.log('📥 Загружаю HTML с сайта...');
    const response = await fetch('https://booomerangs.ru');
    const html = await response.text();
    
    console.log(`📊 Размер HTML: ${html.length} символов\n`);
    
    // Тестируем все паттерны
    const pricePatterns = [
      { name: 'Простой рубль', pattern: /(\d{1,5})\s*р(?:\.|\b)/gi },
      { name: 'Рубли/рублей', pattern: /(\d{1,5})\s*руб(?:лей|ля|ль)?\b/gi },
      { name: 'Символ ₽', pattern: /(\d{1,5})\s*₽/gi },
      { name: 'С разделителями', pattern: /(\d{1,3}(?:\s\d{3})+)\s*р(?:\.|\b)/gi },
      { name: 'С контекстом', pattern: /цена[:\s]*(\d{1,5})\s*р/gi }
    ];
    
    console.log('🧪 Тестирую паттерны поиска цен:\n');
    
    let totalFound = 0;
    pricePatterns.forEach(({name, pattern}) => {
      const matches = html.match(pattern) || [];
      console.log(`${name}: ${matches.length} совпадений`);
      if (matches.length > 0) {
        console.log(`  Примеры: ${matches.slice(0, 3).join(', ')}`);
      }
      totalFound += matches.length;
    });
    
    console.log(`\n📈 Всего найдено: ${totalFound} цен\n`);
    
    // Проверим наличие конкретных цен в HTML
    console.log('🔍 Поиск конкретных цен из веб-версии:');
    const expectedPrices = ['5990', '3090', '6290'];
    
    expectedPrices.forEach(price => {
      const found = html.includes(price);
      console.log(`  ${price}: ${found ? '✅ Найдена' : '❌ Не найдена'}`);
      
      if (found) {
        // Найдем контекст вокруг цены
        const index = html.indexOf(price);
        const context = html.substring(index - 50, index + 50);
        console.log(`    Контекст: ...${context}...`);
      }
    });
    
    // Проверим, есть ли JavaScript загрузка цен
    console.log('\n🚀 Анализ JavaScript загрузки:');
    const hasJS = html.includes('<script');
    const hasTildaJS = html.includes('tilda');
    const hasAjax = html.includes('ajax') || html.includes('fetch');
    
    console.log(`  JavaScript присутствует: ${hasJS ? '✅' : '❌'}`);
    console.log(`  Tilda CMS: ${hasTildaJS ? '✅' : '❌'}`);
    console.log(`  AJAX/Fetch запросы: ${hasAjax ? '✅' : '❌'}`);
    
    if (hasTildaJS) {
      console.log('\n💡 ВЫВОД: Цены загружаются динамически через Tilda CMS');
      console.log('   Требуется либо парсинг JavaScript, либо поиск API endpoints');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

testPriceDetection();