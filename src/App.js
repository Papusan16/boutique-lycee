// src/App.js
import React, { useState, useEffect, createContext, useContext } from 'react';
import { ShoppingCart, Plus, Minus, Search, LogIn, LogOut, Star } from 'lucide-react';
import { AppwriteService } from './appwriteServices';
import './App.css';

// Context pour l'authentification
const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await AppwriteService.auth.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      const user = await AppwriteService.auth.login(email, password);
      setUser(user);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AppwriteService.auth.logout();
      setUser(null);
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  const register = async (email, password, name) => {
    try {
      const user = await AppwriteService.auth.register(email, password, name);
      setUser(user);
      return true;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Composant de confirmation de commande
const OrderSuccessModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-xl p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Commande confirmée !</h3>
          <p className="text-sm text-gray-500 mb-4">
            Votre commande #{order.orderNumber} a été confirmée avec succès.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left">
            <h4 className="font-semibold text-sm mb-2">Détails de la commande :</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div>Total : {order.totalAmount}€</div>
              <div>Articles : {Array.isArray(order.items) ? order.items.length : JSON.parse(order.items || '[]').length} produit(s)</div>
              <div>Statut : Confirmée</div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            Continuer mes achats
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant de processus de commande
const CheckoutModal = ({ isOpen, onClose, cart, totalPrice, onPlaceOrder }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: 'France'
    },
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmitOrder = async () => {
    setIsProcessing(true);
    try {
      await onPlaceOrder(formData);
    } catch (error) {
      console.error('Erreur commande:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-90vh overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Finaliser la commande</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>

          <div className="flex items-center mb-8">
            <div className={`flex items-center ${step >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>1</div>
              <span className="ml-2">Livraison</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div className={`h-full ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'} transition-all`}></div>
            </div>
            <div className={`flex items-center ${step >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>2</div>
              <span className="ml-2">Paiement</span>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Adresse de livraison</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                  placeholder="Numéro et nom de rue"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                    placeholder="Ville"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                  <input
                    type="text"
                    value={formData.address.postalCode}
                    onChange={(e) => handleInputChange('address', 'postalCode', e.target.value)}
                    placeholder="Code postal"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!formData.address.street || !formData.address.city || !formData.address.postalCode}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuer vers le paiement
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Informations de paiement</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Méthode de paiement</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={(e) => handleInputChange(null, 'paymentMethod', e.target.value)}
                      className="mr-2"
                    />
                    Carte bancaire
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={(e) => handleInputChange(null, 'paymentMethod', e.target.value)}
                      className="mr-2"
                    />
                    PayPal
                  </label>
                </div>
              </div>

              {formData.paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de carte</label>
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange(null, 'cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
                      <input
                        type="text"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange(null, 'expiryDate', e.target.value)}
                        placeholder="MM/AA"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange(null, 'cvv', e.target.value)}
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom sur la carte</label>
                    <input
                      type="text"
                      value={formData.nameOnCard}
                      onChange={(e) => handleInputChange(null, 'nameOnCard', e.target.value)}
                      placeholder="Nom complet"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Récapitulatif de la commande</h4>
                <div className="space-y-1 text-sm">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{(item.price * item.quantity).toFixed(2)}€</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 font-semibold flex justify-between">
                    <span>Total</span>
                    <span>{totalPrice}€</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400"
                >
                  Retour
                </button>
                <button
                  onClick={handleSubmitOrder}
                  disabled={isProcessing}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {isProcessing ? 'Traitement...' : `Payer ${totalPrice}€`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Composant de connexion/inscription
const AuthModal = ({ isOpen, onClose, mode, onSwitchMode, onLogin, onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!name.trim() || name.length < 2) {
          throw new Error('Le nom doit contenir au moins 2 caractères');
        }
      }

      if (!email.trim() || !email.includes('@')) {
        throw new Error('Veuillez entrer un email valide');
      }

      if (!password.trim() || password.length < 8) {
        throw new Error('Le mot de passe doit contenir au moins 8 caractères');
      }

      if (mode === 'login') {
        await onLogin(email, password);
      } else {
        await onRegister(email, password, name);
      }

      setEmail('');
      setPassword('');
      setName('');
      setError('');
      onClose();

    } catch (error) {
      setError(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4">
          {mode === 'login' ? 'Connexion' : 'Inscription'}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nom *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Votre nom complet"
                required
                minLength="2"
              />
            </div>
          )}
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="votre@email.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Mot de passe *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder={mode === 'register' ? 'Minimum 8 caractères' : 'Votre mot de passe'}
              required
              minLength="8"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {mode === 'login' ? 'Connexion...' : 'Inscription...'}
              </div>
            ) : (
              mode === 'login' ? 'Se connecter' : "S'inscrire"
            )}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={onSwitchMode}
            className="text-green-600 hover:text-green-700 text-sm"
          >
            {mode === 'login' 
              ? "Pas encore de compte ? S'inscrire" 
              : "Déjà un compte ? Se connecter"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant principal
const GroceryStoreApp = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  const { user, logout, loading, login, register } = useAuth();

  const categories = [
    { id: 'all', name: 'Tous les produits' },
    { id: 'vins', name: 'Vins du domaine' },
    { id: 'spiritueux', name: 'Spiritueux' },
    { id: 'boissons', name: 'Boissons' },
    { id: 'epicerie', name: 'Épicerie fine' }
  ];

  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);
      try {
        const appwriteProducts = await AppwriteService.products.getAllProducts();
        
        if (appwriteProducts && appwriteProducts.length > 0) {
          setProducts(appwriteProducts);
          console.log('✅ Produits chargés depuis Appwrite:', appwriteProducts.length);
        } else {
          console.log('📦 Aucun produit trouvé dans Appwrite');
          setProducts([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = async (product) => {
    if (!user) {
      setIsAuthModalOpen(true);
      setAuthMode('login');
      return;
    }

    setCart(prevCart => {
      const productId = product.$id || product.id || product.name;
      const existingItem = prevCart.find(item => (item.$id || item.id || item.name) === productId);
      
      if (existingItem) {
        return prevCart.map(item =>
          (item.$id || item.id || item.name) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, id: productId, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => (item.$id || item.id || item.name) === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          (item.$id || item.id || item.name) === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prevCart.filter(item => (item.$id || item.id || item.name) !== productId);
    });
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const placeOrder = async (orderData) => {
    try {
      const newOrder = {
        userId: user.$id,
        items: JSON.stringify(cart),
        totalAmount: parseFloat(getTotalPrice()),
        status: 'confirmed',
        shippingAddress: JSON.stringify(orderData.address),
        paymentMethod: orderData.paymentMethod,
        orderNumber: 'CMD-' + Math.random().toString(36).substr(2, 9).toUpperCase()
      };
      
      try {
        const savedOrder = await AppwriteService.orders.createOrder(newOrder);
        newOrder.id = savedOrder.$id;
        newOrder.$createdAt = savedOrder.$createdAt;
        console.log('✅ Commande sauvegardée dans Appwrite:', savedOrder);
      } catch (appwriteError) {
        console.error('⚠️ Erreur Appwrite, commande sauvegardée localement:', appwriteError);
        newOrder.id = 'order-' + Date.now();
        newOrder.$createdAt = new Date().toISOString();
      }
      
      newOrder.items = cart;
      
      setCart([]);
      
      setIsCheckoutOpen(false);
      setShowOrderSuccess(newOrder);
      
      return newOrder;
    } catch (error) {
      console.error('Erreur lors de la commande:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <span className="ml-3 text-gray-600">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-green-600">🍇 Boutique du Lycée</h1>
            </div>
            
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher des produits..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">Bonjour, {user.name}</span>
                  <button 
                    onClick={logout}
                    className="p-2 text-gray-600 hover:text-red-600"
                    title="Se déconnecter"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setAuthMode('login');
                  }}
                  className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-green-600"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Connexion</span>
                </button>
              )}
              
              <button 
                className="relative p-2 text-gray-600 hover:text-green-600"
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <ShoppingCart className="w-6 h-6" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Catégories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-green-100 text-green-800 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {loadingProducts ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                <span className="ml-3 text-gray-600">Chargement des produits...</span>
              </div>
            ) : (
              <>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Aucun produit trouvé pour cette recherche.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                      <div key={product.$id || product.id || product.name} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                          <img 
                            src={product.image || "https://via.placeholder.com/200"} 
                            alt={product.name}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                          <div className="flex items-center mb-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">{product.rating || 4.5}</span>
                            <span className="text-xs text-gray-500 ml-2">({product.unit || product.quantity})</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-green-600">{product.price?.toFixed(2) || '0.00'}€</span>
                            <button
                              onClick={() => addToCart(product)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Ajouter
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        totalPrice={getTotalPrice()}
        onPlaceOrder={placeOrder}
      />

      {/* Order Success Modal */}
      <OrderSuccessModal 
        order={showOrderSuccess}
        isOpen={!!showOrderSuccess}
        onClose={() => setShowOrderSuccess(false)}
      />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
        onLogin={login}
        onRegister={register}
      />

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Panier ({getTotalItems()})</h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Votre panier est vide</p>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.$id || item.id || item.name} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                        <img src={item.image || "https://via.placeholder.com/50"} alt={item.name} className="w-12 h-12 object-cover rounded" />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-green-600 font-semibold">{item.price?.toFixed(2) || '0.00'}€</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => removeFromCart(item.$id || item.id || item.name)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => addToCart(item)}
                            className="text-gray-400 hover:text-green-600"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="border-t p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total: {getTotalPrice()}€</span>
                  </div>
                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Commander
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// App principal avec le provider d'authentification
const App = () => {
  return (
    <AuthProvider>
      <GroceryStoreApp />
    </AuthProvider>
  );
};

export default App;