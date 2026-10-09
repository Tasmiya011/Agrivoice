import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight, ArrowLeft, CheckCircle2, ChevronDown, FileText, Globe2,
  Home as HomeIcon, Leaf, Menu, Mic, Search, ShieldCheck, Sprout, UserRound,
  X, Upload, Volume2, LogIn, UserPlus, MapPin, Phone, Mail, Lock, Eye,
  EyeOff, HelpCircle, Settings, LogOut, Landmark, Tractor, CircleUserRound,
} from "lucide-react";
import "./styles.css";
import { api } from "./api";
import { INDIA_STATES, INDIA_DISTRICTS } from "./locations";

/*
  AgriVoice Authentic Website
  --------------------------------
  This is a complete React + Vite frontend for the major project.
  It uses React state for page navigation, so no backend is required yet.
  Replace the sample data/API calls later when your backend is ready.
*/

// Each section now uses a different relevant agriculture image instead of reusing one photo everywhere.
const images = {
  // Your uploaded/generated farmer image is kept as the main AgriVoice hero image.
  hero: "/images/hero-farmer.png",
  // Different farmer using a phone for the digital-support sections.
  farmer: "https://www.tata.com/content/dam/tata/images/newsroom/business/desktop/fields-feeds_banner_desktop_1920x1080.jpg",
  // Crop-focused image for the Fasal Bima/insurance section.
  field: "https://vulplex.com/images/featured/Indian-Female-Farmer-in-Sari-Tending-Green-Crops-in-Rural-Field-Wallpaper-69bfd33918af5.jpg",
  // Tractor image for Kisan Credit Card / farm equipment context.
  crop: "https://img.autocarpro.in/autocarpro/3bf43129-1833-4f50-aa38-7f0cbf317d67_image.png?c=1&h=490&q=75&w=750",
  // Close-up rice/wheat crop image for Soil Health.
  plant: "https://images.unsplash.com/photo-1599328580087-15c9dab481f3?auto=format&fit=crop&fm=jpg&q=85&w=1400",
  // A different field image for documents/registration areas.
  farm: "https://images.unsplash.com/photo-1495107334309-fcf20504a2ab?auto=format&fit=crop&q=85&w=1400"
};

const schemes = [
  {id:1,backendId:"S001",name:"PM Kisan Samman Nidhi", category:"Financial Support", desc:"Financial support of ₹6,000 per year to eligible farmers.", image:images.farmer},
  {id:2,backendId:"S002",name:"Pradhan Mantri Fasal Bima Yojana", category:"Insurance", desc:"Crop insurance protection for farmers against natural calamities.", image:images.field},
  {id:3,backendId:"S003",name:"Kisan Credit Card (KCC)", category:"Credit", desc:"Short-term credit support for agricultural needs.", image:images.crop},
  {id:4,backendId:"S004",name:"Soil Health Card Scheme", category:"Other", desc:"Free soil testing and recommendations.", image:images.plant}
];


const STATIC_SCHEME_LOCAL = {
  English: {
    S001:{name:"PM Kisan Samman Nidhi",category:"Financial Support",desc:"Financial support of ₹6,000 per year to eligible farmers."},
    S002:{name:"Pradhan Mantri Fasal Bima Yojana",category:"Insurance",desc:"Crop insurance protection for farmers against natural calamities."},
    S003:{name:"Kisan Credit Card (KCC)",category:"Credit",desc:"Short-term credit support for agricultural needs."},
    S004:{name:"Soil Health Card Scheme",category:"Other",desc:"Free soil testing and recommendations."}
  },
  मराठी: {
    S001:{name:"पीएम-किसान सन्मान निधी",category:"आर्थिक सहाय्य",desc:"पात्र शेतकऱ्यांना दरवर्षी ₹6,000 आर्थिक सहाय्य."},
    S002:{name:"प्रधानमंत्री फसल बीमा योजना",category:"विमा",desc:"नैसर्गिक आपत्तींमुळे होणाऱ्या पिकांच्या नुकसानीसाठी विमा संरक्षण."},
    S003:{name:"किसान क्रेडिट कार्ड (KCC)",category:"कर्ज",desc:"शेतीच्या गरजांसाठी अल्पकालीन कर्ज सहाय्य."},
    S004:{name:"मृदा आरोग्य कार्ड योजना",category:"इतर",desc:"माती परीक्षण आणि शिफारसी."}
  },
  हिंदी: {
    S001:{name:"पीएम-किसान सम्मान निधि",category:"वित्तीय सहायता",desc:"पात्र किसानों को प्रति वर्ष ₹6,000 की वित्तीय सहायता।"},
    S002:{name:"प्रधानमंत्री फसल बीमा योजना",category:"बीमा",desc:"प्राकृतिक आपदाओं से फसल नुकसान के लिए बीमा सुरक्षा।"},
    S003:{name:"किसान क्रेडिट कार्ड (KCC)",category:"ऋण",desc:"कृषि आवश्यकताओं के लिए अल्पकालिक ऋण सहायता।"},
    S004:{name:"मृदा स्वास्थ्य कार्ड योजना",category:"अन्य",desc:"मिट्टी परीक्षण और सिफारिशें।"}
  },
  कन्नड: {
    S001:{name:"ಪಿಎಂ-ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ",category:"ಆರ್ಥಿಕ ಸಹಾಯ",desc:"ಅರ್ಹ ರೈತರಿಗೆ ವರ್ಷಕ್ಕೆ ₹6,000 ಆರ್ಥಿಕ ಸಹಾಯ."},
    S002:{name:"ಪ್ರಧಾನಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ",category:"ವಿಮೆ",desc:"ನೈಸರ್ಗಿಕ ವಿಕೋಪಗಳಿಂದ ಬೆಳೆ ನಷ್ಟಕ್ಕೆ ವಿಮಾ ರಕ್ಷಣೆ."},
    S003:{name:"ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ (KCC)",category:"ಸಾಲ",desc:"ಕೃಷಿ ಅಗತ್ಯಗಳಿಗೆ ಅಲ್ಪಾವಧಿಯ ಸಾಲ ಸಹಾಯ."},
    S004:{name:"ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಯೋಜನೆ",category:"ಇತರೆ",desc:"ಮಣ್ಣು ಪರೀಕ್ಷೆ ಮತ್ತು ಶಿಫಾರಸುಗಳು."}
  }
};
function localizedStaticScheme(scheme, lang){ return scheme; }

const extraTranslations = {
  English:{country:"Country",selectCountry:"Select country",selectState:"Select state",selectDistrict:"Select district",selectFarmerType:"Select farmer type",villageHint:"Village name (2–20 characters)",talukaHint:"Taluka / Tehsil",emailHint:"Use a valid email such as name@example.com",passwordPolicy:"At least 8 characters: uppercase, lowercase, number and special character",registeredOnly:"Only registered farmers can log in.",noAccountFound:"No registered account found with these credentials.",duplicateAccount:"An account already exists with this email or mobile number.",eligibilityDetails:"Eligibility details",requiredDocuments:"Required documents",howToApply:"How to apply",why:"Why",important:"Important",officialWebsite:"Official scheme portal / application guidance",preliminary:"Preliminary guidance only. Verify the final result on the official portal.",allSchemes:"Eligible & Relevant Schemes",farmerInfo:"Farmer Information",landQuestion:"Do you own agricultural land?",taxQuestion:"Are you an income-tax payer?",cropDamageQuestion:"Is there crop damage?",cropOptional:"Crop (optional)",checkAll:"Check all scheme eligibility"},
  मराठी:{country:"देश",selectCountry:"देश निवडा",selectState:"राज्य निवडा",selectDistrict:"जिल्हा निवडा",selectFarmerType:"शेतकरी प्रकार निवडा",villageHint:"गावाचे नाव (२–२० अक्षरे)",talukaHint:"तालुका",emailHint:"वैध ईमेल उदा. name@example.com",passwordPolicy:"किमान ८ अक्षरे: मोठे अक्षर, लहान अक्षर, अंक आणि विशेष चिन्ह",registeredOnly:"फक्त नोंदणीकृत शेतकरी लॉगिन करू शकतात.",noAccountFound:"या माहितीसह नोंदणीकृत खाते सापडले नाही.",duplicateAccount:"या ईमेल किंवा मोबाईलसह खाते आधीच आहे.",eligibilityDetails:"पात्रतेचे तपशील",requiredDocuments:"आवश्यक कागदपत्रे",howToApply:"अर्ज कसा करावा",why:"का",important:"महत्त्वाचे",officialWebsite:"अधिकृत अर्ज वेबसाइट",preliminary:"हे प्राथमिक मार्गदर्शन आहे. अंतिम निकाल अधिकृत पोर्टलवर तपासा.",allSchemes:"पात्र व संबंधित योजना",farmerInfo:"शेतकरी माहिती",landQuestion:"तुमच्याकडे शेतीची जमीन आहे का?",taxQuestion:"तुम्ही आयकरदाता आहात का?",cropDamageQuestion:"पिकाचे नुकसान झाले आहे का?",cropOptional:"पीक (पर्यायी)",checkAll:"सर्व योजनांची पात्रता तपासा"},
  हिंदी:{country:"देश",selectCountry:"देश चुनें",selectState:"राज्य चुनें",selectDistrict:"जिला चुनें",selectFarmerType:"किसान प्रकार चुनें",villageHint:"गांव का नाम (2–20 अक्षर)",talukaHint:"तहसील",emailHint:"मान्य ईमेल जैसे name@example.com",passwordPolicy:"कम से कम 8 अक्षर: बड़ा अक्षर, छोटा अक्षर, अंक और विशेष चिन्ह",registeredOnly:"केवल पंजीकृत किसान लॉगिन कर सकते हैं।",noAccountFound:"इन विवरणों से कोई पंजीकृत खाता नहीं मिला।",duplicateAccount:"इस ईमेल या मोबाइल से खाता पहले से मौजूद है।",eligibilityDetails:"पात्रता विवरण",requiredDocuments:"आवश्यक दस्तावेज़",howToApply:"आवेदन कैसे करें",why:"क्यों",important:"महत्वपूर्ण",officialWebsite:"आधिकारिक आवेदन वेबसाइट",preliminary:"यह केवल प्रारंभिक मार्गदर्शन है। अंतिम परिणाम आधिकारिक पोर्टल पर जांचें।",allSchemes:"पात्र और संबंधित योजनाएं",farmerInfo:"किसान जानकारी",landQuestion:"क्या आपके पास कृषि भूमि है?",taxQuestion:"क्या आप आयकरदाता हैं?",cropDamageQuestion:"क्या फसल को नुकसान हुआ है?",cropOptional:"फसल (वैकल्पिक)",checkAll:"सभी योजनाओं की पात्रता जांचें"},
  कन्नड:{country:"ದೇಶ",selectCountry:"ದೇಶ ಆಯ್ಕೆಮಾಡಿ",selectState:"ರಾಜ್ಯ ಆಯ್ಕೆಮಾಡಿ",selectDistrict:"ಜಿಲ್ಲೆ ಆಯ್ಕೆಮಾಡಿ",selectFarmerType:"ರೈತರ ಪ್ರಕಾರ ಆಯ್ಕೆಮಾಡಿ",villageHint:"ಗ್ರಾಮದ ಹೆಸರು (2–20 ಅಕ್ಷರ)",talukaHint:"ತಾಲೂಕು",emailHint:"ಮಾನ್ಯ ಇಮೇಲ್ ಉದಾ. name@example.com",passwordPolicy:"ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳು: ದೊಡ್ಡ ಅಕ್ಷರ, ಸಣ್ಣ ಅಕ್ಷರ, ಸಂಖ್ಯೆ ಮತ್ತು ವಿಶೇಷ ಚಿಹ್ನೆ",registeredOnly:"ನೋಂದಾಯಿತ ರೈತರು ಮಾತ್ರ ಲಾಗಿನ್ ಮಾಡಬಹುದು.",noAccountFound:"ಈ ವಿವರಗಳೊಂದಿಗೆ ನೋಂದಾಯಿತ ಖಾತೆ ಕಂಡುಬಂದಿಲ್ಲ.",duplicateAccount:"ಈ ಇಮೇಲ್ ಅಥವಾ ಮೊಬೈಲ್‌ನಿಂದ ಖಾತೆ ಈಗಾಗಲೇ ಇದೆ.",eligibilityDetails:"ಅರ್ಹತಾ ವಿವರಗಳು",requiredDocuments:"ಅಗತ್ಯ ದಾಖಲೆಗಳು",howToApply:"ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ವಿಧಾನ",why:"ಏಕೆ",important:"ಮುಖ್ಯ",officialWebsite:"ಅಧಿಕೃತ ಅರ್ಜಿ ವೆಬ್‌ಸೈಟ್",preliminary:"ಇದು ಪ್ರಾಥಮಿಕ ಮಾರ್ಗದರ್ಶನ ಮಾತ್ರ. ಅಂತಿಮ ಫಲಿತಾಂಶವನ್ನು ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.",allSchemes:"ಅರ್ಹ ಮತ್ತು ಸಂಬಂಧಿತ ಯೋಜನೆಗಳು",farmerInfo:"ರೈತರ ಮಾಹಿತಿ",landQuestion:"ನಿಮ್ಮ ಬಳಿ ಕೃಷಿ ಜಮೀನು ಇದೆಯೇ?",taxQuestion:"ನೀವು ಆದಾಯ ತೆರಿಗೆದಾರರೇ?",cropDamageQuestion:"ಬೆಳೆ ಹಾನಿಯಾಗಿದೆಯೇ?",cropOptional:"ಬೆಳೆ (ಐಚ್ಛಿಕ)",checkAll:"ಎಲ್ಲಾ ಯೋಜನೆಗಳ ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ"}
};

const COMMON_I18N = {
  English: {
    select:"Select", yes:"Yes", no:"No", notSure:"Not applicable / not sure", result:"RESULT", agriSupport:"AGRI SUPPORT", smartVoiceSupport:"SMART VOICE SUPPORT", accountSettings:"ACCOUNT SETTINGS", languagePreference:"Language Preference", schemeUpdates:"Scheme Updates", schemeUpdatesText:"Receive important scheme notifications", applicationStatus:"Application Status", applicationStatusText:"Get updates about your applications", smartFarming:"Smart Farming", betterTomorrow:"Better Tomorrow", builtWith:"Built with React + Vite • Easy to customize",
    authLoginHero:"Smart farming support, in your language.", authRegisterHero:"Join AgriVoice and simplify your farming journey.", authHeroText:"Government schemes, voice assistance, eligibility checks and document guidance in one place.", createAccountText:"Create an account to save your farmer details, address and future application guidance.", enterName:"Enter your full name", registeredEmailMobile:"Registered email or 10-digit mobile", enterEmail:"Enter your email address", enterMobile:"Enter 10 digit mobile number", passwordPlaceholder:"Min 8 chars: Aa1@...", rememberMe:"Remember me", saving:"Saving...", loggingIn:"Logging in...", creating:"Creating...", loading:"Loading...", checking:"Checking...", typeQuestion:"Type your question...", send:"Send", resetConversation:"Reset Conversation", listening:"Listening...", processing:"Processing...", voiceLanguage:"Voice language", askAnything:"You can ask anything like:", speakNaturally:"Speak naturally, or type your question below.", voiceIntro:"Ask your question naturally. AgriVoice can understand scheme questions, eligibility, crop damage, documents, application steps and general farming queries instead of only three fixed questions.", availableLanguages:"Available in English, Marathi, Hindi and Kannada",
    officialLinkNote:"Always verify the latest requirements on the official portal before applying.", officialLinkAvailable:"Official application link available below", preliminaryEligibility:"Preliminary eligibility guidance is available", farmerTypeRule:"Farmer type:", otherConditions:"Other conditions:", asApplicable:"As applicable", required:"Required", optional:"Optional", mayBeRequired:"May be required", seeOfficialRules:"See official scheme rules and exclusions.", oneCheck:"One check, multiple schemes", compareAll:"AgriVoice compares the farmer information with all schemes stored in the database.", storedAddress:"Your address is stored with your AgriVoice account and is loaded again after login.", selectLanguage:"Select language",
    invalidName:"Full name should contain letters and spaces only.", invalidMobile:"Mobile number must contain exactly 10 digits.", invalidEmail:"Enter a valid email address with a valid domain.", invalidFarmerType:"Please select a valid farmer type.", invalidCountry:"Please select India as the country.", incompleteAddress:"Please complete your country, state, district, taluka and village.", invalidVillage:"Village must contain only letters/spaces and be 2–20 characters.", invalidPassword:"Password must be 8+ characters with uppercase, lowercase, number and special character.", loginIdentifier:"Enter your registered email or mobile number.", speechUnsupported:"Speech recognition is not supported in this browser. Please use Google Chrome or type your message below.", microphoneError:"Microphone error", backendError:"Could not connect to the AgriVoice backend.", assistantFallback:"I could not generate a response.",
    schemeFinancial:"Financial Support", schemeInsurance:"Insurance", schemeCredit:"Credit", schemeOther:"Other", relevantSupport:"Relevant government support for farmers.", whySuggested:"Why suggested", applyOfficial:"Apply / Official Website", cropExample:"e.g. sugarcane",
    farmerTypes:{"Landowner":"Landowner","Owner cultivator":"Owner cultivator","Marginal farmer":"Marginal farmer","Small farmer":"Small farmer","Tenant farmer":"Tenant farmer","Sharecropper":"Sharecropper","Agricultural labourer":"Agricultural labourer","Lessee farmer":"Lessee farmer","Cooperative farmer":"Cooperative farmer","Organic farmer":"Organic farmer","Tribal farmer":"Tribal farmer","Women farmer":"Women farmer","Cultivator":"Cultivator","Other":"Other"}
  },
  मराठी: {
    select:"निवडा", yes:"होय", no:"नाही", notSure:"लागू नाही / खात्री नाही", result:"निकाल", agriSupport:"कृषी सहाय्य", smartVoiceSupport:"स्मार्ट व्हॉइस सहाय्य", accountSettings:"खाते सेटिंग्ज", languagePreference:"भाषा प्राधान्य", schemeUpdates:"योजना अद्यतने", schemeUpdatesText:"महत्त्वाच्या योजना सूचना मिळवा", applicationStatus:"अर्ज स्थिती", applicationStatusText:"आपल्या अर्जाची अद्यतने मिळवा", smartFarming:"स्मार्ट शेती", betterTomorrow:"उत्तम उद्यासाठी", builtWith:"React + Vite सह तयार • सहज बदलता येते",
    authLoginHero:"आपल्या भाषेत स्मार्ट शेती सहाय्य.", authRegisterHero:"AgriVoice मध्ये सामील व्हा आणि शेतीचा प्रवास सोपा करा.", authHeroText:"शासकीय योजना, व्हॉइस सहाय्य, पात्रता तपासणी आणि कागदपत्र मार्गदर्शन एकाच ठिकाणी.", createAccountText:"आपली शेतकरी माहिती, पत्ता आणि भविष्यातील अर्ज मार्गदर्शन जतन करण्यासाठी खाते तयार करा.", enterName:"आपले पूर्ण नाव लिहा", registeredEmailMobile:"नोंदणीकृत ईमेल किंवा १० अंकी मोबाईल", enterEmail:"आपला ईमेल पत्ता लिहा", enterMobile:"१० अंकी मोबाईल क्रमांक लिहा", passwordPlaceholder:"किमान ८ अक्षरे: Aa1@...", rememberMe:"मला लक्षात ठेवा", saving:"जतन करत आहे...", loggingIn:"लॉगिन होत आहे...", creating:"खाते तयार करत आहे...", loading:"लोड होत आहे...", checking:"तपासत आहे...", typeQuestion:"आपला प्रश्न लिहा...", send:"पाठवा", resetConversation:"संवाद रीसेट करा", listening:"ऐकत आहे...", processing:"प्रक्रिया सुरू आहे...", voiceLanguage:"व्हॉइस भाषा", askAnything:"आपण असे काहीही विचारू शकता:", speakNaturally:"नैसर्गिकपणे बोला किंवा खाली प्रश्न लिहा.", voiceIntro:"आपला प्रश्न नैसर्गिकपणे विचारा. AgriVoice योजना, पात्रता, पीक नुकसान, कागदपत्रे, अर्जाच्या पायऱ्या आणि शेतीविषयक प्रश्न समजू शकतो.", availableLanguages:"इंग्रजी, मराठी, हिंदी आणि कन्नडमध्ये उपलब्ध",
    officialLinkNote:"अर्ज करण्यापूर्वी अधिकृत पोर्टलवरील नवीनतम आवश्यकता तपासा.", officialLinkAvailable:"अधिकृत अर्जाची लिंक खाली उपलब्ध आहे", preliminaryEligibility:"प्राथमिक पात्रता मार्गदर्शन उपलब्ध आहे", farmerTypeRule:"शेतकरी प्रकार:", otherConditions:"इतर अटी:", asApplicable:"लागू असल्याप्रमाणे", required:"आवश्यक", optional:"पर्यायी", mayBeRequired:"आवश्यक असू शकते", seeOfficialRules:"अधिकृत योजना नियम आणि अपवाद पहा.", oneCheck:"एक तपासणी, अनेक योजना", compareAll:"AgriVoice डेटाबेसमधील सर्व योजनांशी शेतकऱ्याची माहिती तपासतो.", storedAddress:"आपला पत्ता AgriVoice खात्यात जतन केला जातो आणि लॉगिननंतर पुन्हा लोड होतो.", selectLanguage:"भाषा निवडा",
    invalidName:"पूर्ण नावात फक्त अक्षरे आणि मोकळी जागा असावी.", invalidMobile:"मोबाईल क्रमांकात नेमके १० अंक असावेत.", invalidEmail:"वैध डोमेनसह योग्य ईमेल पत्ता लिहा.", invalidFarmerType:"वैध शेतकरी प्रकार निवडा.", invalidCountry:"देश म्हणून भारत निवडा.", incompleteAddress:"देश, राज्य, जिल्हा, तालुका आणि गाव पूर्ण भरा.", invalidVillage:"गावात फक्त अक्षरे/मोकळी जागा असावी आणि २–२० अक्षरे असावीत.", invalidPassword:"पासवर्डमध्ये किमान ८ अक्षरे, मोठे अक्षर, लहान अक्षर, अंक आणि विशेष चिन्ह असावे.", loginIdentifier:"नोंदणीकृत ईमेल किंवा मोबाईल क्रमांक लिहा.", speechUnsupported:"या ब्राउझरमध्ये स्पीच ओळख उपलब्ध नाही. Google Chrome वापरा किंवा खाली प्रश्न लिहा.", microphoneError:"मायक्रोफोन त्रुटी", backendError:"AgriVoice बॅकएंडशी कनेक्ट करता आले नाही.", assistantFallback:"उत्तर तयार करता आले नाही.",
    schemeFinancial:"आर्थिक सहाय्य", schemeInsurance:"विमा", schemeCredit:"कर्ज", schemeOther:"इतर", relevantSupport:"शेतकऱ्यांसाठी संबंधित शासकीय सहाय्य.", whySuggested:"का सुचवले", applyOfficial:"अर्ज / अधिकृत वेबसाइट", cropExample:"उदा. ऊस",
    farmerTypes:{"Landowner":"जमीनमालक","Owner cultivator":"मालक शेतकरी","Marginal farmer":"अल्पभूधारक शेतकरी","Small farmer":"लहान शेतकरी","Tenant farmer":"भाडेकरू शेतकरी","Sharecropper":"बटाईदार शेतकरी","Agricultural labourer":"शेतमजूर","Lessee farmer":"भाडेपट्टा शेतकरी","Cooperative farmer":"सहकारी शेतकरी","Organic farmer":"सेंद्रिय शेतकरी","Tribal farmer":"आदिवासी शेतकरी","Women farmer":"महिला शेतकरी","Cultivator":"पीक उत्पादक","Other":"इतर"}
  },
  हिंदी: {
    select:"चुनें", yes:"हाँ", no:"नहीं", notSure:"लागू नहीं / निश्चित नहीं", result:"परिणाम", agriSupport:"कृषि सहायता", smartVoiceSupport:"स्मार्ट वॉइस सहायता", accountSettings:"खाता सेटिंग्स", languagePreference:"भाषा प्राथमिकता", schemeUpdates:"योजना अपडेट", schemeUpdatesText:"महत्वपूर्ण योजना सूचनाएँ प्राप्त करें", applicationStatus:"आवेदन स्थिति", applicationStatusText:"अपने आवेदन की अपडेट प्राप्त करें", smartFarming:"स्मार्ट खेती", betterTomorrow:"बेहतर कल", builtWith:"React + Vite से बनाया गया • आसानी से अनुकूलित करें",
    authLoginHero:"आपकी भाषा में स्मार्ट कृषि सहायता।", authRegisterHero:"AgriVoice से जुड़ें और खेती का सफर आसान बनाएं।", authHeroText:"सरकारी योजनाएँ, वॉइस सहायता, पात्रता जाँच और दस्तावेज़ मार्गदर्शन एक ही जगह।", createAccountText:"अपनी किसान जानकारी, पता और भविष्य के आवेदन मार्गदर्शन को सुरक्षित रखने के लिए खाता बनाएँ।", enterName:"अपना पूरा नाम दर्ज करें", registeredEmailMobile:"पंजीकृत ईमेल या 10 अंकों का मोबाइल", enterEmail:"अपना ईमेल पता दर्ज करें", enterMobile:"10 अंकों का मोबाइल नंबर दर्ज करें", passwordPlaceholder:"कम से कम 8 अक्षर: Aa1@...", rememberMe:"मुझे याद रखें", saving:"सहेजा जा रहा है...", loggingIn:"लॉगिन हो रहा है...", creating:"खाता बनाया जा रहा है...", loading:"लोड हो रहा है...", checking:"जाँच हो रही है...", typeQuestion:"अपना प्रश्न लिखें...", send:"भेजें", resetConversation:"बातचीत रीसेट करें", listening:"सुन रहा है...", processing:"प्रक्रिया हो रही है...", voiceLanguage:"वॉइस भाषा", askAnything:"आप ऐसे कुछ भी पूछ सकते हैं:", speakNaturally:"स्वाभाविक रूप से बोलें या नीचे अपना प्रश्न लिखें।", voiceIntro:"अपना प्रश्न स्वाभाविक रूप से पूछें। AgriVoice योजना, पात्रता, फसल नुकसान, दस्तावेज़, आवेदन के चरण और सामान्य कृषि प्रश्न समझ सकता है।", availableLanguages:"अंग्रेज़ी, मराठी, हिंदी और कन्नड़ में उपलब्ध",
    officialLinkNote:"आवेदन करने से पहले आधिकारिक पोर्टल पर नवीनतम आवश्यकताओं की जाँच करें।", officialLinkAvailable:"आधिकारिक आवेदन लिंक नीचे उपलब्ध है", preliminaryEligibility:"प्रारंभिक पात्रता मार्गदर्शन उपलब्ध है", farmerTypeRule:"किसान प्रकार:", otherConditions:"अन्य शर्तें:", asApplicable:"लागू होने के अनुसार", required:"आवश्यक", optional:"वैकल्पिक", mayBeRequired:"आवश्यक हो सकता है", seeOfficialRules:"आधिकारिक योजना नियम और अपवाद देखें।", oneCheck:"एक जाँच, कई योजनाएँ", compareAll:"AgriVoice डेटाबेस में संग्रहीत सभी योजनाओं से किसान की जानकारी की तुलना करता है।", storedAddress:"आपका पता AgriVoice खाते में सुरक्षित रहता है और लॉगिन के बाद फिर से लोड होता है।", selectLanguage:"भाषा चुनें",
    invalidName:"पूरा नाम केवल अक्षरों और रिक्त स्थान से होना चाहिए।", invalidMobile:"मोबाइल नंबर में ठीक 10 अंक होने चाहिए।", invalidEmail:"मान्य डोमेन वाला सही ईमेल पता दर्ज करें।", invalidFarmerType:"मान्य किसान प्रकार चुनें।", invalidCountry:"देश के रूप में भारत चुनें।", incompleteAddress:"देश, राज्य, जिला, तालुका और गाँव पूरा भरें।", invalidVillage:"गाँव में केवल अक्षर/रिक्त स्थान हों और 2–20 अक्षर हों।", invalidPassword:"पासवर्ड में कम से कम 8 अक्षर, बड़ा अक्षर, छोटा अक्षर, अंक और विशेष चिन्ह होना चाहिए।", loginIdentifier:"अपना पंजीकृत ईमेल या मोबाइल नंबर दर्ज करें।", speechUnsupported:"इस ब्राउज़र में स्पीच पहचान उपलब्ध नहीं है। Google Chrome का उपयोग करें या नीचे प्रश्न लिखें।", microphoneError:"माइक्रोफोन त्रुटि", backendError:"AgriVoice बैकएंड से कनेक्ट नहीं हो सका।", assistantFallback:"उत्तर तैयार नहीं किया जा सका।",
    schemeFinancial:"वित्तीय सहायता", schemeInsurance:"बीमा", schemeCredit:"ऋण", schemeOther:"अन्य", relevantSupport:"किसानों के लिए संबंधित सरकारी सहायता।", whySuggested:"क्यों सुझाया", applyOfficial:"आवेदन / आधिकारिक वेबसाइट", cropExample:"जैसे गन्ना",
    farmerTypes:{"Landowner":"भूमि मालिक","Owner cultivator":"स्वयं खेती करने वाला मालिक","Marginal farmer":"सीमांत किसान","Small farmer":"लघु किसान","Tenant farmer":"किरायेदार किसान","Sharecropper":"बटाईदार किसान","Agricultural labourer":"कृषि मजदूर","Lessee farmer":"पट्टेदार किसान","Cooperative farmer":"सहकारी किसान","Organic farmer":"जैविक किसान","Tribal farmer":"आदिवासी किसान","Women farmer":"महिला किसान","Cultivator":"कृषक","Other":"अन्य"}
  },
  कन्नड: {
    select:"ಆಯ್ಕೆಮಾಡಿ", yes:"ಹೌದು", no:"ಇಲ್ಲ", notSure:"ಅನ್ವಯಿಸುವುದಿಲ್ಲ / ಖಚಿತವಿಲ್ಲ", result:"ಫಲಿತಾಂಶ", agriSupport:"ಕೃಷಿ ಸಹಾಯ", smartVoiceSupport:"ಸ್ಮಾರ್ಟ್ ವಾಯ್ಸ್ ಸಹಾಯ", accountSettings:"ಖಾತೆ ಸೆಟ್ಟಿಂಗ್‌ಗಳು", languagePreference:"ಭಾಷಾ ಆದ್ಯತೆ", schemeUpdates:"ಯೋಜನೆ ನವೀಕರಣಗಳು", schemeUpdatesText:"ಪ್ರಮುಖ ಯೋಜನೆ ಸೂಚನೆಗಳನ್ನು ಪಡೆಯಿರಿ", applicationStatus:"ಅರ್ಜಿ ಸ್ಥಿತಿ", applicationStatusText:"ನಿಮ್ಮ ಅರ್ಜಿಯ ನವೀಕರಣಗಳನ್ನು ಪಡೆಯಿರಿ", smartFarming:"ಸ್ಮಾರ್ಟ್ ಕೃಷಿ", betterTomorrow:"ಉತ್ತಮ ನಾಳೆ", builtWith:"React + Vite ಮೂಲಕ ನಿರ್ಮಿಸಲಾಗಿದೆ • ಸುಲಭವಾಗಿ ಬದಲಾಯಿಸಬಹುದು",
    authLoginHero:"ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸಹಾಯ.", authRegisterHero:"AgriVoice ಗೆ ಸೇರಿ ಮತ್ತು ಕೃಷಿ ಪ್ರಯಾಣವನ್ನು ಸರಳಗೊಳಿಸಿ.", authHeroText:"ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು, ವಾಯ್ಸ್ ಸಹಾಯ, ಅರ್ಹತಾ ಪರಿಶೀಲನೆ ಮತ್ತು ದಾಖಲೆ ಮಾರ್ಗದರ್ಶನ ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ.", createAccountText:"ನಿಮ್ಮ ರೈತ ವಿವರಗಳು, ವಿಳಾಸ ಮತ್ತು ಭವಿಷ್ಯದ ಅರ್ಜಿ ಮಾರ್ಗದರ್ಶನವನ್ನು ಉಳಿಸಲು ಖಾತೆ ರಚಿಸಿ.", enterName:"ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ", registeredEmailMobile:"ನೋಂದಾಯಿತ ಇಮೇಲ್ ಅಥವಾ 10 ಅಂಕಿಯ ಮೊಬೈಲ್", enterEmail:"ನಿಮ್ಮ ಇಮೇಲ್ ವಿಳಾಸ ನಮೂದಿಸಿ", enterMobile:"10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ", passwordPlaceholder:"ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳು: Aa1@...", rememberMe:"ನನ್ನನ್ನು ನೆನಪಿಡಿ", saving:"ಉಳಿಸಲಾಗುತ್ತಿದೆ...", loggingIn:"ಲಾಗಿನ್ ಆಗುತ್ತಿದೆ...", creating:"ಖಾತೆ ರಚಿಸಲಾಗುತ್ತಿದೆ...", loading:"ಲೋಡ್ ಆಗುತ್ತಿದೆ...", checking:"ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...", typeQuestion:"ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ...", send:"ಕಳುಹಿಸಿ", resetConversation:"ಸಂಭಾಷಣೆ ಮರುಹೊಂದಿಸಿ", listening:"ಕೇಳುತ್ತಿದೆ...", processing:"ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...", voiceLanguage:"ವಾಯ್ಸ್ ಭಾಷೆ", askAnything:"ನೀವು ಹೀಗೆ ಏನನ್ನಾದರೂ ಕೇಳಬಹುದು:", speakNaturally:"ಸಹಜವಾಗಿ ಮಾತನಾಡಿ ಅಥವಾ ಕೆಳಗೆ ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ.", voiceIntro:"ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಸಹಜವಾಗಿ ಕೇಳಿ. AgriVoice ಯೋಜನೆಗಳು, ಅರ್ಹತೆ, ಬೆಳೆ ಹಾನಿ, ದಾಖಲೆಗಳು, ಅರ್ಜಿ ಹಂತಗಳು ಮತ್ತು ಸಾಮಾನ್ಯ ಕೃಷಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತದೆ.", availableLanguages:"ಇಂಗ್ಲಿಷ್, ಮರಾಠಿ, ಹಿಂದಿ ಮತ್ತು ಕನ್ನಡದಲ್ಲಿ ಲಭ್ಯ",
    officialLinkNote:"ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಮೊದಲು ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿನ ಇತ್ತೀಚಿನ ಅವಶ್ಯಕತೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.", officialLinkAvailable:"ಅಧಿಕೃತ ಅರ್ಜಿ ಲಿಂಕ್ ಕೆಳಗೆ ಲಭ್ಯವಿದೆ", preliminaryEligibility:"ಪ್ರಾಥಮಿಕ ಅರ್ಹತಾ ಮಾರ್ಗದರ್ಶನ ಲಭ್ಯವಿದೆ", farmerTypeRule:"ರೈತರ ಪ್ರಕಾರ:", otherConditions:"ಇತರೆ ಷರತ್ತುಗಳು:", asApplicable:"ಅನ್ವಯಿಸುವಂತೆ", required:"ಅಗತ್ಯ", optional:"ಐಚ್ಛಿಕ", mayBeRequired:"ಅಗತ್ಯವಿರಬಹುದು", seeOfficialRules:"ಅಧಿಕೃತ ಯೋಜನೆ ನಿಯಮಗಳು ಮತ್ತು ವಿನಾಯಿತಿಗಳನ್ನು ನೋಡಿ.", oneCheck:"ಒಂದು ಪರಿಶೀಲನೆ, ಹಲವು ಯೋಜನೆಗಳು", compareAll:"AgriVoice ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿರುವ ಎಲ್ಲಾ ಯೋಜನೆಗಳೊಂದಿಗೆ ರೈತರ ಮಾಹಿತಿಯನ್ನು ಹೋಲಿಸುತ್ತದೆ.", storedAddress:"ನಿಮ್ಮ ವಿಳಾಸವನ್ನು AgriVoice ಖಾತೆಯಲ್ಲಿ ಉಳಿಸಲಾಗುತ್ತದೆ ಮತ್ತು ಲಾಗಿನ್ ನಂತರ ಮತ್ತೆ ಲೋಡ್ ಮಾಡಲಾಗುತ್ತದೆ.", selectLanguage:"ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ",
    invalidName:"ಪೂರ್ಣ ಹೆಸರು ಅಕ್ಷರಗಳು ಮತ್ತು ಖಾಲಿ ಜಾಗಗಳನ್ನು ಮಾತ್ರ ಹೊಂದಿರಬೇಕು.", invalidMobile:"ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯಲ್ಲಿ ನಿಖರವಾಗಿ 10 ಅಂಕಿಗಳು ಇರಬೇಕು.", invalidEmail:"ಮಾನ್ಯ ಡೊಮೇನ್‌ನೊಂದಿಗೆ ಸರಿಯಾದ ಇಮೇಲ್ ವಿಳಾಸ ನಮೂದಿಸಿ.", invalidFarmerType:"ಮಾನ್ಯ ರೈತರ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ.", invalidCountry:"ದೇಶವಾಗಿ ಭಾರತವನ್ನು ಆಯ್ಕೆಮಾಡಿ.", incompleteAddress:"ದೇಶ, ರಾಜ್ಯ, ಜಿಲ್ಲೆ, ತಾಲೂಕು ಮತ್ತು ಗ್ರಾಮವನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.", invalidVillage:"ಗ್ರಾಮದ ಹೆಸರಿನಲ್ಲಿ ಅಕ್ಷರಗಳು/ಖಾಲಿ ಜಾಗ ಮಾತ್ರ ಇರಬೇಕು ಮತ್ತು 2–20 ಅಕ್ಷರಗಳಿರಬೇಕು.", invalidPassword:"ಪಾಸ್‌ವರ್ಡ್‌ನಲ್ಲಿ ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳು, ದೊಡ್ಡ ಅಕ್ಷರ, ಸಣ್ಣ ಅಕ್ಷರ, ಸಂಖ್ಯೆ ಮತ್ತು ವಿಶೇಷ ಚಿಹ್ನೆ ಇರಬೇಕು.", loginIdentifier:"ನಿಮ್ಮ ನೋಂದಾಯಿತ ಇಮೇಲ್ ಅಥವಾ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.", speechUnsupported:"ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಸ್ಪೀಚ್ ಗುರುತಿಸುವಿಕೆ ಲಭ್ಯವಿಲ್ಲ. Google Chrome ಬಳಸಿ ಅಥವಾ ಕೆಳಗೆ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ.", microphoneError:"ಮೈಕ್ರೋಫೋನ್ ದೋಷ", backendError:"AgriVoice ಬ್ಯಾಕೆಂಡ್‌ಗೆ ಸಂಪರ್ಕಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.", assistantFallback:"ಉತ್ತರವನ್ನು ರಚಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
    schemeFinancial:"ಆರ್ಥಿಕ ಸಹಾಯ", schemeInsurance:"ವಿಮೆ", schemeCredit:"ಸಾಲ", schemeOther:"ಇತರೆ", relevantSupport:"ರೈತರಿಗೆ ಸಂಬಂಧಿಸಿದ ಸರ್ಕಾರಿ ಸಹಾಯ.", whySuggested:"ಏಕೆ ಸೂಚಿಸಲಾಗಿದೆ", applyOfficial:"ಅರ್ಜಿ / ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್", cropExample:"ಉದಾ. ಕಬ್ಬು",
    farmerTypes:{"Landowner":"ಭೂ ಮಾಲೀಕ","Owner cultivator":"ಮಾಲೀಕ ಕೃಷಿಕ","Marginal farmer":"ಅಲ್ಪಭೂಧಾರಕ ರೈತ","Small farmer":"ಸಣ್ಣ ರೈತ","Tenant farmer":"ಬಾಡಿಗೆ ರೈತ","Sharecropper":"ಪಾಲುದಾರ ರೈತ","Agricultural labourer":"ಕೃಷಿ ಕಾರ್ಮಿಕ","Lessee farmer":"ಲೀಸ್ ರೈತ","Cooperative farmer":"ಸಹಕಾರಿ ರೈತ","Organic farmer":"ಸಾವಯವ ರೈತ","Tribal farmer":"ಆದಿವಾಸಿ ರೈತ","Women farmer":"ಮಹಿಳಾ ರೈತ","Cultivator":"ಕೃಷಿಕ","Other":"ಇತರೆ"}
  }
};

const translations = {
  English:{
    home:"Home", schemes:"Government Schemes", voice:"Voice Assistant", documents:"Documents",
    guidance:"Guidance", profile:"Profile", login:"Login", register:"Register", language:"English",
    heroTitle:"Empowering Farmers with Smart Solutions", heroText:"Get information about government schemes, check eligibility, access documents and more — all in your language.",
    explore:"Explore Schemes", popular:"Popular Government Schemes", viewAll:"View all",
    schemeTitle:"Government Schemes", schemeText:"Explore government schemes and benefits for farmers. Get complete details and check your eligibility.",
    search:"Search schemes...", details:"View Details", check:"Check Eligibility", benefits:"Key Benefits",
    voiceTitle:"Voice Assistant", voiceText:"Speak in your language. I'm here to help you!", tap:"Tap to speak",
    documentsTitle:"Documents Checklist", documentsText:"Keep the following documents ready for a smooth application process.",
    guidanceTitle:"Step-by-Step Guidance", guidanceText:"Follow these simple steps to apply for the scheme.",
    profileTitle:"My Profile", edit:"Edit", welcome:"Welcome to AgriVoice", logout:"Logout",
    loginTitle:"Welcome Back", loginText:"Login to access your schemes, documents and personalised support.",
    registerTitle:"Create Your AgriVoice Account", registerText:"Create an account to save your farmer profile and application progress.",
    email:"Email Address", mobile:"Mobile Number", password:"Password", name:"Full Name",
    loginBtn:"Login", registerBtn:"Create Account", forgot:"Forgot password?", noAccount:"Don't have an account?",
    haveAccount:"Already have an account?", back:"Back to Home", required:"Required", available:"Available",
    upload:"Upload Documents", needHelp:"Need Help?", settings:"Settings",
    featureExplore:"Explore benefits", featureVoice:"Get help through voice", featureDocuments:"View required documents", featureGuidance:"Easy instructions",
    supportTag:"AGRICULTURE SUPPORT", supportTitle:"Support made simple for every farmer", supportText:"Use voice assistance, check eligibility and keep your documents ready in one place.",
    supportTagAlt:"AGRI SUPPORT", schemeOverview:"Scheme Overview", schemeOverviewText:"This section is designed to be connected to your backend API later. It can show official scheme eligibility, benefits, required documents, application link and status.",
    voiceAvailable:"Available in English, Marathi, Hindi and Kannada", voicePrompt:"Try: “Show PM Kisan scheme” or “Check my eligibility”",
    startListening:"Start Listening", docLabels:["Aadhaar Card","Land Record / 7/12 or equivalent","Bank Passbook / Account Details","Passport Size Photo"],
    docDescriptions:["Identity proof","Proof of land ownership","For DBT","Recent photo"],
    docUnuploaded:"Not Uploaded", farmerAccount:"FARMER ACCOUNT", farmerType:"Farmer Type", saveChanges:"Save Changes", defaultFarmer:"Farmer",
    addressDetails:"Address Details", village:"Village", taluka:"Taluka", district:"District", state:"State", profileNote:"Add your address details here when the profile form is connected to the backend.",
    helpContact:"Contact Support", supportTeam:"Our support team can guide you through each document.",
    steps:["Check Eligibility","Collect Documents","Apply Online / Offline","Track Application"],
    stepDesc:["Verify if you meet the scheme criteria.","Keep all required documents ready.","Submit your application through the portal or service centre.","Check status using your reference number."],
    simpleProcess:"SIMPLE PROCESS", voiceSupport:"SMART VOICE SUPPORT", appReady:"APPLICATION READY", eligibilityLabel:"Eligibility", officialApplication:"Official Application", verifyLatest:"Always verify the latest requirements on the official portal before applying.", contactSupport:"Contact Support", loading:"Loading..."
  },
  मराठी:{
    home:"मुख्यपृष्ठ", schemes:"शासकीय योजना", voice:"व्हॉइस सहाय्यक", documents:"कागदपत्रे",
    guidance:"मार्गदर्शन", profile:"प्रोफाइल", login:"लॉगिन", register:"नोंदणी", language:"मराठी",
    heroTitle:"स्मार्ट उपायांसह शेतकऱ्यांना सक्षम बनवा", heroText:"शासकीय योजना, पात्रता, कागदपत्रे आणि इतर माहिती आपल्या भाषेत मिळवा.",
    explore:"योजना पहा", popular:"लोकप्रिय शासकीय योजना", viewAll:"सर्व पहा",
    schemeTitle:"शासकीय योजना", schemeText:"शेतकऱ्यांसाठी उपलब्ध शासकीय योजना आणि लाभ पहा.",
    search:"योजना शोधा...", details:"तपशील पहा", check:"पात्रता तपासा", benefits:"मुख्य फायदे",
    voiceTitle:"व्हॉइस सहाय्यक", voiceText:"आपल्या भाषेत बोला. मी मदतीसाठी येथे आहे!", tap:"बोलण्यासाठी टॅप करा",
    documentsTitle:"कागदपत्रांची यादी", documentsText:"अर्जासाठी आवश्यक कागदपत्रे तयार ठेवा.",
    guidanceTitle:"टप्प्याटप्प्याने मार्गदर्शन", guidanceText:"योजनेसाठी अर्ज करण्यासाठी सोप्या पायऱ्या पाळा.",
    profileTitle:"माझे प्रोफाइल", edit:"संपादित करा", welcome:"AgriVoice मध्ये स्वागत", logout:"लॉगआउट",
    loginTitle:"पुन्हा स्वागत आहे", loginText:"आपल्या योजना आणि वैयक्तिक सहाय्यासाठी लॉगिन करा.",
    registerTitle:"AgriVoice खाते तयार करा", registerText:"आपले शेतकरी प्रोफाइल आणि अर्जाची प्रगती जतन करण्यासाठी खाते तयार करा.",
    email:"ईमेल पत्ता", mobile:"मोबाईल क्रमांक", password:"पासवर्ड", name:"पूर्ण नाव",
    loginBtn:"लॉगिन", registerBtn:"खाते तयार करा", forgot:"पासवर्ड विसरलात?", noAccount:"खाते नाही?",
    haveAccount:"आधीच खाते आहे?", back:"मुख्यपृष्ठावर जा", required:"आवश्यक", available:"उपलब्ध",
    upload:"कागदपत्रे अपलोड करा", needHelp:"मदत हवी आहे?", settings:"सेटिंग्ज",
    featureExplore:"फायदे पहा", featureVoice:"व्हॉइसद्वारे मदत मिळवा", featureDocuments:"आवश्यक कागदपत्रे पहा", featureGuidance:"सोपी सूचना",
    supportTag:"शेती साह्य", supportTitle:"प्रत्येक शेतकऱ्यासाठी सोपे सहाय्य", supportText:"व्हॉइस सहाय्य वापरा, पात्रता तपासा आणि आपल्या कागदपत्रे एकाच ठिकाणी तयार ठेवा.",
    supportTagAlt:"शेती समर्थन", schemeOverview:"योजना विहंगावलोकन", schemeOverviewText:"ही विभाग नंतर बँक/अॅप APIशी जोडण्यासाठी तयार केले आहे. हे अधिकृत पात्रता, फायदे, आवश्यक दस्तावेळ, अर्ज लिंक आणि स्थिती दाखवू शकते.",
    voiceAvailable:"मराठी, हिंदी आणि कन्नड मध्ये उपलब्ध", voicePrompt:"प्रयत्न करा: “पीएम किसान योजना दाखवा” किंवा “माझी पात्रता तपासा”",
    startListening:"ऐकायला प्रारंभ करा", docLabels:["आधार कार्ड","जमीन नोंद / ७/१२ किंवा समतुल्य","बँक पासबुक / खातेदार तपशील","पासपोर्ट साइज फोटो"],
    docDescriptions:["ओळख पुरावा","जमीन मालकीचा पुरावा","DBT साठी","अलीकडील फोटो"],
    docUnuploaded:"अपलोड केलेले नाही", farmerAccount:"शेतकरी खाते", farmerType:"शेतकरी प्रकार", saveChanges:"बदल जतन करा", defaultFarmer:"शेतकरी",
    addressDetails:"पत्ता तपशील", village:"गाव", taluka:"तालुका", district:"जिल्हा", state:"राज्य", profileNote:"प्रोफाइल फॉर्म पूर्ण झाल्यावर तुमचा पत्ता येथे भरा.",
    helpContact:"सपोर्टशी संपर्क करा", supportTeam:"आमची सपोर्ट टीम प्रत्येक कागदपत्रात तुम्हाला मार्गदर्शन करेल.",
    steps:["पात्रता तपासा","कागदपत्रे गोळा करा","ऑनलाइन / ऑफलाइन अर्ज करा","अर्ज ट्रॅक करा"],
    stepDesc:["तुम्ही योजनेच्या निकषांवर पात्र आहात की नाही ते तपासा.","सर्व आवश्यक कागदपत्रे तयार ठेवा.","पोर्टल किंवा सेवा केंद्राद्वारे अर्ज सादर करा.","तुमच्या संदर्भ क्रमांकाद्वारे स्थिती तपासा."],
    simpleProcess:"सोपे प्रक्रिया", voiceSupport:"स्मार्ट व्हॉइस सपोर्ट", appReady:"अर्ज तयार", eligibilityLabel:"पात्रता", officialApplication:"अधिकृत अर्ज", verifyLatest:"अर्ज करण्यापूर्वी अधिकृत पोर्टलवरील नवीनतम आवश्यकता तपासा.", contactSupport:"सपोर्टशी संपर्क करा", loading:"लोड होत आहे...", 
  },
  हिंदी:{
    home:"होम", schemes:"सरकारी योजनाएं", voice:"वॉइस असिस्टेंट", documents:"दस्तावेज़",
    guidance:"मार्गदर्शन", profile:"प्रोफ़ाइल", login:"लॉगिन", register:"पंजीकरण", language:"हिंदी",
    heroTitle:"स्मार्ट समाधानों से किसानों को सशक्त बनाएं", heroText:"सरकारी योजनाओं, पात्रता और दस्तावेज़ों की जानकारी अपनी भाषा में पाएं।",
    explore:"योजनाएं देखें", popular:"लोकप्रिय सरकारी योजनाएं", viewAll:"सभी देखें",
    schemeTitle:"सरकारी योजनाएं", schemeText:"किसानों के लिए उपलब्ध सरकारी योजनाएं और लाभ देखें।",
    search:"योजनाएं खोजें...", details:"विवरण देखें", check:"पात्रता जांचें", benefits:"मुख्य लाभ",
    voiceTitle:"वॉइस असिस्टेंट", voiceText:"अपनी भाषा में बोलें। मैं आपकी मदद के लिए यहां हूं!", tap:"बोलने के लिए टैप करें",
    documentsTitle:"दस्तावेज़ चेकलिस्ट", documentsText:"आवेदन के लिए आवश्यक दस्तावेज़ तैयार रखें।",
    guidanceTitle:"चरण-दर-चरण मार्गदर्शन", guidanceText:"योजना के लिए आवेदन करने के लिए आसान चरणों का पालन करें।",
    profileTitle:"मेरी प्रोफ़ाइल", edit:"संपादित करें", welcome:"AgriVoice में आपका स्वागत है", logout:"लॉगआउट",
    loginTitle:"वापसी पर स्वागत है", loginText:"अपनी योजनाओं और व्यक्तिगत सहायता के लिए लॉगिन करें।",
    registerTitle:"अपना AgriVoice खाता बनाएं", registerText:"अपनी किसान प्रोफ़ाइल और आवेदन की प्रगति सुरक्षित रखने के लिए खाता बनाएं।",
    email:"ईमेल पता", mobile:"मोबाइल नंबर", password:"पासवर्ड", name:"पूरा नाम",
    loginBtn:"लॉगिन", registerBtn:"खाता बनाएं", forgot:"पासवर्ड भूल गए?", noAccount:"खाता नहीं है?",
    haveAccount:"पहले से खाता है?", back:"होम पर जाएं", required:"आवश्यक", available:"उपलब्ध",
    upload:"दस्तावेज़ अपलोड करें", needHelp:"मदद चाहिए?", settings:"सेटिंग्स",
    featureExplore:"लाभ देखें", featureVoice:"वॉइस से मदद लें", featureDocuments:"आवश्यक दस्तावेज़ देखें", featureGuidance:"सरल निर्देश",
    supportTag:"कृषि सहायता", supportTitle:"हर किसान के लिए सरल सहायता", supportText:"वॉइस सहायक का उपयोग करें, पात्रता जांचें और दस्तावेज़ एक ही जगह तैयार रखें।",
    supportTagAlt:"कृषि सहायता", schemeOverview:"योजना अवलोकन", schemeOverviewText:"यह सेक्शन बाद में आपके बैकएंड API से जुड़ने के लिए बनाया गया है। यह आधिकारिक पात्रता, लाभ, आवश्यक दस्तावेज़, आवेदन लिंक और स्थिति दिखा सकता है।",
    voiceAvailable:"हिंदी, मराठी और कन्नड़ में उपलब्ध", voicePrompt:"कोशिश करें: “पीएम किसान योजना दिखाओ” या “मुझे पात्रता जांचें”",
    startListening:"सुना शुरू करें", docLabels:["आधार कार्ड","भूमि रिकॉर्ड / 7/12 या समकक्ष","बैंक पासबुक / खाता विवरण","पासपोर्ट साइज फोटो"],
    docDescriptions:["पहचान प्रमाण","भूमि स्वामित्व का प्रमाण","DBT के लिए","हाल का फोटो"],
    docUnuploaded:"अपलोड नहीं किया गया", farmerAccount:"किसान खाता", farmerType:"किसान का प्रकार", saveChanges:"परिवर्तन सेव करें", defaultFarmer:"किसान",
    addressDetails:"पता विवरण", village:"गाँव", taluka:"तहसील", district:"जिला", state:"राज्य", profileNote:"जब प्रोफ़ाइल फॉर्म बैकएंड से जुड़ जाएगा, तो अपना पता यहाँ जोड़ें।",
    helpContact:"सपोर्ट से संपर्क करें", supportTeam:"हमारी सपोर्ट टीम प्रत्येक दस्तावेज़ में आपकी सहायता करेगी।",
    steps:["पात्रता जांचें","दस्तावेज़ एकत्र करें","ऑनलाइन / ऑफलाइन आवेदन करें","आवेदन ट्रैक करें"],
    stepDesc:["सुनिश्चित करें कि आप योजना के मानदंडों को पूरा करते हैं।","सभी आवश्यक दस्तावेज़ तैयार रखें।","पोर्टल या सेवा केंद्र के माध्यम से आवेदन जमा करें।","अपने संदर्भ संख्या से स्थिति देखें।"],
    simpleProcess:"सरल प्रक्रिया", voiceSupport:"स्मार्ट वॉइस सपोर्ट", appReady:"आवेदन तैयार", eligibilityLabel:"पात्रता", officialApplication:"आधिकारिक आवेदन", verifyLatest:"आवेदन से पहले आधिकारिक पोर्टल पर नवीनतम आवश्यकताएं जांचें।", contactSupport:"सपोर्ट से संपर्क करें", loading:"लोड हो रहा है..."
  },
  कन्नड:{
    home:"ಮುಖಪುಟ", schemes:"ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು", voice:"ಧ್ವನಿ ಸಹಾಯಕ", documents:"ದಾಖಲೆಗಳು",
    guidance:"ಮಾರ್ಗದರ್ಶನ", profile:"ಪ್ರೊಫೈಲ್", login:"ಲಾಗಿನ್", register:"ನೋಂದಣಿ", language:"ಕನ್ನಡ",
    heroTitle:"ಸ್ಮಾರ್ಟ್ ಪರಿಹಾರಗಳೊಂದಿಗೆ ರೈತರನ್ನು ಸಬಲೀಕರಿಸಿ", heroText:"ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು, ಅರ್ಹತೆ ಮತ್ತು ದಾಖಲೆಗಳ ಮಾಹಿತಿಯನ್ನು ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಪಡೆಯಿರಿ.",
    explore:"ಯೋಜನೆಗಳನ್ನು ನೋಡಿ", popular:"ಜನಪ್ರಿಯ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು", viewAll:"ಎಲ್ಲವನ್ನೂ ನೋಡಿ",
    schemeTitle:"ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು", schemeText:"ರೈತರಿಗೆ ಲಭ್ಯವಿರುವ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಪ್ರಯೋಜನಗಳನ್ನು ನೋಡಿ.",
    search:"ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ...", details:"ವಿವರಗಳನ್ನು ನೋಡಿ", check:"ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ", benefits:"ಮುಖ್ಯ ಪ್ರಯೋಜನಗಳು",
    voiceTitle:"ಧ್ವನಿ ಸಹಾಯಕ", voiceText:"ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿ. ನಾನು ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇನೆ!", tap:"ಮಾತನಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
    documentsTitle:"ದಾಖಲೆಗಳ ಪಟ್ಟಿ", documentsText:"ಅರ್ಜಿಗಾಗಿ ಅಗತ್ಯ ದಾಖಲೆಗಳನ್ನು ಸಿದ್ಧವಾಗಿಡಿ.",
    guidanceTitle:"ಹಂತ ಹಂತದ ಮಾರ್ಗದರ್ಶನ", guidanceText:"ಯೋಜನೆಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಈ ಸರಳ ಹಂತಗಳನ್ನು ಅನುಸರಿಸಿ.",
    profileTitle:"ನನ್ನ ಪ್ರೊಫೈಲ್", edit:"ತಿದ್ದುಪಡಿ", welcome:"AgriVoice ಗೆ ಸ್ವಾಗತ", logout:"ಲಾಗ್‌ಔಟ್",
    loginTitle:"ಮತ್ತೆ ಸ್ವಾಗತ", loginText:"ನಿಮ್ಮ ಯೋಜನೆಗಳು ಮತ್ತು ವೈಯಕ್ತಿಕ ಸಹಾಯಕ್ಕಾಗಿ ಲಾಗಿನ್ ಮಾಡಿ.",
    registerTitle:"AgriVoice ಖಾತೆ ರಚಿಸಿ", registerText:"ನಿಮ್ಮ ರೈತ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಅರ್ಜಿ ಪ್ರಗತಿಯನ್ನು ಉಳಿಸಲು ಖಾತೆ ರಚಿಸಿ.",
    email:"ಇಮೇಲ್ ವಿಳಾಸ", mobile:"ಮೊಬೈಲ್ ಸಂಖ್ಯೆ", password:"ಪಾಸ್‌ವರ್ಡ್", name:"ಪೂರ್ಣ ಹೆಸರು",
    loginBtn:"ಲಾಗಿನ್", registerBtn:"ಖಾತೆ ರಚಿಸಿ", forgot:"ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?", noAccount:"ಖಾತೆ ಇಲ್ಲವೇ?",
    haveAccount:"ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?", back:"ಮುಖಪುಟಕ್ಕೆ", required:"ಅಗತ್ಯ", available:"ಲಭ್ಯ",
    upload:"ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", needHelp:"ಸಹಾಯ ಬೇಕೇ?", settings:"ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    featureExplore:"ಪ್ರಯೋಜನಗಳನ್ನು ನೋಡಿ", featureVoice:"ಧ್ವನಿ ಸಹಾಯ ಪಡೆಯಿರಿ", featureDocuments:"ಅಗತ್ಯ ದಾಖಲೆಗಳನ್ನು ನೋಡಿ", featureGuidance:"ಸರಳ ಸೂಚನೆಗಳು",
    supportTag:"ಕೃಷಿ ಸಹಾಯ", supportTitle:"ಪ್ರತಿಯೊಬ್ಬ ರೈತನಿಗೆ ಸರಳ ಸಹಾಯ", supportText:"ಧ್ವನಿ ಸಹಾಯಕ ಬಳಸಿ, ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ ಮತ್ತು ದಾಖಲೆಗಳನ್ನು ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ ಸಿದ್ಧವಾಗಿಡಿ.",
    supportTagAlt:"ಕೃಷಿ ಬೆಂಬಲ", schemeOverview:"ಯೋಜನೆ ಅವಲೋಕನ", schemeOverviewText:"ಈ ವಿಭಾಗವನ್ನು ನಂತರ ನಿಮ್ಮ ಬ್ಯಾಕೆಂಡ್ API ಜೊತೆಗೆ ಸಂಪರ್ಕಿಸಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ. ಇದು ಅಧಿಕ ಅರ್ಹತೆ, ಪ್ರಯೋಜನಗಳು, ಅಗತ್ಯ ದಾಖಲೆಗಳು, ಅರ್ಜಿ ಲಿಂಕ್ ಮತ್ತು ಸ್ಥಿತಿ ತೋರಿಸಬಹುದು.",
    voiceAvailable:"ಕನ್ನಡ, ಮರಾಠಿ, ಹಿಂದು ಮತ್ತು ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಲಭ್ಯ", voicePrompt:"ಪ್ರಯತ್ನಿಸಿ: “PM ಕಿಸಾನ್ ಯೋಜನೆಯನ್ನು ತೋರಿಸಿ” ಅಥವಾ “ನನ್ನ ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ”",
    startListening:"ಆಲಿಸುವುದನ್ನು ಪ್ರಾರಂಭಿಸಿ", docLabels:["ಆಧಾರ್ ಕಾರ್ಡ್","ಭೂ ದಾಖಲೆ / 7/12 ಅಥವಾ ಸಮಾನ","ಬ್ಯಾಂಕ್ ಪಾಸ್ಬುಕ್ / ಖಾತೆ ವಿವರಗಳು","ಪಾಸ್ಪೋರ್ಟ್ ಸೈಜ್ ಫೋಟೋ"],
    docDescriptions:["ಗುರುತಿನ ಚಹರೆ","ಭೂ ಮಾಲೀಕತ್ವದ ಸಾದೃಶ್ಯ","DBT ಗಾಗಿ","ಇತ್ತೀಚಿನ ಫೋಟೋ"],
    docUnuploaded:"ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗಿಲ್ಲ", farmerAccount:"ರೈತ ಖಾತೆ", farmerType:"ರೈತ ಪ್ರಕಾರ", saveChanges:"ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ", defaultFarmer:"ರೈತ",
    addressDetails:"ವಿಳಾಸದ ವಿವರಗಳು", village:"ಗ್ರಾಮ", taluka:"ತಾಲೂಕು", district:"ಜಿಲ್ಲೆ", state:"ರಾಜ್ಯ", profileNote:"ಪ್ರೊಫೈಲ್ ಫಾರ್ಮ್ ಬ್ಯಾಕೆಂಡ್‌ಗೆ ಲಗತ್ತಿಸಿದ ನಂತರ ನಿಮ್ಮ ವಿಳಾಸವನ್ನು ಇಲ್ಲಿ ಸೇರಿಸಿ.",
    helpContact:"ಸಹಾಯ ಪಡೆಯಿರಿ", supportTeam:"ನಮ್ಮ ಸಹಾಯ ತಂಡವು ಪ್ರತಿಯೊಂದು ದಾಖಲೆಗೂ ನಿಮ್ಮನ್ನು ಮಾರ್ಗದರ್ಶನ ಮಾಡುತ್ತದೆ.",
    steps:["ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ","ದಾಖಲೆಗಳನ್ನು ಸಂಗ್ರಹಿಸಿ","ಆನ್ಲೈನ್ / ಆಫ್‌ಲೈನ್ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ","ಅರ್ಜಿ ಸ್ಥಿತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ"],
    stepDesc:["ನಿಮ್ಮ ಯೋಜನೆ ಮಾನದಂಡಗಳನ್ನು ಪೂರೈಸುತ್ತೀರಾ ಎಂದು ಪರಿಶೀಲಿಸಿ.","ಎಲ್ಲ ಅಗತ್ಯ ದಾಖಲೆಗಳನ್ನು ಸಿದ್ಧವಾಗಿಡಿ.","ಪೋರ್ಟಲ್ ಅಥವಾ ಸೇವಾ ಕೇಂದ್ರದ ಮೂಲಕ ಅರ್ಜಿಯನ್ನು ಸಲ್ಲಿಸಿ.","ಸಂಬಂಧಿತ ಸಂಖ್ಯೆಯಿಂದ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ."],
    simpleProcess:"ಸರಳ ಪ್ರಕ್ರಿಯೆ", voiceSupport:"ಸ್ಮಾರ್ಟ್ ವಾಯ್ಸ್ ಸಪೋರ್ಟ್", appReady:"ಅರ್ಜಿ ಸಿದ್ಧ", eligibilityLabel:"ಅರ್ಹತೆ", officialApplication:"ಅಧಿಕೃತ ಅರ್ಜಿ", verifyLatest:"ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಮೊದಲು ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿನ ಇತ್ತೀಚಿನ ಅವಶ್ಯಕತೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.", contactSupport:"ಸಪೋರ್ಟ್ ಸಂಪರ್ಕಿಸಿ", loading:"ಲೋಡ್ ಆಗುತ್ತಿದೆ..."
  }
};

const FARMER_TYPES = ["Landowner","Owner cultivator","Marginal farmer","Small farmer","Tenant farmer","Sharecropper","Agricultural labourer","Lessee farmer","Cooperative farmer","Organic farmer","Tribal farmer","Women farmer","Cultivator","Other"];

function localizedFarmerType(t, value){ return t.farmerTypes?.[value] || value; }

function LocationFields({t, form, update, includeCountry=true, compact=false}){
  const states = form.country === "India" ? INDIA_STATES : [];
  const districts = form.country === "India" && form.state ? (INDIA_DISTRICTS[form.state] || []) : [];
  return <>
    {includeCountry && <label>{t.country}<select value={form.country||""} onChange={e=>{update("country",e.target.value);update("state","");update("district","");}}><option value="">{t.selectCountry}</option><option>India</option></select></label>}
    <label>{t.state}<select value={form.state||""} disabled={includeCountry && form.country!=="India"} onChange={e=>{update("state",e.target.value);update("district","");}}><option value="">{t.selectState}</option>{states.map(x=><option key={x}>{x}</option>)}</select></label>
    <label>{t.district}<select value={form.district||""} disabled={!form.state} onChange={e=>update("district",e.target.value)}><option value="">{t.selectDistrict}</option>{districts.map(x=><option key={x}>{x}</option>)}</select></label>
    <label>{t.taluka}<input value={form.taluka||""} maxLength={40} onChange={e=>update("taluka",e.target.value.replace(/[^\p{L} ]/gu,"").replace(/\s+/g," ").slice(0,40))} placeholder={t.talukaHint}/></label>
    <label>{t.village}<input value={form.village||""} minLength={2} maxLength={20} onChange={e=>update("village",e.target.value.replace(/[^\p{L} ]/gu,"").replace(/\s+/g," ").slice(0,20))} placeholder={t.villageHint}/></label>
  </>;
}

const SCHEME_LOCAL = {
  English: {
    S001:{name:"PM Kisan Samman Nidhi",desc:"Income support scheme for eligible landholding farmer families.",benefits:"₹6,000 per year in three equal instalments, subject to scheme rules and verification.",docs:["Aadhaar/identity document","Landholding/land record information","Bank account details"],docDesc:["Used to verify farmer identity and link the beneficiary record to scheme registration.","Used to verify the agricultural landholding recorded for the farmer/family.","Used to receive eligible benefit payments through the applicable bank account."],steps:["Check preliminary eligibility","Complete official registration/status process"],stepDesc:["Review landholding, beneficiary and exclusion information. The final decision is based on official records and current scheme rules.","Open the official PM-KISAN portal, complete the current registration/status process and keep the acknowledgement/reference number."],ruleFarmerType:"Landholding farmer",ruleOther:"Eligible landholding farmer families are identified and verified by the State/UT administration; scheme exclusions apply. This system provides preliminary guidance only."},
    S002:{name:"Pradhan Mantri Fasal Bima Yojana",desc:"Crop insurance support for covered crop losses under the applicable season and state notification.",benefits:"Insurance protection for notified crops and covered risks.",docs:["Land/cultivation and crop details","Bank account details","Identity/contact details"],docDesc:["Shows crop, cultivated area and information needed for applicable insurance enrolment/claim processing.","Used for premium, benefit or claim-related banking information where applicable.","Used to identify and contact the farmer for the insurance process."],steps:["Check notified crop and season","Enrol through the applicable channel"],stepDesc:["Check whether the crop, notified area, season and risk are covered by the current state/season notification.","Use the official PMFBY portal or applicable bank/state/service channel and retain the receipt or acknowledgement."],ruleFarmerType:"Cultivator",ruleOther:"Coverage depends on the notified crop, season, area, state/UT rules and enrolment/claim conditions. Do not treat crop damage alone as proof of eligibility."},
    S003:{name:"Kisan Credit Card (KCC)",desc:"Credit support for agriculture and eligible allied activities.",benefits:"Agricultural credit according to the participating bank's current terms.",docs:["KCC/application form","Identity and address proof","Proof of landholding/cultivation as applicable"],docDesc:["The prescribed KCC application form submitted to the participating bank.","Confirms applicant identity and address for bank/KCC processing.","Helps assess agricultural landholding/cultivation and eligible credit requirement."],steps:["Choose a participating bank","Submit the KCC application"],stepDesc:["Choose a participating bank and ask for current KCC eligibility, limit, interest and document requirements.","Fill the KCC application, attach requested documents and submit it to the bank or supported digital channel. Keep the acknowledgement."],ruleFarmerType:"Owner cultivator / Tenant farmer / Sharecropper",ruleOther:"Participating banks assess applications and may apply institution/location-specific requirements."},
    S004:{name:"Soil Health Card Scheme",desc:"Soil testing and nutrient-management recommendations.",benefits:"Soil-test information and recommendations for nutrient management.",docs:["Farmer/field details","Soil sample/field information as instructed locally"],docDesc:["Identifies the farmer and field to arrange the applicable soil test.","Provides the sample/field information needed by the local soil-testing facility."],steps:["Arrange soil testing","Receive and use soil recommendations"],stepDesc:["Contact the local agriculture department or authorised soil-testing facility and follow its sample collection instructions.","Collect the soil-health report and follow its crop/nutrient recommendations; consult the agriculture department if unclear."],ruleFarmerType:"Farmer / Cultivator",ruleOther:"Availability and field/lab process can depend on the local agriculture department and soil testing arrangements."}
  },
  मराठी: {
    S001:{name:"पीएम-किसान सन्मान निधी",desc:"पात्र जमीनधारक शेतकरी कुटुंबांसाठी उत्पन्न सहाय्य योजना.",benefits:"योजनेच्या नियमांनुसार वर्षाला ₹6,000 तीन समान हप्त्यांत.",docs:["आधार/ओळख दस्तऐवज","जमीनधारणा/जमीन नोंद","बँक खाते तपशील"],docDesc:["शेतकऱ्याची ओळख पडताळण्यासाठी आणि लाभार्थी नोंदणीशी जोडण्यासाठी.","शेतकरी/कुटुंबाच्या नोंदवलेल्या शेतीजमिनीची पडताळणी करण्यासाठी.","पात्र लाभ थेट बँक खात्यात मिळवण्यासाठी."],steps:["प्राथमिक पात्रता तपासा","अधिकृत नोंदणी/स्थिती प्रक्रिया पूर्ण करा"],stepDesc:["जमीनधारणा, लाभार्थी माहिती आणि अपवाद तपासा. अंतिम निर्णय अधिकृत नोंदी व सध्याच्या नियमांवर आधारित असतो.","अधिकृत PM-किसान पोर्टल उघडा, सध्याची नोंदणी/स्थिती प्रक्रिया पूर्ण करा आणि पावती/संदर्भ क्रमांक जतन करा."],ruleFarmerType:"जमीनधारक शेतकरी",ruleOther:"पात्र जमीनधारक शेतकरी कुटुंबांची राज्य/केंद्रशासित प्रदेश प्रशासनाकडून पडताळणी केली जाते; योजनेतील अपवाद लागू होतात. ही प्रणाली फक्त प्राथमिक मार्गदर्शन देते."},
    S002:{name:"प्रधानमंत्री फसल बीमा योजना",desc:"लागू हंगाम व राज्य अधिसूचनेनुसार संरक्षित पिकांच्या नुकसानीसाठी विमा सहाय्य.",benefits:"अधिसूचित पिके व जोखमींसाठी विमा संरक्षण.",docs:["जमीन/लागवड व पीक तपशील","बँक खाते तपशील","ओळख व संपर्क तपशील"],docDesc:["पीक, लागवड क्षेत्र आणि विमा नोंदणी/दाव्यासाठी आवश्यक माहिती दर्शवते.","लागू असल्यास प्रीमियम, लाभ किंवा दावा संबंधित बँकिंग माहिती.","विमा प्रक्रियेसाठी शेतकऱ्याची ओळख आणि संपर्क साधण्यासाठी."],steps:["अधिसूचित पीक व हंगाम तपासा","लागू माध्यमातून नोंदणी करा"],stepDesc:["अधिकृत राज्य/हंगाम अधिसूचनेत पीक, क्षेत्र, हंगाम आणि जोखीम समाविष्ट आहेत का ते तपासा.","अधिकृत PMFBY पोर्टल किंवा लागू बँक/राज्य/सेवा केंद्राद्वारे नोंदणी करा आणि पावती जतन करा."],ruleFarmerType:"पीक उत्पादक / लागवड करणारा शेतकरी",ruleOther:"संरक्षण अधिसूचित पीक, हंगाम, क्षेत्र, राज्य/केंद्रशासित प्रदेश नियम आणि नोंदणी/दावा अटींवर अवलंबून असते. केवळ पीक नुकसान हे पात्रतेचे पुरावे नाही."},
    S003:{name:"किसान क्रेडिट कार्ड (KCC)",desc:"शेती आणि पात्र संबंधित कामांसाठी कर्ज सहाय्य.",benefits:"सहभागी बँकेच्या सध्याच्या अटींनुसार कृषी कर्ज.",docs:["KCC अर्ज फॉर्म","ओळख व पत्ता पुरावा","लागू असल्यास जमीनधारणा/लागवडीचा पुरावा"],docDesc:["सहभागी बँकेला दिलेला निर्धारित KCC अर्ज फॉर्म.","अर्जदाराची ओळख आणि पत्ता पडताळण्यासाठी.","शेतीजमीन/लागवड आणि आवश्यक कृषी कर्जाचे मूल्यांकन करण्यासाठी."],steps:["सहभागी बँक निवडा","KCC अर्ज सादर करा"],stepDesc:["सहभागी बँक निवडा आणि सध्याची KCC पात्रता, मर्यादा, व्याज व कागदपत्रे विचारा.","KCC अर्ज भरा, आवश्यक कागदपत्रे जोडा आणि बँक किंवा उपलब्ध डिजिटल माध्यमातून सादर करा."],ruleFarmerType:"मालक शेतकरी / भाडेकरू शेतकरी / बटाईदार शेतकरी",ruleOther:"सहभागी बँक अर्जाचे मूल्यांकन करते आणि संस्था/स्थानानुसार अतिरिक्त आवश्यकता लागू होऊ शकतात."},
    S004:{name:"मृदा आरोग्य कार्ड योजना",desc:"माती परीक्षण व पोषण व्यवस्थापनासाठी शिफारसी.",benefits:"माती परीक्षण माहिती आणि पोषण व्यवस्थापनाच्या शिफारसी.",docs:["शेतकरी/शेत तपशील","स्थानिक सूचनेनुसार माती नमुना/शेत माहिती"],docDesc:["शेतकरी आणि शेताची ओळख करून योग्य माती परीक्षणाची व्यवस्था करण्यासाठी.","स्थानिक माती परीक्षण केंद्राला आवश्यक नमुना/शेत माहिती देण्यासाठी."],steps:["माती परीक्षणाची व्यवस्था करा","मातीच्या शिफारसी मिळवा आणि वापरा"],stepDesc:["स्थानिक कृषी विभाग किंवा अधिकृत माती परीक्षण केंद्राशी संपर्क करून नमुना संकलनाच्या सूचना पाळा.","मृदा आरोग्य अहवाल घ्या आणि त्यातील पीक/पोषक शिफारसी वापरा; शंका असल्यास कृषी विभागाशी संपर्क करा."],ruleFarmerType:"शेतकरी / पीक उत्पादक",ruleOther:"उपलब्धता आणि क्षेत्र/प्रयोगशाळा प्रक्रिया स्थानिक कृषी विभाग व माती परीक्षण व्यवस्थेवर अवलंबून असू शकते."}
  },
  हिंदी: {
    S001:{name:"पीएम-किसान सम्मान निधि",desc:"पात्र भूमि धारक किसान परिवारों के लिए आय सहायता योजना।",benefits:"योजना नियमों के अनुसार वर्ष में ₹6,000 तीन समान किस्तों में।",docs:["आधार/पहचान दस्तावेज़","भूमि रिकॉर्ड","बैंक खाते का विवरण"],docDesc:["किसान की पहचान सत्यापित करने और लाभार्थी रिकॉर्ड को योजना पंजीकरण से जोड़ने के लिए।","किसान/परिवार की दर्ज कृषि भूमि की पुष्टि करने के लिए।","पात्र लाभ को बैंक खाते में प्राप्त करने के लिए।"],steps:["प्रारंभिक पात्रता जांचें","आधिकारिक पंजीकरण/स्थिति प्रक्रिया पूरी करें"],stepDesc:["भूमि रिकॉर्ड, लाभार्थी जानकारी और अपवाद देखें। अंतिम निर्णय आधिकारिक रिकॉर्ड और वर्तमान नियमों पर आधारित होता है।","आधिकारिक PM-किसान पोर्टल खोलें, वर्तमान पंजीकरण/स्थिति प्रक्रिया पूरी करें और पावती/संदर्भ संख्या रखें।"],ruleFarmerType:"भूमिधारक किसान",ruleOther:"पात्र भूमि धारक किसान परिवारों की पहचान और सत्यापन राज्य/केंद्रशासित प्रदेश प्रशासन द्वारा किया जाता है; योजना के अपवाद लागू होते हैं। यह प्रणाली केवल प्रारंभिक मार्गदर्शन देती है।"},
    S002:{name:"प्रधानमंत्री फसल बीमा योजना",desc:"लागू मौसम और राज्य अधिसूचना के अनुसार फसल नुकसान के लिए बीमा सहायता।",benefits:"अधिसूचित फसलों और जोखिमों के लिए बीमा सुरक्षा।",docs:["भूमि/फसल विवरण","बैंक खाते का विवरण","पहचान और संपर्क विवरण"],docDesc:["फसल, खेती का क्षेत्र और बीमा नामांकन/दावा प्रक्रिया के लिए आवश्यक जानकारी।","जहाँ लागू हो वहाँ प्रीमियम/लाभ/दावा से जुड़ी बैंकिंग जानकारी।","बीमा प्रक्रिया के लिए किसान की पहचान और संपर्क जानकारी।"],steps:["अधिसूचित फसल और मौसम जांचें","लागू माध्यम से नामांकन करें"],stepDesc:["वर्तमान राज्य/मौसम अधिसूचना में फसल, क्षेत्र, मौसम और जोखिम शामिल हैं या नहीं जाँचें।","आधिकारिक PMFBY पोर्टल या लागू बैंक/राज्य/सेवा चैनल से नामांकन करें और पावती रखें।"],ruleFarmerType:"कृषक / फसल उत्पादक",ruleOther:"कवरेज अधिसूचित फसल, मौसम, क्षेत्र, राज्य/केंद्रशासित प्रदेश के नियम और नामांकन/दावा शर्तों पर निर्भर करता है। केवल फसल नुकसान पात्रता का प्रमाण नहीं है।"},
    S003:{name:"किसान क्रेडिट कार्ड (KCC)",desc:"खेती और पात्र कृषि गतिविधियों के लिए ऋण सहायता।",benefits:"भाग लेने वाले बैंक की वर्तमान शर्तों के अनुसार कृषि ऋण।",docs:["KCC आवेदन फॉर्म","पहचान और पता प्रमाण","लागू होने पर भूमि/खेती का प्रमाण"],docDesc:["भाग लेने वाले बैंक को दिया गया निर्धारित KCC आवेदन फॉर्म।","आवेदक की पहचान और पता सत्यापित करने के लिए।","कृषि भूमि/खेती और आवश्यक कृषि ऋण का आकलन करने के लिए।"],steps:["भाग लेने वाला बैंक चुनें","KCC आवेदन जमा करें"],stepDesc:["भाग लेने वाला बैंक चुनें और वर्तमान KCC पात्रता, सीमा, ब्याज और दस्तावेज़ आवश्यकताएँ पूछें।","KCC आवेदन भरें, आवश्यक दस्तावेज़ लगाएँ और बैंक या उपलब्ध डिजिटल माध्यम से जमा करें।"],ruleFarmerType:"स्वयं खेती करने वाला मालिक / किरायेदार किसान / बटाईदार किसान",ruleOther:"भाग लेने वाला बैंक आवेदन का मूल्यांकन करता है और संस्था/स्थान के अनुसार अतिरिक्त आवश्यकताएँ लागू हो सकती हैं।"},
    S004:{name:"मृदा स्वास्थ्य कार्ड योजना",desc:"मिट्टी जांच और पोषक प्रबंधन की सिफारिशें।",benefits:"मिट्टी जांच की जानकारी और पोषक प्रबंधन की सिफारिशें।",docs:["किसान/खेत विवरण","स्थानीय निर्देश के अनुसार मिट्टी नमूना/खेत जानकारी"],docDesc:["किसान और खेत की पहचान कर उपयुक्त मिट्टी परीक्षण की व्यवस्था करने के लिए।","स्थानीय मिट्टी परीक्षण केंद्र को आवश्यक नमूना/खेत जानकारी देने के लिए।"],steps:["मिट्टी जांच की व्यवस्था करें","मिट्टी की सिफारिशें प्राप्त कर उपयोग करें"],stepDesc:["स्थानीय कृषि विभाग या अधिकृत मिट्टी परीक्षण केंद्र से संपर्क कर नमूना संग्रह निर्देशों का पालन करें।","मृदा स्वास्थ्य रिपोर्ट प्राप्त करें और उसकी फसल/पोषक सिफारिशों का उपयोग करें; शंका होने पर कृषि विभाग से संपर्क करें।"],ruleFarmerType:"किसान / कृषक",ruleOther:"उपलब्धता और क्षेत्र/प्रयोगशाला प्रक्रिया स्थानीय कृषि विभाग और मिट्टी परीक्षण व्यवस्था पर निर्भर कर सकती है।"}
  },
  कन्नड: {
    S001:{name:"ಪಿಎಂ-ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ",desc:"ಅರ್ಹ ಭೂಮಿ ಹೊಂದಿರುವ ರೈತ ಕುಟುಂಬಗಳಿಗೆ ಆದಾಯ ಸಹಾಯ ಯೋಜನೆ.",benefits:"ಯೋಜನೆಯ ನಿಯಮಗಳಂತೆ ವರ್ಷಕ್ಕೆ ₹6,000 ಮೂರು ಸಮಾನ ಕಂತುಗಳಲ್ಲಿ.",docs:["ಆಧಾರ್/ಗುರುತಿನ ದಾಖಲೆ","ಭೂಮಿ ದಾಖಲೆ","ಬ್ಯಾಂಕ್ ಖಾತೆ ವಿವರ"],docDesc:["ರೈತರ ಗುರುತನ್ನು ಪರಿಶೀಲಿಸಲು ಮತ್ತು ಫಲಾನುಭವಿ ದಾಖಲೆಯನ್ನು ಯೋಜನಾ ನೋಂದಣಿಗೆ ಜೋಡಿಸಲು.","ರೈತ/ಕುಟುಂಬದ ದಾಖಲಾಗಿರುವ ಕೃಷಿ ಭೂಮಿಯನ್ನು ಪರಿಶೀಲಿಸಲು.","ಅರ್ಹ ಲಾಭವನ್ನು ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಪಡೆಯಲು."],steps:["ಪ್ರಾಥಮಿಕ ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ","ಅಧಿಕೃತ ನೋಂದಣಿ/ಸ್ಥಿತಿ ಪ್ರಕ್ರಿಯೆ ಪೂರ್ಣಗೊಳಿಸಿ"],stepDesc:["ಭೂಮಿ ದಾಖಲೆ, ಫಲಾನುಭವಿ ಮಾಹಿತಿ ಮತ್ತು ವಿನಾಯಿತಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ. ಅಂತಿಮ ನಿರ್ಧಾರ ಅಧಿಕೃತ ದಾಖಲೆ ಮತ್ತು ಪ್ರಸ್ತುತ ನಿಯಮಗಳ ಮೇಲೆ ಆಧಾರಿತವಾಗಿದೆ.","ಅಧಿಕೃತ PM-ಕಿಸಾನ್ ಪೋರ್ಟಲ್ ತೆರೆಯಿರಿ, ಪ್ರಸ್ತುತ ನೋಂದಣಿ/ಸ್ಥಿತಿ ಪ್ರಕ್ರಿಯೆ ಪೂರ್ಣಗೊಳಿಸಿ ಮತ್ತು ಸ್ವೀಕೃತಿ/ಉಲ್ಲೇಖ ಸಂಖ್ಯೆಯನ್ನು ಉಳಿಸಿ."],ruleFarmerType:"ಭೂಮಿ ಹೊಂದಿರುವ ರೈತ",ruleOther:"ಅರ್ಹ ಭೂಮಿ ಹೊಂದಿರುವ ರೈತ ಕುಟುಂಬಗಳನ್ನು ರಾಜ್ಯ/ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶ ಆಡಳಿತ ಗುರುತಿಸಿ ಪರಿಶೀಲಿಸುತ್ತದೆ; ಯೋಜನೆಯ ವಿನಾಯಿತಿಗಳು ಅನ್ವಯಿಸುತ್ತವೆ. ಇದು ಪ್ರಾಥಮಿಕ ಮಾರ್ಗದರ್ಶನ ಮಾತ್ರ."},
    S002:{name:"ಪ್ರಧಾನಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ",desc:"ಅನ್ವಯಿಸುವ ಹಂಗಾಮು ಮತ್ತು ರಾಜ್ಯ ಅಧಿಸೂಚನೆಯಂತೆ ಬೆಳೆ ನಷ್ಟಕ್ಕೆ ವಿಮಾ ಸಹಾಯ.",benefits:"ಅಧಿಸೂಚಿತ ಬೆಳೆಗಳು ಮತ್ತು ಅಪಾಯಗಳಿಗೆ ವಿಮಾ ರಕ್ಷಣೆ.",docs:["ಭೂಮಿ/ಬೆಳೆ ವಿವರ","ಬ್ಯಾಂಕ್ ಖಾತೆ ವಿವರ","ಗುರುತು ಮತ್ತು ಸಂಪರ್ಕ ವಿವರ"],docDesc:["ಬೆಳೆ, ಬೆಳೆದ ಪ್ರದೇಶ ಮತ್ತು ವಿಮಾ ನೋಂದಣಿ/ದಾವೆಗೆ ಅಗತ್ಯವಿರುವ ಮಾಹಿತಿ.","ಅನ್ವಯಿಸಿದಲ್ಲಿ ಪ್ರೀಮಿಯಂ/ಲಾಭ/ದಾವೆಗೆ ಸಂಬಂಧಿಸಿದ ಬ್ಯಾಂಕ್ ಮಾಹಿತಿ.","ವಿಮೆ ಪ್ರಕ್ರಿಯೆಗೆ ರೈತರ ಗುರುತು ಮತ್ತು ಸಂಪರ್ಕ ವಿವರ."],steps:["ಅಧಿಸೂಚಿತ ಬೆಳೆ ಮತ್ತು ಹಂಗಾಮು ಪರಿಶೀಲಿಸಿ","ಅನ್ವಯಿಸುವ ಮಾರ್ಗದ ಮೂಲಕ ನೋಂದಾಯಿಸಿ"],stepDesc:["ಪ್ರಸ್ತುತ ರಾಜ್ಯ/ಹಂಗಾಮಿನ ಅಧಿಸೂಚನೆಯಲ್ಲಿ ಬೆಳೆ, ಪ್ರದೇಶ, ಹಂಗಾಮು ಮತ್ತು ಅಪಾಯ ಒಳಗೊಂಡಿದೆಯೇ ಪರಿಶೀಲಿಸಿ.","ಅಧಿಕೃತ PMFBY ಪೋರ್ಟಲ್ ಅಥವಾ ಅನ್ವಯಿಸುವ ಬ್ಯಾಂಕ್/ರಾಜ್ಯ/ಸೇವಾ ಮಾರ್ಗದ ಮೂಲಕ ನೋಂದಾಯಿಸಿ ಮತ್ತು ಸ್ವೀಕೃತಿಯನ್ನು ಉಳಿಸಿ."],ruleFarmerType:"ಕೃಷಿಕ / ಬೆಳೆ ಬೆಳೆಸುವ ರೈತ",ruleOther:"ವಿಮೆ ವ್ಯಾಪ್ತಿ ಅಧಿಸೂಚಿತ ಬೆಳೆ, ಹಂಗಾಮು, ಪ್ರದೇಶ, ರಾಜ್ಯ/ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶದ ನಿಯಮಗಳು ಮತ್ತು ನೋಂದಣಿ/ದಾವೆ ಷರತ್ತುಗಳ ಮೇಲೆ ಅವಲಂಬಿತವಾಗಿದೆ. ಬೆಳೆ ಹಾನಿ ಮಾತ್ರ ಅರ್ಹತೆಯ ಸಾಕ್ಷ್ಯವಲ್ಲ."},
    S003:{name:"ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ (KCC)",desc:"ಕೃಷಿ ಮತ್ತು ಸಂಬಂಧಿತ ಅರ್ಹ ಚಟುವಟಿಕೆಗಳಿಗೆ ಸಾಲ ಸಹಾಯ.",benefits:"ಭಾಗವಹಿಸುವ ಬ್ಯಾಂಕಿನ ಪ್ರಸ್ತುತ ನಿಯಮಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ಕೃಷಿ ಸಾಲ.",docs:["KCC ಅರ್ಜಿ","ಗುರುತು ಮತ್ತು ವಿಳಾಸ ಪುರಾವೆ","ಅನ್ವಯಿಸಿದರೆ ಭೂಮಿ/ಕೃಷಿ ಪುರಾವೆ"],docDesc:["ಭಾಗವಹಿಸುವ ಬ್ಯಾಂಕ್‌ಗೆ ಸಲ್ಲಿಸುವ ನಿಗದಿತ KCC ಅರ್ಜಿ.","ಅರ್ಜಿದಾರರ ಗುರುತು ಮತ್ತು ವಿಳಾಸವನ್ನು ಪರಿಶೀಲಿಸಲು.","ಕೃಷಿ ಭೂಮಿ/ಕೃಷಿ ಮತ್ತು ಅಗತ್ಯ ಕೃಷಿ ಸಾಲವನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಲು."],steps:["ಭಾಗವಹಿಸುವ ಬ್ಯಾಂಕ್ ಆಯ್ಕೆಮಾಡಿ","KCC ಅರ್ಜಿ ಸಲ್ಲಿಸಿ"],stepDesc:["ಭಾಗವಹಿಸುವ ಬ್ಯಾಂಕ್ ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ಪ್ರಸ್ತುತ KCC ಅರ್ಹತೆ, ಮಿತಿ, ಬಡ್ಡಿ ಮತ್ತು ದಾಖಲೆಗಳ ಅವಶ್ಯಕತೆ ಕೇಳಿ.","KCC ಅರ್ಜಿ ಭರ್ತಿ ಮಾಡಿ, ಅಗತ್ಯ ದಾಖಲೆಗಳನ್ನು ಸೇರಿಸಿ ಮತ್ತು ಬ್ಯಾಂಕ್ ಅಥವಾ ಲಭ್ಯವಿರುವ ಡಿಜಿಟಲ್ ಮಾರ್ಗದಲ್ಲಿ ಸಲ್ಲಿಸಿ."],ruleFarmerType:"ಮಾಲೀಕ ಕೃಷಿಕ / ಬಾಡಿಗೆ ರೈತ / ಪಾಲುದಾರ ರೈತ",ruleOther:"ಭಾಗವಹಿಸುವ ಬ್ಯಾಂಕ್ ಅರ್ಜಿಯನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡುತ್ತದೆ ಮತ್ತು ಸಂಸ್ಥೆ/ಸ್ಥಳದ ಪ್ರಕಾರ ಹೆಚ್ಚುವರಿ ಅವಶ್ಯಕತೆಗಳು ಇರಬಹುದು."},
    S004:{name:"ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಯೋಜನೆ",desc:"ಮಣ್ಣು ಪರೀಕ್ಷೆ ಮತ್ತು ಪೋಷಕಾಂಶ ನಿರ್ವಹಣೆಯ ಸಲಹೆಗಳು.",benefits:"ಮಣ್ಣು ಪರೀಕ್ಷೆಯ ಮಾಹಿತಿ ಮತ್ತು ಪೋಷಕಾಂಶ ನಿರ್ವಹಣೆಯ ಸಲಹೆಗಳು.",docs:["ರೈತ/ಕ್ಷೇತ್ರ ವಿವರ","ಸ್ಥಳೀಯ ಸೂಚನೆಯಂತೆ ಮಣ್ಣು ಮಾದರಿ/ಕ್ಷೇತ್ರ ಮಾಹಿತಿ"],docDesc:["ರೈತ ಮತ್ತು ಹೊಲವನ್ನು ಗುರುತಿಸಿ ಸೂಕ್ತ ಮಣ್ಣು ಪರೀಕ್ಷೆಯನ್ನು ವ್ಯವಸ್ಥೆ ಮಾಡಲು.","ಸ್ಥಳೀಯ ಮಣ್ಣು ಪರೀಕ್ಷಾ ಕೇಂದ್ರಕ್ಕೆ ಅಗತ್ಯ ಮಾದರಿ/ಹೊಲ ಮಾಹಿತಿ ನೀಡಲು."],steps:["ಮಣ್ಣು ಪರೀಕ್ಷೆ ವ್ಯವಸ್ಥೆ ಮಾಡಿ","ಮಣ್ಣಿನ ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆದು ಬಳಸಿ"],stepDesc:["ಸ್ಥಳೀಯ ಕೃಷಿ ಇಲಾಖೆ ಅಥವಾ ಅಧಿಕೃತ ಮಣ್ಣು ಪರೀಕ್ಷಾ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ ಮತ್ತು ಮಾದರಿ ಸಂಗ್ರಹ ಸೂಚನೆಗಳನ್ನು ಅನುಸರಿಸಿ.","ಮಣ್ಣಿನ ಆರೋಗ್ಯ ವರದಿ ಪಡೆದು ಅದರ ಬೆಳೆ/ಪೋಷಕಾಂಶ ಶಿಫಾರಸುಗಳನ್ನು ಬಳಸಿ; ಸಂದೇಹವಿದ್ದರೆ ಕೃಷಿ ಇಲಾಖೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ."],ruleFarmerType:"ರೈತ / ಕೃಷಿಕ",ruleOther:"ಲಭ್ಯತೆ ಮತ್ತು ಕ್ಷೇತ್ರ/ಪ್ರಯೋಗಾಲಯ ಪ್ರಕ್ರಿಯೆ ಸ್ಥಳೀಯ ಕೃಷಿ ಇಲಾಖೆ ಮತ್ತು ಮಣ್ಣು ಪರೀಕ್ಷಾ ವ್ಯವಸ್ಥೆಯ ಮೇಲೆ ಅವಲಂಬಿತವಾಗಿರಬಹುದು."}
  }
};
function localizedScheme(data, lang){ return data; }

function localizeResultItem(item,lang){ return item; }

const TRANSLATE_TARGETS = {English:"en", "मराठी":"mr", "हिन्दी":"hi", "कन्नड":"kn"};
function ApiAutoTranslator({lang}){
  // Offline mode: no Google Translate/deep-translator requests are made.
  // The interface uses the built-in English/Marathi/Hindi/Kannada dictionaries above.
  useEffect(()=>{},[lang]);
  return null;
}

function App(){
  const [page,setPage] = useState("home");
  const [pageHistory,setPageHistory] = useState([]);
  const [lang,setLang] = useState(()=>{
    const saved = localStorage.getItem("agrivoiceLanguage") || "English";
    const aliases = {"हिन्दी":"हिंदी", "ಕನ್ನಡ":"कन्नड"};
    const normalized = aliases[saved] || saved;
    return translations[normalized] ? normalized : "English";
  });
  const [selectedScheme,setSelectedScheme] = useState(schemes[0]);
  const [mobileMenu,setMobileMenu] = useState(false);
  const [authToken,setAuthToken] = useState(()=>localStorage.getItem("agrivoiceToken")||"");
  const [isLoggedIn,setIsLoggedIn] = useState(()=>Boolean(localStorage.getItem("agrivoiceToken")));
  const [user,setUser] = useState(()=>{try{return JSON.parse(localStorage.getItem("agrivoiceUser"))||{}}catch{return {}}});
  const changeLanguage = (value) => {
    const aliases = {"हिन्दी":"हिंदी", "ಕನ್ನಡ":"कन्नड"};
    const normalized = aliases[value] || value;
    const safeLanguage = translations[normalized] ? normalized : "English";
    setLang(safeLanguage);
    localStorage.setItem("agrivoiceLanguage", safeLanguage);
  };
  const t = {
    ...translations.English,
    ...(extraTranslations.English || {}),
    ...(COMMON_I18N.English || {}),
    ...(translations[lang] || {}),
    ...(extraTranslations[lang] || {}),
    ...(COMMON_I18N[lang] || {})
  };

  useEffect(()=>{
    if(!authToken) return;
    api.me(authToken).then(data=>{
      setUser(data.user); setIsLoggedIn(true); localStorage.setItem("agrivoiceUser",JSON.stringify(data.user));
    }).catch(()=>{
      localStorage.removeItem("agrivoiceToken"); localStorage.removeItem("agrivoiceUser");
      setAuthToken(""); setIsLoggedIn(false); setUser({});
    });
  },[authToken]);

  const go = (next) => { if(next!==page) setPageHistory(h=>[...h,page]); setPage(next); setMobileMenu(false); window.scrollTo({top:0,behavior:"smooth"}); };
  const goBack = () => { const previous=pageHistory[pageHistory.length-1]||"home"; setPageHistory(h=>h.slice(0,-1)); setPage(previous); window.scrollTo({top:0,behavior:"smooth"}); };

  const handleAuth = (data) => {
    setUser(data.user); setAuthToken(data.token); setIsLoggedIn(true);
    localStorage.setItem("agrivoiceUser",JSON.stringify(data.user));
    localStorage.setItem("agrivoiceToken",data.token);
    go("home");
  };

  const handleLogout = async () => {
    try { if(authToken) await api.logout(authToken); } catch { /* local logout still happens */ }
    setAuthToken(""); setIsLoggedIn(false); setUser({});
    localStorage.removeItem("agrivoiceToken"); localStorage.removeItem("agrivoiceUser");
    go("home");
  };

  return <div className="app">
    <ApiAutoTranslator lang={lang}/>
    <Navbar t={t} lang={lang} setLang={changeLanguage} go={go} mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout}/>
    <main>
      {page!=="home" && <div className="container page-back-wrap"><button className="outline back-button" onClick={goBack} aria-label="Go back">← Back</button></div>}
      {page==="home" && <Home t={t} lang={lang} go={go} setSelectedScheme={setSelectedScheme}/>} 
      {page==="schemes" && <Schemes t={t} lang={lang} go={go} setSelectedScheme={setSelectedScheme}/>} 
      {page==="detail" && <SchemeDetail t={t} go={go} scheme={selectedScheme} setSelectedScheme={setSelectedScheme} lang={lang}/>} 
      {page==="voice" && <Voice t={t} user={user} token={authToken} siteLang={lang}/>} 
      {page==="documents" && <Documents t={t}/>} 
      {page==="guidance" && <Guidance t={t}/>} 
      {page==="profile" && isLoggedIn && <Profile t={t} user={user} setUser={setUser} token={authToken}/>} 
      {page==="eligibility" && <Eligibility t={t} token={authToken} user={user} selectedScheme={selectedScheme} lang={lang}/>} 
      {page==="login" && <Auth t={t} mode="login" go={go} onAuth={handleAuth}/>} 
      {page==="register" && <Auth t={t} mode="register" go={go} onAuth={handleAuth}/>} 
      {page==="settings" && <SettingsPage t={t} lang={lang} setLang={changeLanguage}/>} 
    </main>
    <Footer t={t}/>
  </div>
}

function Navbar({t,lang,setLang,go,mobileMenu,setMobileMenu,isLoggedIn,user,onLogout}){
  const [profileOpen,setProfileOpen] = useState(false);
  return <header className="navbar">
    <div className="nav-inner">
      <button className="brand" onClick={()=>go("home")} aria-label={t.home}>
        <span className="brand-mark"><Leaf size={20}/></span><span>AgriVoice</span>
      </button>
      <nav className="desktop-nav">
        <button onClick={()=>go("home")}>{t.home}</button>
        <button onClick={()=>go("schemes")}>{t.schemes}</button>
        <button onClick={()=>go("voice")}>{t.voice}</button>
        <button onClick={()=>go("documents")}>{t.documents}</button>
        <button onClick={()=>go("guidance")}>{t.guidance}</button>
      </nav>
      <div className="nav-actions">
        <div className="language">
          <Globe2 size={15}/><select value={lang} onChange={e=>setLang(e.target.value)} aria-label="Language">
            <option value="English">English</option><option value="मराठी">मराठी</option><option value="हिंदी">हिंदी</option><option value="कन्नड">ಕನ್ನಡ</option>
          </select>
        </div>
        {!isLoggedIn ? <><button className="nav-login" onClick={()=>go("login")}><LogIn size={16}/>{t.login}</button><button className="nav-register" onClick={()=>go("register")}><UserPlus size={16}/>{t.register}</button></> : <div className="profile-menu-wrap">
          <button className="profile-icon-btn" aria-label="Open profile menu" onClick={()=>setProfileOpen(!profileOpen)}>
            <CircleUserRound size={25}/>
          </button>
          {profileOpen && <div className="profile-dropdown">
            <button onClick={()=>{setProfileOpen(false);go("profile")}}><UserRound size={17}/><span>{t.profile}</span></button>
            <button onClick={()=>{setProfileOpen(false);go("settings")}}><Settings size={17}/><span>{t.settings}</span></button>
            <button onClick={()=>{setProfileOpen(false);onLogout()}}><LogOut size={17}/><span>{t.logout}</span></button>
          </div>}
        </div>}
        <button className="menu-btn" onClick={()=>setMobileMenu(!mobileMenu)}>{mobileMenu?<X/>:<Menu/>}</button>
      </div>
    </div>
    {mobileMenu && <div className="mobile-nav">
      <button onClick={()=>go("home")}>{t.home}</button><button onClick={()=>go("schemes")}>{t.schemes}</button>
      <button onClick={()=>go("voice")}>{t.voice}</button><button onClick={()=>go("documents")}>{t.documents}</button>
      <button onClick={()=>go("guidance")}>{t.guidance}</button>
      {!isLoggedIn ? <><button onClick={()=>go("login")}>{t.login}</button><button onClick={()=>go("register")}>{t.register}</button></> : <>
        <button onClick={()=>go("profile")}>{t.profile}</button><button onClick={()=>go("settings")}>{t.settings}</button><button onClick={onLogout}>{t.logout}</button>
      </>}
    </div>}
  </header>
}

function Home({t,lang,go,setSelectedScheme}){
  return <div>
    <section className="hero">
      <img src={images.hero} alt="Green agricultural field"/>
      <div className="hero-overlay"/>
      <div className="container hero-content">
        <div className="hero-copy">
          <p className="eyebrow">{t.welcome}</p>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroText}</p>
          <div className="hero-buttons"><button className="primary" onClick={()=>go("schemes")}>{t.explore}<ArrowRight size={17}/></button><button className="secondary-light" onClick={()=>go("voice")}><Mic size={17}/>{t.voice}</button></div>
        </div>
      </div>
    </section>
    <section className="container feature-grid">
      <Feature icon={<Landmark/>} title={t.schemes} text={t.featureExplore} go={()=>go("schemes")}/>
      <Feature icon={<Mic/>} title={t.voice} text={t.featureVoice} go={()=>go("voice")}/>
      <Feature icon={<FileText/>} title={t.documents} text={t.featureDocuments} go={()=>go("documents")}/>
      <Feature icon={<CheckCircle2/>} title={t.guidance} text={t.featureGuidance} go={()=>go("guidance")}/>
    </section>
    <section className="container section">
      <div className="section-head"><div><span className="eyebrow green">{t.supportTag}</span><h2>{t.popular}</h2></div><button className="text-btn" onClick={()=>go("schemes")}>{t.viewAll} <ArrowRight size={16}/></button></div>
      <div className="scheme-grid">{schemes.map(s=><SchemeCard key={s.id} scheme={localizedStaticScheme(s,lang)} t={t} onClick={()=>{setSelectedScheme(s);go("detail")}}/>)}</div>
    </section>
    <section className="container info-banner">
      <div><Sprout size={36}/><div><h3>{t.supportTitle}</h3><p>{t.supportText}</p></div></div>
      <button className="primary" onClick={()=>go("register")}><UserPlus size={17}/> {t.register}</button>
    </section>
  </div>
}

function Feature({icon,title,text,go}){return <button className="feature-card" onClick={go}><span className="feature-icon">{icon}</span><span><b>{title}</b><small>{text}</small></span><ArrowRight size={16}/></button>}

function SchemeCard({scheme,t,onClick}){return <article className="scheme-card"><img src={scheme.image} alt={scheme.name}/><div className="scheme-body"><span className="pill">{scheme.category}</span><h3>{scheme.name}</h3><p>{scheme.desc}</p><button className="text-btn" onClick={onClick}>{t.details} <ArrowRight size={15}/></button></div></article>}

function Schemes({t,lang,go,setSelectedScheme}){
  const [q,setQ]=useState("");
  const filtered=useMemo(()=>schemes.filter(s=>{const v=localizedStaticScheme(s,lang); const query=q.toLowerCase(); return [s.name,s.category,s.desc,v.name,v.category,v.desc].some(x=>String(x).toLowerCase().includes(query));}),[q,lang]);
  return <section className="container page">
    <div className="page-banner" style={{backgroundImage:`url(${images.field})`}}><div><span className="eyebrow">{t.agriSupport}</span><h1>{t.schemeTitle}</h1><p>{t.schemeText}</p></div></div>
    <div className="search-row"><div className="search-box"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder={t.search}/></div><button className="outline" onClick={()=>go("eligibility")}>{t.check}</button></div>
    <div className="scheme-grid large">{filtered.map(s=><SchemeCard key={s.id} scheme={localizedStaticScheme(s,lang)} t={t} onClick={()=>{setSelectedScheme(s);go("detail")}}/>)}</div>
  </section>
}

function SchemeDetail({t,go,scheme,lang}){
  const [detail,setDetail]=useState(null);
  const [loading,setLoading]=useState(true);
  const id=scheme?.backendId || "S001";
  useEffect(()=>{let active=true; setLoading(true); api.getScheme(id).then(data=>{if(active)setDetail(localizedScheme(data,lang))}).catch(()=>{}).finally(()=>{if(active)setLoading(false)}); return()=>{active=false}},[id,lang]);
  const data=detail || {};
  const cardScheme=localizedStaticScheme(scheme||schemes[0],lang);
  const docs=data.documents||[];
  const steps=data.application_steps||[];
  const rules=data.eligibility||[];
  return <section className="container page">
    <button className="back-btn" onClick={()=>go("schemes")}><ArrowLeft size={16}/> {t.back}</button>
    <div className="detail-card">
      <div className="detail-image"><img src={cardScheme.image} alt={cardScheme.name}/></div>
      <div className="detail-main">
        <span className="pill">{cardScheme.category}</span><h1>{data.scheme_name||cardScheme.name}</h1>
        <p>{data.description||cardScheme.desc}</p>
        <h3>{t.benefits}</h3>
        <ul className="checks">
          <li><CheckCircle2/> {data.benefits||cardScheme.desc}</li>
          <li><CheckCircle2/> {t.officialLinkAvailable}</li>
          <li><CheckCircle2/> {t.preliminaryEligibility}</li>
        </ul>
        <button className="primary" onClick={()=>go("eligibility")}>{t.check}<ArrowRight size={17}/></button>
      </div>
    </div>
    <div className="content-card detail-sections">
      <div><h2>{t.eligibilityDetails}</h2>{loading?<p>{t.preliminary}</p>:rules.map(r=><div className="detail-rule" key={r.rule_id}><b>{t.farmerTypeRule}</b> {r.farmer_type||t.asApplicable}<br/><b>{t.otherConditions}</b> {r.other_conditions}</div>)}</div>
      <div><h2>{t.requiredDocuments}</h2>{docs.length?<ul className="detail-list">{docs.map(d=><li key={d.document_id}><CheckCircle2/> {d.document_name}{d.mandatory?<span className="required-badge">{t.required}</span>:<span className="optional-badge">{t.optional}</span>}</li>)}</ul>:<p>{t.requiredDocuments}.</p>}</div>
      <div><h2>{t.howToApply}</h2>{steps.length?<div className="mini-steps">{steps.map(step=><div key={step.step_order}><span>{step.step_order}</span><div><b>{step.title}</b><p>{step.description}</p></div></div>)}</div>:<p>{t.howToApply}.</p>}</div>
      <div className="official-link-card"><div><h2>{t.officialWebsite}</h2><p>{t.officialLinkNote}</p></div>{data.application_link&&<a className="primary" href={data.application_link} target="_blank" rel="noreferrer">{t.officialWebsite} <ArrowRight size={17}/></a>}</div>
    </div>
  </section>
}

function Voice({t,user,token,siteLang}){
  const languageMap = { English:{key:"english",speech:"en-IN"}, "मराठी":{key:"marathi",speech:"mr-IN"}, "हिंदी":{key:"hindi",speech:"hi-IN"}, "कन्नड":{key:"kannada",speech:"kn-IN"} };
  const [language,setLanguage]=useState(siteLang);
  useEffect(()=>setLanguage(siteLang),[siteLang]);
  const [input,setInput]=useState("");
  const [messages,setMessages]=useState([]);
  const [listening,setListening]=useState(false);
  const [processing,setProcessing]=useState(false);
  const [error,setError]=useState("");
  const [anonymousSession]=useState(()=>localStorage.getItem("agrivoiceVoiceSession") || ((window.crypto?.randomUUID?.()) || `voice-${Date.now()}`));
  const sessionId=user?.user_id ? `user-${user.user_id}` : anonymousSession;
  useEffect(()=>localStorage.setItem("agrivoiceVoiceSession",anonymousSession),[anonymousSession]);

  const speak=(text)=>{if(!text||!("speechSynthesis" in window))return; window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang=languageMap[language].speech; window.speechSynthesis.speak(u)};
  const submitText=async(text=input)=>{
    const clean=text.trim(); if(!clean||processing)return; setError(""); setProcessing(true); setMessages(prev=>[...prev,{role:"user",text:clean}]); setInput("");
    try{const result=await api.processVoice(clean,languageMap[language].key,sessionId,user,token); setMessages(prev=>[...prev,{role:"assistant",text:result.message||t.assistantFallback,done:result.done,collected:result.collected,result}]); speak(result.message)}catch(err){setError(err.message||t.backendError)}finally{setProcessing(false)}
  };
  const startListening=()=>{
    setError(""); const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!Recognition){setError(t.speechUnsupported);return}
    const recognition=new Recognition(); recognition.lang=languageMap[language].speech; recognition.interimResults=false; recognition.maxAlternatives=1;
    recognition.onstart=()=>setListening(true); recognition.onend=()=>setListening(false); recognition.onerror=e=>{setListening(false);setError(`${t.microphoneError}: ${e.error||"speech recognition failed"}`)}; recognition.onresult=e=>{const transcript=e.results[0][0].transcript;setInput(transcript);submitText(transcript)}; recognition.start();
  };
  const resetConversation=async()=>{try{await api.resetVoice(sessionId,token)}catch{} setMessages([]);setInput("");setError("");if("speechSynthesis" in window)window.speechSynthesis.cancel()};
  const changeLanguage=async value=>{setLanguage(value);setError("");try{await api.setVoiceLanguage(languageMap[value].key)}catch(err){setError(err.message)}};

  return <section className="container page"><div className="voice-page">
    <div className="voice-copy"><span className="eyebrow green">{t.smartVoiceSupport}</span><h1>{t.voiceTitle}</h1><p>{t.voiceIntro}</p>
      <div className="language-note"><Globe2/> {t.availableLanguages}</div>
      <div className="voice-language-control"><label>{t.voiceLanguage}</label><select value={language} onChange={e=>changeLanguage(e.target.value)}>{Object.keys(languageMap).map(name=><option key={name}>{name}</option>)}</select></div>
      <div className="voice-examples"><b>{t.askAnything}</b><button onClick={()=>submitText("Can I get PM Kisan? I own agricultural land")}>Can I get PM Kisan?</button><button onClick={()=>submitText("My sugarcane crop was damaged by heavy rain")}>My sugarcane crop was damaged</button><button onClick={()=>submitText("What documents are required for PMFBY?")}>What documents are required?</button><button onClick={()=>submitText("How do I apply for Kisan Credit Card?")}>How do I apply?</button><button onClick={()=>submitText("What schemes are available for farmers?")}>What schemes are available?</button><button onClick={()=>submitText("I need weather information")}>I need weather information</button></div>
    </div>
    <div className="voice-panel"><div className={`voice-rings ${listening?"is-listening":""}`}><div className="voice-orb"><Mic size={42}/></div></div><h2>{listening?t.listening:processing?t.processing:t.tap}</h2><p>{t.speakNaturally}</p><button className="primary" onClick={startListening} disabled={listening||processing}><Mic size={17}/> {listening?t.listening:t.startListening}</button>
      <div className="voice-input-row"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")submitText()}} placeholder={t.typeQuestion}/><button className="outline" onClick={()=>submitText()} disabled={processing||!input.trim()}>{t.send}</button></div><button className="voice-reset" onClick={resetConversation}>{t.resetConversation}</button>{error&&<div className="voice-error">{error}</div>}
      {messages.length>0&&<div className="voice-messages">{messages.map((m,i)=><div key={i} className={`voice-message ${m.role}`}><span>{m.role==="user"?"You":"AgriVoice"}</span><p>{m.text}</p>{m.role==="assistant"&&<><button className="voice-speak" onClick={()=>speak(m.text)}><Volume2 size={14}/> Speak</button><VoiceResult result={m.result} t={t}/></>}</div>)}</div>}
    </div>
  </div></section>
}

function VoiceResult({result,t}){
  if(!result)return null;
  const elig=(result.eligibility?.eligible_schemes||[]); const recs=result.recommendations||[]; const list=elig.length?elig:recs;
  return <div className="voice-result">{result.eligibility&&<div className="result-notice">{t.preliminary}</div>}{list.length>0&&<div className="result-cards">{list.map(item=><div className="result-card" key={item.scheme_id}><div><span className="pill">{item.category}</span><h4>{item.scheme}</h4><p>{item.benefits||t.relevantSupport}</p>{item.reasons?.length>0&&<small>{t.whySuggested}: {item.reasons.join(", ")}</small>}</div><a className="outline" href={item.application_link} target="_blank" rel="noreferrer">{t.officialWebsite} <ArrowRight size={14}/></a></div>)}</div>}{result.scheme&&<div className="result-scheme"><h4>{result.scheme.scheme_name}</h4><p>{result.scheme.benefits}</p><div className="result-links">{result.scheme.documents?.map(d=><span key={d.document_id}>✓ {d.document_name}</span>)}</div><a className="primary" href={result.scheme.application_link} target="_blank" rel="noreferrer">{t.applyOfficial} <ArrowRight size={15}/></a></div>}</div>
}

function Eligibility({t,token,user,selectedScheme,lang}){
  const [form,setForm]=useState({country:user?.country||"India",land_owner:"",cultivates_land:"",pm_kisan_exclusion:"",farmer_type:user?.farmerType||"",income_tax_payer:"",crop:"",crop_damage:"",state:user?.state||"",district:user?.district||"",taluka:user?.taluka||"",village:user?.village||""});
  const [result,setResult]=useState(null); const [loading,setLoading]=useState(false); const [error,setError]=useState(""); const update=(k,v)=>setForm(f=>({...f,[k]:v}));
  const submit=async()=>{setError("");setLoading(true);try{const profile={...form,land_owner:form.land_owner===""?null:form.land_owner==="true",cultivates_land:form.cultivates_land===""?null:form.cultivates_land==="true",pm_kisan_exclusion:form.pm_kisan_exclusion===""?null:form.pm_kisan_exclusion==="true",income_tax_payer:form.income_tax_payer===""?null:form.income_tax_payer==="true",crop_damage:form.crop_damage===""?null:form.crop_damage==="true",farmer_type:form.farmer_type};const data=await api.checkEligibility(profile);setResult(data)}catch(err){setError(err.message)}finally{setLoading(false)}};
  const sorted=result?.results ? [...result.results].sort((a,b)=>(a.scheme_id===selectedScheme?.backendId?-1:0)-(b.scheme_id===selectedScheme?.backendId?-1:0)) : [];
  return <section className="container page"><div className="page-banner" style={{backgroundImage:`url(${images.field})`}}><div><span className="eyebrow">{t.checkAll}</span><h1>{t.checkAll}</h1><p>{t.preliminary}</p></div></div>
    <div className="eligibility-layout"><div className="content-card form-card"><h2>{t.farmerInfo}</h2><label>{t.country}<select value={form.country} onChange={e=>{update("country",e.target.value);update("state","");update("district","")}}><option value="">{t.selectCountry}</option><option>India</option></select></label><label>{t.state}<select value={form.state} disabled={form.country!=="India"} onChange={e=>{update("state",e.target.value);update("district","")}}><option value="">{t.selectState}</option>{INDIA_STATES.map(x=><option key={x}>{x}</option>)}</select></label><label>{t.district}<select value={form.district} disabled={!form.state} onChange={e=>update("district",e.target.value)}><option value="">{t.selectDistrict}</option>{(INDIA_DISTRICTS[form.state]||[]).map(x=><option key={x}>{x}</option>)}</select></label><label>{t.landQuestion}<select value={form.land_owner} onChange={e=>update("land_owner",e.target.value)}><option value="">{t.select}</option><option value="true">{t.yes}</option><option value="false">{t.no}</option></select></label><label>Do you currently cultivate agricultural land?<select value={form.cultivates_land} onChange={e=>update("cultivates_land",e.target.value)}><option value="">{t.select}</option><option value="true">{t.yes}</option><option value="false">{t.no}</option></select></label><label>{t.farmerType}<select value={form.farmer_type} onChange={e=>update("farmer_type",e.target.value)}><option value="">{t.selectFarmerType}</option>{FARMER_TYPES.map(x=><option key={x} value={x}>{localizedFarmerType(t,x)}</option>)}</select></label><label>{t.taxQuestion}<select value={form.income_tax_payer} onChange={e=>update("income_tax_payer",e.target.value)}><option value="">{t.select}</option><option value="true">{t.yes}</option><option value="false">{t.no}</option></select></label><label>Does any other PM-KISAN exclusion apply (institutional landholding, constitutional post, minister/legislator/mayor, specified government service, pension of ₹10,000+/month, or registered professional)?<select value={form.pm_kisan_exclusion} onChange={e=>update("pm_kisan_exclusion",e.target.value)}><option value="">{t.select}</option><option value="true">{t.yes}</option><option value="false">{t.no}</option></select></label><label>{t.cropOptional}<input value={form.crop} maxLength={40} onChange={e=>update("crop",e.target.value.replace(/[^A-Za-z ]/g,""))} placeholder={t.cropExample || "e.g. sugarcane"}/></label><label>{t.cropDamageQuestion}<select value={form.crop_damage} onChange={e=>update("crop_damage",e.target.value)}><option value="">{t.notSure}</option><option value="true">{t.yes}</option><option value="false">{t.no}</option></select></label>{error&&<div className="auth-error">{error}</div>}<button className="primary full" onClick={submit} disabled={loading}>{loading?"Checking...":t.checkAll}</button></div><div className="eligibility-visual"><img src={images.farmer} alt="Farmer checking information"/><div className="result"><CheckCircle2/><h2>{t.oneCheck}</h2><p>{t.compareAll}</p></div></div></div>
    {result&&<div className="content-card eligibility-results"><div className="result-header"><div><span className="eyebrow green">{t.result}</span><h2>{t.allSchemes}</h2></div><p>{result.notice || t.preliminary}</p></div>{result.missing_information?.length>0&&<div className="auth-error">Please complete these fields before checking: {result.missing_information.join(", ").replaceAll("_"," ")}.</div>}{sorted.length===0&&(!result.missing_information||result.missing_information.length===0)&&<div className="empty-state"><h3>No matching schemes found from the answers provided.</h3><p>Try checking your answers, or contact the relevant agriculture department for scheme-specific guidance. Schemes that do not match your answers are not displayed as eligible.</p></div>}{sorted.map(item=>{const display=localizeResultItem(item,lang); return <div className={`eligibility-result ${item.status.includes("Potentially")?"potential":"not-match"}`} key={item.scheme_id}><div className="eligibility-result-head"><div><span className="pill">{item.category}</span><h3>{display.scheme}</h3></div><strong>{item.status}</strong></div><p>{display.benefits}</p>{item.reasons?.length>0&&<p><b>{t.why}:</b> {item.reasons.join(" ")}</p>}{item.warnings?.length>0&&<p><b>{t.important}:</b> {item.warnings.join(" ")}</p>}<div className="result-actions"><a className="primary" href={item.application_link} target="_blank" rel="noreferrer">{t.officialWebsite} <ArrowRight size={15}/></a><SchemeMiniDetails schemeId={item.scheme_id} lang={lang} t={t}/></div></div>})}</div>}
  </section>
}

function SchemeMiniDetails({schemeId,lang,t}){
  const [data,setData]=useState(null); useEffect(()=>{api.getScheme(schemeId).then(d=>setData(localizedScheme(d,lang))).catch(()=>{})},[schemeId,lang]);
  if(!data)return <span className="loading-inline">{t.loading}</span>;
  return <details className="scheme-mini-details"><summary>{t.eligibilityDetails}, {t.requiredDocuments} & {t.howToApply}</summary><div><h4>{t.eligibilityDetails}</h4><p>{data.eligibility?.[0]?.other_conditions||t.seeOfficialRules}</p><h4>{t.requiredDocuments}</h4><ul>{data.documents?.map(d=><li key={d.document_id}><b>{d.document_name}</b> — {d.mandatory?t.required:t.mayBeRequired}{d.description&&<small className="doc-explanation">{d.description}</small>}</li>)}</ul><h4>{t.howToApply}</h4><ol>{data.application_steps?.map(s=><li key={s.step_order}><b>{s.title}</b>{s.description?`: ${s.description}`:""}</li>)}</ol><a className="primary" href={data.application_link} target="_blank" rel="noreferrer">{t.officialWebsite} <ArrowRight size={15}/></a></div></details>
}

function Documents({t}){const docs=t.docLabels||["Aadhaar Card","Land Record / 7/12 or equivalent","Bank Passbook / Account Details","Passport Size Photo"];const desc=t.docDescriptions||["Identity proof","Proof of land ownership","For DBT","Recent photo"];return <section className="container page"><div className="split-title"><div><span className="eyebrow green">{t.appReady}</span><h1>{t.documentsTitle}</h1><p>{t.documentsText}</p></div></div><div className="document-layout"><div className="content-card">{docs.map((d,i)=><div className="doc-row" key={d}><span className="doc-icon"><FileText/></span><div><b>{d}</b><small>{desc[i]}</small></div><span className={`status ${i<3?"ok":"missing"}`}>{i<3?t.available:t.docUnuploaded}</span></div>)}<button className="primary full"><Upload size={17}/> {t.upload}</button></div><aside className="help-card"><HelpCircle size={35}/><h3>{t.needHelp}</h3><p>{t.supportTeam}</p><button className="outline">{t.contactSupport}</button></aside></div></section>}

function Guidance({t}){const steps=t.steps;const desc=t.stepDesc;return <section className="container page"><div className="guidance-head"><div><span className="eyebrow green">{t.simpleProcess}</span><h1>{t.guidanceTitle}</h1><p>{t.guidanceText}</p></div></div><div className="steps">{steps.map((s,i)=><div className="step" key={s}><span>{i+1}</span><div><h3>{s}</h3><p>{desc[i]}</p></div></div>)}</div></section>}

function Profile({t,user,setUser,token}){
  const [editing,setEditing]=useState(false); const [draft,setDraft]=useState(user); const [error,setError]=useState(""); const [saving,setSaving]=useState(false);
  useEffect(()=>setDraft({...user,country:user.country||"India"}),[user]);
  const update=(k,v)=>setDraft(d=>({...d,[k]:v}));
  const save=async()=>{setError("");setSaving(true);try{const data=await api.updateProfile(token,draft);setUser(data.user);localStorage.setItem("agrivoiceUser",JSON.stringify(data.user));setEditing(false)}catch(err){setError(err.message)}finally{setSaving(false)}};
  return <section className="container page"><div className="profile-head"><div><span className="eyebrow green">{t.farmerAccount}</span><h1>{t.profileTitle}</h1></div><button className="outline" onClick={()=>setEditing(!editing)}>{t.edit}</button></div>
    <div className="profile-grid"><div className="content-card profile-card"><div className="profile-avatar"><CircleUserRound size={62}/></div><div className="profile-details">{editing?<><label>{t.name}<input value={draft.name||""} onChange={e=>update("name",e.target.value.replace(/[^\p{L} ]/gu,"").replace(/\s+/g," ").slice(0,80))}/></label><label>{t.mobile}<input value={draft.mobile||""} maxLength={10} onChange={e=>update("mobile",e.target.value.replace(/\D/g,"").slice(0,10))}/></label><label>{t.email}<input value={draft.email||""} onChange={e=>update("email",e.target.value)}/></label><div className="field"><label>{t.farmerType}</label><select value={draft.farmerType||""} onChange={e=>update("farmerType",e.target.value)}>{FARMER_TYPES.map(x=><option key={x} value={x}>{localizedFarmerType(t,x)}</option>)}</select></div><div className="address-form-grid"><LocationFields t={t} form={draft} update={update}/></div>{error&&<div className="auth-error">{error}</div>}<button className="primary" onClick={save} disabled={saving}>{saving?t.saving:t.saveChanges}</button></>:<><h2>{user.name||t.defaultFarmer}</h2><p><b>{t.mobile}:</b> {user.mobile||"—"}</p><p><b>{t.email}:</b> {user.email||"—"}</p><p><b>{t.farmerType}:</b> {localizedFarmerType(t,user.farmerType||"")||"—"}</p></>}</div></div>
    <div className="content-card"><h2>{t.addressDetails}</h2><div className="address-grid"><p><small>{t.country}</small>{user.country||"India"}</p><p><small>{t.state}</small>{user.state||"—"}</p><p><small>{t.district}</small>{user.district||"—"}</p><p><small>{t.taluka}</small>{user.taluka||"—"}</p><p><small>{t.village}</small>{user.village||"—"}</p></div><p className="profile-note">{t.storedAddress}</p></div></div>
  </section>
}

function Auth({t,mode,go,onAuth}){
  const login=mode==="login"; const [show,setShow]=useState(false); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  const [form,setForm]=useState({name:"",mobile:"",email:"",password:"",farmerType:"",country:"",state:"",district:"",taluka:"",village:""});
  const update=(key,value)=>setForm(f=>({...f,[key]:value}));
  const emailOk=v=>/^(?!.*\.\.)[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/.test(v.trim());
  const validate=()=>{
    if(login){ if(!form.email.trim()) return t.loginIdentifier; }
    else {
      if(!/^[\p{L}][\p{L} ]{1,79}$/u.test(form.name.trim()))return t.invalidName;
      if(!/^\d{10}$/.test(form.mobile))return t.invalidMobile;
      if(!emailOk(form.email))return t.invalidEmail;
      if(!FARMER_TYPES.includes(form.farmerType))return t.invalidFarmerType;
      if(form.country!=="India")return t.invalidCountry;
      if(!form.state||!form.district||!form.taluka.trim()||!form.village.trim())return t.incompleteAddress;
      if(!/^[\p{L}][\p{L} ]{1,19}$/u.test(form.village.trim()))return t.invalidVillage;
    }
    if(form.password.length<8||!/[A-Z]/.test(form.password)||!/[a-z]/.test(form.password)||!/[0-9]/.test(form.password)||!/[^A-Za-z0-9]/.test(form.password))return t.invalidPassword;
    return "";
  };
  const submit=async()=>{setError("");const validation=validate();if(validation){setError(validation);return}setLoading(true);try{const data=login?await api.login(form.email,form.password):await api.register(form);onAuth(data)}catch(err){setError(err.status===401?t.noAccountFound:err.message)}finally{setLoading(false)}};
  return <section className="auth-page"><div className="auth-visual"><img src={images.farm} alt="Indian agriculture"/><div><span className="brand-light"><Leaf/> AgriVoice</span><h1>{login?t.authLoginHero:t.authRegisterHero}</h1><p>{t.authHeroText}</p></div></div><div className="auth-form-wrap"><button className="back-btn" onClick={()=>go("home")}><ArrowLeft/> {t.back}</button><div className="auth-form"><div className="auth-tabs"><button className={login?"active":""} onClick={()=>go("login")}>{t.login}</button><button className={!login?"active":""} onClick={()=>go("register")}>{t.register}</button></div><div className="auth-heading"><span className="brand-small"><Leaf/> AgriVoice</span><h1>{login?t.loginTitle:t.registerTitle}</h1><p>{login?t.loginText:t.createAccountText}</p></div>
    {!login&&<Field icon={<UserRound/>} label={t.name} placeholder={t.enterName} value={form.name} onChange={v=>update("name",v.replace(/[^\p{L} ]/gu,"").replace(/\s+/g," ").slice(0,80))}/>} 
    <Field icon={<Mail/>} label={login?t.email+" / "+t.mobile:t.email} placeholder={login?t.registeredEmailMobile:t.enterEmail} value={form.email} onChange={v=>update("email",v)}/>
    {!login&&<Field icon={<Phone/>} label={t.mobile} placeholder={t.enterMobile} value={form.mobile} onChange={v=>update("mobile",v.replace(/\D/g,"").slice(0,10))}/>} 
    <div className="field"><label>{t.password}</label><div className="input-icon"><Lock/><input value={form.password} onChange={e=>update("password",e.target.value)} type={show?"text":"password"} placeholder={t.passwordPlaceholder}/><button type="button" onClick={()=>setShow(!show)}>{show?<EyeOff/>:<Eye/>}</button></div><small className="password-hint">{t.passwordPolicy}</small></div>
    {!login&&<div className="field"><label>{t.farmerType}</label><div className="input-icon"><Tractor/><select value={form.farmerType} onChange={e=>update("farmerType",e.target.value)}><option value="">{t.selectFarmerType}</option>{FARMER_TYPES.map(x=><option key={x} value={x}>{localizedFarmerType(t,x)}</option>)}</select></div></div>}
    {!login&&<div className="address-auth"><h3>{t.addressDetails}</h3><div className="address-form-grid"><LocationFields t={t} form={form} update={update}/></div></div>}
    {login&&<div className="auth-options"><label><input type="checkbox"/> {t.rememberMe}</label><button type="button">{t.forgot}</button></div>}{error&&<div className="auth-error">{error}</div>}{!login&&<small className="password-hint">{t.emailHint}</small>}<button className="primary full auth-submit" onClick={submit} disabled={loading}>{login?<><LogIn/> {loading?t.loggingIn:t.loginBtn}</>:<><UserPlus/> {loading?t.creating:t.registerBtn}</>}</button><p className="switch-auth">{login?t.noAccount:t.haveAccount} <button onClick={()=>go(login?"register":"login")}>{login?t.register:t.login}</button></p></div></div></section>
}

function Field({icon,label,placeholder,value,onChange}){return <div className="field"><label>{label}</label><div className="input-icon">{icon}<input value={value||""} onChange={e=>onChange?.(e.target.value)} placeholder={placeholder}/></div></div>}

function SettingsPage({t,lang,setLang}){return <section className="container page"><div className="content-card settings-card"><span className="eyebrow green">{t.accountSettings}</span><h1>{t.settings}</h1><label>{t.languagePreference}<select value={lang} onChange={e=>setLang(e.target.value)}><option value="English">English</option><option value="मराठी">मराठी</option><option value="हिंदी">हिंदी</option><option value="कन्नड">ಕನ್ನಡ</option></select></label><div className="setting-row"><span><b>{t.schemeUpdates}</b><small>{t.schemeUpdatesText}</small></span><input type="checkbox" defaultChecked/></div><div className="setting-row"><span><b>{t.applicationStatus}</b><small>{t.applicationStatusText}</small></span><input type="checkbox" defaultChecked/></div></div></section>}

function Footer({t}){return <footer><div className="container footer-inner"><div className="brand"><span className="brand-mark"><Leaf size={20}/></span>AgriVoice</div><div>{t.smartFarming} <span>|</span> {t.betterTomorrow}</div><div className="footer-note">{t.builtWith}</div></div></footer>}

createRoot(document.getElementById("root")).render(<App />);
