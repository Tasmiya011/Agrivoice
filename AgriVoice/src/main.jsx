import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight, ArrowLeft, CheckCircle2, ChevronDown, FileText, Globe2,
  Home as HomeIcon, Leaf, Menu, Mic, Search, ShieldCheck, Sprout, UserRound,
  X, Upload, Volume2, LogIn, UserPlus, MapPin, Phone, Mail, Lock, Eye,
  EyeOff, HelpCircle, Settings, LogOut, Landmark, Tractor, CircleUserRound,
} from "lucide-react";
import "./styles.css";
import { api } from "./api";

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
  {id:1,name:"PM Kisan Samman Nidhi", category:"Financial Support", desc:"Financial support of ₹6,000 per year to eligible farmers.", image:images.farmer},
  {id:2,name:"Pradhan Mantri Fasal Bima Yojana", category:"Insurance", desc:"Crop insurance protection for farmers against natural calamities.", image:images.field},
  {id:3,name:"Kisan Credit Card (KCC)", category:"Credit", desc:"Short-term credit support for agricultural needs.", image:images.crop},
  {id:4,name:"Soil Health Card Scheme", category:"Other", desc:"Free soil testing and recommendations.", image:images.plant}
];

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
    simpleProcess:"SIMPLE PROCESS", voiceSupport:"SMART VOICE SUPPORT", appReady:"APPLICATION READY"
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
    simpleProcess:"सोपे प्रक्रिया", voiceSupport:"स्मार्ट व्हॉइस सपोर्ट", appReady:"अर्ज तयार", 
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
    simpleProcess:"सरल प्रक्रिया", voiceSupport:"स्मार्ट वॉइस सपोर्ट", appReady:"आवेदन तैयार"
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
    simpleProcess:"ಸರಳ ಪ್ರಕ್ರಿಯೆ", voiceSupport:"ಸ್ಮಾರ್ಟ್ ವಾಯ್ಸ್ ಸಪೋರ್ಟ್", appReady:"ಅರ್ಜಿ ಸಿದ್ಧ"
  }
};

function App(){
  // Authentication is kept in React state for this frontend demo.
  const [page,setPage] = useState("home");
  const [lang,setLang] = useState("English");
  const [selectedScheme,setSelectedScheme] = useState(schemes[0]);
  const [mobileMenu,setMobileMenu] = useState(false);
  const [isLoggedIn,setIsLoggedIn] = useState(()=>localStorage.getItem("agrivoiceLoggedIn")==="true");
  const [user,setUser] = useState(()=>{try{return JSON.parse(localStorage.getItem("agrivoiceUser"))||{name:"",mobile:"",email:"",farmerType:""}}catch{return {name:"",mobile:"",email:"",farmerType:""}}});
  const t = translations[lang];

  const go = (next) => { setPage(next); setMobileMenu(false); window.scrollTo({top:0,behavior:"smooth"}); };

  const handleAuth = (profile) => {
    setUser(profile);
    setIsLoggedIn(true);
    localStorage.setItem("agrivoiceUser", JSON.stringify(profile));
    localStorage.setItem("agrivoiceLoggedIn", "true");
    go("home");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("agrivoiceLoggedIn");
    go("home");
  };

  return <div className="app">
    <Navbar t={t} lang={lang} setLang={setLang} go={go} mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout}/>
    <main>
      {page==="home" && <Home t={t} go={go} setSelectedScheme={setSelectedScheme}/>} 
      {page==="schemes" && <Schemes t={t} go={go} setSelectedScheme={setSelectedScheme}/>} 
      {page==="detail" && <SchemeDetail t={t} go={go} scheme={selectedScheme}/>} 
      {page==="voice" && <Voice t={t}/>} 
      {page==="documents" && <Documents t={t}/>} 
      {page==="guidance" && <Guidance t={t}/>} 
      {page==="profile" && isLoggedIn && <Profile t={t} user={user} setUser={setUser}/>} 
      {page==="eligibility" && <Eligibility t={t}/>} 
      {page==="login" && <Auth t={t} mode="login" go={go} onAuth={handleAuth} existingUser={user}/>} 
      {page==="register" && <Auth t={t} mode="register" go={go} onAuth={handleAuth}/>} 
      {page==="settings" && <SettingsPage t={t}/>} 
    </main>
    <Footer t={t}/>
  </div>
}

function Navbar({t,lang,setLang,go,mobileMenu,setMobileMenu,isLoggedIn,user,onLogout}){
  const [profileOpen,setProfileOpen] = useState(false);
  return <header className="navbar">
    <div className="nav-inner">
      <button className="brand" onClick={()=>go("home")} aria-label="AgriVoice Home">
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
            <option>English</option><option>मराठी</option><option>हिन्दी</option><option>कन्नड</option>
          </select>
        </div>
        {!isLoggedIn ? <button className="nav-register" onClick={()=>go("register")}><UserPlus size={16}/>{t.register}</button> : <div className="profile-menu-wrap">
          <button className="profile-icon-btn" aria-label="Open profile menu" onClick={()=>setProfileOpen(!profileOpen)}>
            <CircleUserRound size={25}/>
          </button>
          {profileOpen && <div className="profile-dropdown">
            <button onClick={()=>{setProfileOpen(false);go("profile")}}><UserRound size={17}/><span>{t.profile}</span></button>
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
      {!isLoggedIn ? <button onClick={()=>go("register")}>{t.register}</button> : <>
        <button onClick={()=>go("profile")}>{t.profile}</button><button onClick={onLogout}>{t.logout}</button>
      </>}
    </div>}
  </header>
}

function Home({t,go,setSelectedScheme}){
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
      <div className="scheme-grid">{schemes.map(s=><SchemeCard key={s.id} scheme={s} t={t} onClick={()=>{setSelectedScheme(s);go("detail")}}/>)}</div>
    </section>
    <section className="container info-banner">
      <div><Sprout size={36}/><div><h3>{t.supportTitle}</h3><p>{t.supportText}</p></div></div>
      <button className="primary" onClick={()=>go("register")}><UserPlus size={17}/> {t.register}</button>
    </section>
  </div>
}

function Feature({icon,title,text,go}){return <button className="feature-card" onClick={go}><span className="feature-icon">{icon}</span><span><b>{title}</b><small>{text}</small></span><ArrowRight size={16}/></button>}

function SchemeCard({scheme,t,onClick}){return <article className="scheme-card"><img src={scheme.image} alt={scheme.name}/><div className="scheme-body"><span className="pill">{scheme.category}</span><h3>{scheme.name}</h3><p>{scheme.desc}</p><button className="text-btn" onClick={onClick}>{t.details} <ArrowRight size={15}/></button></div></article>}

function Schemes({t,go,setSelectedScheme}){
  const [q,setQ]=useState("");
  const filtered=useMemo(()=>schemes.filter(s=>s.name.toLowerCase().includes(q.toLowerCase())||s.category.toLowerCase().includes(q.toLowerCase())),[q]);
  return <section className="container page">
    <div className="page-banner" style={{backgroundImage:`url(${images.field})`}}><div><span className="eyebrow">AGRI SUPPORT</span><h1>{t.schemeTitle}</h1><p>{t.schemeText}</p></div></div>
    <div className="search-row"><div className="search-box"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder={t.search}/></div><button className="outline" onClick={()=>go("eligibility")}>{t.check}</button></div>
    <div className="scheme-grid large">{filtered.map(s=><SchemeCard key={s.id} scheme={s} t={t} onClick={()=>{setSelectedScheme(s);go("detail")}}/>)}</div>
  </section>
}

function SchemeDetail({t,go,scheme}){return <section className="container page"><button className="back-btn" onClick={()=>go("schemes")}><ArrowLeft size={16}/> {t.back}</button><div className="detail-card"><div className="detail-image"><img src={scheme.image} alt={scheme.name}/></div><div className="detail-main"><span className="pill">{scheme.category}</span><h1>{scheme.name}</h1><p>{scheme.desc}</p><h3>{t.benefits}</h3><ul className="checks"><li><CheckCircle2/> ₹6,000 per year for eligible farmers</li><li><CheckCircle2/> Direct Benefit Transfer (DBT)</li><li><CheckCircle2/> Simple online/offline application support</li></ul><button className="primary" onClick={()=>go("eligibility")}>{t.check}<ArrowRight size={17}/></button></div></div><div className="content-card"><h2>Scheme Overview</h2><p>This section is designed to be connected to your backend API later. It can show official scheme eligibility, benefits, required documents, application link and status.</p></div></section>}

function Voice({t}){
  const languageMap = {
    English: { key: "english", speech: "en-IN" },
    "मराठी": { key: "marathi", speech: "mr-IN" },
    "हिन्दी": { key: "hindi", speech: "hi-IN" },
    "कन्नड": { key: "kannada", speech: "kn-IN" },
  };
  const [language, setLanguage] = useState("English");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const speak = (text) => {
    if (!text || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageMap[language].speech;
    window.speechSynthesis.speak(utterance);
  };

  const submitText = async (text = input) => {
    const clean = text.trim();
    if (!clean || processing) return;
    setError("");
    setProcessing(true);
    setMessages(prev => [...prev, { role: "user", text: clean }]);
    setInput("");
    try {
      const result = await api.processVoice(clean, languageMap[language].key);
      setMessages(prev => [...prev, {
        role: "assistant",
        text: result.message || "I could not generate a response.",
        done: result.done,
        collected: result.collected,
      }]);
      speak(result.message);
    } catch (err) {
      setError(err.message || "Could not connect to the AgriVoice backend.");
    } finally {
      setProcessing(false);
    }
  };

  const startListening = () => {
    setError("");
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setError("Speech recognition is not supported in this browser. Please use Google Chrome or type your message below.");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = languageMap[language].speech;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (event) => {
      setListening(false);
      setError(`Microphone error: ${event.error || "speech recognition failed"}`);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      submitText(transcript);
    };
    recognition.start();
  };

  const resetConversation = async () => {
    try { await api.resetVoice(); } catch { /* local UI can still reset */ }
    setMessages([]);
    setInput("");
    setError("");
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  };

  const changeLanguage = async (value) => {
    setLanguage(value);
    setError("");
    try { await api.setVoiceLanguage(languageMap[value].key); } catch (err) { setError(err.message); }
  };

  return <section className="container page">
    <div className="voice-page">
      <div className="voice-copy">
        <span className="eyebrow green">SMART VOICE SUPPORT</span>
        <h1>{t.voiceTitle}</h1>
        <p>{t.voiceText}</p>
        <div className="language-note"><Globe2/> Available in English, Marathi, Hindi and Kannada</div>
        <div className="voice-language-control">
          <label>Voice language</label>
          <select value={language} onChange={e=>changeLanguage(e.target.value)}>
            {Object.keys(languageMap).map(name => <option key={name}>{name}</option>)}
          </select>
        </div>
        <div className="voice-examples">
          <b>Try asking:</b>
          <button onClick={()=>submitText("My crop is damaged")}>My crop is damaged</button>
          <button onClick={()=>submitText("What schemes are available for farmers?")}>What schemes are available?</button>
          <button onClick={()=>submitText("I need weather information")}>I need weather information</button>
        </div>
      </div>
      <div className="voice-panel">
        <div className={`voice-rings ${listening ? "is-listening" : ""}`}>
          <div className="voice-orb"><Mic size={42}/></div>
        </div>
        <h2>{listening ? "Listening..." : processing ? "Processing..." : t.tap}</h2>
        <p>Speak naturally, or type your question below.</p>
        <button className="primary" onClick={startListening} disabled={listening || processing}>
          <Mic size={17}/> {listening ? "Listening..." : "Start Listening"}
        </button>
        <div className="voice-input-row">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")submitText()}} placeholder="Type your question..." />
          <button className="outline" onClick={()=>submitText()} disabled={processing || !input.trim()}>Send</button>
        </div>
        <button className="voice-reset" onClick={resetConversation}>Reset Conversation</button>
        {error && <div className="voice-error">{error}</div>}
        {messages.length > 0 && <div className="voice-messages">
          {messages.map((m,i)=><div key={i} className={`voice-message ${m.role}`}>
            <span>{m.role === "user" ? "You" : "AgriVoice"}</span>
            <p>{m.text}</p>
            {m.role === "assistant" && <button className="voice-speak" onClick={()=>speak(m.text)}><Volume2 size={14}/> Speak</button>}
          </div>)}
        </div>}
      </div>
    </div>
  </section>
}

function Documents({t}){const docs=["Aadhaar Card","Land Record / 7/12 or equivalent","Bank Passbook / Account Details","Passport Size Photo"];return <section className="container page"><div className="split-title"><div><span className="eyebrow green">APPLICATION READY</span><h1>{t.documentsTitle}</h1><p>{t.documentsText}</p></div></div><div className="document-layout"><div className="content-card">{docs.map((d,i)=><div className="doc-row" key={d}><span className="doc-icon"><FileText/></span><div><b>{d}</b><small>{i===0?"Identity proof":i===1?"Proof of land ownership":i===2?"For DBT":"Recent photo"}</small></div><span className={`status ${i<3?"ok":"missing"}`}>{i<3?t.available:"Not Uploaded"}</span></div>)}<button className="primary full"><Upload size={17}/> {t.upload}</button></div><aside className="help-card"><HelpCircle size={35}/><h3>{t.needHelp}</h3><p>Our support team can guide you through each document.</p><button className="outline">Contact Support</button></aside></div></section>}

function Guidance({t}){const steps=["Check Eligibility","Collect Documents","Apply Online / Offline","Track Application"];return <section className="container page"><div className="guidance-head"><div><span className="eyebrow green">SIMPLE PROCESS</span><h1>{t.guidanceTitle}</h1><p>{t.guidanceText}</p></div></div><div className="steps">{steps.map((s,i)=><div className="step" key={s}><span>{i+1}</span><div><h3>{s}</h3><p>{["Verify if you meet the scheme criteria.","Keep all required documents ready.","Submit your application through the portal or service centre.","Check status using your reference number."][i]}</p></div></div>)}</div></section>}

function Profile({t,user,setUser}){
  const [editing,setEditing] = useState(false);
  const [draft,setDraft] = useState(user);
  const save = () => { setUser(draft); localStorage.setItem("agrivoiceUser", JSON.stringify(draft)); setEditing(false); };
  return <section className="container page">
    <div className="profile-head"><div><span className="eyebrow green">FARMER ACCOUNT</span><h1>{t.profileTitle}</h1></div><button className="outline" onClick={()=>setEditing(!editing)}>{t.edit}</button></div>
    <div className="profile-grid">
      <div className="content-card profile-card">
        <div className="profile-avatar"><CircleUserRound size={62}/></div>
        <div className="profile-details">
          {editing ? <>
            <label>{t.name}<input value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})}/></label>
            <label>{t.mobile}<input value={draft.mobile} onChange={e=>setDraft({...draft,mobile:e.target.value})}/></label>
            <label>{t.email}<input value={draft.email} onChange={e=>setDraft({...draft,email:e.target.value})}/></label>
            <label>Farmer Type<input value={draft.farmerType} onChange={e=>setDraft({...draft,farmerType:e.target.value})}/></label>
            <button className="primary" onClick={save}>Save Changes</button>
          </> : <>
            <h2>{user.name || "Farmer"}</h2>
            <p><b>{t.mobile}:</b> {user.mobile || "—"}</p>
            <p><b>{t.email}:</b> {user.email || "—"}</p>
            <p><b>Farmer Type:</b> {user.farmerType || "—"}</p>
          </>}
        </div>
      </div>
      <div className="content-card"><h2>Address Details</h2><div className="address-grid"><p><small>Village</small>—</p><p><small>Taluka</small>—</p><p><small>District</small>—</p><p><small>State</small>—</p></div><p className="profile-note">Add your address details here when the profile form is connected to the backend.</p></div>
    </div>
  </section>
}

function Auth({t,mode,go,onAuth,existingUser}){
  const login=mode==="login";
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({name:existingUser?.name||"",mobile:existingUser?.mobile||"",email:existingUser?.email||"",password:"",farmerType:""});
  const update=(key,value)=>setForm({...form,[key]:value});
  const submit=()=>{
    // Demo authentication using browser storage. Replace this with your backend API later.
    if(login){
      const saved=JSON.parse(localStorage.getItem("agrivoiceUser")||"null");
      if(saved){
        onAuth(saved);
      }else{
        // First-time demo login: use the details entered on the login form.
        onAuth({name:"",mobile:form.mobile,email:form.email,farmerType:""});
      }
    }else{
      onAuth({name:form.name,mobile:form.mobile,email:form.email,farmerType:form.farmerType});
    }
  };
  return <section className="auth-page"><div className="auth-visual"><img src={images.farm} alt="Indian agriculture"/><div><span className="brand-light"><Leaf/> AgriVoice</span><h1>{login?"Smart farming support, in your language.":"Join AgriVoice and simplify your farming journey."}</h1><p>Government schemes, voice assistance, eligibility checks and document guidance in one place.</p></div></div><div className="auth-form-wrap"><button className="back-btn" onClick={()=>go("home")}><ArrowLeft/> {t.back}</button><div className="auth-form"><div className="auth-tabs"><button className={login?"active":""} onClick={()=>go("login")}>{t.login}</button><button className={!login?"active":""} onClick={()=>go("register")}>{t.register}</button></div><div className="auth-heading"><span className="brand-small"><Leaf/> AgriVoice</span><h1>{login?t.loginTitle:t.registerTitle}</h1><p>{login?t.loginText:t.registerText}</p></div>{!login&&<Field icon={<UserRound/>} label={t.name} placeholder="Enter your full name" value={form.name} onChange={v=>update("name",v)}/>}<Field icon={<Phone/>} label={t.mobile} placeholder="Enter 10 digit mobile number" value={form.mobile} onChange={v=>update("mobile",v)}/><Field icon={<Mail/>} label={t.email} placeholder="Enter your email address" value={form.email} onChange={v=>update("email",v)}/><div className="field"><label>{t.password}</label><div className="input-icon"><Lock/><input value={form.password} onChange={e=>update("password",e.target.value)} type={show?"text":"password"} placeholder="Enter password"/><button type="button" onClick={()=>setShow(!show)}>{show?<EyeOff/>:<Eye/>}</button></div></div>{!login&&<Field icon={<Tractor/>} label="Farmer Type" placeholder="Small Farmer / Tenant / Landowner" value={form.farmerType} onChange={v=>update("farmerType",v)}/>} {login&&<div className="auth-options"><label><input type="checkbox"/> Remember me</label><button>{t.forgot}</button></div>}<button className="primary full auth-submit" onClick={submit}>{login?<><LogIn/> {t.loginBtn}</>:<><UserPlus/> {t.registerBtn}</>}</button><p className="switch-auth">{login?t.noAccount:t.haveAccount} <button onClick={()=>go(login?"register":"login")}>{login?t.register:t.login}</button></p></div></div></section>
}

function Field({icon,label,placeholder,value,onChange}){return <div className="field"><label>{label}</label><div className="input-icon">{icon}<input value={value||""} onChange={e=>onChange?.(e.target.value)} placeholder={placeholder}/></div></div>}

function SettingsPage({t}){return <section className="container page"><div className="content-card settings-card"><span className="eyebrow green">ACCOUNT SETTINGS</span><h1>{t.settings}</h1><label>Language Preference<select><option>English</option><option>Marathi</option><option>Hindi</option><option>Kannada</option></select></label><div className="setting-row"><span><b>Scheme Updates</b><small>Receive important scheme notifications</small></span><input type="checkbox" defaultChecked/></div><div className="setting-row"><span><b>Application Status</b><small>Get updates about your applications</small></span><input type="checkbox" defaultChecked/></div></div></section>}

function Footer({t}){return <footer><div className="container footer-inner"><div className="brand"><span className="brand-mark"><Leaf size={20}/></span>AgriVoice</div><div>Smart Farming <span>|</span> Better Tomorrow</div><div className="footer-note">Built with React + Vite • Easy to customize</div></div></footer>}

createRoot(document.getElementById("root")).render(<App />);
