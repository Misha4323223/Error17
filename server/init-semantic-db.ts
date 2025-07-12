
import { db } from './db';
import { userProfiles, learningPatterns, projectMemory, emotionalHistory, semanticCache } from '../shared/schema';

/**
 * Инициализация семантических таблиц с начальными данными
 */
export async function initializeSemanticDatabase() {
  console.log('🚀 Инициализация семантической базы данных...');
  
  try {
    // Проверяем подключение
    await db.execute('SELECT 1');
    console.log('✅ Подключение к PostgreSQL успешно');
    
    // Проверяем существование таблиц
    const tableCheck = await db.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('user_profiles', 'learning_patterns', 'project_memory', 'emotional_history', 'semantic_cache')
    `);
    
    console.log(`📊 Найдено семантических таблиц: ${tableCheck.length}/5`);
    
    if (tableCheck.length < 5) {
      console.log('⚠️ Не все семантические таблицы созданы. Выполните миграции:');
      console.log('npx drizzle-kit migrate');
      return false;
    }
    
    // Добавляем начальные данные (если таблицы пустые)
    const userProfilesCount = await db.select().from(userProfiles).limit(1);
    
    if (userProfilesCount.length === 0) {
      console.log('📝 Добавляем начальные данные...');
      
      // Создаем профиль по умолчанию для пользователя 1
      await db.insert(userProfiles).values({
        userId: 1,
        favoriteColors: ['синий', 'зеленый', 'белый'],
        preferredStyles: ['минималистичный', 'современный'],
        designComplexity: 'medium',
        totalInteractions: 0
      }).onConflictDoNothing();
      
      // Добавляем базовые паттерны обучения
      await db.insert(learningPatterns).values([
        {
          userId: 1,
          pattern: 'предпочитает простые формы',
          category: 'design_preference',
          confidence: 70,
          successRate: 80,
          timesUsed: 0
        },
        {
          userId: 1,
          pattern: 'часто использует синий цвет',
          category: 'color_preference',
          confidence: 60,
          successRate: 75,
          timesUsed: 0
        }
      ]).onConflictDoNothing();
      
      console.log('✅ Начальные данные добавлены');
    }
    
    // Очистка старого кэша
    await db.delete(semanticCache).where(
      db.sql`expires_at < NOW()`
    );
    
    console.log('🧹 Старый кэш очищен');
    console.log('✅ Семантическая база данных готова к работе');
    
    return true;
    
  } catch (error) {
    console.error('❌ Ошибка инициализации семантической БД:', error);
    return false;
  }
}

// Экспорт для использования в других модулях
export { userProfiles, learningPatterns, projectMemory, emotionalHistory, semanticCache };
