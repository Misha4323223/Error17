
/**
 * API маршруты для системы коммерческих предложений
 */

const express = require('express');
const multer = require('multer');
const CommercialProposalGenerator = require('./commercial-proposal-generator');
const OfferBannerGenerator = require('./offer-banner-generator');

const router = express.Router();

// Настройка multer для загрузки изображений
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

/**
 * POST /api/commercial/proposal
 * Генерация коммерческого предложения
 */
router.post('/proposal', upload.array('images', 10), async (req, res) => {
  try {
    console.log('📋 Генерация коммерческого предложения...');

    const {
      clientName,
      clientCompany,
      clientType = 'standard',
      services = [],
      quantity = 1,
      deadline,
      additionalInfo = '',
      newsItems = []
    } = req.body;

    // Обрабатываем загруженные изображения
    const images = req.files ? req.files.map(file => ({
      filename: file.originalname,
      buffer: file.buffer,
      mimetype: file.mimetype,
      size: file.size
    })) : [];

    const request = {
      clientName,
      clientCompany,
      clientType,
      services: Array.isArray(services) ? services : services.split(','),
      images,
      quantity: parseInt(quantity) || 1,
      deadline: deadline ? new Date(deadline) : null,
      additionalInfo,
      newsItems: Array.isArray(newsItems) ? newsItems : []
    };

    const result = await CommercialProposalGenerator.generateCommercialProposal(request);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ Ошибка генерации КП:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка генерации коммерческого предложения',
      details: error.message
    });
  }
});

/**
 * POST /api/commercial/offer
 * Генерация офера
 */
router.post('/offer', async (req, res) => {
  try {
    console.log('💫 Генерация офера...');

    const {
      offerType = 'discount',
      clientType = 'standard',
      services = [],
      discountPercentage = 15,
      validUntil,
      customMessage = '',
      targetAudience = 'general'
    } = req.body;

    const request = {
      offerType,
      clientType,
      services: Array.isArray(services) ? services : services.split(','),
      discountPercentage: parseInt(discountPercentage) || 15,
      validUntil: validUntil ? new Date(validUntil) : null,
      customMessage,
      targetAudience
    };

    const result = await OfferBannerGenerator.generateOffer(request);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ Ошибка генерации офера:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка генерации офера',
      details: error.message
    });
  }
});

/**
 * POST /api/commercial/email-campaign
 * Генерация email кампании
 */
router.post('/email-campaign', async (req, res) => {
  try {
    console.log('📧 Генерация email кампании...');

    const {
      campaignType = 'promotional',
      targetSegment = 'all',
      offers = [],
      newsItems = [],
      personalizations = {}
    } = req.body;

    const request = {
      campaignType,
      targetSegment,
      offers,
      newsItems,
      personalizations
    };

    const result = await OfferBannerGenerator.generateEmailCampaign(request);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ Ошибка генерации email кампании:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка генерации email кампании',
      details: error.message
    });
  }
});

/**
 * GET /api/commercial/templates
 * Получение доступных шаблонов
 */
router.get('/templates', async (req, res) => {
  try {
    const templates = {
      proposals: {
        standard: 'Стандартное КП',
        premium: 'Премиум КП',  
        startup: 'КП для стартапов',
        corporate: 'Корпоративное КП'
      },
      offers: {
        discount: 'Скидочный офер',
        seasonal: 'Сезонное предложение',
        new_client: 'Для новых клиентов',
        volume: 'Объемные заказы',
        express: 'Срочные заказы'
      },
      emails: {
        promotional: 'Рекламная рассылка',
        newsletter: 'Новостная рассылка',
        seasonal: 'Сезонная рассылка'
      }
    };

    res.json({
      success: true,
      data: templates
    });

  } catch (error) {
    console.error('❌ Ошибка получения шаблонов:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка получения шаблонов'
    });
  }
});

/**
 * POST /api/commercial/quick-proposal
 * Быстрая генерация КП по минимальным данным
 */
router.post('/quick-proposal', async (req, res) => {
  try {
    console.log('⚡ Быстрая генерация КП...');

    const {
      clientName = 'Уважаемый клиент',
      serviceType = 'print_design',
      urgency = 'normal'
    } = req.body;

    // Определяем услуги по типу
    const serviceMap = {
      logo: ['logo_design', 'vectorization'],
      print: ['print_design', 'production'],
      embroidery: ['embroidery_design', 'embroidery_production'],
      full: ['logo_design', 'print_design', 'vectorization', 'production']
    };

    const services = serviceMap[serviceType] || serviceMap.print;

    const request = {
      clientName,
      clientCompany: '',
      clientType: urgency === 'urgent' ? 'premium' : 'standard',
      services,
      images: [],
      quantity: 1,
      deadline: null,
      additionalInfo: 'Быстро сгенерированное предложение',
      newsItems: []
    };

    const result = await CommercialProposalGenerator.generateCommercialProposal(request);

    res.json({
      success: true,
      data: result,
      type: 'quick_proposal'
    });

  } catch (error) {
    console.error('❌ Ошибка быстрой генерации КП:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка быстрой генерации КП',
      details: error.message
    });
  }
});

/**
 * GET /api/commercial/pricing
 * Получение актуальных цен
 */
router.get('/pricing', async (req, res) => {
  try {
    const pricing = {
      logo: {
        base: 2500,
        premium: 5000,
        exclusive: 8000,
        description: 'Разработка логотипа'
      },
      print_design: {
        simple: 1500,
        detailed: 3000,
        complex: 4500,
        description: 'Дизайн для печати'
      },
      embroidery: {
        per_1000_stitches: 50,
        setup_fee: 500,
        min_order: 10,
        description: 'Машинная вышивка'
      },
      vectorization: {
        simple: 800,
        medium: 1500,
        complex: 2500,
        description: 'Векторизация изображений'
      },
      production: {
        tshirt_print: 350,
        hoodie_print: 650,
        per_item_embroidery: 180,
        description: 'Производство и печать'
      },
      discounts: {
        volume_10_49: '5%',
        volume_50_99: '10%',
        volume_100_199: '15%',
        volume_200_plus: '20%',
        returning_client: '5%',
        vip_client: '10%',
        partner: '15%'
      }
    };

    res.json({
      success: true,
      data: pricing,
      updated: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Ошибка получения цен:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка получения цен'
    });
  }
});

module.exports = router;
