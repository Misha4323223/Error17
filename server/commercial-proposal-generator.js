
/**
 * Генератор коммерческих предложений с анализом изображений и персонализацией
 */

const fs = require('fs');
const path = require('path');

class CommercialProposalGenerator {
  constructor() {
    this.initializeTemplates();
    this.initializePricing();
  }

  /**
   * Инициализация шаблонов КП
   */
  initializeTemplates() {
    this.templates = {
      standard: {
        name: 'Стандартное КП',
        structure: ['header', 'intro', 'services', 'portfolio', 'pricing', 'terms', 'contacts'],
        tone: 'профессиональный'
      },
      premium: {
        name: 'Премиум КП',
        structure: ['header', 'personalized_intro', 'exclusive_services', 'portfolio', 'detailed_pricing', 'guarantees', 'vip_terms', 'contacts'],
        tone: 'элитный'
      },
      startup: {
        name: 'КП для стартапов',
        structure: ['header', 'friendly_intro', 'startup_services', 'young_portfolio', 'flexible_pricing', 'growth_terms', 'contacts'],
        tone: 'дружелюбный'
      },
      corporate: {
        name: 'Корпоративное КП',
        structure: ['official_header', 'business_intro', 'corporate_services', 'enterprise_portfolio', 'volume_pricing', 'corporate_terms', 'official_contacts'],
        tone: 'деловой'
      }
    };

    this.contentBlocks = {
      header: {
        logo: '🎨 **BOOOMERANGS** - Профессиональный дизайн и печать',
        tagline: 'Превращаем идеи в визуальные решения'
      },
      
      services: {
        design: {
          title: '🎨 **Дизайн-услуги**',
          items: [
            '• Логотипы и фирменный стиль',
            '• Принты для одежды',
            '• Дизайн вышивки',
            '• Векторизация изображений',
            '• Персонажи и иллюстрации'
          ]
        },
        print: {
          title: '👕 **Печать и производство**',
          items: [
            '• Шелкография',
            '• DTF печать',
            '• Машинная вышивка',
            '• Сублимационная печать',
            '• Термотрансфер'
          ]
        },
        additional: {
          title: '⚡ **Дополнительные услуги**',
          items: [
            '• Консультации по дизайну',
            '• Адаптация под разные форматы',
            '• Создание брендбука',
            '• Дизайн упаковки'
          ]
        }
      }
    };
  }

  /**
   * Инициализация ценообразования
   */
  initializePricing() {
    this.pricing = {
      logo: {
        base: 2500,
        premium: 5000,
        exclusive: 8000
      },
      print_design: {
        simple: 1500,
        detailed: 3000,
        complex: 4500
      },
      embroidery: {
        per_1000_stitches: 50,
        setup_fee: 500,
        min_order: 10
      },
      vectorization: {
        simple: 800,
        medium: 1500,
        complex: 2500
      },
      production: {
        tshirt_print: 350,
        hoodie_print: 650,
        embroidery_setup: 800,
        per_item_embroidery: 180
      }
    };

    this.discounts = {
      volume: {
        '10-49': 0.05,
        '50-99': 0.10,
        '100-199': 0.15,
        '200+': 0.20
      },
      loyalty: {
        returning: 0.05,
        vip: 0.10,
        partner: 0.15
      }
    };
  }

  /**
   * Главная функция генерации КП
   */
  async generateCommercialProposal(request) {
    const {
      clientName,
      clientCompany,
      clientType = 'standard',
      services = [],
      images = [],
      quantity = 1,
      deadline,
      additionalInfo = '',
      newsItems = []
    } = request;

    console.log('🎯 Генерируем коммерческое предложение для:', clientName);

    // Анализируем загруженные изображения
    const imageAnalysis = await this.analyzeClientImages(images);
    
    // Подбираем шаблон
    const template = this.selectTemplate(clientType, imageAnalysis);
    
    // Генерируем персонализированное содержание
    const content = await this.generatePersonalizedContent({
      client: { name: clientName, company: clientCompany, type: clientType },
      services,
      imageAnalysis,
      quantity,
      deadline,
      additionalInfo,
      newsItems,
      template
    });

    // Рассчитываем стоимость
    const pricing = this.calculatePricing(services, quantity, clientType, imageAnalysis);

    // Формируем итоговое КП
    const proposal = this.assembleProposal(template, content, pricing);

    return {
      success: true,
      proposal,
      pricing,
      template: template.name,
      recommendations: this.generateRecommendations(imageAnalysis, services)
    };
  }

  /**
   * Анализ загруженных клиентом изображений
   */
  async analyzeClientImages(images) {
    if (!images || images.length === 0) {
      return { hasImages: false, analysis: [] };
    }

    const analysis = [];
    
    for (const image of images.slice(0, 5)) { // Анализируем до 5 изображений
      try {
        // Используем существующий анализатор изображений
        const imageAnalyzer = require('./smart-vision-analyzer');
        const result = await imageAnalyzer.analyzeImageContent(image.buffer, image.filename);
        
        const imageData = {
          filename: image.filename,
          analysis: result,
          suitableServices: this.determineServicesFromImage(result),
          estimatedComplexity: this.estimateDesignComplexity(result),
          recommendedPricing: this.getRecommendedPricing(result)
        };
        
        analysis.push(imageData);
      } catch (error) {
        console.log('❌ Ошибка анализа изображения:', error.message);
        analysis.push({
          filename: image.filename,
          error: 'Не удалось проанализировать',
          suitableServices: ['vectorization', 'print_design']
        });
      }
    }

    return {
      hasImages: true,
      count: images.length,
      analysis,
      dominantStyle: this.determineDominantStyle(analysis),
      complexity: this.calculateAverageComplexity(analysis)
    };
  }

  /**
   * Определение подходящих услуг по изображению
   */
  determineServicesFromImage(analysis) {
    const services = [];
    const description = analysis.description?.toLowerCase() || '';

    if (description.includes('логотип') || description.includes('logo')) {
      services.push('logo_design', 'vectorization');
    }
    
    if (description.includes('персонаж') || description.includes('character')) {
      services.push('character_design', 'print_design');
    }
    
    if (description.includes('вышивка') || description.includes('embroidery')) {
      services.push('embroidery_design', 'embroidery_production');
    }
    
    if (description.includes('принт') || description.includes('печать')) {
      services.push('print_design', 'production');
    }

    // Если не определили конкретные услуги, предлагаем базовые
    if (services.length === 0) {
      services.push('vectorization', 'print_design');
    }

    return services;
  }

  /**
   * Оценка сложности дизайна
   */
  estimateDesignComplexity(analysis) {
    let complexity = 1; // Базовая сложность

    const description = analysis.description?.toLowerCase() || '';
    
    // Факторы, увеличивающие сложность
    if (description.includes('детал')) complexity += 0.5;
    if (description.includes('цвет')) complexity += 0.3;
    if (description.includes('градиент') || description.includes('тень')) complexity += 0.7;
    if (description.includes('текст')) complexity += 0.2;
    if (description.includes('элемент')) complexity += 0.4;

    return Math.min(complexity, 3); // Максимум 3
  }

  /**
   * Генерация персонализированного содержания
   */
  async generatePersonalizedContent(params) {
    const { client, services, imageAnalysis, quantity, deadline, newsItems, template } = params;

    const content = {
      header: this.generateHeader(client, template),
      introduction: this.generateIntroduction(client, imageAnalysis),
      services: this.generateServicesSection(services, imageAnalysis),
      portfolio: this.generatePortfolioSection(imageAnalysis, newsItems),
      advantages: this.generateAdvantagesSection(client.type),
      timeline: this.generateTimelineSection(services, deadline),
      next_steps: this.generateNextStepsSection()
    };

    return content;
  }

  /**
   * Генерация заголовка
   */
  generateHeader(client, template) {
    const date = new Date().toLocaleDateString('ru-RU');
    
    return `
# 📋 **КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ**

**Для:** ${client.company ? `${client.company} (${client.name})` : client.name}  
**От:** BOOOMERANGS - Профессиональный дизайн и печать  
**Дата:** ${date}  
**№:** КП-${Date.now().toString().slice(-6)}

---

## 🎨 **BOOOMERANGS**
### *Превращаем идеи в визуальные решения*

Мы специализируемся на создании уникального дизайна и качественной печати для бизнеса любого масштаба.
`;
  }

  /**
   * Генерация введения
   */
  generateIntroduction(client, imageAnalysis) {
    let intro = `## 👋 Здравствуйте, ${client.name}!\n\n`;
    
    if (imageAnalysis.hasImages) {
      intro += `Мы изучили предоставленные вами материалы (${imageAnalysis.count} изображений) и подготовили персонализированное предложение.\n\n`;
      
      if (imageAnalysis.dominantStyle) {
        intro += `На основе анализа ваших изображений, мы видим, что вам близок **${imageAnalysis.dominantStyle}** стиль. `;
      }
      
      intro += `Наше предложение учитывает специфику ваших задач и поможет достичь желаемого результата.\n\n`;
    } else {
      intro += `Мы подготовили для вас комплексное предложение наших услуг. Наша команда готова воплотить ваши идеи в жизнь.\n\n`;
    }

    intro += `**Почему выбирают нас:**
• ✅ Более 1000 успешных проектов
• ✅ Гарантия качества на все работы  
• ✅ Соблюдение сроков
• ✅ Персональный подход к каждому клиенту\n\n`;

    return intro;
  }

  /**
   * Генерация раздела услуг
   */
  generateServicesSection(requestedServices, imageAnalysis) {
    let section = `## 🎯 **РЕКОМЕНДУЕМЫЕ УСЛУГИ**\n\n`;

    // Если есть анализ изображений, используем его
    if (imageAnalysis.hasImages) {
      const recommendedServices = new Set();
      imageAnalysis.analysis.forEach(img => {
        img.suitableServices?.forEach(service => recommendedServices.add(service));
      });

      section += `На основе анализа ваших изображений мы рекомендуем:\n\n`;
      
      recommendedServices.forEach(service => {
        section += this.getServiceDescription(service) + '\n';
      });
    } else {
      // Стандартный набор услуг
      section += `Мы предлагаем полный спектр услуг:\n\n`;
      Object.values(this.contentBlocks.services).forEach(serviceGroup => {
        section += `### ${serviceGroup.title}\n`;
        serviceGroup.items.forEach(item => section += `${item}\n`);
        section += '\n';
      });
    }

    return section;
  }

  /**
   * Получение описания услуги
   */
  getServiceDescription(serviceKey) {
    const descriptions = {
      logo_design: '🎨 **Разработка логотипа** - от концепции до финальной векторной версии',
      vectorization: '📐 **Векторизация** - перевод растровых изображений в векторный формат',
      print_design: '👕 **Дизайн для печати** - адаптация под различные виды печати',
      embroidery_design: '🧵 **Дизайн вышивки** - создание файлов для машинной вышивки',
      character_design: '🎭 **Дизайн персонажей** - создание уникальных персонажей и маскотов',
      production: '🏭 **Производство** - печать и вышивка на различных носителях'
    };

    return descriptions[serviceKey] || `• **${serviceKey}** - профессиональное выполнение`;
  }

  /**
   * Генерация раздела портфолио
   */
  generatePortfolioSection(imageAnalysis, newsItems) {
    let section = `## 🏆 **НАШИ РАБОТЫ**\n\n`;

    if (newsItems && newsItems.length > 0) {
      section += `### 🆕 Последние проекты:\n\n`;
      newsItems.slice(0, 3).forEach(item => {
        section += `**${item.title}**  \n${item.description}\n\n`;
      });
    }

    section += `### 📊 Наша статистика:
• **1000+** выполненных проектов
• **95%** клиентов возвращаются повторно  
• **24 часа** - средний срок выполнения простых задач
• **100%** гарантия на все работы

### 🎨 Специализация:
• Логотипы и фирменный стиль
• Принты для одежды и аксессуаров
• Машинная вышивка
• Векторная графика
• Персонажи и иллюстрации\n\n`;

    return section;
  }

  /**
   * Расчет стоимости
   */
  calculatePricing(services, quantity, clientType, imageAnalysis) {
    const calculations = [];
    let totalCost = 0;

    // Базовые расчеты по услугам
    if (imageAnalysis.hasImages) {
      imageAnalysis.analysis.forEach((img, index) => {
        const complexity = img.estimatedComplexity || 1;
        const basePrice = this.pricing.print_design.simple * complexity;
        
        calculations.push({
          item: `Работа с изображением ${index + 1} (${img.filename})`,
          description: `Сложность: ${complexity.toFixed(1)}`,
          basePrice,
          quantity: 1,
          total: basePrice
        });
        
        totalCost += basePrice;
      });
    }

    // Добавляем производство если указано количество
    if (quantity > 1) {
      const productionCost = this.pricing.production.tshirt_print * quantity;
      calculations.push({
        item: 'Производство (печать на футболках)',
        description: `${quantity} шт.`,
        basePrice: this.pricing.production.tshirt_print,
        quantity,
        total: productionCost
      });
      totalCost += productionCost;
    }

    // Применяем скидки
    let discount = 0;
    let discountReason = '';

    if (quantity >= 50) {
      discount = this.discounts.volume['50-99'];
      discountReason = 'Скидка за объем';
    } else if (quantity >= 10) {
      discount = this.discounts.volume['10-49'];
      discountReason = 'Скидка за объем';
    }

    if (clientType === 'premium') {
      discount = Math.max(discount, this.discounts.loyalty.vip);
      discountReason = discountReason ? `${discountReason} + VIP` : 'VIP клиент';
    }

    const discountAmount = totalCost * discount;
    const finalCost = totalCost - discountAmount;

    return {
      calculations,
      subtotal: totalCost,
      discount: discountAmount,
      discountReason,
      total: finalCost,
      formattedTotal: this.formatPrice(finalCost)
    };
  }

  /**
   * Сборка финального КП
   */
  assembleProposal(template, content, pricing) {
    const proposal = `${content.header}

${content.introduction}

${content.services}

${content.portfolio}

## 💰 **СТОИМОСТЬ РАБОТ**

${this.formatPricingSection(pricing)}

## ⏰ **СРОКИ ВЫПОЛНЕНИЯ**

• **Дизайн:** 1-3 рабочих дня
• **Векторизация:** 1 рабочий день  
• **Печать/Вышивка:** 3-7 рабочих дней (в зависимости от тиража)

## 📞 **КОНТАКТЫ**

**BOOOMERANGS**  
📧 Email: info@booomerangs.ru  
📱 Telegram: @booomerangs  
🌐 Сайт: booomerangs.ru

---

*Данное предложение действительно в течение 14 дней с момента отправки.*

**Готовы приступить к работе? Свяжитесь с нами!** 🚀
`;

    return proposal;
  }

  /**
   * Форматирование раздела цен
   */
  formatPricingSection(pricing) {
    let section = '';

    pricing.calculations.forEach(calc => {
      section += `• **${calc.item}**\n`;
      if (calc.description) section += `  *${calc.description}*\n`;
      section += `  ${this.formatPrice(calc.total)}\n\n`;
    });

    section += `**Итого:** ${this.formatPrice(pricing.subtotal)}\n`;
    
    if (pricing.discount > 0) {
      section += `**Скидка (${pricing.discountReason}):** -${this.formatPrice(pricing.discount)}\n`;
      section += `**К оплате:** ${pricing.formattedTotal}\n`;
    }

    return section;
  }

  /**
   * Форматирование цены
   */
  formatPrice(price) {
    return `${Math.round(price).toLocaleString('ru-RU')} ₽`;
  }

  /**
   * Генерация рекомендаций
   */
  generateRecommendations(imageAnalysis, services) {
    const recommendations = [];

    if (imageAnalysis.hasImages) {
      recommendations.push('Рекомендуем векторизацию для лучшего качества печати');
      
      if (imageAnalysis.complexity > 2) {
        recommendations.push('Сложный дизайн - предлагаем упрощение для вышивки');
      }
    }

    recommendations.push('Заказ от 50 шт. - скидка 10%');
    recommendations.push('Постоянным клиентам - дополнительные бонусы');

    return recommendations;
  }

  /**
   * Определение доминирующего стиля
   */
  determineDominantStyle(analysis) {
    // Упрощенная логика определения стиля
    const styles = analysis.map(img => {
      const desc = img.analysis?.description?.toLowerCase() || '';
      if (desc.includes('минимал')) return 'минималистичный';
      if (desc.includes('техно') || desc.includes('кибер')) return 'технологичный';
      if (desc.includes('классик')) return 'классический';
      return 'современный';
    });

    // Возвращаем самый частый стиль
    const styleCounts = {};
    styles.forEach(style => styleCounts[style] = (styleCounts[style] || 0) + 1);
    
    return Object.keys(styleCounts).reduce((a, b) => 
      styleCounts[a] > styleCounts[b] ? a : b, 'современный'
    );
  }

  /**
   * Расчет средней сложности
   */
  calculateAverageComplexity(analysis) {
    if (!analysis.length) return 1;
    
    const complexities = analysis.map(img => img.estimatedComplexity || 1);
    return complexities.reduce((sum, c) => sum + c, 0) / complexities.length;
  }

  /**
   * Выбор шаблона
   */
  selectTemplate(clientType, imageAnalysis) {
    return this.templates[clientType] || this.templates.standard;
  }

  /**
   * Генерация раздела преимуществ
   */
  generateAdvantagesSection(clientType) {
    return `## ✨ **НАШИ ПРЕИМУЩЕСТВА**

• 🎯 **Персональный подход** к каждому проекту
• ⚡ **Быстрое выполнение** работ  
• 💎 **Высокое качество** дизайна и печати
• 🔄 **Бесплатные правки** до утверждения
• 📱 **Постоянная связь** на всех этапах работы
• 🛡️ **Гарантия** на все виды работ\n\n`;
  }

  /**
   * Генерация раздела сроков
   */
  generateTimelineSection(services, deadline) {
    return `## ⏰ **ПЛАН РАБОТ**

1. **Согласование ТЗ** - 1 день
2. **Создание концепций** - 1-2 дня  
3. **Утверждение дизайна** - 1 день
4. **Финализация файлов** - 1 день
5. **Производство** (при необходимости) - 3-7 дней

**Общий срок:** 7-12 рабочих дней\n\n`;
  }

  /**
   * Генерация следующих шагов
   */
  generateNextStepsSection() {
    return `## 🚀 **СЛЕДУЮЩИЕ ШАГИ**

1. **Ответьте на это предложение** для подтверждения интереса
2. **Обсудим детали** проекта и техническое задание  
3. **Подпишем договор** и начнем работу
4. **Получите результат** в оговоренные сроки

**Вопросы?** Свяжитесь с нами любым удобным способом! 📞\n\n`;
  }

  /**
   * Получение рекомендуемых цен
   */
  getRecommendedPricing(analysis) {
    const complexity = this.estimateDesignComplexity(analysis);
    return {
      vectorization: this.pricing.vectorization.simple * complexity,
      print_design: this.pricing.print_design.simple * complexity,
      logo: this.pricing.logo.base * complexity
    };
  }
}

module.exports = new CommercialProposalGenerator();
