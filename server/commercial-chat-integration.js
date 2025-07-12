/**
 * Интеграция коммерческого чата для обработки бизнес-запросов
 */
const commercialProposalGenerator = require('./commercial-proposal-generator');
const offerBannerGenerator = require('./offer-banner-generator');

/**
 * Обрабатывает сообщение чата и определяет, является ли оно коммерческим запросом
 */
async function handleChatMessage(message, context = {}) {
  try {
    // Анализ сообщения на коммерческие намерения
    const commercialIntent = analyzeCommercialIntent(message);

    if (!commercialIntent.isCommercial) {
      return null; // Не коммерческий запрос
    }

    console.log('💼 Обнаружен коммерческий запрос:', commercialIntent.type);

    switch (commercialIntent.type) {
      case 'commercial_proposal':
        return await generateCommercialProposal(message, context);

      case 'offer_banner':
        return await generateOfferBanner(message, context);

      case 'client_outreach':
        return await generateClientOutreach(message, context);

      default:
        return await generateGenericCommercialResponse(message, context);
    }
  } catch (error) {
    console.error('❌ Ошибка в коммерческой интеграции:', error);
    return null;
  }
}

/**
 * Анализирует намерения сообщения на коммерческий контекст
 */
function analyzeCommercialIntent(message) {
  const lowerMessage = message.toLowerCase();

  // Ключевые слова для коммерческих предложений
  const proposalKeywords = [
    'коммерческое предложение', 'кп', 'предложение', 'прайс', 'смета',
    'расчет стоимости', 'ценовое предложение', 'оферта'
  ];

  // Ключевые слова для баннеров и рекламы
  const bannerKeywords = [
    'баннер', 'реклама', 'промо', 'акция', 'скидка', 'распродажа',
    'рекламный баннер', 'промо-материал'
  ];

  // Ключевые слова для работы с клиентами
  const clientKeywords = [
    'клиент', 'заказчик', 'рассылка', 'email', 'презентация',
    'переговоры', 'встреча с клиентом'
  ];

  if (proposalKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return { isCommercial: true, type: 'commercial_proposal' };
  }

  if (bannerKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return { isCommercial: true, type: 'offer_banner' };
  }

  if (clientKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return { isCommercial: true, type: 'client_outreach' };
  }

  return { isCommercial: false, type: null };
}

/**
 * Генерирует коммерческое предложение
 */
async function generateCommercialProposal(message, context) {
  try {
    const proposal = await commercialProposalGenerator.generateProposal({
      request: message,
      userContext: context,
      includeImages: true,
      includeNews: true
    });

    return {
      type: 'commercial_proposal',
      message: proposal.content,
      data: proposal.data,
      suggestions: [
        'Отправить клиенту на email',
        'Создать презентацию',
        'Добавить в CRM',
        'Создать договор'
      ]
    };
  } catch (error) {
    console.error('❌ Ошибка генерации КП:', error);
    return null;
  }
}

/**
 * Генерирует рекламный баннер или офер
 */
async function generateOfferBanner(message, context) {
  try {
    const banner = await offerBannerGenerator.generateBanner({
      request: message,
      userContext: context,
      includeImages: true
    });

    return {
      type: 'offer_banner',
      message: banner.content,
      data: banner.data,
      suggestions: [
        'Использовать в соцсетях',
        'Добавить в рассылку',
        'Разместить на сайте',
        'Создать вариации'
      ]
    };
  } catch (error) {
    console.error('❌ Ошибка генерации баннера:', error);
    return null;
  }
}

/**
 * Генерирует материалы для работы с клиентами
 */
async function generateClientOutreach(message, context) {
  return {
    type: 'client_outreach',
    message: `💼 **Помощь в работе с клиентами**

Готов помочь с:
- Подготовкой презентаций
- Созданием email-рассылок
- Разработкой стратегии переговоров
- Анализом потребностей клиента

Опишите подробнее, что именно нужно подготовить для клиента.`,
    data: { type: 'client_support' },
    suggestions: [
      'Создать презентацию',
      'Подготовить email',
      'Составить план встречи',
      'Анализ конкурентов'
    ]
  };
}

/**
 * Универсальный коммерческий ответ
 */
async function generateGenericCommercialResponse(message, context) {
  return {
    type: 'commercial_general',
    message: `💼 **Коммерческая поддержка**

Определил коммерческий запрос. Могу помочь с:

🎯 **Коммерческие предложения**
- Создание персонализированных КП
- Расчет стоимости услуг
- Формирование ценовых предложений

📢 **Маркетинговые материалы**
- Рекламные баннеры и оферы
- Промо-материалы для акций
- Контент для социальных сетей

👥 **Работа с клиентами**
- Email-рассылки
- Презентации для встреч
- Материалы для переговоров

Уточните, что именно нужно подготовить?`,
    data: { type: 'commercial_menu' },
    suggestions: [
      'Создать КП',
      'Сделать баннер',
      'Подготовить рассылку',
      'Составить презентацию'
    ]
  };
}

module.exports = {
  handleChatMessage,
  analyzeCommercialIntent,
  generateCommercialProposal,
  generateOfferBanner,
  generateClientOutreach
};