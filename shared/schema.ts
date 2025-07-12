import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Define User schema для простой авторизации
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  token: text("token").unique(),
  isOnline: boolean("is_online").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
});

// Define Message schema
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  text: text("text").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  status: text("status").notNull().default("sent"),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  senderId: true,
  receiverId: true,
  text: true
});

// Семантические таблицы
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  favoriteColors: text("favorite_colors").array(),
  preferredStyles: text("preferred_styles").array(),
  designComplexity: text("design_complexity").default("medium"),
  totalInteractions: integer("total_interactions").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const learningPatterns = pgTable("learning_patterns", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  pattern: text("pattern").notNull(),
  category: text("category").notNull(),
  confidence: integer("confidence").default(50),
  successRate: integer("success_rate").default(0),
  timesUsed: integer("times_used").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const projectMemory = pgTable("project_memory", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  sessionId: text("session_id").notNull(),
  projectTitle: text("project_title").notNull(),
  projectType: text("project_type").notNull(),
  description: text("description"),
  domain: text("domain").default("general"),
  semanticTags: text("semantic_tags").array(),
  concepts: text("concepts").array(),
  originalQuery: text("original_query"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const emotionalHistory = pgTable("emotional_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  sessionId: text("session_id").notNull(),
  emotionalState: text("emotional_state").notNull(),
  dominantEmotion: text("dominant_emotion"),
  confidence: integer("confidence").default(50),
  context: text("context"),
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

export const semanticCache = pgTable("semantic_cache", {
  id: serial("id").primaryKey(),
  queryHash: text("query_hash").notNull().unique(),
  queryText: text("query_text").notNull(),
  semanticResult: text("semantic_result").notNull(),
  confidence: integer("confidence").default(50),
  category: text("category"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Связи
export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

export const learningPatternsRelations = relations(learningPatterns, ({ one }) => ({
  user: one(users, {
    fields: [learningPatterns.userId],
    references: [users.id],
  }),
}));

export const projectMemoryRelations = relations(projectMemory, ({ one }) => ({
  user: one(users, {
    fields: [projectMemory.userId],
    references: [users.id],
  }),
}));

export const emotionalHistoryRelations = relations(emotionalHistory, ({ one }) => ({
  user: one(users, {
    fields: [emotionalHistory.userId],
    references: [users.id],
  }),
}));

// Chat Sessions для сохранения истории чатов с AI
export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").default(1), // Убираем внешний ключ для простоты
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// AI Messages для сохранения сообщений с AI
export const aiMessages = pgTable("ai_messages", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => chatSessions.id).notNull(),
  content: text("content").notNull(),
  sender: text("sender").notNull(), // 'user' or 'ai'
  provider: text("provider"), // AI provider used
  model: text("model"), // AI model used
  category: text("category"), // message category
  confidence: text("confidence"), // AI confidence score
  imageUrl: text("image_url"), // attached image if any
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiMessageSchema = createInsertSchema(aiMessages).omit({
  id: true,
  createdAt: true,
});

// Define WebSocket event types
export enum WSEventType {
  AUTH = "auth",
  MESSAGE = "message",
  USER_CONNECTED = "user_connected",
  USER_DISCONNECTED = "user_disconnected",
  ERROR = "error",
}

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  chatSessions: many(chatSessions),
}));

export const chatSessionsRelations = relations(chatSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [chatSessions.userId],
    references: [users.id],
  }),
  aiMessages: many(aiMessages),
}));

export const aiMessagesRelations = relations(aiMessages, ({ one }) => ({
  session: one(chatSessions, {
    fields: [aiMessages.sessionId],
    references: [chatSessions.id],
  }),
}));

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// База поставщиков уличной одежды
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // streetwear, accessories, shoes, etc.
  contactPerson: text("contact_person"),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  city: text("city"),
  country: text("country").default("Россия"),
  website: text("website"),
  telegram: text("telegram"),
  whatsapp: text("whatsapp"),
  specialization: text("specialization"), // худи, кроссовки, кепки, etc.
  brands: text("brands").array(), // какие бренды поставляет
  minOrder: text("min_order"), // минимальный заказ
  paymentTerms: text("payment_terms"), // условия оплаты
  deliveryTime: text("delivery_time"), // время доставки
  notes: text("notes"),
  rating: text("rating").default("⭐⭐⭐"), // рейтинг поставщика
  status: text("status").default("active"), // active, inactive
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertAiMessage = z.infer<typeof insertAiMessageSchema>;
export type AiMessage = typeof aiMessages.$inferSelect;

// Система автоматических отчетов
export const reportTemplates = pgTable("report_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  reportType: text("report_type").notNull(), // "daily", "weekly", "monthly", "usage", "errors"
  schedule: text("schedule").notNull(), // cron format
  isActive: boolean("is_active").default(true).notNull(),
  emailRecipients: text("email_recipients").array(), // список email для отправки
  lastRun: timestamp("last_run"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const reportLogs = pgTable("report_logs", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").references(() => reportTemplates.id).notNull(),
  reportData: text("report_data").notNull(), // JSON с данными отчета
  status: text("status").notNull(), // "success", "failed", "sending"
  emailsSent: integer("emails_sent").default(0),
  errorMessage: text("error_message"),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
});

export const emailNotifications = pgTable("email_notifications", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // "report", "error", "system"
  recipient: text("recipient").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull().default("pending"), // "pending", "sent", "failed"
  reportLogId: integer("report_log_id").references(() => reportLogs.id),
  sentAt: timestamp("sent_at"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReportTemplateSchema = createInsertSchema(reportTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReportLogSchema = createInsertSchema(reportLogs).omit({
  id: true,
  generatedAt: true,
});

export const insertEmailNotificationSchema = createInsertSchema(emailNotifications).omit({
  id: true,
  createdAt: true,
});

export type ReportTemplate = typeof reportTemplates.$inferSelect;
export type InsertReportTemplate = z.infer<typeof insertReportTemplateSchema>;
export type ReportLog = typeof reportLogs.$inferSelect;
export type InsertReportLog = z.infer<typeof insertReportLogSchema>;
export type EmailNotification = typeof emailNotifications.$inferSelect;
export type InsertEmailNotification = z.infer<typeof insertEmailNotificationSchema>;

// ===== ФАЗА 1: СЕМАНТИЧЕСКАЯ ПАМЯТЬ И ПЕРСОНАЛИЗАЦИЯ =====

// Профили пользователей для персонализации
export const userProfilesOld = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),

  // Коммуникационные предпочтения
  communicationStyle: text("communication_style").default("friendly"), // formal, friendly, brief, detailed
  preferredLanguage: text("preferred_language").default("ru"),
  responseLength: text("response_length").default("medium"), // short, medium, detailed

  // Дизайн предпочтения  
  favoriteColors: text("favorite_colors").array(), // предпочитаемые цвета
  preferredStyles: text("preferred_styles").array(), // minimalist, vintage, modern, etc.
  designComplexity: text("design_complexity").default("medium"), // simple, medium, complex

  // Эмоциональный профиль
  emotionalTone: text("emotional_tone").default("neutral"), // enthusiastic, calm, professional
  feedbackStyle: text("feedback_style").default("encouraging"), // direct, encouraging, detailed

  // Обучение и адаптация
  learningProgress: text("learning_progress").default("{}"), // JSON с прогрессом обучения
  successPatterns: text("success_patterns").default("{}"), // JSON с успешными паттернами

  // Метаданные
  totalInteractions: integer("total_interactions").default(0),
  lastActive: timestamp("last_active").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Долгосрочная память проектов
export const projectMemoryOld = pgTable("project_memory", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  sessionId: integer("session_id").references(() => chatSessions.id),

  // Основная информация о проекте
  projectType: text("project_type").notNull(), // logo, print, embroidery, character, etc.
  projectTitle: text("project_title").notNull(),
  description: text("description"),

  // Семантические теги и контекст
  semanticTags: text("semantic_tags").array(), // извлеченные семантические теги
  concepts: text("concepts").array(), // основные концепции проекта
  domain: text("domain"), // branding, apparel, textile, etc.

  // История развития проекта
  evolutionStages: text("evolution_stages").default("{}"), // JSON с этапами развития
  artifacts: text("artifacts").array(), // созданные артефакты (URLs, file paths)
  nextStepsPredictions: text("next_steps_predictions").default("{}"), // JSON предсказаний

  // Пользовательский контекст
  userIntent: text("user_intent"), // основное намерение пользователя
  satisfactionLevel: integer("satisfaction_level"), // 1-10 оценка удовлетворенности
  completionStatus: text("completion_status").default("active"), // active, completed, abandoned

  // Временные метки
  startedAt: timestamp("started_at").defaultNow().notNull(),
  lastWorkedOn: timestamp("last_worked_on").defaultNow(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Паттерны обучения для контекстного обучения
export const learningPatternsOld = pgTable("learning_patterns", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),

  // Тип паттерна
  patternType: text("pattern_type").notNull(), // request_pattern, success_flow, preference_pattern
  category: text("category"), // image_generation, vectorization, consultation, etc.

  // Паттерн данных
  inputPattern: text("input_pattern").notNull(), // что пользователь обычно просит
  contextPattern: text("context_pattern").default("{}"), // в каком контексте
  responsePattern: text("response_pattern").default("{}"), // что работает лучше всего

  // Метрики успеха
  successRate: integer("success_rate").default(0), // процент успешности 0-100
  usageCount: integer("usage_count").default(1), // сколько раз встречался
  lastSuccess: timestamp("last_success"),

  // Обучение
  confidence: integer("confidence").default(50), // уверенность в паттерне 0-100
  adaptationData: text("adaptation_data").default("{}"), // данные для адаптации

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Эмоциональная история взаимодействий
export const emotionalHistoryOld = pgTable("emotional_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  sessionId: integer("session_id").references(() => chatSessions.id),
  messageId: integer("message_id").references(() => aiMessages.id),

  // Эмоциональный анализ
  detectedEmotion: text("detected_emotion"), // joy, frustration, excitement, etc.
  emotionConfidence: integer("emotion_confidence"), // 0-100
  emotionIntensity: integer("emotion_intensity"), // 1-10

  // Контекст
  triggerContext: text("trigger_context"), // что вызвало эмоцию
  responseAdjustment: text("response_adjustment"), // как была скорректирована реакция

  // Результат
  satisfactionChange: integer("satisfaction_change"), // изменение удовлетворенности -10 до +10
  followupNeeded: boolean("followup_needed").default(false),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Схемы для вставки
export const insertUserProfileSchema = createInsertSchema(userProfilesOld).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectMemorySchema = createInsertSchema(projectMemoryOld).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLearningPatternSchema = createInsertSchema(learningPatternsOld).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmotionalHistorySchema = createInsertSchema(emotionalHistoryOld).omit({
  id: true,
  createdAt: true,
});

// Типы для TypeScript
export type UserProfile = typeof userProfilesOld.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type ProjectMemory = typeof projectMemoryOld.$inferSelect;
export type InsertProjectMemory = z.infer<typeof insertProjectMemorySchema>;
export type LearningPattern = typeof learningPatternsOld.$inferSelect;
export type InsertLearningPattern = z.infer<typeof insertLearningPatternSchema>;
export type EmotionalHistory = typeof emotionalHistoryOld.$inferSelect;
export type InsertEmotionalHistory = z.infer<typeof insertEmotionalHistorySchema>;

// Define schemas for API validation
export const authSchema = z.object({
  token: z.string().min(1, "Access token is required"),
});

export const messageSchema = z.object({
  text: z.string().min(1, "Message cannot be empty"),
  receiverId: z.number(),
});

// Define WebSocket message interfaces
export interface WSMessage {
  type: WSEventType;
  payload: any;
}

export interface WSAuthPayload {
  token: string;
}

export interface WSMessagePayload {
  text: string;
  receiverId: number;
}

export interface WSErrorPayload {
  message: string;
}

// Define frontend user interface with additional fields
export interface UserWithInitials extends User {
  initials: string;
}

// For frontend message display
export interface MessageWithSender extends Message {
  sender: UserWithInitials;
  time: string;
}