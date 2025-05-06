import { Variants } from "framer-motion";

// Animations pour les entrées d'éléments
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4 }
  }
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Animation pour les cartes de produits
export const productCardHover: Variants = {
  initial: { scale: 1, y: 0, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" },
  hover: { 
    scale: 1.03, 
    y: -5, 
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: { duration: 0.2 }
  }
};

// Animation pour les boutons
export const buttonTap: Variants = {
  tap: { scale: 0.98 }
};

// Animation pour les staggered lists (listes avec effets en cascade)
export const staggeredList = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggeredItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

// Animation pour les notifications
export const notificationAnimation: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 500, 
      damping: 25 
    }
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

// Animation pour les transitions de page
export const pageTransition: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { 
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.15
    }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// Animation pour le menu mobile
export const mobileMenuAnimation: Variants = {
  closed: { 
    height: 0, 
    opacity: 0,
    transition: { 
      duration: 0.3,
      when: "afterChildren"
    }
  },
  open: { 
    height: "auto", 
    opacity: 1,
    transition: { 
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.05
    }
  }
};

export const mobileMenuItemAnimation: Variants = {
  closed: { opacity: 0, x: -10 },
  open: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.2
    }
  }
};

// Animation pour zoom image
export const imageZoom: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.1,
    transition: { duration: 0.4 }
  }
};

// Animation pour les filtres
export const filterExpand: Variants = {
  collapsed: { height: 0, opacity: 0, overflow: "hidden" },
  expanded: { 
    height: "auto", 
    opacity: 1,
    overflow: "visible", 
    transition: { duration: 0.3 }
  }
}; 