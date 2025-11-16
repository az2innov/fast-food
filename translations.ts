
import { AppTranslations } from './types';

export const translations: AppTranslations = {
  en: {
    appName: "1st Food DZ",
    currency: "DZD",
    nav: {
      menu: "Menu",
      trackOrder: "Track Order",
      admin: "Admin",
      cart: "Cart",
    },
    auth: {
      loginAsCustomer: "Login as Customer",
      loginAsAdmin: "Login as Admin",
      logout: "Logout",
      welcome: "Welcome",
    },
    adminLogin: {
        title: "Admin Login",
        username: "Username",
        password: "Password",
        login: "Login",
        error: "Invalid credentials. Please try again.",
    },
    menu: {
      title: "Our Menu",
      addToCart: "Add to Cart",
      promotion: "Promotion",
      categories: {
        all: "All",
        burgers: "Burgers",
        sides: "Sides",
        drinks: "Drinks",
        desserts: "Desserts",
      },
    },
    cart: {
      title: "Your Cart",
      empty: "Your cart is empty.",
      subtotal: "Subtotal",
      checkout: "Checkout",
      total: "Total",
      remove: "Remove",
    },
    checkout: {
      title: "Checkout",
      success: "Order Placed!",
      successMessage: "Your order is being prepared. You can track its status on the Track Order page.",
      cashSuccessMessage: "Your order has been placed! Please keep your phone nearby as we will call you to confirm. Payment will be collected upon delivery/pickup.",
      yourOrderId: "Your Order ID",
      customerName: "Your Name",
      customerPhone: "Your Phone Number",
      paymentMethod: "Payment Method",
      cardPayment: "Card Payment",
      cashPayment: "Cash Payment",
      cardNumber: "Card Number",
      expiryDate: "Expiry Date",
      cvc: "CVC",
      payNow: "Pay Now",
      placeOrder: "Place Order",
      cashPaymentInfo: "For cash payments, our staff will contact you via WhatsApp or phone call to confirm your order before preparation.",
      backToMenu: "Back to Menu",
      verification: {
        title: "Order Verification",
        message: "A mock confirmation code has been sent. Please enter it to confirm.",
        placeholder: "Confirmation code (1001)",
        confirm: "Confirm",
        cancel: "Cancel",
        errorCode: "Incorrect code. Please try again.",
      },
      receipt: {
        title: "Order Receipt",
        orderId: "Order Number",
        date: "Date",
        summary: "Order Summary",
        prepTime: "Estimated Preparation Time",
        minutes: "minutes"
      }
    },
    orderStatus: {
      title: "Track Your Order",
      enterId: "Enter your order ID",
      track: "Track",
      status: "Status",
      statuses: {
        pending: "Pending",
        preparing: "Preparing",
        ready: "Ready for Pickup",
        delivered: "Delivered",
        cancelled: "Cancelled",
      },
      notFound: "Order not found.",
    },
    admin: {
      dashboard: "Admin Dashboard",
      orders: "Live Orders",
      menuItems: "Menu Items",
      orderId: "Order ID",
      customer: "Customer",
      orderDate: "Date",
      total: "Total",
      status: "Status",
      actions: "Actions",
      updateStatus: "Update Status",
      addMenuItem: "Add New Menu Item",
      edit: "Edit",
      delete: "Delete",
      details: "Details",
      promotions: {
          title: "Promotional Programs"
      },
      addPromotionForm: {
          title: "Add New Promotion",
          name: "Promotion Name",
          discount: "Discount (%)",
          description: "Description",
          category: "Applicable Category",
          add: "Add Promotion"
      },
      editPromotionModal: {
          title: "Edit Promotion"
      },
      addMenuItemModal: {
          title: "Add New Menu Item"
      },
      editMenuItemModal: {
          title: "Edit Menu Item"
      },
      menuItemForm: {
          name: "Name",
          description: "Description",
          price: "Price",
          category: "Category",
          imageUrl: "Image URL",
          save: "Save"
      },
      orderDetailsModal: {
          title: "Order Details"
      },
      confirmDelete: {
        title: "Confirm Deletion",
        message: "Are you sure you want to delete this item? This action cannot be undone.",
        messagePromo: "Are you sure you want to delete this promotion? This action cannot be undone.",
        confirm: "Delete"
      },
      alerts: {
        deleteSuccess: "Item deleted successfully.",
        deleteError: "Failed to delete item. Please try again.",
        promoDeleteSuccess: "Promotion deleted successfully.",
        promoDeleteError: "Failed to delete promotion. Please try again."
      }
    },
    ai: {
      assistant: "AI Assistant",
      placeholder: "Ask me about our menu...",
      greeting: "Hello! I'm your AI assistant. How can I help you today? You can ask me for recommendations, promotions, or details about our food!",
    },
  },
  fr: {
    appName: "1st Food DZ",
    currency: "DZD",
    nav: {
      menu: "Menu",
      trackOrder: "Suivre la Commande",
      admin: "Admin",
      cart: "Panier",
    },
    auth: {
      loginAsCustomer: "Connexion Client",
      loginAsAdmin: "Connexion Admin",
      logout: "Déconnexion",
      welcome: "Bienvenue",
    },
    adminLogin: {
        title: "Connexion Admin",
        username: "Nom d'utilisateur",
        password: "Mot de passe",
        login: "Se connecter",
        error: "Identifiants invalides. Veuillez réessayer.",
    },
    menu: {
      title: "Notre Menu",
      addToCart: "Ajouter au Panier",
      promotion: "Promotion",
      categories: {
        all: "Tous",
        burgers: "Burgers",
        sides: "Accompagnements",
        drinks: "Boissons",
        desserts: "Desserts",
      },
    },
    cart: {
      title: "Votre Panier",
      empty: "Votre panier est vide.",
      subtotal: "Sous-total",
      checkout: "Payer",
      total: "Total",
      remove: "Retirer",
    },
    checkout: {
      title: "Paiement",
      success: "Commande Passée !",
      successMessage: "Votre commande est en cours de préparation. Vous pouvez suivre son statut sur la page Suivre la Commande.",
      cashSuccessMessage: "Votre commande a bien été passée ! Veuillez garder votre téléphone à proximité, nous vous appellerons pour confirmer. Le paiement s'effectuera à la livraison/récupération.",
      yourOrderId: "Votre ID de Commande",
      customerName: "Votre Nom",
      customerPhone: "Votre Numéro de Téléphone",
      paymentMethod: "Méthode de Paiement",
      cardPayment: "Paiement par Carte",
      cashPayment: "Paiement en Espèces",
      cardNumber: "Numéro de Carte",
      expiryDate: "Date d'Expiration",
      cvc: "CVC",
      payNow: "Payer Maintenant",
      placeOrder: "Passer la Commande",
      cashPaymentInfo: "Pour les paiements en espèces, notre équipe vous contactera par WhatsApp ou par téléphone pour confirmer votre commande avant sa préparation.",
      backToMenu: "Retour au Menu",
      verification: {
        title: "Vérification de la Commande",
        message: "Un code de confirmation fictif a été envoyé. Veuillez le saisir pour valider.",
        placeholder: "Code de confirmation (1001)",
        confirm: "Confirmer",
        cancel: "Annuler",
        errorCode: "Code incorrect. Veuillez réessayer.",
      },
      receipt: {
        title: "Reçu de Commande",
        orderId: "Numéro de Commande",
        date: "Date",
        summary: "Résumé de la Commande",
        prepTime: "Temps de préparation estimé",
        minutes: "minutes"
      }
    },
    orderStatus: {
      title: "Suivre Votre Commande",
      enterId: "Entrez votre ID de commande",
      track: "Suivre",
      status: "Statut",
      statuses: {
        pending: "En attente",
        preparing: "En préparation",
        ready: "Prête à être récupérée",
        delivered: "Livrée",
        cancelled: "Annulée",
      },
      notFound: "Commande non trouvée.",
    },
    admin: {
      dashboard: "Tableau de Bord Admin",
      orders: "Commandes en Direct",
      menuItems: "Articles du Menu",
      orderId: "ID Commande",
      customer: "Client",
      orderDate: "Date",
      total: "Total",
      status: "Statut",
      actions: "Actions",
      updateStatus: "Mettre à jour le statut",
      addMenuItem: "Ajouter un Article",
      edit: "Modifier",
      delete: "Supprimer",
      details: "Détails",
      promotions: {
        title: "Programmes Promotionnels"
      },
      addPromotionForm: {
          title: "Ajouter une Nouvelle Promotion",
          name: "Nom de la promotion",
          discount: "Remise (%)",
          description: "Description",
          category: "Catégorie Applicable",
          add: "Ajouter la Promotion"
      },
      editPromotionModal: {
          title: "Modifier la Promotion"
      },
      addMenuItemModal: {
          title: "Ajouter un Nouvel Article au Menu"
      },
      editMenuItemModal: {
          title: "Modifier l'Article du Menu"
      },
      menuItemForm: {
          name: "Nom",
          description: "Description",
          price: "Prix",
          category: "Catégorie",
          imageUrl: "URL de l'image",
          save: "Enregistrer"
      },
      orderDetailsModal: {
          title: "Détails de la Commande"
      },
      confirmDelete: {
        title: "Confirmer la Suppression",
        message: "Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.",
        messagePromo: "Êtes-vous sûr de vouloir supprimer cette promotion ? Cette action est irréversible.",
        confirm: "Supprimer"
      },
      alerts: {
        deleteSuccess: "Article supprimé avec succès.",
        deleteError: "Échec de la suppression de l'article. Veuillez réessayer.",
        promoDeleteSuccess: "Promotion supprimée avec succès.",
        promoDeleteError: "Échec de la suppression de la promotion. Veuillez réessayer."
      }
    },
    ai: {
      assistant: "Assistant IA",
      placeholder: "Demandez-moi sur notre menu...",
      greeting: "Bonjour! Je suis votre assistant IA. Comment puis-je vous aider aujourd'hui? Vous pouvez me demander des recommandations, des promotions ou des détails sur nos plats!",
    },
  },
  ar: {
    appName: "1st Food DZ",
    currency: "د.ج",
    nav: {
      menu: "قائمة الطعام",
      trackOrder: "تتبع الطلب",
      admin: "الإدارة",
      cart: "سلة المشتريات",
    },
    auth: {
      loginAsCustomer: "تسجيل الدخول كعميل",
      loginAsAdmin: "تسجيل الدخول كمدير",
      logout: "تسجيل الخروج",
      welcome: "مرحباً",
    },
     adminLogin: {
        title: "تسجيل دخول المسؤول",
        username: "اسم المستخدم",
        password: "كلمة المرور",
        login: "تسجيل الدخول",
        error: "بيانات الاعتماد غير صالحة. يرجى المحاولة مرة أخرى.",
    },
    menu: {
      title: "قائمة طعامنا",
      addToCart: "أضف إلى السلة",
      promotion: "عرض خاص",
      categories: {
        all: "الكل",
        burgers: "برجر",
        sides: "أطباق جانبية",
        drinks: "مشروبات",
        desserts: "حلويات",
      },
    },
    cart: {
      title: "سلة مشترياتك",
      empty: "سلة مشترياتك فارغة.",
      subtotal: "المجموع الفرعي",
      checkout: "الدفع",
      total: "المجموع الكلي",
      remove: "إزالة",
    },
    checkout: {
      title: "الدفع",
      success: "تم استلام الطلب!",
      successMessage: "طلبك قيد التحضير. يمكنك تتبع حالته في صفحة تتبع الطلب.",
      cashSuccessMessage: "تم استلام طلبك بنجاح! يرجى إبقاء هاتفك قريبًا حيث سنتصل بك للتأكيد. سيتم تحصيل المبلغ عند الاستلام.",
      yourOrderId: "رقم طلبك",
      customerName: "اسمك",
      customerPhone: "رقم هاتفك",
      paymentMethod: "طريقة الدفع",
      cardPayment: "الدفع بالبطاقة",
      cashPayment: "الدفع نقداً",
      cardNumber: "رقم البطاقة",
      expiryDate: "تاريخ انتهاء الصلاحية",
      cvc: "CVC",
      payNow: "ادفع الآن",
      placeOrder: "إرسال الطلب",
      cashPaymentInfo: "للمدفوعات النقدية، سيتصل بك فريقنا عبر الواتساب أو الهاتف لتأكيد طلبك قبل التحضير.",
      backToMenu: "العودة إلى القائمة",
      verification: {
        title: "تأكيد الطلب",
        message: "تم إرسال رمز تأكيد وهمي. الرجاء إدخاله للتأكيد.",
        placeholder: "رمز التأكيد (1001)",
        confirm: "تأكيد",
        cancel: "إلغاء",
        errorCode: "الرمز غير صحيح. يرجى المحاولة مرة أخرى.",
      },
      receipt: {
        title: "إيصال الطلب",
        orderId: "رقم الطلب",
        date: "التاريخ",
        summary: "ملخص الطلب",
        prepTime: "وقت التحضير المقدر",
        minutes: "دقائق"
      }
    },
    orderStatus: {
      title: "تتبع طلبك",
      enterId: "أدخل رقم طلبك",
      track: "تتبع",
      status: "الحالة",
      statuses: {
        pending: "قيد الانتظار",
        preparing: "قيد التحضير",
        ready: "جاهز للاستلام",
        delivered: "تم التوصيل",
        cancelled: "ملغاة",
      },
      notFound: "الطلب غير موجود.",
    },
    admin: {
      dashboard: "لوحة تحكم المدير",
      orders: "الطلبات الحالية",
      menuItems: "عناصر القائمة",
      orderId: "رقم الطلب",
      customer: "العميل",
      orderDate: "التاريخ",
      total: "المجموع",
      status: "الحالة",
      actions: "إجراءات",
      updateStatus: "تحديث الحالة",
      addMenuItem: "إضافة عنصر جديد للقائمة",
      edit: "تعديل",
      delete: "حذف",
      details: "تفاصيل",
      promotions: {
          title: "البرامج الترويجية"
      },
      addPromotionForm: {
          title: "إضافة عرض ترويجي جديد",
          name: "اسم العرض",
          discount: "الخصم (%)",
          description: "الوصف",
          category: "الفئة المستهدفة",
          add: "إضافة العرض"
      },
      editPromotionModal: {
          title: "تعديل العرض الترويجي"
      },
      addMenuItemModal: {
          title: "إضافة عنصر قائمة جديد"
      },
      editMenuItemModal: {
          title: "تعديل عنصر القائمة"
      },
      menuItemForm: {
          name: "الاسم",
          description: "الوصف",
          price: "السعر",
          category: "الفئة",
          imageUrl: "رابط الصورة",
          save: "حفظ"
      },
      orderDetailsModal: {
          title: "تفاصيل الطلب"
      },
      confirmDelete: {
        title: "تأكيد الحذف",
        message: "هل أنت متأكد أنك تريد حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.",
        messagePromo: "هل أنت متأكد أنك تريد حذف هذه الحملة الترويجية؟ لا يمكن التراجع عن هذا الإجراء.",
        confirm: "حذف"
      },
      alerts: {
        deleteSuccess: "تم حذف العنصر بنجاح.",
        deleteError: "فشل حذف العنصر. يرجى المحاولة مرة أخرى.",
        promoDeleteSuccess: "تم حذف العرض الترويجي بنجاح.",
        promoDeleteError: "فشل حذف العرض الترويجي. يرجى المحاولة مرة أخرى."
      }
    },
    ai: {
      assistant: "المساعد الذكي",
      placeholder: "اسألني عن قائمة طعامنا...",
      greeting: "أهلاً بك! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟ يمكنك أن تسألني عن توصيات، عروض خاصة، أو تفاصيل عن أطباقنا!",
    },
  },
};