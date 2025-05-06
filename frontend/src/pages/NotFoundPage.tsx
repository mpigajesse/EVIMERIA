import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { components, typography, animations, colors } from '../utils/designSystem';
import { Button } from '../components/ui';

const NotFoundPage = () => {
  return (
    <div className={components.containers.page}>
      {/* Éléments décoratifs d'arrière-plan */}
      <div className={`${components.decorations.blobs} w-96 h-96 bg-primary-300 top-0 -right-48 opacity-20`}></div>
      <div className={`${components.decorations.blobs} w-72 h-72 bg-secondary-300 bottom-40 -left-40 opacity-20`}></div>
      
      <div className={components.containers.maxWidth}>
        <motion.div 
          className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4"
          initial="hidden"
          animate="visible"
          variants={animations.fadeIn}
        >
          <motion.div 
            className="relative"
            variants={animations.fadeInUp}
          >
            <motion.h1 
              className={`text-8xl md:text-9xl font-bold ${colors.gradients.primary} bg-clip-text text-transparent mb-4`}
              animate={animations.pulse}
            >
              404
            </motion.h1>
            <div className="absolute -inset-1 bg-primary-400 rounded-full blur-xl opacity-20 -z-10"></div>
          </motion.div>
          
          <motion.h2 
            className={`${typography.headings.h2} mb-6`}
            variants={animations.fadeInUp}
            transition={{ delay: 0.1 }}
          >
            Page non trouvée
          </motion.h2>
          
          <motion.p 
            className={`${typography.body.regular} mb-8 max-w-lg`}
            variants={animations.fadeInUp}
            transition={{ delay: 0.2 }}
          >
            La page que vous recherchez n'existe pas ou a été déplacée. 
            Ne vous inquiétez pas, vous pouvez toujours revenir à l'accueil.
          </motion.p>
          
          <motion.div
            variants={animations.fadeInUp}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="primary"
              to="/"
              className="px-8 py-3"
            >
              Retour à l'accueil
            </Button>
          </motion.div>
          
          {/* Éléments décoratifs */}
          <motion.div 
            className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-primary-200 opacity-20"
            animate={animations.float}
            transition={{ delay: 0.1 }}
          ></motion.div>
          <motion.div 
            className="absolute bottom-1/3 right-1/3 w-12 h-12 rounded-full bg-secondary-200 opacity-20"
            animate={animations.float}
            transition={{ delay: 0.3 }}
          ></motion.div>
          <motion.div 
            className="absolute top-1/3 right-1/4 w-8 h-8 rounded-full bg-green-200 opacity-20"
            animate={animations.float}
            transition={{ delay: 0.5 }}
          ></motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage; 