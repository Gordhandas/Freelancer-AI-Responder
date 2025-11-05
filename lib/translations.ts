
import { Language, UserRole, ModelId } from '../types';

export type TranslationSet = {
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
    changeApiKey: string;


    // Role-specific labels and placeholders
    labels: (role: UserRole) => { skills: string; experience: string; };
    placeholders: (role: UserRole) => { skills: string; experience: string; };

    // Conversation List
    noMessagesYet: string;
    importConversations: string;
    exportConversations: string;
    share: string;
    linkCopied: string;

    // Response Generator
    clientMessage: string;
    clientMessagePlaceholder: string;
    voiceInputNotSupported: string;
    voiceInputError: (error: string) => string;
    microphoneAccessDenied: string;
    promptLibraryFor: (role: UserRole) => string;
    tone: string;
    style: string;
    model: string;
    models: {
        flashLite: { name: string; description: string; };
        flash: { name: string; description: string; };
        pro: { name: string; description: string; };
    };
    searchTheWeb: string;
    autoDetectLanguage: string;
    generateResponse: string;
    generating: string;
    generatingMessages: string[];
    retry: string;
    generatedResponseTitle: string;
    edit: string;
    copy: string;
    copied: string;
    save: string;
    cancel: string;
    responseHistory: string;
    clear: string;
    copyConversation: string;
    client: string;
    reply: string;
    you: string;
    searchResults: string;

    // API Key Input
    saveAndContinue: string;
    
    // Quick Prompts by Role
    promptLibrary: Record<UserRole, { title: string, prompt: string }[]>;

    // Error Messages
    errors: {
        invalidApiKey: string;
        rateLimit: string;
        clientRateLimit: (seconds: number) => string;
        badRequest: string;
        serverError: string;
        networkError: string;
        unknownError: (errorMessage: string) => string;
    };

    // Tooltips
    tooltips: {
        // Header
        toggleSidebarShow: string;
        toggleSidebarHide: string;
        newConversation: string;
        toggleLightMode: string;
        toggleDarkMode: string;

        // Profile Form
        name: string;
        role: string;
        language: string;
        skills: (role: UserRole) => string;
        portfolio: (role: UserRole) => string;
        experience: (role: UserRole) => string;
        changeApiKey: string;

        // Response Generator
        clientMessage: string;
        voiceInputStart: string;
        voiceInputStop: string;
        voiceInputNotSupported: string;
        toggleWebSearch: string;
        toggleLanguageDetection: string;
        quickPrompt: (prompt: string) => string;
        model: string;
        tone: string;
        style: string;
        generateResponse: string;
        retry: string;
        editResponse: string;
        copyResponse: string;
        saveChanges: string;
        cancelChanges: string;
        toggleHistory: string;
        clearHistory: string;
        copyConversation: string;
        replyToMessage: string;
        goodResponse: string;
        badResponse: string;
        
        // Conversation List
        selectConversation: string;
        renameConversation: string;
        importConversations: string;
        exportConversations: string;
        shareConversation: string;

        // API Key Input
        apiKey: string;
        saveApiKey: string;
        getApiKey: string;
    }
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
        changeApiKey: 'Change API Key',
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
        importConversations: 'Import',
        exportConversations: 'Export',
        share: 'Share',
        linkCopied: 'Link Copied!',
        clientMessage: "Client's Message",
        clientMessagePlaceholder: "Paste the client's inquiry here, or use the microphone to dictate...",
        voiceInputNotSupported: "Voice input is not supported in this browser.",
        voiceInputError: (error: string) => `Voice input error: ${error}. Please check microphone permissions.`,
        microphoneAccessDenied: "Microphone access was denied. Please enable it in your browser settings.",
        promptLibraryFor: (role) => `Prompt Library for a ${role}`,
        tone: 'Tone',
        style: 'Style',
        model: 'Model',
        models: {
            flashLite: { name: 'Gemini Flash Lite', description: 'Optimized for speed and efficiency in high-frequency tasks.' },
            flash: { name: 'Gemini 2.5 Flash', description: 'A great balance of speed, quality, and cost for most tasks.' },
            pro: { name: 'Gemini 2.5 Pro', description: 'For complex reasoning, coding, and creative generation.' },
        },
        searchTheWeb: 'Search the web for up-to-date info',
        autoDetectLanguage: 'Auto-detect response language',
        generateResponse: 'Generate Response',
        generating: 'Generating...',
        generatingMessages: [
            'Analyzing your request...',
            'Consulting the knowledge base...',
            'Crafting a thoughtful response...',
            'Polishing the final draft...',
            'Just a moment longer...',
        ],
        retry: 'Retry',
        generatedResponseTitle: 'Generated Response',
        edit: 'Edit',
        copy: 'Copy',
        copied: 'Copied!',
        save: 'Save',
        cancel: 'Cancel',
        responseHistory: 'Response History',
        clear: 'Clear',
        copyConversation: 'Copy',
        client: 'Client:',
        reply: 'Reply',
        you: 'You:',
        searchResults: 'Sources',
        saveAndContinue: 'Save and Continue',
        promptLibrary: {
            'Freelancer': [
                { title: "Project Inquiry", prompt: "A potential client is asking about my availability and rates for a new web development project." },
                { title: "Quote Request", prompt: "A client gave a vague project description and wants a price. I need to ask clarifying questions before providing a quote." },
                { title: "Handle Scope Creep", prompt: "A client is asking for more work than was agreed upon. I need to politely address this and suggest a contract amendment." },
                { title: "Suggest Improvement", prompt: "I've identified a way to improve the client's project. I want to propose this idea, explaining its benefits." },
                { title: "Weekly Progress Update", prompt: "It's time for a weekly progress report. Summarize completed tasks, next steps, and any blockers." },
                { title: "Project Handover", prompt: "The project is complete. I need to send a final email with deliverables and ask for a testimonial." },
            ],
            'Student': [
                { title: "Request Extension", prompt: "I need to email my professor to respectfully request an extension for an upcoming assignment due to unforeseen circumstances." },
                { title: "Ask for Clarification", prompt: "I want to ask my TA for clarification on a concept from the last lecture that I'm struggling with." },
                { title: "Recommendation Letter", prompt: "I need to ask a professor for a strong letter of recommendation for a graduate school application." },
                { title: "Networking Outreach", prompt: "I'm reaching out to an alum in my field to ask for a brief informational interview about their career path." },
                { title: "Form a Study Group", prompt: "I want to post a message to my classmates to see who is interested in forming a study group for the final exam." },
                { title: "Grade Inquiry", prompt: "I have a question about my grade on the recent exam and would like to respectfully inquire about it with the professor." },
            ],
            'Business Owner': [
                { title: "Handle Negative Review", prompt: "A customer left a negative review online. I need to draft a professional public response that addresses their concerns." },
                { title: "Partnership Proposal", prompt: "I'm reaching out to a potential partner to propose a collaboration that would be mutually beneficial." },
                { title: "Polite Invoice Reminder", prompt: "A client's invoice is past due. I need to send a polite reminder to follow up on the payment." },
                { title: "Job Applicant Rejection", prompt: "We've chosen another candidate for a role. I need to send a polite and encouraging rejection email to an applicant." },
                { title: "Internal Announcement", prompt: "I need to announce a new company-wide policy to all employees in a clear and positive way." },
                { title: "Vendor Inquiry", prompt: "I need to contact a potential new vendor to inquire about their services, capabilities, and pricing structure." },
            ]
        },
        errors: {
            invalidApiKey: "API Key Not Valid. Your API key appears to be invalid or has expired. Please enter a valid key to continue.",
            rateLimit: "Rate Limit Exceeded. You have made too many requests in a short period. Please wait a moment and try again.",
            clientRateLimit: (seconds: number) => `You are making requests too quickly. Please wait ${seconds} second${seconds !== 1 ? 's' : ''} before trying again.`,
            badRequest: "Invalid Request. The request sent to the AI was invalid. This can sometimes be caused by the content of the prompt. Please try rephrasing your message.",
            serverError: "Server Error. The AI service is currently experiencing issues on its end. Please try again in a few minutes.",
            networkError: "Network Error. Could not connect to the AI service. Please check your internet connection.",
            unknownError: (errorMessage: string) => `An unexpected error occurred. Please try again.\n\nDetails: ${errorMessage}`,
        },
        tooltips: {
            toggleSidebarShow: 'Show conversations sidebar (Ctrl+B)',
            toggleSidebarHide: 'Hide conversations sidebar (Ctrl+B)',
            newConversation: 'Start a new, empty conversation',
            toggleLightMode: 'Switch to light mode',
            toggleDarkMode: 'Switch to dark mode',
            name: 'Enter your full name as you want it to appear in responses.',
            role: 'Select the role that best describes you to tailor the AI\'s persona.',
            language: 'Choose the language for the application interface and AI responses.',
            skills: (role: UserRole) => `List your key skills or areas of study, separated by commas. This helps the AI understand your expertise as a ${role}.`,
            portfolio: (role: UserRole) => `Enter the full URL to your portfolio, website, or profile page. The AI can share this link if relevant.`,
            experience: (role: UserRole) => `Provide a brief summary of your experience. This will be used by the AI to introduce you as a ${role}.`,
            changeApiKey: 'Forget the current API key and enter a new one.',
            clientMessage: 'Enter or paste the full message. Use Shift+Enter for a new line. (Ctrl+M to focus)',
            voiceInputStart: 'Start voice input (requires microphone permission)',
            voiceInputStop: 'Stop listening',
            voiceInputNotSupported: 'Your browser does not support speech recognition.',
            toggleWebSearch: 'Toggle web search. When enabled, the AI can search Google for up-to-date information and will cite its sources.',
            toggleLanguageDetection: 'Toggle language auto-detection. When enabled, the AI will respond in the language of the client\'s message.',
            quickPrompt: (prompt: string) => `Use this prompt: "${prompt}"`,
            model: 'Select the underlying AI model. More powerful models may have slightly higher latency.',
            tone: 'Select the overall tone for the AI-generated response.',
            style: 'Select the desired length and level of detail for the response.',
            generateResponse: 'Generate a response based on the client message, your profile, and selected options. (Ctrl+Enter)',
            retry: 'Try generating the response again. This can be useful if there was a temporary network error.',
            editResponse: 'Manually edit the generated response before copying.',
            copyResponse: 'Copy the final response to your clipboard.',
            saveChanges: 'Save your edits to the response.',
            cancelChanges: 'Discard your edits and revert to the original AI-generated response.',
            toggleHistory: 'Show or hide the previous messages in this conversation.',
            clearHistory: 'Permanently delete all messages in this conversation.',
            copyConversation: 'Copy the entire conversation history to your clipboard.',
            replyToMessage: 'Use this client message again as the input for a new response.',
            goodResponse: 'Mark as good response',
            badResponse: 'Mark as bad response',
            selectConversation: 'Click to view this conversation.',
            renameConversation: 'Double-click to rename this conversation.',
            importConversations: 'Import conversations from a JSON file',
            exportConversations: 'Export all conversations to a JSON file',
            shareConversation: 'Share conversation via a unique link',
            apiKey: 'Enter your Google Gemini API key. It is stored securely in your browser.',
            saveApiKey: 'Save the key and start using the application.',
            getApiKey: 'Go to Google AI Studio to get a free API key.',
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
        changeApiKey: 'Cambiar Clave de API',
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
        importConversations: 'Importar',
        exportConversations: 'Exportar',
        share: 'Compartir',
        linkCopied: '¡Enlace Copiado!',
        clientMessage: "Mensaje del Cliente",
        clientMessagePlaceholder: "Pega la consulta del cliente aquí, o usa el micrófono para dictar...",
        voiceInputNotSupported: "La entrada de voz no es compatible con este navegador.",
        voiceInputError: (error: string) => `Error de entrada de voz: ${error}. Revisa los permisos del micrófono.`,
        microphoneAccessDenied: "Se denegó el acceso al micrófono. Habilítalo en la configuración de tu navegador.",
        promptLibraryFor: (role) => `Biblioteca de Ideas para un/a ${role}`,
        tone: 'Tono',
        style: 'Estilo',
        model: 'Modelo',
        models: {
            flashLite: { name: 'Gemini Flash Lite', description: 'Optimizado para velocidad y eficiencia en tareas de alta frecuencia.' },
            flash: { name: 'Gemini 2.5 Flash', description: 'Un gran equilibrio de velocidad, calidad y costo para la mayoría de las tareas.' },
            pro: { name: 'Gemini 2.5 Pro', description: 'Para razonamiento complejo, codificación y generación creativa.' },
        },
        searchTheWeb: 'Buscar en la web para información actualizada',
        autoDetectLanguage: 'Autodetectar idioma de respuesta',
        generateResponse: 'Generar Respuesta',
        generating: 'Generando...',
        generatingMessages: [
            'Analizando tu solicitud...',
            'Consultando la base de conocimientos...',
            'Elaborando una respuesta detallada...',
            'Puliendo el borrador final...',
            'Un momento más, por favor...',
        ],
        retry: 'Reintentar',
        generatedResponseTitle: 'Respuesta Generada',
        edit: 'Editar',
        copy: 'Copiar',
        copied: '¡Copiado!',
        save: 'Guardar',
        cancel: 'Cancelar',
        responseHistory: 'Historial de Respuestas',
        clear: 'Limpiar',
        copyConversation: 'Copiar',
        client: 'Cliente:',
        reply: 'Responder',
        you: 'Tú:',
        searchResults: 'Fuentes',
        saveAndContinue: 'Guardar y Continuar',
        promptLibrary: {
            'Freelancer': [
                { title: "Consulta de Proyecto", prompt: "Un cliente potencial pregunta sobre mi disponibilidad y tarifas para un nuevo proyecto de desarrollo web." },
                { title: "Solicitud de Cotización", prompt: "Un cliente dio una descripción vaga del proyecto y quiere un precio. Necesito hacer preguntas aclaratorias antes de dar una cotización." },
                { title: "Manejar 'Scope Creep'", prompt: "Un cliente está pidiendo más trabajo del acordado. Necesito abordar esto amablemente y sugerir una enmienda al contrato." },
                { title: "Sugerir Mejora", prompt: "He identificado una forma de mejorar el proyecto del cliente. Quiero proponer esta idea, explicando sus beneficios." },
                { title: "Actualización Semanal", prompt: "Es hora del informe de progreso semanal. Resume las tareas completadas, los próximos pasos y cualquier obstáculo." },
                { title: "Entrega de Proyecto", prompt: "El proyecto está completo. Necesito enviar un email final con los entregables y pedir un testimonio." },
            ],
            'Student': [
                { title: "Solicitar Prórroga", prompt: "Necesito enviar un email a mi profesor para solicitar respetuosamente una prórroga para una tarea debido a circunstancias imprevistas." },
                { title: "Pedir Aclaración", prompt: "Quiero pedirle a mi asistente de cátedra que aclare un concepto de la última clase con el que tengo dificultades." },
                { title: "Carta de Recomendación", prompt: "Necesito pedirle a un profesor una carta de recomendación sólida para una solicitud de posgrado." },
                { title: "Contacto de Networking", prompt: "Me estoy comunicando con un exalumno en mi campo para pedir una breve entrevista informativa sobre su trayectoria profesional." },
                { title: "Formar Grupo de Estudio", prompt: "Quiero publicar un mensaje a mis compañeros para ver quién está interesado en formar un grupo de estudio para el examen final." },
                { title: "Consulta de Calificación", prompt: "Tengo una pregunta sobre mi calificación en el examen reciente y me gustaría consultarlo respetuosamente con el profesor." },
            ],
            'Business Owner': [
                { title: "Manejar Reseña Negativa", prompt: "Un cliente dejó una reseña negativa en línea. Necesito redactar una respuesta pública y profesional que aborde sus preocupaciones." },
                { title: "Propuesta de Asociación", prompt: "Me estoy comunicando con un socio potencial para proponer una colaboración que sería mutuamente beneficiosa." },
                { title: "Recordatorio Amable de Factura", prompt: "La factura de un cliente está vencida. Necesito enviar un recordatorio amable para hacer seguimiento del pago." },
                { title: "Rechazo de Candidato", prompt: "Hemos elegido a otro candidato para un puesto. Necesito enviar un email de rechazo amable y alentador a un solicitante." },
                { title: "Anuncio Interno", prompt: "Necesito anunciar una nueva política para toda la empresa a todos los empleados de una manera clara y positiva." },
                { title: "Consulta a Proveedor", prompt: "Necesito contactar a un nuevo proveedor potencial para preguntar sobre sus servicios, capacidades y estructura de precios." },
            ]
        },
        errors: {
            invalidApiKey: "Clave de API no válida. Tu clave de API parece ser inválida o ha expirado. Por favor, ingresa una clave válida para continuar.",
            rateLimit: "Límite de Tasa Excedido. Has realizado demasiadas solicitudes en un corto período. Por favor, espera un momento y vuelve a intentarlo.",
            clientRateLimit: (seconds: number) => `Estás haciendo solicitudes demasiado rápido. Por favor, espera ${seconds} segundo${seconds !== 1 ? 's' : ''} antes de volver a intentarlo.`,
            badRequest: "Solicitud Inválida. La solicitud enviada a la IA no era válida. A veces, esto puede ser causado por el contenido del mensaje. Intenta reformular tu mensaje.",
            serverError: "Error del Servidor. El servicio de IA está experimentando problemas actualmente. Por favor, inténtalo de nuevo en unos minutos.",
            networkError: "Error de Red. No se pudo conectar al servicio de IA. Por favor, revisa tu conexión a internet.",
            unknownError: (errorMessage: string) => `Ocurrió un error inesperado. Por favor, inténtalo de nuevo.\n\nDetalles: ${errorMessage}`,
        },
        tooltips: {
            toggleSidebarShow: 'Mostrar barra lateral de conversaciones (Ctrl+B)',
            toggleSidebarHide: 'Ocultar barra lateral de conversaciones (Ctrl+B)',
            newConversation: 'Comenzar una nueva conversación vacía',
            toggleLightMode: 'Cambiar a modo claro',
            toggleDarkMode: 'Cambiar a modo oscuro',
            name: 'Ingresa tu nombre completo como quieres que aparezca en las respuestas.',
            role: 'Selecciona el rol que mejor te describa para personalizar la personalidad de la IA.',
            language: 'Elige el idioma para la interfaz de la aplicación y las respuestas de la IA.',
            skills: (role: UserRole) => `Enumera tus habilidades clave o áreas de estudio, separadas por comas. Esto ayuda a la IA a entender tu experiencia como ${role}.`,
            portfolio: (role: UserRole) => `Ingresa la URL completa de tu portafolio, sitio web o página de perfil. La IA puede compartir este enlace si es relevante.`,
            experience: (role: UserRole) => `Proporciona un breve resumen de tu experiencia. Esto será utilizado por la IA para presentarte como ${role}.`,
            changeApiKey: 'Olvidar la clave de API actual e ingresar una nueva.',
            clientMessage: 'Ingresa o pega el mensaje completo. Usa Shift+Enter para una nueva línea. (Ctrl+M para enfocar)',
            voiceInputStart: 'Iniciar entrada de voz (requiere permiso de micrófono)',
            voiceInputStop: 'Dejar de escuchar',
            voiceInputNotSupported: 'Tu navegador no admite el reconocimiento de voz.',
            toggleWebSearch: 'Activar/desactivar búsqueda web. Cuando está activado, la IA puede buscar en Google información actualizada y citará sus fuentes.',
            toggleLanguageDetection: 'Activar/desactivar la autodetección de idioma. Cuando está activado, la IA responderá en el idioma del mensaje del cliente.',
            quickPrompt: (prompt: string) => `Usar esta plantilla: "${prompt}"`,
            model: 'Selecciona el modelo de IA subyacente. Los modelos más potentes pueden tener una latencia ligeramente mayor.',
            tone: 'Selecciona el tono general para la respuesta generada por la IA.',
            style: 'Selecciona la longitud y el nivel de detalle deseados para la respuesta.',
            generateResponse: 'Generar una respuesta basada en el mensaje del cliente, tu perfil y las opciones seleccionadas. (Ctrl+Enter)',
            retry: 'Intentar generar la respuesta de nuevo. Esto puede ser útil si hubo un error de red temporal.',
            editResponse: 'Editar manually la respuesta generada antes de copiar.',
            copyResponse: 'Copiar la respuesta final a tu portapapeles.',
            saveChanges: 'Guardar tus ediciones en la respuesta.',
            cancelChanges: 'Descartar tus ediciones y volver a la respuesta original generada por la IA.',
            toggleHistory: 'Mostrar u ocultar los mensajes anteriores en esta conversación.',
            clearHistory: 'Eliminar permanentemente todos los mensajes en esta conversación.',
            copyConversation: 'Copiar todo el historial de la conversación al portapapeles.',
            replyToMessage: 'Usar este mensaje del cliente de nuevo como entrada para una nueva respuesta.',
            goodResponse: 'Marcar como buena respuesta',
            badResponse: 'Marcar como mala respuesta',
            selectConversation: 'Haz clic para ver esta conversación.',
            renameConversation: 'Doble clic para renombrar esta conversación.',
            importConversations: 'Importar conversaciones desde un archivo JSON',
            exportConversations: 'Exportar todas las conversaciones a un archivo JSON',
            shareConversation: 'Compartir conversación mediante un enlace único',
            apiKey: 'Ingresa tu clave de API de Google Gemini. Se almacena de forma segura en tu navegador.',
            saveApiKey: 'Guardar la clave y comenzar a usar la aplicación.',
            getApiKey: 'Ve a Google AI Studio para obtener una clave de API gratuita.',
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
        changeApiKey: 'Changer la clé API',
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
        importConversations: 'Importer',
        exportConversations: 'Exporter',
        share: 'Partager',
        linkCopied: 'Lien Copié !',
        clientMessage: "Message du Client",
        clientMessagePlaceholder: "Collez la demande du client ici, ou utilisez le microphone pour dicter...",
        voiceInputNotSupported: "L'entrée vocale n'est pas prise en charge par ce navigateur.",
        voiceInputError: (error: string) => `Erreur de saisie vocale : ${error}. Veuillez vérifier les autorisations du microphone.`,
        microphoneAccessDenied: "L'accès au microphone a été refusé. Veuillez l'activer dans les paramètres de votre navigateur.",
        promptLibraryFor: (role) => `Bibliothèque d'idées pour un(e) ${role}`,
        tone: 'Ton',
        style: 'Style',
        model: 'Modèle',
        models: {
            flashLite: { name: 'Gemini Flash Lite', description: 'Optimisé pour la vitesse et l\'efficacité dans les tâches à haute fréquence.' },
            flash: { name: 'Gemini 2.5 Flash', description: 'Un excellent équilibre entre vitesse, qualité et coût pour la plupart des tâches.' },
            pro: { name: 'Gemini 2.5 Pro', description: 'Pour le raisonnement complexe, le codage et la génération créative.' },
        },
        searchTheWeb: 'Rechercher sur le web pour des informations à jour',
        autoDetectLanguage: 'Détecter automatiquement la langue de la réponse',
        generateResponse: 'Générer une Réponse',
        generating: 'Génération...',
        generatingMessages: [
            'Analyse de votre demande...',
            'Consultation de la base de connaissances...',
            'Rédaction d\'une réponse réfléchie...',
            'Peaufinage de la version finale...',
            'Juste un instant de plus...',
        ],
        retry: 'Réessayer',
        generatedResponseTitle: 'Réponse Générée',
        edit: 'Modifier',
        copy: 'Copier',
        copied: 'Copié !',
        save: 'Enregistrer',
        cancel: 'Annuler',
        responseHistory: 'Historique des Réponses',
        clear: 'Effacer',
        copyConversation: 'Copier',
        client: 'Client :',
        reply: 'Répondre',
        you: 'Vous :',
        searchResults: 'Sources',
        saveAndContinue: 'Enregistrer et Continuer',
        promptLibrary: {
            'Freelancer': [
                { title: "Demande de Projet", prompt: "Un client potentiel s'interroge sur ma disponibilité et mes tarifs pour un nouveau projet de développement web." },
                { title: "Demande de Devis", prompt: "Un client a donné une description vague du projet et veut un prix. Je dois poser des questions de clarification avant de fournir un devis." },
                { title: "Gérer le 'Scope Creep'", prompt: "Un client demande plus de travail que ce qui a été convenu. Je dois aborder cela poliment et suggérer un avenant au contrat." },
                { title: "Suggérer une Amélioration", prompt: "J'ai identifié un moyen d'améliorer le projet du client. Je veux proposer cette idée, en expliquant ses avantages." },
                { title: "Mise à Jour Hebdomadaire", prompt: "C'est l'heure du rapport d'avancement hebdomadaire. Résumez les tâches terminées, les prochaines étapes et les éventuels blocages." },
                { title: "Livraison de Projet", prompt: "Le projet est terminé. Je dois envoyer un email final avec les livrables et demander un témoignage." },
            ],
            'Student': [
                { title: "Demander un Délai", prompt: "Je dois envoyer un email à mon professeur pour demander respectueusement un délai supplémentaire pour un devoir en raison de circonstances imprévues." },
                { title: "Demander des Éclaircissements", prompt: "Je veux demander à mon assistant de cours des éclaircissements sur un concept de la dernière conférence que j'ai du mal à comprendre." },
                { title: "Lettre de Recommandation", prompt: "Je dois demander à un professeur une lettre de recommandation solide pour une candidature en master." },
                { title: "Prise de Contact (Réseautage)", prompt: "Je contacte un ancien élève de mon domaine pour demander un bref entretien d'information sur son parcours professionnel." },
                { title: "Former un Groupe d'Étude", prompt: "Je veux poster un message à mes camarades pour voir qui est intéressé pour former un groupe de révision pour l'examen final." },
                { title: "Question sur une Note", prompt: "J'ai une question sur ma note au récent examen et j'aimerais en discuter respectueusement avec le professeur." },
            ],
            'Business Owner': [
                { title: "Gérer un Avis Négatif", prompt: "Un client a laissé un avis négatif en ligne. Je dois rédiger une réponse publique professionnelle qui répond à ses préoccupations." },
                { title: "Proposition de Partenariat", prompt: "Je contacte un partenaire potentiel pour proposer une collaboration qui serait mutuellement bénéfique." },
                { title: "Rappel de Facture Poli", prompt: "La facture d'un client est en retard. Je dois envoyer un rappel poli pour le suivi du paiement." },
                { title: "Refus de Candidature", prompt: "Nous avons choisi un autre candidat pour un poste. Je dois envoyer un email de refus poli et encourageant à un candidat." },
                { title: "Annonce Interne", prompt: "Je dois announcer une nouvelle politique à l'échelle de l'entreprise à tous les employés de manière claire et positive." },
                { title: "Demande d'Information Fournisseur", prompt: "Je dois contacter un nouveau fournisseur potentiel pour me renseigner sur ses services, ses capacités et sa grille tarifaire." },
            ]
        },
        errors: {
            invalidApiKey: "Clé API non valide. Votre clé API semble être invalide ou a expiré. Veuillez saisir une clé valide pour continuer.",
            rateLimit: "Limite de Taux Atteinte. Vous avez fait trop de requêtes en peu de temps. Veuillez patienter un moment et réessayer.",
            clientRateLimit: (seconds: number) => `Vous effectuez des requêtes trop rapidement. Veuillez patienter ${seconds} seconde${seconds !== 1 ? 's' : ''} avant de réessayer.`,
            badRequest: "Requête Invalide. La requête envoyée à l'IA était invalide. Cela peut parfois être causé par le contenu du message. Essayez de reformuler votre message.",
            serverError: "Erreur de Serveur. Le service d'IA rencontre actuellement des problèmes. Veuillez réessayer dans quelques minutes.",
            networkError: "Erreur Réseau. Impossible de se connecter au service d'IA. Veuillez vérifier votre connexion internet.",
            unknownError: (errorMessage: string) => `Une erreur inattendue est survenue. Veuillez réessayer.\n\nDétails : ${errorMessage}`,
        },
        tooltips: {
            toggleSidebarShow: 'Afficher la barre latérale des conversations (Ctrl+B)',
            toggleSidebarHide: 'Masquer la barre latérale des conversations (Ctrl+B)',
            newConversation: 'Démarrer une nouvelle conversation vide',
            toggleLightMode: 'Passer en mode clair',
            toggleDarkMode: 'Passer en mode sombre',
            name: 'Entrez votre nom complet tel que vous souhaitez qu\'il apparaisse dans les réponses.',
            role: 'Sélectionnez le rôle qui vous décrit le mieux pour adapter la personnalité de l\'IA.',
            language: 'Choisissez la langue pour l\'interface de l\'application et les réponses de l\'IA.',
            skills: (role: UserRole) => `Énumérez vos compétences clés ou domaines d'études, séparés par des virgules. Cela aide l'IA à comprendre votre expertise en tant que ${role}.`,
            portfolio: (role: UserRole) => `Entrez l'URL complète de votre portfolio, site web ou page de profil. L'IA peut partager ce lien si pertinent.`,
            experience: (role: UserRole) => `Fournissez un bref résumé de votre expérience. Il sera utilisé par l'IA pour vous présenter en tant que ${role}.`,
            changeApiKey: 'Oublier la clé API actuelle et en saisir une nouvelle.',
            clientMessage: 'Saisissez ou collez le message complet. Utilisez Maj+Entrée pour une nouvelle ligne. (Ctrl+M pour mettre le focus)',
            voiceInputStart: 'Démarrer la saisie vocale (nécessite l\'autorisation du microphone)',
            voiceInputStop: 'Arrêter l\'écoute',
            voiceInputNotSupported: 'Votre navigateur ne prend pas en charge la reconnaissance vocale.',
            toggleWebSearch: 'Activer/Désactiver la recherche web. Lorsque cette option est activée, l\'IA peut rechercher des informations à jour sur Google et citera ses sources.',
            toggleLanguageDetection: 'Activer/désactiver la détection automatique de la langue. Lorsque cette option est activée, l\'IA répondra dans la langue du message du client.',
            quickPrompt: (prompt: string) => `Utiliser cette suggestion : "${prompt}"`,
            model: 'Sélectionnez le modèle d\'IA sous-jacent. Les modèles plus puissants peuvent avoir une latence légèrement plus élevée.',
            tone: 'Sélectionnez le ton général pour la réponse générée par l\'IA.',
            style: 'Sélectionnez la longueur et le niveau de détail souhaités pour la réponse.',
            generateResponse: 'Générer une réponse basée sur le message du client, votre profile et les options sélectionnées. (Ctrl+Enter)',
            retry: 'Tenter de générer à nouveau la réponse. Utile en cas d\'erreur réseau temporaire.',
            editResponse: 'Modifier manuellement la réponse générée avant de la copier.',
            copyResponse: 'Copier la réponse finale dans votre presse-papiers.',
            saveChanges: 'Enregistrer vos modifications de la réponse.',
            cancelChanges: 'Annuler vos modifications et revenir à la réponse originale générée par l\'IA.',
            toggleHistory: 'Afficher ou masquer les messages précédents dans cette conversation.',
            clearHistory: 'Supprimer définitivement tous les messages de cette conversation.',
            copyConversation: 'Copier l\'historique entier de la conversation dans le presse-papiers.',
            replyToMessage: 'Utiliser à nouveau ce message client comme entrée pour une nouvelle réponse.',
            goodResponse: 'Marquer comme bonne réponse',
            badResponse: 'Marquer comme mauvaise réponse',
            selectConversation: 'Cliquez pour afficher cette conversation.',
            renameConversation: 'Double-cliquez pour renommer cette conversation.',
            importConversations: 'Importer des conversations depuis un fichier JSON',
            exportConversations: 'Exporter toutes les conversations vers un fichier JSON',
            shareConversation: 'Partager la conversation via un lien unique',
            apiKey: 'Entrez votre clé API Google Gemini. Elle est stockée en toute sécurité dans votre navigateur.',
            saveApiKey: 'Enregistrer la clé et commencer à utiliser l\'application.',
            getApiKey: 'Allez sur Google AI Studio pour obtenir une clé API gratuite.',
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
        portfolioWebsite: 'ポートフォolio/ウェブサイト',
        portfolioWebsitePlaceholder: (role) => {
            switch (role) {
                case 'Student': return '例：GitHub、学術プロフィールページ';
                case 'Business Owner': return '例：https://あなたの会社.com';
                default: return '例：https://あなたのポートフォリオ.com';
            }
        },
        changeApiKey: 'APIキーの変更',
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
        importConversations: 'インポート',
        exportConversations: 'エクスポート',
        share: '共有',
        linkCopied: 'リンクをコピーしました！',
        clientMessage: "クライアントのメッセージ",
        clientMessagePlaceholder: "ここにクライアントからの問い合わせを貼り付けるか、マイクを使って音声入力してください...",
        voiceInputNotSupported: "このブラウザは音声入力に対応していません。",
        voiceInputError: (error: string) => `音声入力エラー：${error}。マイクの許可を確認してください。`,
        microphoneAccessDenied: "マイクへのアクセスが拒否されました。ブラウザの設定で有効にしてください。",
        promptLibraryFor: (role) => `${role}のためのプロンプトライブラリ`,
        tone: 'トーン',
        style: 'スタイル',
        model: 'モデル',
        models: {
            flashLite: { name: 'Gemini Flash Lite', description: '高頻度のタスクにおける速度と効率に最適化されています。' },
            flash: { name: 'Gemini 2.5 Flash', description: 'ほとんどのタスクにおいて、速度、品質、コストのバランスが優れています。' },
            pro: { name: 'Gemini 2.5 Pro', description: '複雑な推論、コーディング、創造的な生成向けです。' },
        },
        searchTheWeb: 'ウェブで最新情報を検索',
        autoDetectLanguage: '応答言語を自動検出',
        generateResponse: '返信を生成',
        generating: '生成中...',
        generatingMessages: [
            'リクエストを分析中...',
            '知識ベースを参照中...',
            '丁寧な回答を作成中...',
            '最終稿を推敲中...',
            'もうしばらくお待ちください...',
        ],
        retry: '再試行',
        generatedResponseTitle: '生成された返信',
        edit: '編集',
        copy: 'コピー',
        copied: 'コピーしました！',
        save: '保存',
        cancel: 'キャンセル',
        responseHistory: '返信履歴',
        clear: 'クリア',
        copyConversation: 'コピー',
        client: 'クライアント:',
        reply: '返信',
        you: 'あなた:',
        searchResults: 'ソース',
        saveAndContinue: '保存して続行',
        promptLibrary: {
            'Freelancer': [
                { title: "プロジェクトの問い合わせ", prompt: "潜在的なクライアントから、新しいウェブ開発プロジェクトの空き状況と料金について問い合わせがありました。" },
                { title: "見積依頼", prompt: "クライアントから曖昧なプロジェクト説明で見積もりを依頼されました。見積もりを出す前に、明確化するための質問をする必要があります。" },
                { title: "スコープクリープへの対応", prompt: "クライアントが合意した以上の作業を要求しています。これに丁寧に対応し、契約の修正を提案する必要があります。" },
                { title: "改善提案", prompt: "クライアントのプロジェクトを改善する方法を見つけました。その利点を説明し、このアイデアを提案したいです。" },
                { title: "週次進捗報告", prompt: "週次の進捗報告の時間です。完了したタスク、次のステップ、および障害となっている点を要約してください。" },
                { title: "プロジェクトの引き渡し", prompt: "プロジェクトが完了しました。成果物を記載した最終メールを送り、推薦文を依頼する必要があります。" },
            ],
            'Student': [
                { title: "提出期限の延長願い", prompt: "予期せぬ事態のため、今後の課題の提出期限延長を教授に丁重にお願いするメールを送る必要があります。" },
                { title: "質問・確認", prompt: "前回の講義で理解が難しかった概念について、TAに明確な説明を求めたいです。" },
                { title: "推薦状のお願い", prompt: "大学院出願のために、教授に力強い推薦状をお願いする必要があります。" },
                { title: "ネットワーキングのための連絡", prompt: "自分の分野の卒業生に連絡を取り、キャリアパスについて簡単な情報提供インタビューをお願いしたいです。" },
                { title: "勉強会の結成", prompt: "期末試験のために勉強会を結成することに興味がある人がいるか、クラスメートにメッセージを投稿したいです。" },
                { title: "成績についての問い合わせ", prompt: "最近の試験の成績について質問があり、教授に丁重に問い合わせたいです。" },
            ],
            'Business Owner': [
                { title: "否定的なレビューへの対応", prompt: "顧客がオンラインで否定的なレビューを残しました。彼らの懸念に対応する、プロフェッショナルな公開返信を作成する必要があります。" },
                { title: "提携提案", prompt: "相互に利益のある協力を提案するために、潜在的なパートナーに連絡を取っています。" },
                { title: "請求書の丁寧な催促", prompt: "クライアントの請求書の支払いが期限を過ぎています。支払いのフォローアップのために、丁寧な催促メールを送る必要があります。" },
                { title: "不採用通知", prompt: "あるポジションに別の候補者を選びました。応募者には丁寧で励ますような不採用通知メールを送る必要があります。" },
                { title: "社内通知", prompt: "全社的な新しい方針を、明確かつ肯定的な方法で全従業員に発表する必要があります。" },
                { title: "ベンダーへの問い合わせ", prompt: "新しい潜在的なベンダーに連絡し、そのサービス、能力、価格体系について問い合わせる必要があります。" },
            ]
        },
        errors: {
            invalidApiKey: "APIキーが無効です。APIキーが無効か期限切れのようです。続行するには有効なキーを入力してください。",
            rateLimit: "レート制限を超えました。短時間にリクエストが多すぎます。しばらく待ってからもう一度お試しください。",
            clientRateLimit: (seconds: number) => `リクエストの送信が速すぎます。再試行するまで ${seconds} 秒お待ちください。`,
            badRequest: "無効なリクエスト。AIに送信されたリクエストは無効でした。これはプロンプトの内容が原因である場合があります。メッセージを言い換えてみてください。",
            serverError: "サーバーエラー。AIサービスで現在問題が発生しています。数分後にもう一度お試しください。",
            networkError: "ネットワークエラー。AIサービスに接続できませんでした。インターネット接続を確認してください。",
            unknownError: (errorMessage: string) => `予期せぬエラーが発生しました。もう一度お試しください。\n\n詳細: ${errorMessage}`,
        },
        tooltips: {
            toggleSidebarShow: '会話サイドバーを表示 (Ctrl+B)',
            toggleSidebarHide: '会話サイドバーを非表示 (Ctrl+B)',
            newConversation: '新しい空の会話を開始',
            toggleLightMode: 'ライトモードに切り替え',
            toggleDarkMode: 'ダークモードに切り替え',
            name: '応答に表示させたいフルネームを入力してください。',
            role: 'AIのペルソナを調整するために、あなたを最もよく表す役割を選択してください。',
            language: 'アプリケーションのインターフェースとAIの応答の言語を選択してください。',
            skills: (role: UserRole) => `主要なスキルや研究分野をカンマで区切ってリストアップしてください。これにより、AIが${role}としてのあなたの専門知識を理解するのに役立ちます。`,
            portfolio: (role: UserRole) => `ポートフォリオ、ウェブサイト、またはプロフィールページの完全なURLを入力してください。AIは関連する場合にこのリンクを共有できます。`,
            experience: (role: UserRole) => `あなたの経験の簡単な要約を提供してください。これは、AIが${role}としてあなたを紹介するために使用されます。`,
            changeApiKey: '現在のAPIキーを忘れて新しいものを入力します。',
            clientMessage: 'メッセージを入力または貼り付けてください。Shift+Enterで改行します。(Ctrl+Mでフォーカス)',
            voiceInputStart: '音声入力を開始（マイクの許可が必要です）',
            voiceInputStop: '聞き取りを停止',
            voiceInputNotSupported: 'お使いのブラウザは音声認識をサポートしていません。',
            toggleWebSearch: 'ウェブ検索を切り替えます。有効にすると、AIはGoogleで最新情報を検索し、その情報源を引用します。',
            toggleLanguageDetection: '言語の自動検出を切り替えます。有効にすると、AIはクライアントのメッセージの言語で応答します。',
            quickPrompt: (prompt: string) => `このプロンプトを使用する: "${prompt}"`,
            model: '基盤となるAIモデルを選択します。より強力なモデルは、レイテンシがわずかに高くなる場合があります。',
            tone: 'AIが生成する応答の全体的なトーンを選択してください。',
            style: '応答の希望する長さと詳細レベルを選択してください。',
            generateResponse: 'クライアントのメッセージ、あなたのプロフィール、選択したオプションに基づいて応答を生成します。(Ctrl+Enter)',
            retry: '応答の生成を再試行します。一時的なネットワークエラーがあった場合に便利です。',
            editResponse: 'コピーする前に生成された応答を手動で編集します。',
            copyResponse: '最終的な応答をクリップボードにコピーします。',
            saveChanges: '応答への編集を保存します。',
            cancelChanges: '編集を破棄し、元のAI生成の応答に戻します。',
            toggleHistory: 'この会話の以前のメッセージを表示または非表示にします。',
            clearHistory: 'この会話のすべてのメッセージを完全に削除します。',
            copyConversation: '会話履歴全体をクリップボードにコピーします。',
            replyToMessage: '新しい応答の入力としてこのクライアントメッセージを再度使用します。',
            goodResponse: '良い応答としてマーク',
            badResponse: '悪い応答としてマーク',
            selectConversation: 'クリックしてこの会話を表示します。',
            renameConversation: 'ダブルクリックしてこの会話の名前を変更します。',
            importConversations: 'JSONファイルから会話をインポートする',
            exportConversations: 'すべての会話をJSONファイルにエクスポートする',
            shareConversation: '一意のリンクで会話を共有',
            apiKey: 'Google Gemini APIキーを入力してください。ブラウザに安全に保存されます。',
            saveApiKey: 'キーを保存してアプリケーションの使用を開始します。',
            getApiKey: 'Google AI Studioにアクセスして無料のAPIキーを取得します。',
        }
    }
};
