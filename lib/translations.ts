import { Language, UserRole } from '../types';

type TranslationSet = {
    // Header
    aiResponderPro: string;
    hide: string;
    show: string;
    conversations: string;
    newChat: string;

    // Profile Form
    yourProfile: string;
    yourProfileDesc: string;
    yourName: string;
    yourNamePlaceholder: string;
    iAmA: string;
    language: string;
    freelancer: string;
    student: string;
    businessOwner: string;
    portfolioWebsite: string;
    portfolioWebsitePlaceholder: (role: UserRole) => string;

    // Role-specific labels and placeholders
    labels: (role: UserRole) => { skills: string; experience: string; };
    placeholders: (role: UserRole) => { skills: string; experience: string; };

    // Conversation List
    noMessagesYet: string;
    
    // Response Generator
    clientMessage: string;
    clientMessagePlaceholder: string;
    voiceInputNotSupported: string;
    voiceInputError: (error: string) => string;
    microphoneAccessDenied: string;
    promptLibraryFor: (role: UserRole) => string;
    tone: string;
    style: string;
    mode: string;
    fast: string;
    balanced: string;
    thinking: string;
    searchTheWeb: string;
    generateResponse: string;
    generating: string;
    retry: string;
    generatedResponseTitle: string;
    edit: string;
    copy: string;
    copied: string;
    save: string;
    cancel: string;
    responseHistory: string;
    clear: string;
    client: string;
    reply: string;
    you: string;
    searchResults: string;
    
    // Quick Prompts by Role
    promptLibrary: Record<UserRole, { title: string, prompt: string }[]>;
};

export const translations: Record<Language, TranslationSet> = {
    'English': {
        aiResponderPro: 'AI Responder Pro',
        hide: 'Hide',
        show: 'Show',
        conversations: 'Conversations',
        newChat: 'New Chat',
        yourProfile: 'Your Profile',
        yourProfileDesc: 'Personalize the AI by providing your details to craft responses in your voice.',
        yourName: 'Your Name',
        yourNamePlaceholder: 'e.g., Jane Doe',
        iAmA: 'I am a...',
        language: 'Language',
        freelancer: 'Freelancer',
        student: 'Student',
        businessOwner: 'Business Owner',
        portfolioWebsite: 'Portfolio / Website',
        portfolioWebsitePlaceholder: (role) => {
            switch (role) {
                case 'Student': return 'e.g., GitHub, academic profile page';
                case 'Business Owner': return 'e.g., https://your-company.com';
                default: return 'e.g., https://your-portfolio.com';
            }
        },
        labels: (role) => {
            switch(role) {
                case 'Student': return { skills: 'Areas of Study / Key Skills', experience: 'Projects & Coursework Summary' };
                case 'Business Owner': return { skills: 'Business Specialization', experience: 'Company Summary' };
                default: return { skills: 'Key Skills', experience: 'Experience Summary' };
            }
        },
        placeholders: (role) => {
            switch (role) {
                case 'Student': return { skills: 'e.g., Python, Data Analysis, Research', experience: 'e.g., Course projects, internships, thesis work...' };
                case 'Business Owner': return { skills: 'e.g., SaaS, E-commerce, Digital Marketing', experience: 'e.g., Our company mission, years in business...' };
                default: return { skills: 'e.g., React, Next.js, Figma', experience: 'Briefly describe your expertise...' };
            }
        },
        noMessagesYet: 'No messages yet',
        clientMessage: "Client's Message",
        clientMessagePlaceholder: "Paste the client's inquiry here, or use the microphone to dictate...",
        voiceInputNotSupported: "Voice input is not supported in this browser.",
        voiceInputError: (error: string) => `Voice input error: ${error}. Please check microphone permissions.`,
        microphoneAccessDenied: "Microphone access was denied. Please enable it in your browser settings.",
        promptLibraryFor: (role) => `Prompt Library for a ${role}`,
        tone: 'Tone',
        style: 'Style',
        mode: 'Mode',
        fast: 'Fast',
        balanced: 'Balanced',
        thinking: 'Thinking',
        searchTheWeb: 'Search the web for up-to-date info',
        generateResponse: 'Generate Response',
        generating: 'Generating...',
        retry: 'Retry',
        generatedResponseTitle: 'Generated Response',
        edit: 'Edit',
        copy: 'Copy',
        copied: 'Copied!',
        save: 'Save',
        cancel: 'Cancel',
        responseHistory: 'Response History',
        clear: 'Clear',
        client: 'Client:',
        reply: 'Reply',
        you: 'You:',
        searchResults: 'Sources',
        promptLibrary: {
            'Freelancer': [
                { title: "Project Inquiry", prompt: "A potential client is asking about my availability and rates for a new web development project." },
                { title: "Bug Report", prompt: "A client has found a bug in the application and needs it fixed urgently." },
                { title: "Follow-up", prompt: "I need to follow up with a client who hasn't responded to my last proposal." },
            ],
            'Student': [
                { title: "Professor Email", prompt: "I need to email my professor to request an extension for an upcoming assignment." },
                { title: "Group Project", prompt: "I'm writing a message to my group to schedule a meeting to discuss our project." },
                { title: "Clarification Request", prompt: "I want to ask my TA for clarification on a concept from the last lecture." },
            ],
            'Business Owner': [
                { title: "Customer Complaint", prompt: "A customer is unhappy with their recent purchase and has left a negative review." },
                { title: "Partnership Proposal", prompt: "I'm reaching out to a potential partner to propose a collaboration." },
                { title: "Marketing Email", prompt: "Draft a marketing email announcing our new seasonal product line to our subscribers." },
            ]
        }
    },
    'Spanish': {
        aiResponderPro: 'Asistente de Respuestas IA',
        hide: 'Ocultar',
        show: 'Mostrar',
        conversations: 'Conversaciones',
        newChat: 'Nuevo Chat',
        yourProfile: 'Tu Perfil',
        yourProfileDesc: 'Personaliza la IA con tus datos para crear respuestas con tu propia voz.',
        yourName: 'Tu Nombre',
        yourNamePlaceholder: 'p.ej., Sofía Garcia',
        iAmA: 'Soy un/a...',
        language: 'Idioma',
        freelancer: 'Freelancer',
        student: 'Estudiante',
        businessOwner: 'Dueño/a de Negocio',
        portfolioWebsite: 'Portafolio / Sitio Web',
        portfolioWebsitePlaceholder: (role) => {
            switch (role) {
                case 'Student': return 'p.ej., GitHub, página de perfil académico';
                case 'Business Owner': return 'p.ej., https://tu-empresa.com';
                default: return 'p.ej., https://tu-portafolio.com';
            }
        },
        labels: (role) => {
            switch(role) {
                case 'Student': return { skills: 'Áreas de Estudio / Habilidades Clave', experience: 'Resumen de Proyectos y Cursos' };
                case 'Business Owner': return { skills: 'Especialización del Negocio', experience: 'Resumen de la Empresa' };
                default: return { skills: 'Habilidades Clave', experience: 'Resumen de Experiencia' };
            }
        },
        placeholders: (role) => {
            switch (role) {
                case 'Student': return { skills: 'p.ej., Python, Análisis de Datos, Investigación', experience: 'p.ej., Proyectos de curso, pasantías, tesis...' };
                case 'Business Owner': return { skills: 'p.ej., SaaS, E-commerce, Marketing Digital', experience: 'p.ej., La misión de nuestra empresa, años en el mercado...' };
                default: return { skills: 'p.ej., React, Next.js, Figma', experience: 'Describe brevemente tu especialidad...' };
            }
        },
        noMessagesYet: 'Aún no hay mensajes',
        clientMessage: "Mensaje del Cliente",
        clientMessagePlaceholder: "Pega la consulta del cliente aquí, o usa el micrófono para dictar...",
        voiceInputNotSupported: "La entrada de voz no es compatible con este navegador.",
        voiceInputError: (error: string) => `Error de entrada de voz: ${error}. Revisa los permisos del micrófono.`,
        microphoneAccessDenied: "Se denegó el acceso al micrófono. Habilítalo en la configuración de tu navegador.",
        promptLibraryFor: (role) => `Biblioteca de Ideas para un/a ${role}`,
        tone: 'Tono',
        style: 'Estilo',
        mode: 'Modo',
        fast: 'Rápido',
        balanced: 'Equilibrado',
        thinking: 'Pensamiento',
        searchTheWeb: 'Buscar en la web para información actualizada',
        generateResponse: 'Generar Respuesta',
        generating: 'Generando...',
        retry: 'Reintentar',
        generatedResponseTitle: 'Respuesta Generada',
        edit: 'Editar',
        copy: 'Copiar',
        copied: '¡Copiado!',
        save: 'Guardar',
        cancel: 'Cancelar',
        responseHistory: 'Historial de Respuestas',
        clear: 'Limpiar',
        client: 'Cliente:',
        reply: 'Responder',
        you: 'Tú:',
        searchResults: 'Fuentes',
        promptLibrary: {
            'Freelancer': [
                { title: "Consulta de Proyecto", prompt: "Un cliente potencial pregunta sobre mi disponibilidad y tarifas para un nuevo proyecto de desarrollo web." },
                { title: "Reporte de Error", prompt: "Un cliente ha encontrado un error en la aplicación y necesita que se arregle urgentemente." },
                { title: "Seguimiento", prompt: "Necesito hacer un seguimiento a un cliente que no ha respondido a mi última propuesta." },
            ],
            'Student': [
                { title: "Email a Profesor", prompt: "Necesito enviar un email a mi profesor para solicitar una prórroga en una tarea." },
                { title: "Proyecto en Grupo", prompt: "Estoy escribiendo un mensaje a mi grupo para programar una reunión y discutir nuestro proyecto." },
                { title: "Solicitud de Aclaración", prompt: "Quiero pedirle a mi asistente de cátedra que aclare un concepto de la última clase." },
            ],
            'Business Owner': [
                { title: "Queja de Cliente", prompt: "Un cliente no está satisfecho con su compra reciente y ha dejado una reseña negativa." },
                { title: "Propuesta de Asociación", prompt: "Me estoy comunicando con un socio potencial para proponer una colaboración." },
                { title: "Email de Marketing", prompt: "Redactar un email de marketing anunciando nuestra nueva línea de productos de temporada a nuestros suscriptores." },
            ]
        }
    },
    'French': {
        aiResponderPro: 'Pro Répondeur IA',
        hide: 'Masquer',
        show: 'Afficher',
        conversations: 'Conversations',
        newChat: 'Nouveau Chat',
        yourProfile: 'Votre Profil',
        yourProfileDesc: 'Personnalisez l\'IA en fournissant vos informations pour créer des réponses avec votre voix.',
        yourName: 'Votre Nom',
        yourNamePlaceholder: 'ex: Jeanne Dupont',
        iAmA: 'Je suis un(e)...',
        language: 'Langue',
        freelancer: 'Freelance',
        student: 'Étudiant(e)',
        businessOwner: 'Chef d\'entreprise',
        portfolioWebsite: 'Portfolio / Site Web',
        portfolioWebsitePlaceholder: (role) => {
            switch (role) {
                case 'Student': return 'ex: GitHub, page de profil académique';
                case 'Business Owner': return 'ex: https://votre-entreprise.com';
                default: return 'ex: https://votre-portfolio.com';
            }
        },
        labels: (role) => {
            switch(role) {
                case 'Student': return { skills: 'Domaines d\'Études / Compétences Clés', experience: 'Résumé des Projets et Cours' };
                case 'Business Owner': return { skills: 'Spécialisation de l\'Entreprise', experience: 'Résumé de l\'Entreprise' };
                default: return { skills: 'Compétences Clés', experience: 'Résumé de l\'Expérience' };
            }
        },
        placeholders: (role) => {
            switch (role) {
                case 'Student': return { skills: 'ex: Python, Analyse de Données, Recherche', experience: 'ex: Projets de cours, stages, thèse...' };
                case 'Business Owner': return { skills: 'ex: SaaS, E-commerce, Marketing Numérique', experience: 'ex: La mission de notre entreprise, années d\'existence...' };
                default: return { skills: 'ex: React, Next.js, Figma', experience: 'Décrivez brièvement votre expertise...' };
            }
        },
        noMessagesYet: 'Aucun message pour le moment',
        clientMessage: "Message du Client",
        clientMessagePlaceholder: "Collez la demande du client ici, ou utilisez le microphone pour dicter...",
        voiceInputNotSupported: "L'entrée vocale n'est pas prise en charge par ce navigateur.",
        voiceInputError: (error: string) => `Erreur de saisie vocale : ${error}. Veuillez vérifier les autorisations du microphone.`,
        microphoneAccessDenied: "L'accès au microphone a été refusé. Veuillez l'activer dans les paramètres de votre navigateur.",
        promptLibraryFor: (role) => `Bibliothèque d'idées pour un(e) ${role}`,
        tone: 'Ton',
        style: 'Style',
        mode: 'Mode',
        fast: 'Rapide',
        balanced: 'Équilibré',
        thinking: 'Réflexion',
        searchTheWeb: 'Rechercher sur le web pour des informations à jour',
        generateResponse: 'Générer une Réponse',
        generating: 'Génération...',
        retry: 'Réessayer',
        generatedResponseTitle: 'Réponse Générée',
        edit: 'Modifier',
        copy: 'Copier',
        copied: 'Copié !',
        save: 'Enregistrer',
        cancel: 'Annuler',
        responseHistory: 'Historique des Réponses',
        clear: 'Effacer',
        client: 'Client :',
        reply: 'Répondre',
        you: 'Vous :',
        searchResults: 'Sources',
        promptLibrary: {
            'Freelancer': [
                { title: "Demande de Projet", prompt: "Un client potentiel s'interroge sur ma disponibilité et mes tarifs pour un nouveau projet de développement web." },
                { title: "Rapport de Bogue", prompt: "Un client a trouvé un bogue dans l'application et a besoin qu'il soit corrigé de toute urgence." },
                { title: "Relance", prompt: "Je dois relancer un client qui n'a pas répondu à ma dernière proposition." },
            ],
            'Student': [
                { title: "Email au Professeur", prompt: "Je dois envoyer un email à mon professeur pour demander un délai supplémentaire pour un devoir." },
                { title: "Projet de Groupe", prompt: "J'écris un message à mon groupe pour planifier une réunion afin de discuter de notre projet." },
                { title: "Demande de Clarification", prompt: "Je veux demander à mon assistant de cours des éclaircissements sur un concept de la dernière conférence." },
            ],
            'Business Owner': [
                { title: "Plainte de Client", prompt: "Un client est mécontent de son récent achat et a laissé un avis négatif." },
                { title: "Proposition de Partenariat", prompt: "Je contacte un partenaire potentiel pour proposer une collaboration." },
                { title: "Email Marketing", prompt: "Rédiger un email marketing annonçant notre nouvelle gamme de produits saisonniers à nos abonnés." },
            ]
        }
    },
    'Japanese': {
        aiResponderPro: 'AIレスポンダーPro',
        hide: '非表示',
        show: '表示',
        conversations: '会話',
        newChat: '新規チャット',
        yourProfile: 'あなたのプロフィール',
        yourProfileDesc: 'あなたの詳細情報を提供してAIをパーソナライズし、あなた自身の声で応答を作成します。',
        yourName: 'あなたの名前',
        yourNamePlaceholder: '例：山田 花子',
        iAmA: '私は...',
        language: '言語',
        freelancer: 'フリーランサー',
        student: '学生',
        businessOwner: 'ビジネスオーナー',
        portfolioWebsite: 'ポートフォリオ/ウェブサイト',
        portfolioWebsitePlaceholder: (role) => {
            switch (role) {
                case 'Student': return '例：GitHub、学術プロフィールページ';
                case 'Business Owner': return '例：https://あなたの会社.com';
                default: return '例：https://あなたのポートフォリオ.com';
            }
        },
        labels: (role) => {
            switch(role) {
                case 'Student': return { skills: '研究分野/主要スキル', experience: 'プロジェクト＆課題の概要' };
                case 'Business Owner': return { skills: '事業の専門分野', experience: '会社概要' };
                default: return { skills: '主要スキル', experience: '経験の概要' };
            }
        },
        placeholders: (role) => {
            switch (role) {
                case 'Student': return { skills: '例：Python、データ分析、研究', experience: '例：授業のプロジェクト、インターンシップ、論文...' };
                case 'Business Owner': return { skills: '例：SaaS、Eコマース、デジタルマーケティング', experience: '例：当社の使命、事業年数...' };
                default: return { skills: '例：React、Next.js、Figma', experience: 'あなたの専門知識を簡潔に説明してください...' };
            }
        },
        noMessagesYet: 'まだメッセージはありません',
        clientMessage: "クライアントのメッセージ",
        clientMessagePlaceholder: "ここにクライアントからの問い合わせを貼り付けるか、マイクを使って音声入力してください...",
        voiceInputNotSupported: "このブラウザは音声入力に対応していません。",
        voiceInputError: (error: string) => `音声入力エラー：${error}。マイクの許可を確認してください。`,
        microphoneAccessDenied: "マイクへのアクセスが拒否されました。ブラウザの設定で有効にしてください。",
        promptLibraryFor: (role) => `${role}のためのプロンプトライブラリ`,
        tone: 'トーン',
        style: 'スタイル',
        mode: 'モード',
        fast: '高速',
        balanced: 'バランス',
        thinking: '思考',
        searchTheWeb: 'ウェブで最新情報を検索',
        generateResponse: '返信を生成',
        generating: '生成中...',
        retry: '再試行',
        generatedResponseTitle: '生成された返信',
        edit: '編集',
        copy: 'コピー',
        copied: 'コピーしました！',
        save: '保存',
        cancel: 'キャンセル',
        responseHistory: '返信履歴',
        clear: 'クリア',
        client: 'クライアント:',
        reply: '返信',
        you: 'あなた:',
        searchResults: 'ソース',
        promptLibrary: {
            'Freelancer': [
                { title: "プロジェクトの問い合わせ", prompt: "潜在的なクライアントから、新しいウェブ開発プロジェクトの空き状況と料金について問い合わせがありました。" },
                { title: "バグ報告", prompt: "クライアントがアプリケーションでバグを発見し、緊急の修正を求めています。" },
                { title: "フォローアップ", prompt: "前回の提案に返信がないクライアントにフォローアップする必要があります。" },
            ],
            'Student': [
                { title: "教授へのメール", prompt: "今後の課題の延長を依頼するために、教授にメールを送る必要があります。" },
                { title: "グループプロジェクト", prompt: "プロジェクトについて話し合うための会議を計画するために、グループにメッセージを書いています。" },
                { title: "質問", prompt: "前回の講義の概念について、TAに明確な説明を求めたいです。" },
            ],
            'Business Owner': [
                { title: "顧客の苦情", prompt: "最近の購入に不満を持っている顧客が、否定的なレビューを残しました。" },
                { title: "提携提案", prompt: "協力関係を提案するために、潜在的なパートナーに連絡を取っています。" },
                { title: "マーケティングメール", prompt: "新しい季節限定商品ラインを購読者に知らせるマーケティングメールを作成します。" },
            ]
        }
    }
};