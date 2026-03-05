import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type Language = 'en' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translateProduct: (product: any) => any;
}

const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      shop: 'Shop',
      bulkOrders: 'Bulk Orders',
      about: 'About',
      contact: 'Contact',
      cart: 'Cart',
      profile: 'Profile',
      admin: 'Admin',
      adminPanel: 'Admin Panel',
      search: 'Search products...',
    },
    // Common
    common: {
      menu: 'Menu',
      search: 'Search',
      loading: 'Loading...',
      error: 'Error',
      retry: 'Retry',
      close: 'Close',
    },
    // Home
    home: {
      categories: 'Categories',
      popularItems: 'Popular Items',
      todaySpecials: "Today's Specials",
    },
    // Shop
    shop: {
      popular: 'Popular',
      special: 'Today Special',
      addToCart: 'Add to Cart',
      outOfStock: 'Out of Stock',
    },
    // Cart
    cart: {
      title: 'Cart',
      empty: 'Your cart is empty',
      total: 'Total',
      checkout: 'Checkout',
    },
    // Checkout
    checkout: {
      deliveryDetails: 'Delivery Details',
      name: 'Name',
      mobile: 'Mobile Number',
      address: 'Delivery Address',
      namePlaceholder: 'Your name',
      mobilePlaceholder: '10-digit mobile number',
      addressPlaceholder: 'Full address for delivery',
      continueToPayment: 'Continue to Payment',
      orderSummary: 'Order Summary',
      payment: 'Payment',
      placeOrder: 'Place Order',
      back: 'Back',
    },
    // Auth
    auth: {
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      phone: 'Phone',
    },
  },
  ta: {
    // Navigation
    nav: {
      home: 'முகப்பு',
      shop: 'கடை',
      bulkOrders: 'மொத்த ஆர்டர்கள்',
      about: 'எங்களைப் பற்றி',
      contact: 'தொடர்பு',
      cart: 'வண்டி',
      profile: 'சுயவிவரம்',
      admin: 'நிர்வாகம்',
      adminPanel: 'நிர்வாக பலகை',
      search: 'தயாரிப்புகளைத் தேடவும்...',
    },
    'nav.search': 'தயாரிப்புகளைத் தேடவும்...',
    
    // Home page
    'home.categories': 'வகைகள்',
    'home.popularItems': 'பிரபல பொருட்கள்',
    'home.todaySpecials': 'இன்றைய சிறப்புகள்',
    
    // Common
    'common.loading': 'ஏற்றுகிறது...',
    'common.error': 'பிழை',
    'common.search': 'தேடு',
    'common.menu': 'மெனு',
    'common.close': 'மூடு',
    
    // Shop
    'shop.addToCart': 'வண்டியில் சேர்',
    'shop.outOfStock': 'ஸ்டாக் இல்லை',
    'shop.popular': 'பிரபலமான',
    'shop.special': 'சிறப்பு',
    
    // Cart
    'cart.title': 'ஷாப்பிங் கார்ட்',
    'cart.empty': 'உங்கள் வண்டி காலியாக உள்ளது',
    'cart.total': 'மொத்தம்',
    'cart.checkout': 'செக்கௌட்',
    
    // Auth
    'auth.login': 'உள்நுழைய',
    'auth.register': 'பதிவு',
    'auth.logout': 'வெளியேறு',
    'auth.email': 'மின்னஞ்சல்',
    'auth.password': 'கடவுச்சொல்',
    'auth.name': 'பெயர்',
    'auth.phone': 'தொலைபேசி',
  }
};

// Product translations - you can expand this with actual product translations
const productTranslations = {
  en: {},
  ta: {
    // Example product translations - add your actual product translations here
    'Masala Dosa': 'மசாலா தோசை',
    'Plain Dosa': 'வெறும் தோசை',
    'Idli': 'இட்லி',
    'Vada': 'வடை',
    'Pongal': 'பொங்கல்',
    'Poori': 'பூரி',
    'Chapathi': 'சப்பாத்தி',
    'Parotta': 'பரோட்டா',
    'Upma': 'உப்மா',
    'Kesari': 'கேசரி',
    'Coffee': 'காபி',
    'Tea': 'தேநீர்',
    'Sambar': 'சாம்பார்',
    'Chutney': 'சட்னி',
    'Potato Masala': 'உருளைக்கிழங்கு மசாலா',
    'Chicken Curry': 'சிக்கன் கறி',
    'Mutton Curry': 'மட்டன் கறி',
    'Vegetable Curry': 'காய்கறி',
    'Rasam': 'ரசம்',
    'Curd Rice': 'தயிர் சாதம்',
    'Lemon Rice': 'எலுமிச்சை சாதம்',
    'Coconut Rice': 'தேங்காய் சாதம்',
    'Tomato Rice': 'தக்காளி சாதம்',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'en' || saved === 'ta')) {
      setLanguage(saved);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  const translateProduct = (product: any) => {
    const translations = productTranslations[language];
    const translatedName = translations[product.name as keyof typeof translations] || product.name;
    const translatedDescription = translations[product.description as keyof typeof translations] || product.description;
    
    return {
      ...product,
      name: translatedName,
      description: translatedDescription
    };
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t, translateProduct }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
