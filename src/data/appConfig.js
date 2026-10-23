/**
 * Tisna Car Care - Central Application Configuration
 * 
 * Supports dynamic admin price overrides via localStorage
 * and centralized fallbacks.
 */
import { storage, DEFAULT_PRICING } from '../utils/storage';

export const appConfig = {
  brand: {
    name: "Tisna Car Care",
    tagline: "Clean. Protect. Drive Better.",
    shortName: "Tisna",
    codePrefix: "TCC",
    logoImage: "/assets/logo.svg",
    supportEmail: "support@tisnacarcare.com",
    address: "Sector 76, Noida, Uttar Pradesh, 201301",
    workingHours: "8:00 AM - 7:00 PM (All 7 Days)",
    serviceLocation: "Delhi NCR • Noida • Greater Noida • Gurugram"
  },

  // Client Payment & WhatsApp Configuration (Professional English Instructions)
  payment: {
    qrCodeImage: "/assets/client-qr.png",
    paymentPhone: "+91 98765 43210",
    rawPhone: "9876543210",
    whatsappNumber: "919876543210",
    upiId: "tisnacarcare@upi",
    paymentInstruction: "Please make the payment by scanning this QR code, and send the payment screenshot to the WhatsApp number below to verify your booking.",
    instructionStep1: "Scan this QR code using any UPI app (Google Pay, PhonePe, Paytm, or BHIM) and pay the exact amount.",
    instructionStep2: "Take a screenshot of the completed payment and send it to our WhatsApp number to confirm your slot.",
    platformFee: 0,
    currencySymbol: "₹",
    currencyCode: "INR",
  },

  // Static structure templates for Plans
  regularPlans: {
    basic: {
      id: "basic",
      name: "Basic Service",
      tagline: "Daily exterior & interior routine doorstep cleaning",
      image: "/assets/service-banner.jpg",
      features: [
        "Exterior wash (daily)",
        "Interior vacuum (daily)",
        "Dashboard & console clean",
        "Tyre cleaning & dressing",
        "Basic glass & mirror cleaning"
      ],
      durations: [
        { id: "daily", type: "daily", label: "Daily Wash", badge: "Per Day", billingText: "Single day professional service" },
        { id: "1m", type: "subscription", months: 1, label: "1 Month", badge: null, billingText: "Billed monthly (Best for daily clean)" },
        { id: "3m", type: "subscription", months: 3, label: "3 Months", badge: "Save 7%", billingText: "Billed every 3 months" },
        { id: "6m", type: "subscription", months: 6, label: "6 Months", badge: "Save 11%", billingText: "Billed every 6 months" }
      ]
    },
    premium: {
      id: "premium",
      name: "Premium Service",
      tagline: "Comprehensive care with deep interior detailing & shine",
      image: "/assets/service-premium.jpg",
      features: [
        "All Basic features included",
        "Interior deep clean & sanitization",
        "Tyre & glass premium cleaning",
        "Door jambs thorough wipe down",
        "Hydrophobic windscreen coat"
      ],
      durations: [
        { id: "daily", type: "daily", label: "Daily Wash", badge: "Per Day", billingText: "Single day premium deep clean" },
        { id: "1m", type: "subscription", months: 1, label: "1 Month", badge: null, billingText: "Billed monthly" },
        { id: "3m", type: "subscription", months: 3, label: "3 Months", badge: "Save 7%", billingText: "Billed every 3 months" },
        { id: "6m", type: "subscription", months: 6, label: "6 Months", badge: "Save 11%", billingText: "Billed every 6 months" }
      ]
    }
  },

  // Base list of Other Services
  otherServicesList: [
    {
      id: "jet-spray",
      name: "Washing (Jet Spray)",
      description: "High pressure water wash for exterior, underbody rinse, and wheel arches",
      duration: "30-45 mins",
      image: "/assets/service-jet-spray.jpg",
      category: "Exterior",
      features: ["Underbody wash", "High-pressure foam rinse", "Microfiber dry", "Tyre dressing"]
    },
    {
      id: "dry-clean",
      name: "Dry Clean",
      description: "Complete interior dry cleaning, upholstery shampoo, and carpet vacuum",
      duration: "90-120 mins",
      image: "/assets/service-dry-clean.jpg",
      category: "Interior",
      features: ["Upholstery shampoo", "Ceiling/Roof dry clean", "Carpet deep vacuum", "AC vent sanitization"]
    },
    {
      id: "polishing",
      name: "Polishing",
      description: "Restore paint shine, reduce minor swirls, and apply carnauba protective wax",
      duration: "45-60 mins",
      image: "/assets/service-polishing.jpg",
      category: "Exterior",
      features: ["Machine buffing", "Carnauba wax polish", "Swirl marks reduction", "Mirror gloss finish"]
    },
    {
      id: "glass-cleaning",
      name: "Glass Cleaning",
      description: "Complete glass, mirror & windshield streak-free cleaning with rain repellent",
      duration: "20-30 mins",
      image: "/assets/service-glass-clean.jpg",
      category: "Glass & Lights",
      features: ["Streak-free glass cleaner", "Water spot removal", "Rain repellent coating", "Mirrors polish"]
    },
    {
      id: "engine-bay-clean",
      name: "Engine Bay Clean",
      description: "Remove dust, grime & oil grease safely with low pressure detailing",
      duration: "30-45 mins",
      image: "/assets/service-engine-bay.jpg",
      category: "Engine",
      features: ["Degreasing engine components", "Low pressure gentle rinse", "Silicone dressing", "Plastic restoration"]
    }
  ],

  // Available Time Slots for Booking
  timeSlots: [
    { id: "morning", title: "Morning", timeRange: "8:00 AM - 11:00 AM", subtitle: "Daily Morning Wash" },
    { id: "afternoon", title: "Afternoon", timeRange: "11:00 AM - 2:00 PM", subtitle: "Midday Clean" },
    { id: "evening", title: "Evening", timeRange: "2:00 PM - 5:00 PM", subtitle: "Post-Work Wash" }
  ],

  // Supported Car Types
  carTypes: [
    { id: "hatchback", label: "Small / Hatchback", shortLabel: "Small / Hatch", defaultBasic: 500, defaultPremium: 800, image: "/assets/hatchback-car.jpg" },
    { id: "sedan", label: "Sedan", shortLabel: "Sedan", defaultBasic: 600, defaultPremium: 1100, image: "/assets/honda-city.png" },
    { id: "suv", label: "SUV", shortLabel: "SUV", defaultBasic: 700, defaultPremium: 1300, image: "/assets/suv-car.jpg" },
    { id: "luxury", label: "Luxury", shortLabel: "Luxury", defaultBasic: 850, defaultPremium: 1600, image: "/assets/luxury-car.jpg" }
  ],

  carImages: {
    hatchback: "/assets/hatchback-car.jpg",
    sedan: "/assets/honda-city.png",
    suv: "/assets/suv-car.jpg",
    luxury: "/assets/luxury-car.jpg"
  },

  getCarImage: (segment = "sedan") => {
    const key = (segment || "").toLowerCase();
    if (key.includes("hatch") || key.includes("small")) return "/assets/hatchback-car.jpg";
    if (key.includes("suv") || key.includes("creta")) return "/assets/suv-car.jpg";
    if (key.includes("lux")) return "/assets/luxury-car.jpg";
    return "/assets/honda-city.png";
  },

  // Dynamic getters that fetch updated Admin pricing
  getCarDailyPrice: (planKey = "basic", carType = "sedan") => {
    const pricing = storage.getPricing();
    const typePricing = pricing.carTypePricing?.[planKey] || DEFAULT_PRICING.carTypePricing[planKey];
    return typePricing[carType] || typePricing.sedan;
  },

  getSubscriptionPrice: (planKey = "basic", durationId = "1m") => {
    const pricing = storage.getPricing();
    const planPrices = pricing.subscriptionPlans?.[planKey] || DEFAULT_PRICING.subscriptionPlans[planKey];
    return planPrices[durationId] || planPrices['1m'];
  },

  getOtherServices: () => {
    const pricing = storage.getPricing();
    return appConfig.otherServicesList.map(item => ({
      ...item,
      price: pricing.otherServices?.[item.id] ?? DEFAULT_PRICING.otherServices[item.id]
    }));
  },

  getPaymentDetails: () => {
    const pricing = storage.getPricing();
    const storedPhone = pricing.payment?.paymentPhone;
    const storedWa = pricing.payment?.whatsappNumber;

    // Check if whatsapp was customized away from default
    const isCustomWa = storedWa && storedWa.replace(/\D/g, '') !== '919876543210' && storedWa.replace(/\D/g, '') !== '9876543210';
    const isDefaultPhone = !storedPhone || storedPhone === '+91 98765 43210' || storedPhone.replace(/\D/g, '') === '919876543210';

    let displayPhone = storedPhone;
    if (isCustomWa && (isDefaultPhone || !storedPhone)) {
      const clean = storedWa.replace(/\D/g, '').replace(/^91/, '');
      displayPhone = clean.length === 10 ? `+91 ${clean.slice(0, 5)} ${clean.slice(5)}` : storedWa;
    } else if (displayPhone && !displayPhone.startsWith('+') && !displayPhone.startsWith('91')) {
      const clean = displayPhone.replace(/\D/g, '');
      if (clean.length === 10) {
        displayPhone = `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
      }
    }

    let waDigits = (storedWa || storedPhone || appConfig.payment.whatsappNumber).toString().replace(/\D/g, '');
    if (waDigits.length === 10) {
      waDigits = `91${waDigits}`;
    }

    return {
      ...appConfig.payment,
      paymentPhone: displayPhone || appConfig.payment.paymentPhone,
      whatsappNumber: waDigits || appConfig.payment.whatsappNumber,
      upiId: pricing.payment?.upiId || appConfig.payment.upiId,
      platformFee: pricing.payment?.platformFee ?? appConfig.payment.platformFee
    };
  },

  // Helper method to build WhatsApp pre-filled message URL in clean professional text (no emojis)
  getWhatsAppShareUrl: ({ bookingId, customerName, customerPhone, carNumber, serviceName, startDate, timeSlot, address, amount }) => {
    const payment = appConfig.getPaymentDetails();
    const text = `Hello Tisna Car Care team,

I have booked doorstep car care and completed payment:

- Booking ID: ${bookingId}
- Customer: ${customerName || 'Customer'} (${customerPhone || ''})
- Vehicle: ${carNumber || ''}
- Service: ${serviceName}
- Date: ${startDate || 'Tomorrow'}
- Slot: ${timeSlot || 'Morning'}
- Address: ${address || ''}
- Amount Paid: Rs. ${amount ? amount.toLocaleString('en-IN') : '0'}

Please find my payment screenshot attached. Kindly verify and confirm my booking slot. Thank you!`;
    return `https://wa.me/${payment.whatsappNumber}?text=${encodeURIComponent(text)}`;
  }
};

export default appConfig;
