// Script d'import des produits dans Appwrite
// À ajouter dans votre fichier App.js ou à exécuter une seule fois

import { AppwriteService } from './appwriteServices';

// Catalogue complet de tous vos 31 produits du domaine
const allDomainProducts = [
  // VINS DU DOMAINE
  { 
    name: "VDN Muscat de Rivesaltes", 
    category: "vins", 
    price: 13.40, 
    description: "Vin doux naturel, parfait pour l'apéritif", 
    inStock: true, 
    rating: 4.5, 
    quantity: "75cL",
    image: "https://via.placeholder.com/200/8B5A3C/FFFFFF?text=VDN+Muscat"
  },
  { 
    name: "VDN Muscat de Noël", 
    category: "vins", 
    price: 12.40, 
    description: "Édition spéciale pour les fêtes", 
    inStock: true, 
    rating: 4.8, 
    quantity: "75cL",
    image: "https://via.placeholder.com/200/D2691E/FFFFFF?text=Muscat+Noel"
  },
  { 
    name: "VDN Rivesaltes Grenat", 
    category: "vins", 
    price: 15.00, 
    description: "Vin doux naturel rouge grenat", 
    inStock: true, 
    rating: 4.6, 
    quantity: "75cL",
    image: "https://via.placeholder.com/200/8B0000/FFFFFF?text=Grenat"
  },
  { 
    name: "VDN Rivesaltes Tuilé Hors d'Âge", 
    category: "vins", 
    price: 16.00, 
    description: "Vin vieilli, notes complexes", 
    inStock: true, 
    rating: 4.9, 
    quantity: "75cL",
    image: "https://via.placeholder.com/200/CD853F/FFFFFF?text=Tuile+Hors+Age"
  },
  { 
    name: "VDN Rivesaltes Ambré 2016", 
    category: "vins", 
    price: 19.00, 
    description: "Millésime exceptionnel", 
    inStock: true, 
    rating: 4.7, 
    quantity: "75cL",
    image: "https://via.placeholder.com/200/FF8C00/FFFFFF?text=Ambre+2016"
  },
  { 
    name: "AOP Côtes du Roussillon Rouge Sans sulfites", 
    category: "vins", 
    price: 9.60, 
    description: "Vin rouge bio sans sulfites ajoutés", 
    inStock: true, 
    rating: 4.3, 
    quantity: "75cL",
    image: "https://via.placeholder.com/200/8B0000/FFFFFF?text=Rouge+Bio"
  },
  { 
    name: "AOP Côtes du Roussillon Rouge cuvée Gérard", 
    category: "vins", 
    price: 9.60, 
    description: "Cuvée prestige du domaine", 
    inStock: true, 
    rating: 4.5, 
    quantity: "75cL",
    image: "https://via.placeholder.com/200/800000/FFFFFF?text=Cuvee+Gerard"
  },
  { 
    name: 'VDF "le bon sens" Rouge sans sulfites', 
    category: "vins", 
    price: 8.50, 
    description: "Vin de France naturel", 
    inStock: true, 
    rating: 4.2, 
    quantity: "75cL",
    image: "https://via.placeholder.com/200/A0522D/FFFFFF?text=Bon+Sens"
  },
  { 
    name: "IGP Côtes catalanes Rosé", 
    category: "vins", 
    price: 8.60, 
    description: "Rosé frais et fruité", 
    inStock: true, 
    rating: 4.4, 
    quantity: "75cL",
    image: "https://via.placeholder.com/200/FFB6C1/FFFFFF?text=Rose"
  },
  { 
    name: "IGP Côtes Catalanes Muscat sec", 
    category: "vins", 
    price: 7.40, 
    description: "Muscat sec aromatique", 
    inStock: true, 
    rating: 4.3, 
    quantity: "75cL",
    image: "https://via.placeholder.com/200/F0E68C/000000?text=Muscat+Sec"
  },
  { 
    name: "IGP Côtes Catalanes Chardonnay", 
    category: "vins", 
    price: 8.40, 
    description: "Chardonnay du sud", 
    inStock: true, 
    rating: 4.1, 
    quantity: "75cL",
    image: "https://via.placeholder.com/200/FFFACD/000000?text=Chardonnay"
  },

  // SPIRITUEUX
  { 
    name: "Misco (Spiritueux à base de Muscat)", 
    category: "spiritueux", 
    price: 20.00, 
    description: "Spiritueux artisanal, partenariat avec la Distillerie Nicos", 
    inStock: true, 
    rating: 4.8, 
    quantity: "50cL",
    image: "https://via.placeholder.com/200/4B0082/FFFFFF?text=Misco"
  },

  // PRODUITS DU DOMAINE (Jus et Boissons)
  { 
    name: "Nectar d'abricots", 
    category: "boissons", 
    price: 4.20, 
    description: "100% fruits du domaine", 
    inStock: true, 
    rating: 4.6, 
    quantity: "75cL",
    image: "https://via.placeholder.com/200/FF8C00/FFFFFF?text=Nectar+Abricot"
  },
  { 
    name: "Jus de raisin Merlot", 
    category: "boissons", 
    price: 3.60, 
    description: "Jus de raisin pur", 
    inStock: true, 
    rating: 4.4, 
    quantity: "75cL",
    image: "https://via.placeholder.com/200/8B0000/FFFFFF?text=Jus+Merlot"
  },
  { 
    name: "Jus de raisin Muscat", 
    category: "boissons", 
    price: 3.60, 
    description: "Jus de muscat aromatique", 
    inStock: true, 
    rating: 4.5, 
    quantity: "75cL",
    image: "https://via.placeholder.com/200/9370DB/FFFFFF?text=Jus+Muscat"
  },
  { 
    name: "Jus de raisin Mourvèdre", 
    category: "boissons", 
    price: 3.60, 
    description: "Jus de mourvèdre", 
    inStock: true, 
    rating: 4.3, 
    quantity: "75cL",
    image: "https://via.placeholder.com/200/800080/FFFFFF?text=Jus+Mourvedre"
  },
  { 
    name: "Jus de raisin Grenache Blanc", 
    category: "boissons", 
    price: 3.60, 
    description: "Jus blanc délicat", 
    inStock: true, 
    rating: 4.4, 
    quantity: "75cL",
    image: "https://via.placeholder.com/200/F5F5DC/000000?text=Jus+Grenache"
  },
  { 
    name: "BIO jus de raisin Muscat petit grain", 
    category: "boissons", 
    price: 11.00, 
    description: "Jus bio certifié", 
    inStock: true, 
    rating: 4.7, 
    quantity: "3L",
    image: "https://via.placeholder.com/200/228B22/FFFFFF?text=BIO+Muscat+3L"
  },

  // ÉPICERIE FINE
  { 
    name: "Olives vertes Lucques", 
    category: "epicerie", 
    price: 5.00, 
    description: "Olives de table premium", 
    inStock: true, 
    rating: 4.5, 
    quantity: "200g",
    image: "https://via.placeholder.com/200/808000/FFFFFF?text=Olives+Lucques"
  },
  { 
    name: "Huile d'olive", 
    category: "epicerie", 
    price: 23.60, 
    description: "Huile d'olive extra vierge", 
    inStock: true, 
    rating: 4.9, 
    quantity: "75cL",
    image: "https://via.placeholder.com/200/DAA520/FFFFFF?text=Huile+Olive"
  },
  { 
    name: "Huile essentielle de Romarin", 
    category: "epicerie", 
    price: 4.95, 
    description: "Huile essentielle pure", 
    inStock: true, 
    rating: 4.6, 
    quantity: "10ml",
    image: "https://via.placeholder.com/200/228B22/FFFFFF?text=HE+Romarin"
  },
  { 
    name: "Huile essentielle de Thym Linalol", 
    category: "epicerie", 
    price: 7.40, 
    description: "Huile essentielle de thym", 
    inStock: true, 
    rating: 4.7, 
    quantity: "5ml",
    image: "https://via.placeholder.com/200/32CD32/FFFFFF?text=HE+Thym"
  },
  { 
    name: "Huile essentielle de Lavande Maillette", 
    category: "epicerie", 
    price: 4.95, 
    description: "Lavande vraie", 
    inStock: true, 
    rating: 4.8, 
    quantity: "10ml",
    image: "https://via.placeholder.com/200/9370DB/FFFFFF?text=HE+Lavande+10ml"
  },
  { 
    name: "Huile essentielle de Lavande Maillette", 
    category: "epicerie", 
    price: 14.25, 
    description: "Lavande vraie grand format", 
    inStock: true, 
    rating: 4.8, 
    quantity: "30ml",
    image: "https://via.placeholder.com/200/8A2BE2/FFFFFF?text=HE+Lavande+30ml"
  },
  { 
    name: "Hydrolat (Thym, Romarin ou Lavande)", 
    category: "epicerie", 
    price: 5.10, 
    description: "Hydrolat artisanal", 
    inStock: true, 
    rating: 4.5, 
    quantity: "200ml",
    image: "https://via.placeholder.com/200/ADD8E6/000000?text=Hydrolat"
  },
  { 
    name: "Verveine feuilles entières", 
    category: "epicerie", 
    price: 2.25, 
    description: "Verveine séchée", 
    inStock: true, 
    rating: 4.3, 
    quantity: "15g",
    image: "https://via.placeholder.com/200/90EE90/000000?text=Verveine"
  },
  { 
    name: "Thym Cerdagne feuilles entières", 
    category: "epicerie", 
    price: 4.50, 
    description: "Thym de montagne", 
    inStock: true, 
    rating: 4.6, 
    quantity: "50g",
    image: "https://via.placeholder.com/200/556B2F/FFFFFF?text=Thym+Cerdagne"
  },
  { 
    name: "Mélisse feuilles entières", 
    category: "epicerie", 
    price: 3.30, 
    description: "Mélisse citronnée", 
    inStock: true, 
    rating: 4.4, 
    quantity: "10g",
    image: "https://via.placeholder.com/200/98FB98/000000?text=Melisse"
  },
  { 
    name: "Sarrette feuilles entières", 
    category: "epicerie", 
    price: 4.50, 
    description: "Plante aromatique rare", 
    inStock: true, 
    rating: 4.2, 
    quantity: "45g",
    image: "https://via.placeholder.com/200/6B8E23/FFFFFF?text=Sarrette"
  },
  { 
    name: "Confiture d'abricots", 
    category: "epicerie", 
    price: 4.50, 
    description: "Confiture artisanale", 
    inStock: true, 
    rating: 4.7, 
    quantity: "375g",
    image: "https://via.placeholder.com/200/FF4500/FFFFFF?text=Confiture+Abricot"
  },
  { 
    name: "Confiture de Cerises", 
    category: "epicerie", 
    price: 4.60, 
    description: "Confiture de cerises du domaine", 
    inStock: true, 
    rating: 4.6, 
    quantity: "220g",
    image: "https://via.placeholder.com/200/DC143C/FFFFFF?text=Confiture+Cerise"
  }
];

// Fonction pour importer tous les produits
export const importAllProducts = async () => {
  console.log('🚀 Début de l\'import des produits...');
  
  try {
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < allDomainProducts.length; i++) {
      const product = allDomainProducts[i];
      
      try {
        console.log(`📦 Import du produit ${i + 1}/${allDomainProducts.length}: ${product.name}`);
        
        const result = await AppwriteService.products.createProduct(product);
        console.log(`✅ Produit créé avec ID: ${result.$id}`);
        successCount++;
        
        // Petite pause pour éviter de surcharger l'API
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Erreur pour le produit "${product.name}":`, error);
        errorCount++;
      }
    }
    
    console.log(`\n🎉 Import terminé !`);
    console.log(`✅ Produits importés avec succès: ${successCount}`);
    console.log(`❌ Erreurs: ${errorCount}`);
    console.log(`📊 Total: ${allDomainProducts.length} produits`);
    
    return { success: successCount, errors: errorCount, total: allDomainProducts.length };
    
  } catch (error) {
    console.error('💥 Erreur générale lors de l\'import:', error);
    throw error;
  }
};

// Fonction pour vider la collection (utile pour recommencer)
export const clearAllProducts = async () => {
  console.log('🗑️ Suppression de tous les produits...');
  
  try {
    const existingProducts = await AppwriteService.products.getAllProducts();
    
    for (const product of existingProducts) {
      await AppwriteService.products.deleteProduct(product.$id);
      console.log(`🗑️ Produit supprimé: ${product.name}`);
    }
    
    console.log(`✅ ${existingProducts.length} produits supprimés`);
    return existingProducts.length;
    
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    throw error;
  }
};

// Fonction pour vérifier les produits existants
export const checkExistingProducts = async () => {
  try {
    const products = await AppwriteService.products.getAllProducts();
    console.log(`📊 Produits actuels dans Appwrite: ${products.length}`);
    
    if (products.length > 0) {
      console.log('Produits existants:');
      products.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name} - ${product.price}€`);
      });
    }
    
    return products;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
    throw error;
  }
};

// Script d'exécution automatique (à décommenter si vous voulez l'import automatique)
/*
(async () => {
  try {
    // Vérifier les produits existants
    await checkExistingProducts();
    
    // Si vous voulez vider d'abord (décommentez la ligne suivante)
    // await clearAllProducts();
    
    // Importer tous les produits
    const result = await importAllProducts();
    
    console.log('🎊 Import terminé avec succès !', result);
    
  } catch (error) {
    console.error('💥 Erreur durant l\'import:', error);
  }
})();
*/