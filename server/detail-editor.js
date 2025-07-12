
/**
 * Специальный редактор деталей - для точного добавления/изменения мелких элементов
 * Работает через текстовые команды без интерфейса
 */

const sharp = require('sharp');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs');
const path = require('path');

/**
 * Добавление патча/нашивки на одежду
 */
async function addPatchToClothing(imageUrl, patchDescription, position = 'chest') {
  try {
    console.log(`🏷️ [DETAIL-EDITOR] Добавляем патч: ${patchDescription} на позицию: ${position}`);
    
    // Загружаем базовое изображение
    const imageUtils = require('./image-utils');
    const imageBuffer = await imageUtils.loadImageFromUrl(imageUrl);
    const validatedBuffer = await imageUtils.ensurePngFormat(imageBuffer);
    
    const image = sharp(validatedBuffer);
    const { width, height } = await image.metadata();
    
    // Генерируем патч через Pollinations
    const patchPrompt = `${patchDescription}, patch design, embroidered patch, transparent background, high quality, detailed`;
    const patchImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(patchPrompt)}?width=200&height=200&nologo=true&enhance=true&seed=${Date.now()}`;
    
    // Загружаем изображение патча
    const patchResponse = await fetch(patchImageUrl);
    const patchBuffer = await patchResponse.buffer();
    
    // Обрабатываем патч - делаем нужного размера
    const patchSize = Math.min(width, height) * 0.15; // 15% от размера изображения
    const processedPatch = await sharp(patchBuffer)
      .resize(Math.round(patchSize), Math.round(patchSize))
      .png()
      .toBuffer();
    
    // Определяем позицию патча
    let left, top;
    switch (position.toLowerCase()) {
      case 'chest':
      case 'грудь':
        left = Math.round(width * 0.35);
        top = Math.round(height * 0.25);
        break;
      case 'sleeve':
      case 'рукав':
        left = Math.round(width * 0.15);
        top = Math.round(height * 0.35);
        break;
      case 'back':
      case 'спина':
        left = Math.round(width * 0.4);
        top = Math.round(height * 0.3);
        break;
      case 'shoulder':
      case 'плечо':
        left = Math.round(width * 0.25);
        top = Math.round(height * 0.2);
        break;
      default:
        left = Math.round(width * 0.35);
        top = Math.round(height * 0.25);
    }
    
    // Создаем композицию
    const timestamp = Date.now();
    const outputPath = `./uploads/patch-added-${timestamp}.png`;
    
    await image
      .composite([{
        input: processedPatch,
        left: left,
        top: top,
        blend: 'over'
      }])
      .png()
      .toFile(outputPath);
    
    return {
      success: true,
      imageUrl: `/uploads/patch-added-${timestamp}.png`,
      message: `Патч "${patchDescription}" добавлен на ${position}`,
      type: 'patch_addition',
      patchImageUrl: patchImageUrl
    };
    
  } catch (error) {
    console.error('❌ [DETAIL-EDITOR] Ошибка добавления патча:', error);
    return {
      success: false,
      error: 'Ошибка добавления патча',
      message: 'Не удалось добавить патч на изображение'
    };
  }
}

/**
 * Добавление мелких аксессуаров (украшения, детали)
 */
async function addSmallAccessory(imageUrl, accessoryDescription, targetArea = 'auto') {
  try {
    console.log(`💎 [DETAIL-EDITOR] Добавляем аксессуар: ${accessoryDescription} в область: ${targetArea}`);
    
    const imageUtils = require('./image-utils');
    const imageBuffer = await imageUtils.loadImageFromUrl(imageUrl);
    const validatedBuffer = await imageUtils.ensurePngFormat(imageBuffer);
    
    const image = sharp(validatedBuffer);
    const { width, height } = await image.metadata();
    
    // Определяем размер аксессуара
    let accessorySize;
    let position = { left: 0, top: 0 };
    
    if (accessoryDescription.includes('серьги') || accessoryDescription.includes('earrings')) {
      accessorySize = Math.min(width, height) * 0.05;
      position = { left: Math.round(width * 0.2), top: Math.round(height * 0.15) };
    } else if (accessoryDescription.includes('браслет') || accessoryDescription.includes('bracelet')) {
      accessorySize = Math.min(width, height) * 0.08;
      position = { left: Math.round(width * 0.1), top: Math.round(height * 0.6) };
    } else if (accessoryDescription.includes('кольцо') || accessoryDescription.includes('ring')) {
      accessorySize = Math.min(width, height) * 0.03;
      position = { left: Math.round(width * 0.3), top: Math.round(height * 0.7) };
    } else if (accessoryDescription.includes('цепочка') || accessoryDescription.includes('necklace')) {
      accessorySize = Math.min(width, height) * 0.12;
      position = { left: Math.round(width * 0.35), top: Math.round(height * 0.3) };
    } else {
      // Универсальный аксессуар
      accessorySize = Math.min(width, height) * 0.07;
      position = { left: Math.round(width * 0.4), top: Math.round(height * 0.4) };
    }
    
    // Создаем простую фигуру аксессуара
    let accessoryColor = { r: 255, g: 215, b: 0 }; // золотой по умолчанию
    
    if (accessoryDescription.includes('серебр') || accessoryDescription.includes('silver')) {
      accessoryColor = { r: 192, g: 192, b: 192 };
    } else if (accessoryDescription.includes('красн') || accessoryDescription.includes('red')) {
      accessoryColor = { r: 255, g: 100, b: 100 };
    } else if (accessoryDescription.includes('син') || accessoryDescription.includes('blue')) {
      accessoryColor = { r: 100, g: 100, b: 255 };
    }
    
    // Создаем аксессуар
    const accessory = sharp({
      create: {
        width: Math.round(accessorySize),
        height: Math.round(accessorySize),
        channels: 4,
        background: accessoryColor
      }
    }).png();
    
    const accessoryBuffer = await accessory.toBuffer();
    
    const timestamp = Date.now();
    const outputPath = `./uploads/accessory-added-${timestamp}.png`;
    
    await image
      .composite([{
        input: accessoryBuffer,
        left: position.left,
        top: position.top,
        blend: 'over'
      }])
      .png()
      .toFile(outputPath);
    
    return {
      success: true,
      imageUrl: `/uploads/accessory-added-${timestamp}.png`,
      message: `Аксессуар "${accessoryDescription}" добавлен`,
      type: 'accessory_addition'
    };
    
  } catch (error) {
    console.error('❌ [DETAIL-EDITOR] Ошибка добавления аксессуара:', error);
    return {
      success: false,
      error: 'Ошибка добавления аксессуара',
      message: 'Не удалось добавить аксессуар'
    };
  }
}

/**
 * Изменение текстуры материала
 */
async function changeTexture(imageUrl, textureDescription, targetObject = 'clothing') {
  try {
    console.log(`🧵 [DETAIL-EDITOR] Изменяем текстуру: ${textureDescription} для: ${targetObject}`);
    
    const imageUtils = require('./image-utils');
    const imageBuffer = await imageUtils.loadImageFromUrl(imageUrl);
    const validatedBuffer = await imageUtils.ensurePngFormat(imageBuffer);
    
    let processedImage = sharp(validatedBuffer);
    
    // Применяем текстурные эффекты
    if (textureDescription.includes('кожа') || textureDescription.includes('leather')) {
      // Эффект кожи - увеличиваем контраст и добавляем коричневый оттенок
      processedImage = processedImage
        .modulate({ saturation: 1.2, brightness: 0.9 })
        .tint({ r: 139, g: 69, b: 19 });
    } else if (textureDescription.includes('металл') || textureDescription.includes('metal')) {
      // Металлический эффект
      processedImage = processedImage
        .modulate({ saturation: 0.5, brightness: 1.1 })
        .tint({ r: 192, g: 192, b: 192 });
    } else if (textureDescription.includes('ткань') || textureDescription.includes('fabric')) {
      // Тканевый эффект
      processedImage = processedImage
        .modulate({ saturation: 1.1, brightness: 1.0 })
        .blur(0.5);
    } else if (textureDescription.includes('джинс') || textureDescription.includes('denim')) {
      // Джинсовый эффект
      processedImage = processedImage
        .modulate({ saturation: 1.3 })
        .tint({ r: 70, g: 130, b: 180 });
    } else {
      // Общее улучшение текстуры
      processedImage = processedImage
        .modulate({ saturation: 1.1, brightness: 1.05 })
        .sharpen(1.0);
    }
    
    const timestamp = Date.now();
    const outputPath = `./uploads/texture-changed-${timestamp}.png`;
    
    await processedImage.png().toFile(outputPath);
    
    return {
      success: true,
      imageUrl: `/uploads/texture-changed-${timestamp}.png`,
      message: `Текстура изменена на: ${textureDescription}`,
      type: 'texture_change'
    };
    
  } catch (error) {
    console.error('❌ [DETAIL-EDITOR] Ошибка изменения текстуры:', error);
    return {
      success: false,
      error: 'Ошибка изменения текстуры',
      message: 'Не удалось изменить текстуру'
    };
  }
}

/**
 * Удаление мелких деталей
 */
async function removeSmallDetail(imageUrl, detailDescription) {
  try {
    console.log(`🗑️ [DETAIL-EDITOR] Удаляем деталь: ${detailDescription}`);
    
    const imageUtils = require('./image-utils');
    const imageBuffer = await imageUtils.loadImageFromUrl(imageUrl);
    const validatedBuffer = await imageUtils.ensurePngFormat(imageBuffer);
    
    const image = sharp(validatedBuffer);
    const { width, height } = await image.metadata();
    
    // Определяем область для "удаления" детали
    let maskArea = { x: 0, y: 0, width: width * 0.1, height: height * 0.1 };
    
    if (detailDescription.includes('кнопк') || detailDescription.includes('button')) {
      maskArea = { 
        x: width * 0.4, 
        y: height * 0.3, 
        width: width * 0.03, 
        height: height * 0.03 
      };
    } else if (detailDescription.includes('карман') || detailDescription.includes('pocket')) {
      maskArea = { 
        x: width * 0.2, 
        y: height * 0.5, 
        width: width * 0.15, 
        height: height * 0.1 
      };
    } else if (detailDescription.includes('логотип') || detailDescription.includes('logo')) {
      maskArea = { 
        x: width * 0.35, 
        y: height * 0.25, 
        width: width * 0.1, 
        height: width * 0.05 
      };
    }
    
    // Создаем маску цвета фона
    const backgroundColor = await getAverageColor(validatedBuffer, maskArea);
    
    const mask = sharp({
      create: {
        width: Math.round(maskArea.width),
        height: Math.round(maskArea.height),
        channels: 3,
        background: backgroundColor
      }
    }).png();
    
    const maskBuffer = await mask.toBuffer();
    
    const timestamp = Date.now();
    const outputPath = `./uploads/detail-removed-${timestamp}.png`;
    
    await image
      .composite([{
        input: maskBuffer,
        left: Math.round(maskArea.x),
        top: Math.round(maskArea.y),
        blend: 'over'
      }])
      .png()
      .toFile(outputPath);
    
    return {
      success: true,
      imageUrl: `/uploads/detail-removed-${timestamp}.png`,
      message: `Деталь "${detailDescription}" удалена`,
      type: 'detail_removal'
    };
    
  } catch (error) {
    console.error('❌ [DETAIL-EDITOR] Ошибка удаления детали:', error);
    return {
      success: false,
      error: 'Ошибка удаления детали',
      message: 'Не удалось удалить деталь'
    };
  }
}

/**
 * Получение среднего цвета области изображения
 */
async function getAverageColor(imageBuffer, area) {
  try {
    const sample = await sharp(imageBuffer)
      .extract({ 
        left: Math.round(area.x), 
        top: Math.round(area.y), 
        width: Math.round(area.width), 
        height: Math.round(area.height) 
      })
      .resize(1, 1)
      .raw()
      .toBuffer();
    
    return {
      r: sample[0] || 255,
      g: sample[1] || 255,
      b: sample[2] || 255
    };
  } catch (error) {
    return { r: 255, g: 255, b: 255 }; // белый по умолчанию
  }
}

/**
 * Анализ команды редактирования деталей
 */
function analyzeDetailCommand(command) {
  const lowerCommand = command.toLowerCase();
  
  if (lowerCommand.includes('добавь патч') || lowerCommand.includes('добавь нашивку')) {
    const patchMatch = command.match(/добавь\s+(?:патч|нашивку)\s+(.+?)(?:\s+на\s+(.+?))?(?:\.|$|,)/i);
    return {
      action: 'add_patch',
      description: patchMatch ? patchMatch[1] : 'патч',
      position: patchMatch && patchMatch[2] ? patchMatch[2] : 'chest'
    };
  }
  
  if (lowerCommand.includes('добавь аксессуар') || lowerCommand.includes('добавь украшение')) {
    const accessoryMatch = command.match(/добавь\s+(?:аксессуар|украшение)\s+(.+?)(?:\.|$|,)/i);
    return {
      action: 'add_accessory',
      description: accessoryMatch ? accessoryMatch[1] : 'аксессуар'
    };
  }
  
  if (lowerCommand.includes('измени текстуру') || lowerCommand.includes('сделай материал')) {
    const textureMatch = command.match(/(?:измени текстуру|сделай материал)\s+(.+?)(?:\.|$|,)/i);
    return {
      action: 'change_texture',
      description: textureMatch ? textureMatch[1] : 'новая текстура'
    };
  }
  
  if (lowerCommand.includes('убери') || lowerCommand.includes('удали деталь')) {
    const removeMatch = command.match(/(?:убери|удали деталь)\s+(.+?)(?:\.|$|,)/i);
    return {
      action: 'remove_detail',
      description: removeMatch ? removeMatch[1] : 'деталь'
    };
  }
  
  return {
    action: 'unknown',
    description: command
  };
}

/**
 * Основная функция обработки деталей
 */
async function processDetailEdit(imageUrl, command) {
  const analysis = analyzeDetailCommand(command);
  
  console.log(`🔧 [DETAIL-EDITOR] Обработка команды: ${analysis.action} - ${analysis.description}`);
  
  switch (analysis.action) {
    case 'add_patch':
      return await addPatchToClothing(imageUrl, analysis.description, analysis.position);
      
    case 'add_accessory':
      return await addSmallAccessory(imageUrl, analysis.description);
      
    case 'change_texture':
      return await changeTexture(imageUrl, analysis.description);
      
    case 'remove_detail':
      return await removeSmallDetail(imageUrl, analysis.description);
      
    default:
      return {
        success: false,
        error: 'Неизвестная команда',
        message: 'Используйте: "добавь патч [описание]", "добавь аксессуар [описание]", "измени текстуру [описание]", "убери [деталь]"'
      };
  }
}

module.exports = {
  processDetailEdit,
  addPatchToClothing,
  addSmallAccessory,
  changeTexture,
  removeSmallDetail,
  analyzeDetailCommand
};
