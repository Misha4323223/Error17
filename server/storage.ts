import { 
  users, type User, type InsertUser, 
  messages, type Message, type InsertMessage,
  suppliers, type Supplier, type InsertSupplier,
  chatSessions, type ChatSession, type InsertChatSession,
  aiMessages, type AiMessage, type InsertAiMessage,
  userProfiles, type UserProfile, type InsertUserProfile,
  projectMemory, type ProjectMemory, type InsertProjectMemory,
  learningPatterns, type LearningPattern, type InsertLearningPattern,
  emotionalHistory, type EmotionalHistory, type InsertEmotionalHistory
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, gte } from "drizzle-orm";

// Extended storage interface with methods for chat application
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByToken(token: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  setUserOnlineStatus(id: number, isOnline: boolean): Promise<User | undefined>;

  // Message methods
  createMessage(message: InsertMessage): Promise<Message>;
  getMessageById(id: number): Promise<Message | undefined>;
  getMessagesBetweenUsers(userId1: number, userId2: number): Promise<Message[]>;

  // Chat session methods
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSession(id: number): Promise<ChatSession | undefined>;
  getAllChatSessions(userId?: number): Promise<ChatSession[]>;
  updateChatSession(id: number, updates: Partial<ChatSession>): Promise<ChatSession | undefined>;

  // AI message methods
  createAiMessage(message: InsertAiMessage): Promise<AiMessage>;
  getAiMessagesBySession(sessionId: number): Promise<AiMessage[]>;
  getLatestAiMessages(sessionId: number, limit?: number): Promise<AiMessage[]>;

  // === ФАЗА 1: МЕТОДЫ ДЛЯ СЕМАНТИЧЕСКОЙ ПАМЯТИ ===

  // User Profile methods
  getUserProfile(userId: number): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: number, updates: Partial<UserProfile>): Promise<UserProfile | undefined>;

  // Project Memory methods
  createProjectMemory(project: InsertProjectMemory): Promise<ProjectMemory>;
  getProjectMemory(id: number): Promise<ProjectMemory | undefined>;
  getUserProjects(userId: number, limit?: number): Promise<ProjectMemory[]>;
  updateProjectMemory(id: number, updates: Partial<ProjectMemory>): Promise<ProjectMemory | undefined>;
  getActiveProjects(userId: number): Promise<ProjectMemory[]>;
  getProjectsByType(userId: number, projectType: string): Promise<ProjectMemory[]>;

  // Learning Pattern methods
  createLearningPattern(pattern: InsertLearningPattern): Promise<LearningPattern>;
  getLearningPatterns(userId: number, category?: string): Promise<LearningPattern[]>;
  updateLearningPattern(id: number, updates: Partial<LearningPattern>): Promise<LearningPattern | undefined>;
  getSuccessfulPatterns(userId: number, category: string): Promise<LearningPattern[]>;

  // Emotional History methods
  createEmotionalHistory(emotion: InsertEmotionalHistory): Promise<EmotionalHistory>;
  getEmotionalHistory(userId: number, limit?: number): Promise<EmotionalHistory[]>;
  getRecentEmotions(userId: number, sessionId?: number): Promise<EmotionalHistory[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private messages: Map<number, Message>;
  private userIdCounter: number;
  private messageIdCounter: number;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.userIdCounter = 1;
    this.messageIdCounter = 1;

    // Initialize with some demo users
    this.createUser({
      username: "Alex Kim",
      password: "password123",
      displayName: "Alex Kim",
    });

    this.createUser({
      username: "Maria Johnson",
      password: "password123", 
      displayName: "Maria Johnson",
    });

    this.createUser({
      username: "David Peterson",
      password: "password123",
      displayName: "David Peterson",
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async getUserByToken(token: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.token === token,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { 
      ...insertUser, 
      id, 
      token: null,
      isOnline: false,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async setUserOnlineStatus(id: number, isOnline: boolean): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (user) {
      const updatedUser = { ...user, isOnline };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  // Message methods
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const timestamp = new Date();
    const message: Message = { 
      ...insertMessage, 
      id, 
      timestamp, 
      status: "sent" 
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessageById(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesBetweenUsers(userId1: number, userId2: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => 
        (message.senderId === userId1 && message.receiverId === userId2) ||
        (message.senderId === userId2 && message.receiverId === userId1)
    ).sort((a, b) => {
      // Sort by timestamp
      if (a.timestamp < b.timestamp) return -1;
      if (a.timestamp > b.timestamp) return 1;
      return 0;
    });
  }
}

// Database storage implementation using PostgreSQL
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByToken(token: string): Promise<User | undefined> {
    if (!token) return undefined;
    const [user] = await db.select().from(users).where(eq(users.token, token));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async setUserOnlineStatus(id: number, isOnline: boolean): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ isOnline })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Message methods
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getMessageById(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message || undefined;
  }

  async getMessagesBetweenUsers(userId1: number, userId2: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
          and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1))
        )
      )
      .orderBy(messages.timestamp);
  }

  // Chat session methods
  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const [session] = await db
      .insert(chatSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getChatSession(id: number): Promise<ChatSession | undefined> {
    const [session] = await db.select().from(chatSessions).where(eq(chatSessions.id, id));
    return session || undefined;
  }

  async getAllChatSessions(userId?: number): Promise<ChatSession[]> {
    if (userId) {
      return await db
        .select()
        .from(chatSessions)
        .where(eq(chatSessions.userId, userId))
        .orderBy(desc(chatSessions.updatedAt));
    }
    return await db.select().from(chatSessions).orderBy(desc(chatSessions.updatedAt));
  }

  async updateChatSession(id: number, updates: Partial<ChatSession>): Promise<ChatSession | undefined> {
    const [session] = await db
      .update(chatSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(chatSessions.id, id))
      .returning();
    return session || undefined;
  }

  // AI message methods
  async createAiMessage(insertMessage: InsertAiMessage): Promise<AiMessage> {
    const [message] = await db
      .insert(aiMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getAiMessagesBySession(sessionId: number): Promise<AiMessage[]> {
    return await db
      .select()
      .from(aiMessages)
      .where(eq(aiMessages.sessionId, sessionId))
      .orderBy(aiMessages.createdAt);
  }

  async getLatestAiMessages(sessionId: number, limit: number = 50): Promise<AiMessage[]> {
    return await db
      .select()
      .from(aiMessages)
      .where(eq(aiMessages.sessionId, sessionId))
      .orderBy(desc(aiMessages.createdAt))
      .limit(limit);
  }

  // === ФАЗА 1: РЕАЛИЗАЦИЯ МЕТОДОВ СЕМАНТИЧЕСКОЙ ПАМЯТИ ===

  // User Profile methods
  async getUserProfile(userId: number): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile || undefined;
  }

  async createUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const [profile] = await db
      .insert(userProfiles)
      .values(insertProfile)
      .returning();
    return profile;
  }

  async updateUserProfile(userId: number, updates: Partial<UserProfile>): Promise<UserProfile | undefined> {
    const [profile] = await db
      .update(userProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId))
      .returning();
    return profile || undefined;
  }

  // Project Memory methods
  async createProjectMemory(insertProject: InsertProjectMemory): Promise<ProjectMemory> {
    const [project] = await db
      .insert(projectMemory)
      .values(insertProject)
      .returning();
    return project;
  }

  async getProjectMemory(id: number): Promise<ProjectMemory | undefined> {
    const [project] = await db.select().from(projectMemory).where(eq(projectMemory.id, id));
    return project || undefined;
  }

  async getUserProjects(userId: number, limit: number = 50): Promise<ProjectMemory[]> {
    return await db
      .select()
      .from(projectMemory)
      .where(eq(projectMemory.userId, userId))
      .orderBy(desc(projectMemory.lastWorkedOn))
      .limit(limit);
  }

  async updateProjectMemory(id: number, updates: Partial<ProjectMemory>): Promise<ProjectMemory | undefined> {
    const [project] = await db
      .update(projectMemory)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projectMemory.id, id))
      .returning();
    return project || undefined;
  }

  async getActiveProjects(userId: number): Promise<ProjectMemory[]> {
    return await db
      .select()
      .from(projectMemory)
      .where(and(eq(projectMemory.userId, userId), eq(projectMemory.completionStatus, 'active')))
      .orderBy(desc(projectMemory.lastWorkedOn));
  }

  async getProjectsByType(userId: number, projectType: string): Promise<ProjectMemory[]> {
    return await db
      .select()
      .from(projectMemory)
      .where(and(eq(projectMemory.userId, userId), eq(projectMemory.projectType, projectType)))
      .orderBy(desc(projectMemory.lastWorkedOn));
  }

  // Learning Pattern methods
  async createLearningPattern(insertPattern: InsertLearningPattern): Promise<LearningPattern> {
    const [pattern] = await db
      .insert(learningPatterns)
      .values(insertPattern)
      .returning();
    return pattern;
  }

  async getLearningPatterns(userId: number, category?: string): Promise<LearningPattern[]> {
    const conditions = [eq(learningPatterns.userId, userId)];
    if (category) {
      conditions.push(eq(learningPatterns.category, category));
    }

    return await db
      .select()
      .from(learningPatterns)
      .where(and(...conditions))
      .orderBy(desc(learningPatterns.confidence), desc(learningPatterns.successRate));
  }

  async updateLearningPattern(id: number, updates: Partial<LearningPattern>): Promise<LearningPattern | undefined> {
    const [pattern] = await db
      .update(learningPatterns)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(learningPatterns.id, id))
      .returning();
    return pattern || undefined;
  }

  async getSuccessfulPatterns(userId: number, category: string): Promise<LearningPattern[]> {
    return await db
      .select()
      .from(learningPatterns)
      .where(and(
        eq(learningPatterns.userId, userId),
        eq(learningPatterns.category, category),
        gte(learningPatterns.successRate, 70) // >= 70% success rate
      ))
      .orderBy(desc(learningPatterns.successRate), desc(learningPatterns.usageCount));
  }

  // Emotional History methods
  async createEmotionalHistory(insertEmotion: InsertEmotionalHistory): Promise<EmotionalHistory> {
    const [emotion] = await db
      .insert(emotionalHistory)
      .values(insertEmotion)
      .returning();
    return emotion;
  }

  async getEmotionalHistory(userId: number, limit: number = 100): Promise<EmotionalHistory[]> {
    return await db
      .select()
      .from(emotionalHistory)
      .where(eq(emotionalHistory.userId, userId))
      .orderBy(desc(emotionalHistory.createdAt))
      .limit(limit);
  }

  async getRecentEmotions(userId: number, sessionId?: number): Promise<EmotionalHistory[]> {
    const conditions = [eq(emotionalHistory.userId, userId)];
    if (sessionId) {
      conditions.push(eq(emotionalHistory.sessionId, sessionId));
    }

    return await db
      .select()
      .from(emotionalHistory)
      .where(and(...conditions))
      .orderBy(desc(emotionalHistory.createdAt))
      .limit(20);
  }
}

export const storage = new DatabaseStorage();