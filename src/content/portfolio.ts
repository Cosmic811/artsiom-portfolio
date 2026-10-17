import type { Language } from "./i18n";
export interface Project {
  id: string;
  title: string;
  category: Record<Language, string>;
  stack: string[];
  description: Record<Language, string>;
  highlights: Record<Language, string[]>;
  repo: string;
  live?: string;
}
export const contact = {
  github: "https://github.com/Cosmic811",
  linkedin: "https://www.linkedin.com/in/g1stav/",
  email: "",
  telegram: "",
  resume: "",
};
export const projects: Project[] = [
  {
    id: "arka",
    title: "ARKA 123",
    category: { en: "Creative development", ru: "Креативная разработка" },
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GSAP", "WebGL"],
    repo: "https://github.com/Cosmic811/arka-123",
    live: "https://cosmic811.github.io/arka-123/",
    description: {
      en: "An architectural editorial experience for a fictional event space. Cinematic scrolling, a depth-based room scene and a responsive visual identity.",
      ru: "Архитектурный сайт для вымышленного пространства: анимация при прокрутке, сцена с картой глубины и адаптивный визуальный стиль.",
    },
    highlights: {
      en: [
        "Custom WebGL renderer with a restrained 2.5D depth effect.",
        "GSAP scroll scenes with static fallbacks and a keyboard-accessible gallery.",
        "A concept brand and demo form; no real booking or form delivery.",
      ],
      ru: [
        "Собственный WebGL-рендерер с аккуратным эффектом глубины 2.5D.",
        "Сцены GSAP со статичным запасным вариантом и доступной с клавиатуры галереей.",
        "Концептуальный бренд и демоформа без реального бронирования и отправки.",
      ],
    },
  },
  {
    id: "knowledge",
    title: "Knowledge AI",
    category: { en: "AI product · Full stack", ru: "ИИ-продукт · Полный стек" },
    stack: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "pgvector",
      "Mistral AI",
    ],
    repo: "https://github.com/Cosmic811/paralect-chatbot-builder",
    live: "https://paralect-chatbot-builder.onrender.com",
    description: {
      en: "A document-grounded chatbot builder. Upload knowledge, configure an assistant and embed a public chat widget on a website.",
      ru: "Конструктор чат-ботов на основе документов. Загрузка базы знаний, настройка ассистента и встраиваемый виджет для сайта.",
    },
    highlights: {
      en: [
        "Supabase authentication, private document storage and vector retrieval.",
        "Contextual conversations with source names and restored history.",
        "Owner-scoped bots and signed visitor sessions. Billing is explicitly simulated; no real payments.",
      ],
      ru: [
        "Авторизация Supabase, приватное хранение документов и векторный поиск.",
        "Диалоги с контекстом, названиями источников и восстановлением истории.",
        "Изоляция ботов и подписанные сессии посетителей. Оплата имитируется, реальных платежей нет.",
      ],
    },
  },
  {
    id: "canvas",
    title: "Canvas Web",
    category: { en: "Interactive application", ru: "Интерактивное приложение" },
    stack: ["React", "TypeScript", "React Flow", "Vite", "REST API"],
    repo: "https://github.com/Cosmic811/frontend-canvas-challenge",
    description: {
      en: "A node-based editor that connects prompts, generators and results. Built around reliable persistence and asynchronous workflows.",
      ru: "Узловой редактор, связывающий запросы, генераторы и результаты. Надёжное сохранение и управление асинхронными процессами.",
    },
    highlights: {
      en: [
        "Debounced sequential saves with ETags and explicit conflict recovery.",
        "Idempotent generation requests, abortable polling and stale-result protection.",
        "Restores the saved graph and in-progress generation after refresh. Uses the provided local API.",
      ],
      ru: [
        "Последовательное сохранение с задержкой, ETag и восстановлением после конфликтов.",
        "Идемпотентные запросы, отменяемый опрос и защита от устаревших результатов.",
        "Восстановление графа и генерации после перезагрузки. Используется локальный API задания.",
      ],
    },
  },
  {
    id: "checkout",
    title: "Frontend Checkout",
    category: { en: "Commerce interface", ru: "Интерфейс магазина" },
    stack: ["React", "TypeScript", "REST API"],
    repo: "https://github.com/Cosmic811/frontend-checkout-challenge",
    description: {
      en: "A commerce frontend built against a supplied test API, with product browsing, a cart and an order flow.",
      ru: "Фронтенд магазина на готовом тестовом API: каталог товаров, корзина и оформление заказа.",
    },
    highlights: {
      en: [
        "A frontend implementation in the repository’s apps/web workspace.",
        "Designed for the challenge’s simulated commerce environment, not live payments.",
      ],
      ru: [
        "Фронтенд реализован в рабочем пространстве apps/web репозитория.",
        "Тестовая торговая среда задания, без реальных платежей.",
      ],
    },
  },
  {
    id: "analytics",
    title: "Blogger Analytics",
    category: { en: "Data & integrations", ru: "Данные и интеграции" },
    stack: ["Next.js", "TypeScript", "Supabase", "Apify API"],
    repo: "https://github.com/Cosmic811/blogger-dashboard",
    live: "https://candid-kheer-9ec93e.netlify.app/",
    description: {
      en: "A dashboard for exploring creator content and performance. Connects content collection with persistent analytics and individual creator views.",
      ru: "Панель для анализа контента авторов: сбор статистики, хранение данных и отдельные страницы авторов.",
    },
    highlights: {
      en: [
        "Collects reel and post views, likes and comments through Apify.",
        "Persists creators and videos in Supabase PostgreSQL.",
        "Includes loading and error states; the Apify token remains server-side.",
      ],
      ru: [
        "Сбор просмотров, лайков и комментариев публикаций через Apify.",
        "Хранение авторов и видео в Supabase PostgreSQL.",
        "Состояния загрузки и ошибок; токен Apify остаётся на сервере.",
      ],
    },
  },
];
export const skillGroups = [
  [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "HTML",
    "CSS",
    "Tailwind CSS",
  ],
  [
    "Node.js",
    "NestJS",
    "REST APIs",
    "GraphQL",
    "PostgreSQL",
    "Prisma",
    "Supabase",
  ],
  ["Git", "GitHub", "Docker", "Vite", "CI/CD"],
] as const;
