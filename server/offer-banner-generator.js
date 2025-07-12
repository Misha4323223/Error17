
/**
 * Генератор оферов и рекламных баннеров для коммерческих предложений
 */

class OfferBannerGenerator {
  constructor() {
    this.initializeOfferTemplates();
    this.initializeBannerStyles();
  }

  /**
   * Инициализация шаблонов оферов
   */
  initializeOfferTemplates() {
    this.offerTemplates = {
      discount: {
        name: 'Скидочный офер',
        elements: ['headline', 'discount', 'conditions', 'deadline', 'cta'],
        style: 'urgent'
      },
      seasonal: {
        name: 'Сезонное предложение',
        elements: ['headline', 'season_theme', 'services', 'bonus', 'cta'],
        style: 'themed'
      },
      new_client: {
        name: 'Для новых клиентов',
        elements: ['welcome', 'first_order_bonus', 'services', 'portfolio', 'cta'],
        style: 'welcoming'
      },
      volume: {
        name: 'Объемные заказы',
        elements: ['headline', 'volume_discounts', 'production_benefits', 'examples', 'cta'],
        style: 'business'
      },
      express: {
        name: 'Срочные заказы',
        elements: ['urgency', 'fast_delivery', 'express_pricing', 'guarantees', 'cta'],
        style: 'dynamic'
      }
    };

    this.bannerElements = {
      colors: {
        urgent: ['#FF4444', '#FF6B35', '#FFD23F'],
        business: ['#2E86AB', '#A23B72', '#F18F01'],
        welcoming: ['#06FFA5', '#3D5A80', '#EE6C4D'],
        themed: ['#264653', '#2A9D8F', '#E9C46A'],
        dynamic: ['#E76F51', '#F4A261', '#E9C46A']
      },
      fonts: {
        headline: 'bold, impact',
        body: 'clean, readable',
        accent: 'modern, stylish'
      }
    };
  }

  /**
   * Инициализация стилей баннеров
   */
  initializeBannerStyles() {
    this.bannerSizes = {
      email_header: { width: 600, height: 200 },
      social_post: { width: 1080, height: 1080 },
      story: { width: 1080, height: 1920 },
      web_banner: { width: 728, height: 300 },
      presentation: { width: 1920, height: 1080 }
    };
  }

  /**
   * Генерация офера
   */
  async generateOffer(request) {
    const {
      offerType = 'discount',
      clientType = 'standard',
      services = [],
      discountPercentage = 15,
      validUntil,
      customMessage = '',
      targetAudience = 'general'
    } = request;

    console.log('💫 Генерируем офер:', offerType);

    const template = this.offerTemplates[offerType] || this.offerTemplates.discount;
    const content = await this.generateOfferContent(template, {
      clientType,
      services,
      discountPercentage,
      validUntil,
      customMessage,
      targetAudience
    });

    const banner = await this.generateOfferBanner(template, content);

    return {
      success: true,
      offer: {
        type: offerType,
        template: template.name,
        content,
        banner,
        validUntil,
        targetAudience
      },
      suggestions: this.generateOfferSuggestions(offerType, clientType)
    };
  }

  /**
   * Генерация содержания офера
   */
  async generateOfferContent(template, params) {
    const content = {};

    template.elements.forEach(element => {
      content[element] = this.generateOfferElement(element, template, params);
    });

    return content;
  }

  /**
   * Генерация элемента офера
   */
  generateOfferElement(element, template, params) {
    const { discountPercentage, validUntil, services, targetAudience, customMessage } = params;

    switch (element) {
      case 'headline':
        return this.generateHeadline(template.style, discountPercentage);
      
      case 'discount':
        return this.generateDiscountBlock(discountPercentage);
      
      case 'conditions':
        return this.generateConditions(services);
      
      case 'deadline':
        return this.generateDeadline(validUntil);
      
      case 'cta':
        return this.generateCTA(template.style);
      
      case 'welcome':
        return this.generateWelcomeMessage(targetAudience);
      
      case 'services':
        return this.generateServicesHighlight(services);
      
      case 'volume_discounts':
        return this.generateVolumeDiscounts();
      
      case 'urgency':
        return this.generateUrgencyMessage();
      
      default:
        return customMessage || 'Специальное предложение от BOOOMERANGS';
    }
  }

  /**
   * Генерация заголовка
   */
  generateHeadline(style, discount) {
    const headlines = {
      urgent: [
        `🔥 СКИДКА ${discount}% - ТОЛЬКО СЕГОДНЯ!`,
        `⚡ МЕГА РАСПРОДАЖА - ${discount}% НА ВСЁ!`,
        `🎯 ПОСЛЕДНИЙ ДЕНЬ СКИДКИ ${discount}%!`
      ],
      business: [
        `💼 Корпоративная скидка ${discount}%`,
        `📈 Предложение для бизнеса - ${discount}%`,
        `🤝 Партнерская скидка ${discount}%`
      ],
      welcoming: [
        `👋 Добро пожаловать! Скидка ${discount}%`,
        `🎉 Для новых клиентов - ${discount}%`,
        `✨ Стартовая скидка ${discount}%`
      ],
      themed: [
        `🍂 Осенняя акция - ${discount}%`,
        `❄️ Зимнее предложение - ${discount}%`,
        `🌸 Весенние скидки - ${discount}%`
      ],
      dynamic: [
        `⚡ Экспресс-заказ со скидкой ${discount}%`,
        `🚀 Быстро и выгодно - ${discount}%`,
        `⏰ Срочно нужно? Скидка ${discount}%!`
      ]
    };

    const options = headlines[style] || headlines.urgent;
    return options[Math.floor(Math.random() * options.length)];
  }

  /**
   * Генерация блока скидки
   */
  generateDiscountBlock(percentage) {
    return `
## 💰 **ЭКОНОМЬТЕ ${percentage}% НА ВСЕХ УСЛУГАХ!**

✅ Дизайн логотипов  
✅ Принты для одежды  
✅ Машинная вышивка  
✅ Векторизация  
✅ Печать и производство  

**Скидка действует на ВСЕ наши услуги!**
`;
  }

  /**
   * Генерация условий
   */
  generateConditions(services) {
    return `
### 📋 **Условия акции:**

• Скидка действует при заказе любых наших услуг
• Минимальная сумма заказа: 2000 ₽  
• Скидка суммируется с объемными скидками
• Бесплатные правки включены
• Оплата по факту выполнения работ

*Количество заказов по акции ограничено!*
`;
  }

  /**
   * Генерация дедлайна
   */
  generateDeadline(validUntil) {
    const deadline = validUntil || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const deadlineStr = deadline.toLocaleDateString('ru-RU');
    
    return `
## ⏰ **АКЦИЯ ДЕЙСТВУЕТ ДО ${deadlineStr.toUpperCase()}!**

⚠️ **Не упустите выгодную возможность!**  
После ${deadlineStr} цены будут обычными.

**Осталось дней:** ${Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24))}
`;
  }

  /**
   * Генерация призыва к действию
   */
  generateCTA(style) {
    const ctas = {
      urgent: '🚀 **ЗАКАЗАТЬ СЕЙЧАС СО СКИДКОЙ!**',
      business: '📞 **ОБСУДИТЬ ПРОЕКТ С МЕНЕДЖЕРОМ**',
      welcoming: '✨ **ПОЛУЧИТЬ ПЕРСОНАЛЬНОЕ ПРЕДЛОЖЕНИЕ**',
      themed: '🎯 **ВОСПОЛЬЗОВАТЬСЯ АКЦИЕЙ**',
      dynamic: '⚡ **ОФОРМИТЬ СРОЧНЫЙ ЗАКАЗ**'
    };

    const cta = ctas[style] || ctas.urgent;
    
    return `
${cta}

📱 **Telegram:** @booomerangs  
📧 **Email:** info@booomerangs.ru  
🌐 **Сайт:** booomerangs.ru

**Ответьте на это сообщение или свяжитесь любым удобным способом!**
`;
  }

  /**
   * Генерация приветственного сообщения
   */
  generateWelcomeMessage(audience) {
    return `
## 👋 **Добро пожаловать в BOOOMERANGS!**

Мы рады видеть вас среди наших клиентов! 

**Специально для вас первый заказ со скидкой!**

🎨 **Что мы делаем лучше всего:**
• Создаем запоминающиеся логотипы
• Разрабатываем стильные принты  
• Качественно печатаем и вышиваем
• Быстро векторизуем любые изображения

**Доверьте свой проект профессионалам!**
`;
  }

  /**
   * Генерация объемных скидок
   */
  generateVolumeDiscounts() {
    return `
## 📊 **ОБЪЕМНЫЕ СКИДКИ:**

| Количество | Скидка | Экономия |
|------------|--------|----------|
| 10-49 шт.  | 5%     | до 2 500 ₽ |
| 50-99 шт.  | 10%    | до 7 500 ₽ |
| 100-199 шт.| 15%    | до 15 000 ₽ |
| 200+ шт.   | 20%    | до 50 000 ₽ |

**Чем больше заказ - тем больше экономия!**

💡 **Бонус:** Бесплатная доставка при заказе от 100 шт.
`;
  }

  /**
   * Генерация сообщения срочности
   */
  generateUrgencyMessage() {
    return `
## ⚡ **СРОЧНЫЙ ЗАКАЗ? МЫ ПОМОЖЕМ!**

🚀 **Экспресс-услуги:**
• Логотип за 4 часа
• Принт за 6 часов  
• Векторизация за 2 часа
• Печать за 24 часа

**Работаем 24/7 для срочных проектов!**

⏰ Доплата за срочность всего 30% от стоимости
`;
  }

  /**
   * Генерация баннера для офера
   */
  async generateOfferBanner(template, content) {
    const bannerData = {
      type: 'offer_banner',
      style: template.style,
      elements: {
        headline: content.headline || 'Специальное предложение',
        main_text: content.discount || content.services || 'BOOOMERANGS',
        cta: 'ЗАКАЗАТЬ',
        colors: this.bannerElements.colors[template.style] || this.bannerElements.colors.urgent
      },
      size: this.bannerSizes.email_header
    };

    // Генерируем HTML баннер
    const htmlBanner = this.generateHTMLBanner(bannerData);
    
    // Создаем промпт для AI генерации визуального баннера
    const imagePrompt = this.generateBannerPrompt(bannerData);

    return {
      html: htmlBanner,
      imagePrompt,
      specifications: bannerData
    };
  }

  /**
   * Генерация HTML баннера
   */
  generateHTMLBanner(bannerData) {
    const { elements, colors, size } = bannerData;
    
    return `
<div style="
  width: ${size.width}px;
  height: ${size.height}px;
  background: linear-gradient(135deg, ${colors[0]}, ${colors[1]});
  color: white;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  position: relative;
  overflow: hidden;
">
  <div style="
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: ${colors[2]};
    opacity: 0.1;
    border-radius: 50%;
  "></div>
  
  <h1 style="
    font-size: 24px;
    font-weight: bold;
    margin: 0 0 10px 0;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    z-index: 2;
  ">${elements.headline}</h1>
  
  <p style="
    font-size: 16px;
    margin: 0 0 15px 0;
    z-index: 2;
  ">${elements.main_text}</p>
  
  <button style="
    background: ${colors[2]};
    color: white;
    border: none;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 25px;
    cursor: pointer;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    z-index: 2;
    transition: transform 0.3s;
  " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
    ${elements.cta}
  </button>
  
  <div style="
    position: absolute;
    bottom: 10px;
    right: 15px;
    font-size: 12px;
    opacity: 0.8;
    z-index: 2;
  ">BOOOMERANGS</div>
</div>
`;
  }

  /**
   * Генерация промпта для AI баннера
   */
  generateBannerPrompt(bannerData) {
    const { elements, style, colors } = bannerData;
    
    return `Create a professional marketing banner with the following specifications:
- Headline: "${elements.headline}"
- Main text: "${elements.main_text}"
- Call to action: "${elements.cta}"
- Style: ${style} design aesthetic
- Colors: ${colors.join(', ')}
- Include BOOOMERANGS logo
- Modern, eye-catching design for commercial proposals
- Professional graphic design quality
- Marketing banner style with clear typography`;
  }

  /**
   * Генерация предложений по оферу
   */
  generateOfferSuggestions(offerType, clientType) {
    const suggestions = [];

    switch (offerType) {
      case 'discount':
        suggestions.push('Добавьте ограничение по времени для создания срочности');
        suggestions.push('Укажите конкретные услуги со скидкой');
        break;
      
      case 'volume':
        suggestions.push('Предложите бесплатную доставку для больших заказов');
        suggestions.push('Добавьте примеры успешных объемных проектов');
        break;
      
      case 'new_client':
        suggestions.push('Предложите бесплатную консультацию');
        suggestions.push('Покажите портфолио лучших работ');
        break;
    }

    suggestions.push('Добавьте отзывы клиентов для повышения доверия');
    suggestions.push('Используйте социальные доказательства (количество клиентов)');

    return suggestions;
  }

  /**
   * Генерация email рассылки
   */
  async generateEmailCampaign(request) {
    const {
      campaignType = 'promotional',
      targetSegment = 'all',
      offers = [],
      newsItems = [],
      personalizations = {}
    } = request;

    const campaign = {
      subject: this.generateEmailSubject(campaignType, offers),
      preheader: this.generatePreheader(campaignType),
      header: this.generateEmailHeader(),
      content: await this.generateEmailContent(campaignType, offers, newsItems),
      footer: this.generateEmailFooter(),
      cta: this.generateEmailCTA(campaignType),
      personalization: personalizations
    };

    return {
      success: true,
      campaign,
      html: this.assembleEmailHTML(campaign),
      recommendations: this.generateEmailRecommendations(campaignType)
    };
  }

  /**
   * Генерация темы письма
   */
  generateEmailSubject(campaignType, offers) {
    const subjects = {
      promotional: [
        '🔥 Скидка 20% на все услуги BOOOMERANGS!',
        '🎨 Новинки недели + специальная цена',
        '⚡ Только сегодня: дизайн логотипа за полцены!'
      ],
      newsletter: [
        '📬 BOOOMERANGS: новые работы и полезные советы',
        '🆕 Дайджест недели от BOOOMERANGS',
        '💡 Тренды дизайна + наши новые проекты'
      ],
      seasonal: [
        '🎄 Новогодние скидки до 30%!',
        '🌸 Весенние предложения от BOOOMERANGS',
        '☀️ Летние акции: дизайн + печать со скидкой'
      ]
    };

    const options = subjects[campaignType] || subjects.promotional;
    return options[Math.floor(Math.random() * options.length)];
  }

  /**
   * Сборка HTML email
   */
  assembleEmailHTML(campaign) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${campaign.subject}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .email-container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .cta-button { background: #ff6b35; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            ${campaign.header}
        </div>
        <div class="content">
            ${campaign.content}
            <div style="text-align: center; margin: 30px 0;">
                <a href="#" class="cta-button">${campaign.cta}</a>
            </div>
        </div>
        <div class="footer">
            ${campaign.footer}
        </div>
    </div>
</body>
</html>
`;
  }

  generateEmailHeader() {
    return `
      <h1 style="margin: 0; font-size: 28px;">🎨 BOOOMERANGS</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Превращаем идеи в визуальные решения</p>
    `;
  }

  generateEmailContent(campaignType, offers, newsItems) {
    let content = '<h2>Специальное предложение для вас!</h2>';
    
    if (offers.length > 0) {
      content += '<div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">';
      content += offers[0].content.headline || 'Выгодное предложение';
      content += '</div>';
    }

    if (newsItems.length > 0) {
      content += '<h3>🆕 Наши новые работы:</h3>';
      newsItems.slice(0, 3).forEach(item => {
        content += `<p><strong>${item.title}</strong><br>${item.description}</p>`;
      });
    }

    return content;
  }

  generateEmailFooter() {
    return `
      <p><strong>BOOOMERANGS</strong></p>
      <p>📧 info@booomerangs.ru | 📱 @booomerangs | 🌐 booomerangs.ru</p>
      <p>Отписаться от рассылки можно <a href="#">здесь</a></p>
    `;
  }

  generateEmailCTA(campaignType) {
    const ctas = {
      promotional: 'ЗАКАЗАТЬ СО СКИДКОЙ',
      newsletter: 'ПОСМОТРЕТЬ ПОРТФОЛИО',
      seasonal: 'ПОЛУЧИТЬ ПРЕДЛОЖЕНИЕ'
    };

    return ctas[campaignType] || 'УЗНАТЬ БОЛЬШЕ';
  }

  generatePreheader(campaignType) {
    return 'Эксклюзивное предложение от команды BOOOMERANGS специально для вас!';
  }

  generateEmailRecommendations(campaignType) {
    return [
      'Тестируйте разные темы писем для повышения открываемости',
      'Добавьте персонализацию (имя клиента) в тему и содержание',
      'Используйте мобильно-адаптивный дизайн',
      'Отслеживайте метрики: открытия, клики, конверсии'
    ];
  }
}

module.exports = new OfferBannerGenerator();
