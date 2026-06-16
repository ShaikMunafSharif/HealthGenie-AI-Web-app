import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { secureStorage } from '../utils/secureStorage';

// ━━━ AUTH STORE ━━━
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      hasCompletedSetup: false,
      
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setOnboardingComplete: () => set({ hasCompletedOnboarding: true }),
      setSetupComplete: () => set({ hasCompletedSetup: true }),
      updateProfile: (data) => set((s) => ({ user: { ...s.user, ...data } })),
    }),
    { name: 'healthgenie-auth', storage: createJSONStorage(() => secureStorage) }
  )
);

// ━━━ HEALTH STORE ━━━
export const useHealthStore = create(
  persist(
    (set, get) => ({
      healthScore: 72,
      categories: {
        fitness: 65,
        diet: 70,
        sleep: 80,
        hydration: 60,
        vitals: 75,
      },
      dailyStats: {
        steps: 6240,
        water: 1500,
        calories: 1800,
        sleep: 7.2,
      },
      history: [],
      achievements: [
        { id: 'first_login', name: 'First Steps', icon: '🌟', unlocked: true, date: new Date().toISOString() },
        { id: 'water_streak_3', name: '3-Day Hydration', icon: '💧', unlocked: false },
        { id: 'exercise_streak_7', name: 'Week Warrior', icon: '💪', unlocked: false },
        { id: 'health_score_80', name: 'Health Champion', icon: '🏆', unlocked: false },
        { id: 'perfect_day', name: 'Perfect Day', icon: '✨', unlocked: false },
      ],
      
      updateHealthScore: (score) => set({ healthScore: Math.min(100, Math.max(0, score)) }),
      updateCategory: (cat, val) => set((s) => ({
        categories: { ...s.categories, [cat]: Math.min(100, Math.max(0, val)) }
      })),
      updateDailyStat: (stat, val) => set((s) => ({
        dailyStats: { ...s.dailyStats, [stat]: val }
      })),
      addHistoryEntry: (entry) => set((s) => ({
        history: [...s.history.slice(-89), { ...entry, date: new Date().toISOString() }]
      })),
      unlockAchievement: (id) => set((s) => ({
        achievements: s.achievements.map(a => 
          a.id === id ? { ...a, unlocked: true, date: new Date().toISOString() } : a
        )
      })),
    }),
    { name: 'healthgenie-health', storage: createJSONStorage(() => secureStorage) }
  )
);

// ━━━ WATER STORE ━━━
export const useWaterStore = create(
  persist(
    (set, get) => ({
      dailyGoal: 2500,
      currentIntake: 0,
      intakeLog: [],
      history: [],
      streak: 0,
      
      addIntake: (ml) => {
        const now = new Date();
        set((s) => ({
          currentIntake: s.currentIntake + ml,
          intakeLog: [...s.intakeLog, { amount: ml, time: now.toISOString() }],
        }));
      },
      setDailyGoal: (goal) => set({ dailyGoal: goal }),
      resetDaily: () => {
        const state = get();
        const completed = state.currentIntake >= state.dailyGoal;
        set((s) => ({
          currentIntake: 0,
          intakeLog: [],
          history: [...s.history.slice(-29), {
            date: new Date().toISOString().split('T')[0],
            intake: s.currentIntake,
            goal: s.dailyGoal,
            completed
          }],
          streak: completed ? s.streak + 1 : 0,
        }));
      },
    }),
    { name: 'healthgenie-water', storage: createJSONStorage(() => secureStorage) }
  )
);

// ━━━ DIET STORE ━━━
export const useDietStore = create(
  persist(
    (set) => ({
      weeklyPlan: null,
      calorieTarget: 2000,
      macros: { protein: 30, carbs: 45, fat: 25 },
      mealsLogged: [],
      
      setWeeklyPlan: (plan) => set({ weeklyPlan: plan }),
      setCalorieTarget: (cal) => set({ calorieTarget: cal }),
      setMacros: (macros) => set({ macros }),
      logMeal: (meal) => set((s) => ({
        mealsLogged: [...s.mealsLogged, { ...meal, timestamp: new Date().toISOString() }]
      })),
    }),
    { name: 'healthgenie-diet', storage: createJSONStorage(() => secureStorage) }
  )
);

// ━━━ WOMEN'S HEALTH STORE ━━━
export const useWomenStore = create(
  persist(
    (set, get) => ({
      cycleLength: 28,
      periodLength: 5,
      lastPeriodStart: null,
      periodLog: [],
      symptoms: [],
      
      setLastPeriod: (date) => set({ lastPeriodStart: date }),
      setCycleLength: (len) => set({ cycleLength: len }),
      setPeriodLength: (len) => set({ periodLength: len }),
      logPeriodDay: (entry) => set((s) => ({
        periodLog: [...s.periodLog, { ...entry, date: new Date().toISOString() }]
      })),
      logSymptom: (symptom) => set((s) => ({
        symptoms: [...s.symptoms, { ...symptom, date: new Date().toISOString() }]
      })),
      
      getNextPeriod: () => {
        const { lastPeriodStart, cycleLength } = get();
        if (!lastPeriodStart) return null;
        const next = new Date(lastPeriodStart);
        next.setDate(next.getDate() + cycleLength);
        return next;
      },
      
      getCycleDay: () => {
        const { lastPeriodStart } = get();
        if (!lastPeriodStart) return null;
        const diff = Math.floor((Date.now() - new Date(lastPeriodStart)) / 86400000);
        return diff + 1;
      },
    }),
    { name: 'healthgenie-women', storage: createJSONStorage(() => secureStorage) }
  )
);

// ━━━ PREGNANCY STORE ━━━
export const usePregnancyStore = create(
  persist(
    (set, get) => ({
      isPregnant: false,
      dueDate: null,
      lastMenstrualPeriod: null,
      appointments: [],
      weeklyNotes: [],
      
      setPregnancy: (dueDate, lmp) => set({ 
        isPregnant: true, 
        dueDate, 
        lastMenstrualPeriod: lmp 
      }),
      
      getCurrentWeek: () => {
        const { lastMenstrualPeriod } = get();
        if (!lastMenstrualPeriod) return 0;
        const diff = Date.now() - new Date(lastMenstrualPeriod).getTime();
        return Math.floor(diff / (7 * 86400000));
      },
      
      getTrimester: () => {
        const week = get().getCurrentWeek();
        if (week <= 12) return 1;
        if (week <= 26) return 2;
        return 3;
      },
      
      addAppointment: (apt) => set((s) => ({
        appointments: [...s.appointments, { ...apt, id: Date.now() }]
      })),
      
      addWeeklyNote: (note) => set((s) => ({
        weeklyNotes: [...s.weeklyNotes, { ...note, date: new Date().toISOString() }]
      })),
    }),
    { name: 'healthgenie-pregnancy', storage: createJSONStorage(() => secureStorage) }
  )
);

// ━━━ EMERGENCY STORE ━━━
export const useEmergencyStore = create(
  persist(
    (set) => ({
      contacts: [
        { id: 1, name: 'Emergency Services', phone: '108', type: 'emergency', isPrimary: true },
      ],
      sosActive: false,
      
      addContact: (contact) => set((s) => ({
        contacts: [...s.contacts, { ...contact, id: Date.now() }]
      })),
      removeContact: (id) => set((s) => ({
        contacts: s.contacts.filter(c => c.id !== id)
      })),
      updateContact: (id, data) => set((s) => ({
        contacts: s.contacts.map(c => c.id === id ? { ...c, ...data } : c)
      })),
      activateSOS: () => set({ sosActive: true }),
      deactivateSOS: () => set({ sosActive: false }),
    }),
    { name: 'healthgenie-emergency', storage: createJSONStorage(() => secureStorage) }
  )
);

// ━━━ NOTIFICATION STORE ━━━
export const useNotificationStore = create(
  persist(
    (set) => ({
      preferences: {
        waterReminder: true,
        exerciseReminder: true,
        mealReminder: true,
        medicationReminder: false,
        periodReminder: true,
        appointmentReminder: true,
        dailySummary: true,
      },
      notifications: [],
      
      togglePreference: (key) => set((s) => ({
        preferences: { ...s.preferences, [key]: !s.preferences[key] }
      })),
      addNotification: (notification) => set((s) => ({
        notifications: [{ ...notification, id: Date.now(), read: false, time: new Date().toISOString() }, ...s.notifications.slice(0, 49)]
      })),
      markRead: (id) => set((s) => ({
        notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      markAllRead: () => set((s) => ({
        notifications: s.notifications.map(n => ({ ...n, read: true }))
      })),
      unreadCount: () => 0, // Computed in components
    }),
    { name: 'healthgenie-notifications', storage: createJSONStorage(() => secureStorage) }
  )
);

// ━━━ CHAT STORE ━━━
export const useChatStore = create(
  persist(
    (set) => ({
      messages: [],
      isStreaming: false,
      isOpen: false,
      
      addMessage: (msg) => set((s) => ({
        messages: [...s.messages, { ...msg, id: Date.now(), timestamp: new Date().toISOString() }]
      })),
      updateLastBotMessage: (content) => set((s) => {
        const msgs = [...s.messages];
        for (let i = msgs.length - 1; i >= 0; i--) {
          if (msgs[i].role === 'assistant') {
            msgs[i] = { ...msgs[i], content };
            break;
          }
        }
        return { messages: msgs };
      }),
      setStreaming: (val) => set({ isStreaming: val }),
      toggleChat: () => set((s) => ({ isOpen: !s.isOpen })),
      openChat: () => set({ isOpen: true }),
      closeChat: () => set({ isOpen: false }),
      clearHistory: () => set({ messages: [] }),
    }),
    { name: 'healthgenie-chat', storage: createJSONStorage(() => secureStorage) }
  )
);

// ━━━ SYMPTOM STORE ━━━
export const useSymptomStore = create(
  (set) => ({
    selectedBodyParts: [],
    selectedSymptoms: [],
    duration: '',
    severity: 5,
    frequency: 'occasional',
    additionalNotes: '',
    analysisResult: null,
    isAnalyzing: false,
    
    addBodyPart: (part) => set((s) => ({
      selectedBodyParts: s.selectedBodyParts.includes(part) 
        ? s.selectedBodyParts.filter(p => p !== part)
        : [...s.selectedBodyParts, part]
    })),
    addSymptom: (symptom) => set((s) => ({
      selectedSymptoms: s.selectedSymptoms.includes(symptom)
        ? s.selectedSymptoms.filter(sy => sy !== symptom)
        : [...s.selectedSymptoms, symptom]
    })),
    setDuration: (d) => set({ duration: d }),
    setSeverity: (s) => set({ severity: s }),
    setFrequency: (f) => set({ frequency: f }),
    setAdditionalNotes: (n) => set({ additionalNotes: n }),
    setAnalysisResult: (r) => set({ analysisResult: r }),
    setIsAnalyzing: (v) => set({ isAnalyzing: v }),
    reset: () => set({
      selectedBodyParts: [],
      selectedSymptoms: [],
      duration: '',
      severity: 5,
      frequency: 'occasional',
      additionalNotes: '',
      analysisResult: null,
      isAnalyzing: false,
    }),
  })
);

// ━━━ EXERCISE STORE ━━━
export const useExerciseStore = create(
  persist(
    (set) => ({
      workoutPlan: null,
      exerciseLog: [],
      favoriteExercises: [],
      
      setWorkoutPlan: (plan) => set({ workoutPlan: plan }),
      logExercise: (entry) => set((s) => ({
        exerciseLog: [...s.exerciseLog, { ...entry, date: new Date().toISOString() }]
      })),
      toggleFavorite: (exercise) => set((s) => ({
        favoriteExercises: s.favoriteExercises.includes(exercise)
          ? s.favoriteExercises.filter(e => e !== exercise)
          : [...s.favoriteExercises, exercise]
      })),
    }),
    { name: 'healthgenie-exercise', storage: createJSONStorage(() => secureStorage) }
  )
);

// ━━━ STREAKS STORE ━━━
export const useStreakStore = create(
  persist(
    (set, get) => ({
      currentStreak: 3,
      longestStreak: 12,
      lastActiveDate: new Date().toISOString().split('T')[0],
      activityMap: {},
      
      recordActivity: (type = 'general') => {
        const today = new Date().toISOString().split('T')[0];
        const { lastActiveDate, currentStreak } = get();
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        const newStreak = lastActiveDate === yesterday ? currentStreak + 1 :
                         lastActiveDate === today ? currentStreak : 1;
        
        set((s) => ({
          currentStreak: newStreak,
          longestStreak: Math.max(s.longestStreak, newStreak),
          lastActiveDate: today,
          activityMap: {
            ...s.activityMap,
            [today]: (s.activityMap[today] || 0) + 1
          }
        }));
      },
    }),
    { name: 'healthgenie-streaks', storage: createJSONStorage(() => secureStorage) }
  )
);
