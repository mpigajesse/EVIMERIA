import { motion } from 'framer-motion';
import { components, typography, animations } from '../utils/designSystem';
import { Card, SectionTitle } from '../components/ui';

const AboutPage = () => {
  return (
    <div className={components.containers.page}>
      {/* Éléments décoratifs d'arrière-plan */}
      <div className={`${components.decorations.blobs} w-96 h-96 bg-blue-400 top-20 -right-48 opacity-20`}></div>
      <div className={`${components.decorations.blobs} w-80 h-80 bg-violet-400 bottom-40 -left-40 opacity-20`}></div>
      <div className={`${components.decorations.blobs} w-64 h-64 bg-green-400 top-40 left-20 opacity-10`}></div>
      
      <div className={components.containers.maxWidth}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={animations.fadeIn}
          className="py-12"
        >
          <SectionTitle 
            title="À propos d'EVIMERIA" 
            description="Découvrez notre histoire et notre vision"
            align="center"
            size="lg"
            className="mb-12"
            badge="Notre histoire"
            badgeVariant="primary"
          />
          
          {/* Introduction */}
          <motion.div variants={animations.fadeInUp} transition={{ delay: 0.1 }}>
            <Card elevation="high" rounded="xl" className="overflow-hidden mb-12">
              <div className="bg-gradient-to-r from-blue-600 via-violet-600 to-green-600 h-2 w-full"></div>
              <div className="p-6 sm:p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-1/2">
                    <h2 className={typography.headings.h2 + " mb-4"}>Notre Mission</h2>
                    <p className="text-gray-600 mb-4">EVIMERIA est née d'une passion pour l'élégance et la mode accessible. Notre mission est de rendre la mode haut de gamme accessible à tous, en proposant des produits de qualité à des prix abordables.</p>
                    <p className="text-gray-600">Notre équipe de designers passionnés parcourt le monde à la recherche des dernières tendances pour vous offrir des collections uniques et intemporelles.</p>
                  </div>
                  <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg">
                    <img 
                      src="/src/assets/images/about/mission.jpg" 
                      alt="Notre mission" 
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80';
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
          
          {/* Notre histoire */}
          <motion.div variants={animations.fadeInUp} transition={{ delay: 0.2 }}>
            <Card elevation="high" rounded="xl" className="overflow-hidden mb-12">
              <div className="p-6 sm:p-8">
                <h2 className={typography.headings.h2 + " mb-6 text-center"}>
                  <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-green-600 text-transparent bg-clip-text">Notre Histoire</span>
                </h2>
                
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row items-start gap-4">
                    <div className="bg-blue-100 p-4 rounded-full text-blue-600 font-bold text-xl flex items-center justify-center w-12 h-12 md:mt-1 shrink-0 mx-auto md:mx-0">
                      1
                    </div>
                    <div>
                      <h3 className={typography.headings.h3 + " mb-2"}>Les débuts</h3>
                      <p className="text-gray-600">Fondée en 2018 sous le nom de JaelleShop, notre entreprise a commencé comme une petite boutique en ligne spécialisée dans les accessoires de mode pour femmes.</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-start gap-4">
                    <div className="bg-violet-100 p-4 rounded-full text-violet-600 font-bold text-xl flex items-center justify-center w-12 h-12 md:mt-1 shrink-0 mx-auto md:mx-0">
                      2
                    </div>
                    <div>
                      <h3 className={typography.headings.h3 + " mb-2"}>Croissance et expansion</h3>
                      <p className="text-gray-600">Au fil des années, notre catalogue s'est enrichi pour inclure des vêtements, chaussures et accessoires pour toute la famille. Notre engagement envers la qualité et le service client nous a permis de nous développer rapidement.</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-start gap-4">
                    <div className="bg-green-100 p-4 rounded-full text-green-600 font-bold text-xl flex items-center justify-center w-12 h-12 md:mt-1 shrink-0 mx-auto md:mx-0">
                      3
                    </div>
                    <div>
                      <h3 className={typography.headings.h3 + " mb-2"}>Transformation en EVIMERIA</h3>
                      <p className="text-gray-600">En 2023, nous avons décidé de réinventer notre marque pour mieux refléter notre évolution et notre vision. EVIMERIA est née, symbolisant l'élégance, l'innovation et notre engagement envers la durabilité.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
          
          {/* Nos valeurs */}
          <motion.div variants={animations.fadeInUp} transition={{ delay: 0.3 }}>
            <Card elevation="high" rounded="xl" className="overflow-hidden mb-12">
              <div className="p-6 sm:p-8">
                <h2 className={typography.headings.h2 + " mb-8 text-center"}>Nos Valeurs</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 rounded-xl bg-blue-50 border border-blue-100 hover:shadow-md transition-shadow">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">Qualité</h3>
                    <p className="text-gray-600">Nous nous engageons à offrir des produits durables et de haute qualité, fabriqués avec soin et attention aux détails.</p>
                  </div>
                  
                  <div className="text-center p-6 rounded-xl bg-violet-50 border border-violet-100 hover:shadow-md transition-shadow">
                    <div className="bg-violet-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">Innovation</h3>
                    <p className="text-gray-600">Nous cherchons constamment à innover, tant dans nos produits que dans notre façon de servir nos clients.</p>
                  </div>
                  
                  <div className="text-center p-6 rounded-xl bg-green-50 border border-green-100 hover:shadow-md transition-shadow">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">Durabilité</h3>
                    <p className="text-gray-600">Nous nous engageons à réduire notre impact environnemental en adoptant des pratiques durables à chaque étape de notre chaîne de production.</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
          
          {/* Notre équipe */}
          <motion.div variants={animations.fadeInUp} transition={{ delay: 0.4 }}>
            <Card elevation="high" rounded="xl" className="overflow-hidden">
              <div className="p-6 sm:p-8">
                <h2 className={typography.headings.h2 + " mb-8 text-center"}>Notre Équipe</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[
                    { name: 'Sophie Martin', role: 'Fondatrice & CEO', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80' },
                    { name: 'Thomas Dubois', role: 'Directeur Créatif', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80' },
                    { name: 'Émilie Bernard', role: 'Directrice Marketing', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80' },
                    { name: 'Alexandre Petit', role: 'Responsable E-commerce', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80' },
                  ].map((member, index) => (
                    <div key={index} className="text-center">
                      <div className="relative mb-4 mx-auto w-32 h-32 overflow-hidden rounded-full border-4 border-white shadow-lg">
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-lg font-semibold mb-1 text-gray-900">{member.name}</h3>
                      <p className="text-gray-600">{member.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage; 