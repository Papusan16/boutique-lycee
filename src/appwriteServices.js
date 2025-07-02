// src/appwriteServices.js
import { Client, Account, Databases, ID, Query } from 'appwrite';

// Configuration Appwrite - VOS VRAIS IDs
export const APPWRITE_CONFIG = {
  endpoint: 'https://cloud.appwrite.io/v1',
  projectId: '68595bfa0034b449b053', // Votre Project ID
  databaseId: '68595c75002dbc603bce', // Votre Database ID
  collectionsIds: {
    products: '68595c88000b3c0653f4', // Votre Products Collection ID
    orders: 'orders', // Votre Orders Collection ID
    users: 'users'
  }
};

// Initialisation du client Appwrite
const client = new Client()
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId);

const account = new Account(client);
const databases = new Databases(client);

// Services Appwrite
export const AppwriteService = {
  // Authentification
  auth: {
    async login(email, password) {
      try {
        // Supprime toute session existante
        try {
          await account.deleteSession('current');
        } catch (error) {
          // Ignore l'erreur si aucune session n'existe
        }

        // Crée une nouvelle session
        await account.createEmailPasswordSession(email, password);
        
        // Récupère les informations de l'utilisateur
        const user = await account.get();
        
        return {
          $id: user.$id,
          email: user.email,
          name: user.name,
          $createdAt: user.$createdAt
        };
      } catch (error) {
        console.error('Erreur de connexion:', error);
        throw new Error(error.message || 'Email ou mot de passe incorrect');
      }
    },

    async register(email, password, name) {
      try {
        // Crée un nouveau compte
        await account.create(ID.unique(), email, password, name);
        
        // Connecte automatiquement l'utilisateur
        await account.createEmailPasswordSession(email, password);
        
        // Récupère les informations complètes
        const user = await account.get();
        
        return {
          $id: user.$id,
          email: user.email,
          name: user.name,
          $createdAt: user.$createdAt
        };
      } catch (error) {
        console.error('Erreur d\'inscription:', error);
        throw new Error(error.message || 'Erreur lors de l\'inscription');
      }
    },

    async getCurrentUser() {
      try {
        const user = await account.get();
        return {
          $id: user.$id,
          email: user.email,
          name: user.name,
          $createdAt: user.$createdAt
        };
      } catch (error) {
        return null;
      }
    },

    async logout() {
      try {
        await account.deleteSession('current');
        return true;
      } catch (error) {
        console.error('Erreur de déconnexion:', error);
        return false;
      }
    }
  },

  // Base de données
  database: {
    async createDocument(databaseId, collectionId, documentId, data) {
      try {
        const document = await databases.createDocument(
          databaseId,
          collectionId,
          documentId || ID.unique(),
          data
        );
        return document;
      } catch (error) {
        console.error('Erreur création document:', error);
        throw error;
      }
    },

    async getDocument(databaseId, collectionId, documentId) {
      try {
        const document = await databases.getDocument(databaseId, collectionId, documentId);
        return document;
      } catch (error) {
        console.error('Erreur récupération document:', error);
        throw error;
      }
    },

    async listDocuments(databaseId, collectionId, queries = []) {
      try {
        const response = await databases.listDocuments(databaseId, collectionId, queries);
        return response;
      } catch (error) {
        console.error('Erreur liste documents:', error);
        throw error;
      }
    }
  },

  // Gestion des produits
  products: {
    async getAllProducts() {
      try {
        const response = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collectionsIds.products
        );
        return response.documents;
      } catch (error) {
        console.error('Erreur récupération produits:', error);
        // Retourne les produits en dur en cas d'erreur
        return [];
      }
    },

    async createProduct(productData) {
      try {
        const product = await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collectionsIds.products,
          ID.unique(),
          productData
        );
        return product;
      } catch (error) {
        console.error('Erreur création produit:', error);
        throw error;
      }
    }
  },

  // Gestion des commandes
  orders: {
    async createOrder(orderData) {
      try {
        const order = await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collectionsIds.orders,
          ID.unique(),
          {
            ...orderData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        );
        return order;
      } catch (error) {
        console.error('Erreur création commande:', error);
        throw error;
      }
    },

    async getUserOrders(userId) {
      try {
        const response = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collectionsIds.orders,
          [
            Query.equal('userId', userId),
            Query.orderDesc('$createdAt')
          ]
        );
        return response.documents;
      } catch (error) {
        console.error('Erreur récupération commandes:', error);
        return [];
      }
    }
  }
};

export default AppwriteService;