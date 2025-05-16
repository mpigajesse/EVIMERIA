import { useState } from 'react';
import { motion } from 'framer-motion';
import { components, typography, animations } from '../utils/designSystem';
import { Card, Button, SectionTitle } from '../components/ui';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simuler l'envoi du formulaire
    console.log('Envoi du formulaire:', formData);
    // Afficher un message de succès
    setSubmitted(true);
    // Réinitialiser le formulaire après 3 secondes
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className={components.containers.page}>
      {/* Éléments décoratifs d'arrière-plan */}
      <div className={`${components.decorations.blobs} w-96 h-96 bg-blue-400 top-20 -right-48 opacity-20`}></div>
      <div className={`${components.decorations.blobs} w-80 h-80 bg-violet-400 bottom-40 -left-40 opacity-20`}></div>
      
      <div className={components.containers.maxWidth}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={animations.fadeIn}
          className="py-12"
        >
          <SectionTitle 
            title="Contactez-nous" 
            description="Nous sommes là pour répondre à toutes vos questions"
            align="center"
            size="lg"
            className="mb-12"
            badge="Support"
            badgeVariant="primary"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Formulaire de contact */}
            <motion.div variants={animations.fadeInUp} transition={{ delay: 0.1 }}>
              <Card elevation="high" rounded="xl" className="overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 via-violet-600 to-green-600 h-2 w-full"></div>
                <div className="p-6 sm:p-8">
                  <h2 className={typography.headings.h3}>Envoyez-nous un message</h2>
                  
                  {submitted ? (
                    <motion.div 
                      className="bg-green-100 text-green-700 p-4 my-6 rounded-lg flex items-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className={components.inputs.base}
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Votre nom"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className={components.inputs.base}
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="votre@email.com"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                        <select
                          id="subject"
                          name="subject"
                          required
                          className={components.inputs.base}
                          value={formData.subject}
                          onChange={handleChange}
                        >
                          <option value="">Sélectionnez un sujet</option>
                          <option value="question">Question générale</option>
                          <option value="support">Support technique</option>
                          <option value="partnership">Partenariat</option>
                          <option value="other">Autre</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          required
                          className={`${components.inputs.base} resize-none`}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Votre message ici..."
                        ></textarea>
                      </div>
                      
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button 
                          variant="primary" 
                          className="w-full py-3 bg-gradient-to-r from-blue-600 via-violet-600 to-green-600 !text-white hover:from-blue-700 hover:via-violet-700 hover:to-green-700"
                          type="submit"
                        >
                          Envoyer le message
                        </Button>
                      </motion.div>
                    </form>
                  )}
                </div>
              </Card>
            </motion.div>
            
            {/* Informations de contact et carte */}
            <motion.div variants={animations.fadeInUp} transition={{ delay: 0.2 }}>
              <div className="space-y-8">
                {/* Informations de contact */}
                <Card elevation="medium" rounded="xl" className="p-6 sm:p-8">
                  <h2 className={typography.headings.h3}>Nos coordonnées</h2>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-full mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Adresse</h3>
                        <p className="text-gray-600 mt-1">123 Avenue de la Mode<br />75000 Paris, France</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-violet-100 p-2 rounded-full mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-600" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Téléphone</h3>
                        <p className="text-gray-600 mt-1">+33 (0)1 23 45 67 89</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Email</h3>
                        <p className="text-gray-600 mt-1">contact@evimeria.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-yellow-100 p-2 rounded-full mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Heures d'ouverture</h3>
                        <p className="text-gray-600 mt-1">Lundi - Vendredi: 9h - 18h<br />Samedi: 10h - 16h</p>
                      </div>
                    </div>
                  </div>
                </Card>
                
                {/* Carte (image simulée pour l'exemple) */}
                <Card elevation="medium" rounded="xl" className="overflow-hidden">
                  <div className="relative h-64 w-full bg-gray-200">
                    {/* Dans un projet réel, remplacez ceci par une vraie carte avec Google Maps ou autre API */}
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.292292615509614!3d48.858370079287475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sTour%20Eiffel!5e0!3m2!1sfr!2sfr!4v1631539424214!5m2!1sfr!2sfr" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen={false} 
                      loading="lazy"
                      title="Carte"
                    ></iframe>
                  </div>
                </Card>
                
                {/* Réseaux sociaux */}
                <div className="bg-gradient-to-r from-blue-600 via-violet-600 to-green-600 rounded-xl p-6 text-white shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">Suivez-nous</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                      </svg>
                    </a>
                    <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </a>
                    <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* FAQ */}
          <motion.div 
            variants={animations.fadeInUp} 
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <Card elevation="medium" rounded="xl" className="p-8">
              <SectionTitle 
                title="Questions fréquentes" 
                size="md"
                align="center"
                className="mb-8"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">Comment puis-je suivre ma commande ?</h3>
                  <p className="text-gray-600">Vous pouvez suivre votre commande à tout moment en vous connectant à votre compte et en consultant la section "Mes commandes".</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">Quel est le délai de livraison ?</h3>
                  <p className="text-gray-600">Nos délais de livraison varient généralement entre 3 et 5 jours ouvrables selon votre localisation.</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">Comment effectuer un retour ?</h3>
                  <p className="text-gray-600">Les retours sont acceptés dans les 30 jours suivant l'achat. Connectez-vous à votre compte pour initier un retour.</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">Les frais de livraison sont-ils offerts ?</h3>
                  <p className="text-gray-600">La livraison est offerte pour toutes les commandes de plus de 50€.</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage; 