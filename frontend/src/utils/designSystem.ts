/**
 * Design System pour JaelleShop
 * Ce fichier contient toutes les constantes et utilitaires pour maintenir un design cohérent à travers l'application
 */

// Couleurs de l'application
export const colors = {
  // Couleurs principales (déjà définies dans tailwind.config.js)
  primary: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
    950: "#082f49",
  },
  secondary: {
    50: "#fdf2f8",
    100: "#fce7f3",
    200: "#fbcfe8",
    300: "#f9a8d4",
    400: "#f472b6",
    500: "#ec4899",
    600: "#db2777",
    700: "#be185d",
    800: "#9d174d",
    900: "#831843",
    950: "#500724",
  },
  
  // Couleurs vives pour plus de dynamisme
  accent: {
    orange: {
      light: "bg-amber-100 text-amber-600",
      medium: "bg-amber-400 text-white",
      dark: "bg-amber-600 text-white",
    },
    green: {
      light: "bg-emerald-100 text-emerald-600",
      medium: "bg-emerald-400 text-white",
      dark: "bg-emerald-600 text-white",
    },
    purple: {
      light: "bg-violet-100 text-violet-600",
      medium: "bg-violet-400 text-white",
      dark: "bg-violet-600 text-white",
    },
    teal: {
      light: "bg-teal-100 text-teal-600",
      medium: "bg-teal-400 text-white",
      dark: "bg-teal-600 text-white",
    },
  },
  gradients: {
    primary: "bg-gradient-to-r from-primary-500 to-primary-700",
    secondary: "bg-gradient-to-r from-secondary-500 to-secondary-700",
    sunset: "bg-gradient-to-r from-amber-400 to-secondary-500",
    ocean: "bg-gradient-to-r from-teal-400 to-primary-500",
    cosmic: "bg-gradient-to-r from-violet-500 to-teal-500",
    warm: "bg-gradient-to-r from-amber-500 to-red-500",
  },
  
  // Classes de couleur de texte et fond communes
  text: {
    primary: "text-primary-600",
    secondary: "text-secondary-600",
    dark: "text-gray-900",
    light: "text-white",
    muted: "text-gray-500",
  },
  bg: {
    primary: "bg-primary-600",
    secondary: "bg-secondary-600",
    light: "bg-white",
    dark: "bg-gray-900",
    subtle: "bg-gray-50",
  },
  // Styles de transparence pour les overlays
  overlay: {
    light: "bg-white/20 backdrop-blur-sm",
    dark: "bg-black/20 backdrop-blur-sm",
    gradient: "bg-gradient-to-b from-transparent via-black/10 to-black/70",
  },
};

// Typographie plus moderne
export const typography = {
  headings: {
    h1: "text-3xl xs:text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight",
    h2: "text-xl xs:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight",
    h3: "text-lg xs:text-xl font-semibold text-gray-900 tracking-tight",
    h4: "text-base xs:text-lg font-semibold text-gray-900",
    h5: "text-sm xs:text-base font-semibold text-gray-900",
    display: "text-4xl xs:text-5xl md:text-6xl font-extrabold text-gray-900 leading-none tracking-tighter",
  },
  body: {
    regular: "text-base text-gray-600",
    medium: "text-base font-medium text-gray-700",
    small: "text-sm text-gray-500",
    tiny: "text-xs text-gray-400",
  },
  labels: {
    badge: "inline-block px-3 py-1 rounded-full text-sm font-medium",
    tag: "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium",
  }
};

// Espacements uniformes
export const spacing = {
  section: "mb-16",
  component: "mb-8",
  element: "mb-4",
  inner: "p-6 md:p-8",
  gutter: "px-4 sm:px-6 md:px-8",
};

// Ombres et élévation avec effets plus prononcés
export const elevation = {
  low: "shadow-sm",
  medium: "shadow",
  high: "shadow-lg",
  extraHigh: "shadow-xl",
  intense: "shadow-2xl",
  card: "shadow-lg rounded-3xl bg-white",
  floating: "shadow-xl rounded-3xl bg-white backdrop-blur-sm bg-opacity-90",
};

// Bordures et arrondis plus modernes
export const borders = {
  rounded: {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-3xl",
    full: "rounded-full",
  },
  special: {
    blob: "rounded-[30%_70%_70%_30%/30%_30%_70%_70%]",
    wavy: "rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg",
  }
};

// Composants réutilisables avec styles plus modernes
export const components = {
  buttons: {
    primary: "bg-primary-600 text-white px-6 py-3 rounded-full hover:bg-primary-700 transition-all hover:shadow-md active:scale-95",
    secondary: "bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-50 hover:text-primary-600 hover:shadow-md transition-all active:scale-95",
    accent: "bg-secondary-600 text-white px-6 py-3 rounded-full hover:bg-secondary-700 hover:shadow-md transition-all active:scale-95",
    gradient: "bg-gradient-to-r from-primary-500 to-primary-700 text-white px-6 py-3 rounded-full hover:shadow-md transition-all active:scale-95",
    icon: "p-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors",
    pill: "px-5 py-2 rounded-full text-sm font-medium transition-all hover:shadow-sm active:scale-95",
    outlined: "border border-primary-500 text-primary-600 px-6 py-3 rounded-full hover:bg-primary-50 transition-all hover:shadow-md active:scale-95",
  },
  cards: {
    base: "bg-white rounded-3xl shadow-lg p-6 overflow-hidden",
    hover: "transition-all duration-300 hover:-translate-y-2 hover:shadow-xl",
    glass: "backdrop-blur-md bg-white/70 rounded-3xl shadow-lg p-6 overflow-hidden border border-white/20",
    bordered: "bg-white rounded-3xl shadow-sm p-6 overflow-hidden border border-gray-200 hover:border-primary-200 transition-colors",
  },
  inputs: {
    base: "px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full transition-all",
    search: "pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full transition-shadow hover:shadow-sm",
    floating: "px-4 py-3 rounded-full shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full transition-all",
  },
  containers: {
    page: "bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8",
    maxWidth: "max-w-7xl mx-auto",
    section: "bg-white rounded-3xl shadow-lg p-8 mb-16",
    glass: "backdrop-blur-md bg-white/70 rounded-3xl shadow-lg p-8 mb-16 border border-white/20",
    feature: "bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-8 mb-16 overflow-hidden relative",
  },
  gridLayouts: {
    products: "grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 lg:gap-8",
    features: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 xs:gap-8",
    form: "grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-6",
    gallery: "grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4",
    masonry: "columns-1 xs:columns-2 lg:columns-3 xl:columns-4 gap-4 xs:gap-8 space-y-4 xs:space-y-8",
  },
  decorations: {
    blobs: "absolute -z-10 blur-3xl opacity-30 rounded-full",
    dots: "absolute -z-10 w-full h-full bg-dot-pattern opacity-10",
    lines: "absolute -z-10 w-full h-full bg-line-pattern opacity-10",
  },
  badges: {
    primary: "bg-primary-100 text-primary-700",
    secondary: "bg-secondary-100 text-secondary-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-sky-100 text-sky-700",
    neutral: "bg-gray-100 text-gray-700",
    transparent: "bg-white/20 backdrop-blur-sm text-white",
  }
};

// Animations avancées (pour Framer Motion)
export const animations = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
  slideInRight: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  },
  staggerChildren: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    },
  },
  staggerFast: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    },
  },
  hoverScale: {
    scale: 1.05,
    transition: { type: "spring", stiffness: 400 }
  },
  hoverTilt: {
    rotateX: 5, 
    rotateY: 10,
    transition: { type: "spring", stiffness: 400 }
  },
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: { 
      repeat: Infinity, 
      duration: 2,
      ease: "easeInOut"
    }
  },
  float: {
    y: [0, -10, 0],
    transition: { 
      repeat: Infinity, 
      duration: 3,
      ease: "easeInOut"
    }
  },
  wave: {
    rotate: [0, 5, 0, -5, 0],
    transition: { 
      repeat: Infinity, 
      duration: 3,
      ease: "easeInOut"
    }
  }
};

// Thèmes de couleurs pour différentes sections/pages
export const themes = {
  default: {
    background: "bg-gradient-to-br from-gray-50 to-gray-200",
    card: "bg-white",
    text: "text-gray-900",
    accent: "text-primary-600",
  },
  dark: {
    background: "bg-gray-900",
    card: "bg-gray-800",
    text: "text-white",
    accent: "text-primary-400",
  },
  light: {
    background: "bg-white",
    card: "bg-gray-50",
    text: "text-gray-900",
    accent: "text-primary-600",
  },
  vibrant: {
    background: "bg-gradient-to-br from-primary-50 to-secondary-50",
    card: "bg-white",
    text: "text-gray-900",
    accent: "text-primary-600",
  },
  festive: {
    background: "bg-gradient-to-br from-red-50 to-red-100",
    card: "bg-white",
    text: "text-gray-900",
    accent: "text-red-600",
  },
  cosmic: {
    background: "bg-gradient-to-br from-violet-100 to-teal-100",
    card: "bg-white",
    text: "text-gray-900",
    accent: "text-violet-600",
  },
  ocean: {
    background: "bg-gradient-to-br from-blue-50 to-teal-50",
    card: "bg-white",
    text: "text-gray-900",
    accent: "text-teal-600",
  }
};

// Breakpoints pour le responsive design (pour référence, ils correspondent à Tailwind)
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Utilitaire pour combiner des classes conditionnellement
export function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default {
  colors,
  typography,
  spacing,
  elevation,
  borders,
  components,
  animations,
  themes,
  breakpoints,
  classNames,
}; 