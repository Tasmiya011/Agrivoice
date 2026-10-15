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
  {id:1,name:"PM Kisan Samman Nidhi", category:"Financial Support", desc:"₹6,000 annual income support for eligible landholding farmer families.", image:images.farmer},
  {id:2,name:"Pradhan Mantri Fasal Bima Yojana", category:"Insurance", desc:"Insurance for notified crops, areas and seasons under current scheme rules.", image:images.field},
  {id:3,name:"Kisan Credit Card (KCC)", category:"Credit", desc:"Bank credit for cultivation and eligible agricultural or allied needs.", image:images.crop},
  {id:4,name:"Soil Health Card Scheme", category:"Soil & Crop Management", desc:"Soil-test information and nutrient-management recommendations.", image:images.plant}
];

const SCHEME_LEGAL_DETAILS = {
  S001: {
    summary:"PM-KISAN is a Central Sector scheme that provides eligible landholding farmer families with income support of ₹6,000 per year in three equal instalments, transferred by direct benefit transfer. State and Union Territory administrations identify and verify beneficiary families.",
    benefits:["₹6,000 per eligible farmer family per year, paid in three equal instalments.","The scheme defines a farmer family as husband, wife and minor children."],
    eligibility:["The applicant must be part of an eligible landholding farmer family identified under the scheme and verified by the relevant State or UT.","Exclusions include institutional landholders and specified higher-economic-status categories, including income-tax payers from the previous assessment year, certain public office holders and employees, certain pensioners, and registered professionals. The official exclusion list and exceptions apply.","eKYC is mandatory for registered beneficiaries. Use the official portal to check the current beneficiary status and any verification requirements."],
    documents:["Aadhaar/identity and eKYC details as required by the portal.","Landholding records maintained by the State or UT.","Bank account details used for benefit transfer."],
    process:["Use the official portal's New Farmer Registration and beneficiary-status services.","Complete required eKYC and correct record discrepancies through the official process or the relevant State/UT nodal office."],
    note:"This is a summary, not a final eligibility decision. The official PM-KISAN guidelines, State/UT land records, family rules and exclusion checks govern.",
    sources:[{label:"PM-KISAN official portal and scheme information",url:"https://pmkisan.gov.in/"},{label:"PM-KISAN Revised FAQ (official PDF)",url:"https://pmkisan.gov.in/Documents/RevisedFAQ.pdf"}],
    applicationLink:"https://pmkisan.gov.in/"
  },
  S002: {
    summary:"PMFBY provides crop insurance for notified crops grown in notified areas during notified seasons. Insurable interest, covered risks, sum insured, premium and enrolment dates are governed by the applicable State/UT and season notification and the scheme guidelines.",
    benefits:["Protection may cover specified yield losses and other defined contingencies under the current guidelines.","Coverage is crop-, area- and season-specific; claim eligibility depends on the notified risk, required reporting and assessment process."],
    eligibility:["Farmers cultivating a notified crop in a notified area may be eligible if they have an insurable interest in that crop.","Tenant farmers and sharecroppers may be covered where permitted, subject to the State/UT's rules and accepted proof of cultivation or insurable interest.","Enrollment deadlines, premium amounts and required evidence vary by season and notification. Crop damage alone does not establish a payable claim."],
    documents:["Crop, season, notified-area and cultivated-area details.","Proof of insurable interest/cultivation accepted for the State/UT and season.","Identity and bank details requested by the enrollment channel."],
    process:["Check the current PMFBY crop, area, season notification and enrollment cut-off before applying.","Enroll through the official portal or the notified bank, insurer, Common Service Centre or State channel; retain the acknowledgement.","For loss reporting, follow the current notification and official claim instructions promptly."],
    note:"Do not rely on a fixed premium rate, deadline or universal crop list. The current State/UT notification and operational guidelines control coverage and claims.",
    sources:[{label:"PMFBY official portal",url:"https://pmfby.gov.in/"},{label:"2023 Operational Guidelines (linked from the PMFBY portal)",url:"https://pmfby.amnex.co.in/pmfby/pdf/operational_guidelines_pmfby.pdf"}],
    applicationLink:"https://pmfby.gov.in/"
  },
  S003: {
    summary:"The Kisan Credit Card scheme is a bank-delivered credit facility intended to provide timely credit for farmers' cultivation and specified agricultural or allied needs. Banks assess and administer applications under the applicable KCC framework.",
    benefits:["May cover crop-production credit, post-harvest expenses, produce marketing, eligible household consumption, working capital for farm/allied activities, and investment credit for agriculture or allied activities.","The card provides access to approved credit; it is not a grant or automatic loan approval."],
    eligibility:["The official myScheme KCC listing includes individual/joint owner-cultivators, tenant farmers, oral lessees and sharecroppers.","Eligible farmer groups, including SHGs or JLGs with tenant farmers or sharecroppers, may also apply.","The participating bank verifies eligibility and determines the sanctioned limit, security, documents, interest and repayment terms under current rules."],
    documents:["KCC application and identity/address evidence requested by the participating bank.","Landholding, tenancy, lease, sharecropping or cultivation evidence accepted by that bank.","Details supporting the requested crop or eligible allied-activity credit."],
    process:["Apply through a participating bank or a digital channel supported by that bank.","Confirm the current product terms and required evidence with the bank; approval and credit limits are subject to bank assessment."],
    note:"Interest support, credit limits, collateral thresholds and repayment terms can change and may depend on the bank and current government directions. Confirm current terms with the lender; no fixed rate or loan amount is promised here.",
    sources:[{label:"Kisan Credit Card scheme listing on Government of India's myScheme",url:"https://www.myscheme.gov.in/schemes/kcc"}],
    applicationLink:"https://www.myscheme.gov.in/schemes/kcc"
  },
  S004: {
    summary:"The Soil Health Card initiative provides soil-test information and crop-specific nutrient-management recommendations to help farmers make informed decisions about soil amendments and fertilizer use. It is an advisory and testing service, not a cash-transfer benefit.",
    benefits:["A soil report helps assess soil properties and nutrient status and supports crop and nutrient-management decisions.","Testing, sample collection and report access are coordinated through the relevant State/UT agriculture system and soil-testing facilities."],
    eligibility:["The service is intended for agricultural land/fields for which soil can be sampled and tested.","Local agriculture departments and testing facilities manage availability, sampling arrangements and report procedures; contact them for the process in your area."],
    documents:["Field/location details needed to identify the sample and return the report.","Any farmer or land details requested by the local agriculture department or soil-testing facility."],
    process:["Contact the local agriculture department or use the official Soil Health Card portal to find the available service.","Follow local instructions for soil sampling or collection, then review the report's crop and nutrient recommendations."],
    note:"Recommendations depend on the sample, field and crop context. Follow the report and consult local agriculture experts; availability and procedures may vary by State/UT.",
    sources:[{label:"Soil Health Card portal (Department of Agriculture and Farmers Welfare)",url:"https://soilhealth.dac.gov.in/soilhealthcard"}],
    applicationLink:"https://soilhealth.dac.gov.in/"
  }
};

const SCHEME_DETAIL_TRANSLATIONS = {
  Marathi: {
    S001:{summary:"पीएम-किसान ही केंद्र सरकारची योजना असून, पात्र जमीनधारक शेतकरी कुटुंबांना दरवर्षी ₹6,000 तीन समान हप्त्यांत थेट बँक खात्यात दिले जातात. लाभार्थी कुटुंबांची ओळख व पडताळणी राज्य किंवा केंद्रशासित प्रदेश प्रशासन करते.",benefits:["प्रति पात्र शेतकरी कुटुंब दरवर्षी ₹6,000, तीन समान हप्त्यांत.","योजनेतील शेतकरी कुटुंबात पती, पत्नी आणि अल्पवयीन मुले यांचा समावेश होतो."],eligibility:["अर्जदार योजनेच्या निकषांनुसार पात्र जमीनधारक शेतकरी कुटुंबाचा सदस्य असावा आणि संबंधित राज्य/केंद्रशासित प्रदेशाकडून पडताळणी झालेली असावी.","संस्थात्मक जमीनधारक आणि काही उच्च आर्थिक स्थितीचे गट अपात्र असू शकतात. अधिकृत अपवाद व नियम लागू होतात.","नोंदणीकृत लाभार्थ्यांसाठी eKYC अनिवार्य आहे. सद्यस्थिती आणि पडताळणीच्या अटी अधिकृत पोर्टलवर तपासा."],documents:["पोर्टलने मागितलेली आधार/ओळख व eKYC माहिती.","राज्य किंवा केंद्रशासित प्रदेशातील जमीनधारणा नोंदी.","लाभ हस्तांतरणासाठी बँक खात्याची माहिती."],process:["अधिकृत पोर्टलवरील नवीन शेतकरी नोंदणी आणि लाभार्थी स्थिती सेवा वापरा.","आवश्यक eKYC पूर्ण करा. नोंदींमध्ये त्रुटी असल्यास अधिकृत प्रक्रियेनुसार दुरुस्ती करा."],note:"ही माहिती केवळ सारांश आहे; अंतिम पात्रता ठरवत नाही. अधिकृत पीएम-किसान मार्गदर्शक तत्त्वे, जमीन नोंदी, कुटुंबाची व्याख्या आणि अपात्रता नियम लागू होतात.",sources:["पीएम-किसान अधिकृत पोर्टल व योजना माहिती","पीएम-किसान सुधारित प्रश्नोत्तरे (अधिकृत PDF)"]},
    S002:{summary:"पीएमएफबीवाय अंतर्गत अधिसूचित क्षेत्रात, अधिसूचित हंगामात घेतलेल्या अधिसूचित पिकांसाठी पीक विमा उपलब्ध होतो. विमायोग्य हित, जोखीम, विमा रक्कम, हप्ता आणि अर्जाच्या तारखा संबंधित राज्य/केंद्रशासित प्रदेशाची अधिसूचना व मार्गदर्शक तत्त्वांनुसार ठरतात.",benefits:["सध्याच्या नियमांनुसार विशिष्ट उत्पादन घट आणि इतर अधिसूचित परिस्थितींमध्ये संरक्षण मिळू शकते.","संरक्षण पीक, क्षेत्र आणि हंगामानुसार बदलते; दावा अधिसूचित जोखीम, अहवाल आणि मूल्यांकनावर अवलंबून असतो."],eligibility:["अधिसूचित क्षेत्रात अधिसूचित पीक घेणारे आणि त्या पिकात विमायोग्य हित असलेले शेतकरी पात्र असू शकतात.","राज्याच्या नियमांनुसार आणि स्वीकारार्ह पुराव्यासह भाडेकरू व बटाईदार शेतकरी पात्र असू शकतात.","अंतिम तारीख, विमा हप्ता आणि पुरावे हंगामानुसार बदलतात. केवळ पीक नुकसान झाल्याने दावा मंजूर होत नाही."],documents:["पीक, हंगाम, अधिसूचित क्षेत्र आणि लागवड क्षेत्राची माहिती.","स्वीकारार्ह लागवड/विमायोग्य हिताचा पुरावा.","अर्ज माध्यमाने मागितलेली ओळख व बँक माहिती."],process:["अर्जापूर्वी सध्याची अधिसूचना आणि अंतिम तारीख तपासा.","अधिकृत पोर्टल किंवा अधिसूचित बँक, विमा कंपनी, सेवा केंद्र अथवा राज्याच्या माध्यमातून अर्ज करा आणि पोच जतन करा.","नुकसान कळवताना अधिकृत दावा सूचनांचे त्वरित पालन करा."],note:"निश्चित हप्ता, अंतिम तारीख किंवा सर्वत्र लागू पीक यादी गृहीत धरू नका. सध्याची राज्य अधिसूचना व कार्यपद्धतीचे नियम लागू होतात.",sources:["पीएमएफबीवाय अधिकृत पोर्टल","२०२३ कार्यपद्धती मार्गदर्शक तत्त्वे"]},
    S003:{summary:"किसान क्रेडिट कार्ड ही बँकांमार्फत दिली जाणारी पतसुविधा आहे. शेती आणि पात्र कृषी किंवा संलग्न गरजांसाठी वेळेवर कर्ज उपलब्ध करणे हा तिचा उद्देश आहे. अर्जाचे मूल्यांकन लागू केसीसी नियमांनुसार बँक करते.",benefits:["पीक उत्पादन, काढणीनंतरचे खर्च, विक्री, पात्र घरगुती गरजा, खेळते भांडवल आणि कृषी गुंतवणूक यांचा समावेश होऊ शकतो.","कार्डमुळे मंजूर कर्ज वापरता येते; हे अनुदान नाही आणि कर्ज मंजुरीची हमी नाही."],eligibility:["अधिकृत myScheme माहितीनुसार जमीनधारक, भाडेकरू, तोंडी भाडेपट्टाधारक आणि बटाईदार शेतकरी अर्ज करू शकतात.","पात्र शेतकरी गट, स्वयं-सहायता गट किंवा संयुक्त दायित्व गटही अर्ज करू शकतात.","बँक पात्रता तपासते आणि सध्याच्या नियमांनुसार कर्जमर्यादा, तारण, कागदपत्रे, व्याज व परतफेड ठरवते."],documents:["बँकेने मागितलेला केसीसी अर्ज आणि ओळख/पत्ता पुरावा.","बँकेला मान्य जमीनधारणा, भाडेपट्टा, बटाई किंवा लागवडीचा पुरावा.","कर्जासाठी आवश्यक पीक किंवा पात्र संलग्न व्यवसायाचे तपशील."],process:["सहभागी बँकेत किंवा तिच्या डिजिटल माध्यमातून अर्ज करा.","सध्याच्या अटी बँकेकडून निश्चित करा; मंजुरी व कर्जमर्यादा बँकेच्या तपासणीवर अवलंबून असते."],note:"व्याज सवलत, कर्जमर्यादा, तारण आणि परतफेडीच्या अटी बदलू शकतात. सध्याच्या अटी बँकेकडून तपासा; येथे निश्चित दर किंवा कर्जरक्कम दिलेली नाही.",sources:["भारत सरकारच्या myScheme वरील किसान क्रेडिट कार्ड योजना"]},
    S004:{summary:"मृदा आरोग्य कार्ड उपक्रम माती परीक्षणाची माहिती आणि पीकनिहाय पोषक व्यवस्थापनाच्या शिफारसी देतो. ही परीक्षण व सल्ला सेवा आहे; रोख लाभ योजना नाही.",benefits:["मातीचा अहवाल मातीचे गुणधर्म व पोषक स्थिती समजून पीक आणि खत व्यवस्थापनाचे निर्णय घेण्यास मदत करतो.","नमुना संकलन, परीक्षण आणि अहवालाची उपलब्धता राज्याची कृषी यंत्रणा व मृदा परीक्षण प्रयोगशाळा व्यवस्थापित करतात."],eligibility:["मातीचा नमुना घेऊन परीक्षण करता येणाऱ्या शेतजमिनींसाठी ही सेवा आहे.","स्थानिक कृषी विभाग व परीक्षण केंद्रे उपलब्धता आणि प्रक्रिया ठरवतात; आपल्या भागासाठी त्यांच्याशी संपर्क साधा."],documents:["नमुना ओळखण्यासाठी आणि अहवाल देण्यासाठी आवश्यक शेत/ठिकाणाची माहिती.","स्थानिक कृषी विभाग किंवा परीक्षण केंद्राने मागितलेली माहिती."],process:["स्थानिक कृषी विभागाशी संपर्क साधा किंवा अधिकृत मृदा आरोग्य कार्ड पोर्टल तपासा.","नमुना संकलन सूचनांचे पालन करा आणि अहवालातील शिफारसी पाहा."],note:"शिफारसी नमुना, शेत आणि पिकाच्या परिस्थितीनुसार असतात. अहवाल व स्थानिक कृषी तज्ज्ञांचा सल्ला घ्या; प्रक्रिया राज्यानुसार बदलू शकते.",sources:["मृदा आरोग्य कार्ड पोर्टल (कृषी व शेतकरी कल्याण विभाग)"]}
  },
  Hindi: {
    S001:{summary:"पीएम-किसान केंद्र सरकार की योजना है, जिसके तहत पात्र भूमि-धारक किसान परिवारों को हर वर्ष ₹6,000 की सहायता तीन समान किस्तों में सीधे बैंक खाते में दी जाती है। लाभार्थियों की पहचान और सत्यापन राज्य/केंद्रशासित प्रदेश प्रशासन करता है।",benefits:["प्रति पात्र किसान परिवार हर वर्ष ₹6,000, तीन समान किस्तों में।","किसान परिवार में पति, पत्नी और नाबालिग बच्चे शामिल हैं।"],eligibility:["आवेदक पात्र भूमि-धारक किसान परिवार का सदस्य हो और संबंधित राज्य/केंद्रशासित प्रदेश से सत्यापित हो।","संस्थागत भूमि-धारक और कुछ उच्च आर्थिक स्थिति वाली श्रेणियां अपात्र हो सकती हैं; आधिकारिक अपवाद और नियम लागू होंगे।","पंजीकृत लाभार्थियों के लिए eKYC अनिवार्य है। वर्तमान स्थिति और आवश्यकताएं आधिकारिक पोर्टल पर जांचें।"],documents:["पोर्टल द्वारा मांगी गई आधार/पहचान और eKYC जानकारी।","राज्य/केंद्रशासित प्रदेश के भूमि-अभिलेख।","लाभ हस्तांतरण के लिए बैंक खाते का विवरण।"],process:["आधिकारिक पोर्टल की नए किसान पंजीकरण और लाभार्थी स्थिति सेवाओं का उपयोग करें।","eKYC पूरा करें और अभिलेखों की त्रुटियां आधिकारिक प्रक्रिया से ठीक कराएं।"],note:"यह केवल सारांश है, अंतिम पात्रता निर्णय नहीं। आधिकारिक पीएम-किसान दिशानिर्देश, भूमि-अभिलेख, परिवार की परिभाषा और अपात्रता नियम लागू होंगे।",sources:["पीएम-किसान आधिकारिक पोर्टल और योजना जानकारी","पीएम-किसान संशोधित अक्सर पूछे जाने वाले प्रश्न (आधिकारिक PDF)"]},
    S002:{summary:"पीएमएफबीवाई अधिसूचित क्षेत्र में अधिसूचित मौसम के दौरान उगाई गई अधिसूचित फसलों के लिए बीमा प्रदान करती है। बीमा योग्य हित, जोखिम, बीमित राशि, प्रीमियम और आवेदन की तारीखें राज्य की अधिसूचना और योजना दिशानिर्देशों से तय होती हैं।",benefits:["वर्तमान नियमों के तहत निर्दिष्ट उपज हानि और अन्य अधिसूचित परिस्थितियों में सुरक्षा मिल सकती है।","कवरेज फसल, क्षेत्र और मौसम पर निर्भर है; दावा अधिसूचित जोखिम, सूचना और मूल्यांकन पर निर्भर करता है।"],eligibility:["अधिसूचित क्षेत्र में अधिसूचित फसल उगाने और उसमें बीमा योग्य हित रखने वाले किसान पात्र हो सकते हैं।","राज्य के नियमों और स्वीकार्य प्रमाण के अधीन किरायेदार और बटाईदार किसान भी पात्र हो सकते हैं।","अंतिम तिथि, प्रीमियम और प्रमाण मौसम के अनुसार बदलते हैं। केवल फसल नुकसान से दावा स्वीकृत नहीं होता।"],documents:["फसल, मौसम, अधिसूचित क्षेत्र और बोए गए क्षेत्र का विवरण।","स्वीकार्य खेती/बीमा योग्य हित का प्रमाण।","आवेदन माध्यम द्वारा मांगी गई पहचान और बैंक जानकारी।"],process:["आवेदन से पहले वर्तमान अधिसूचना और अंतिम तिथि जांचें।","आधिकारिक पोर्टल या अधिसूचित बैंक, बीमाकर्ता, सेवा केंद्र अथवा राज्य माध्यम से आवेदन करें और रसीद रखें।","नुकसान की सूचना के लिए आधिकारिक दावा निर्देशों का तुरंत पालन करें।"],note:"निश्चित प्रीमियम, अंतिम तिथि या सार्वभौमिक फसल सूची न मानें। वर्तमान राज्य अधिसूचना और परिचालन दिशानिर्देश लागू होंगे।",sources:["पीएमएफबीवाई आधिकारिक पोर्टल","2023 परिचालन दिशानिर्देश"]},
    S003:{summary:"किसान क्रेडिट कार्ड बैंकों द्वारा दी जाने वाली ऋण सुविधा है, जिसका उद्देश्य खेती और पात्र कृषि या संबंधित जरूरतों के लिए समय पर ऋण देना है। बैंक लागू केसीसी नियमों के तहत आवेदन का मूल्यांकन करते हैं।",benefits:["फसल उत्पादन, कटाई के बाद के खर्च, विपणन, पात्र घरेलू जरूरतें, कार्यशील पूंजी और कृषि निवेश शामिल हो सकते हैं।","यह स्वीकृत ऋण तक पहुंच देता है; अनुदान या ऋण स्वीकृति की गारंटी नहीं है।"],eligibility:["भारत सरकार की myScheme जानकारी में मालिक-किसान, किरायेदार, मौखिक पट्टेदार और बटाईदार किसान शामिल हैं।","पात्र किसान समूह, स्वयं सहायता समूह या संयुक्त देयता समूह भी आवेदन कर सकते हैं।","बैंक पात्रता जांचकर वर्तमान नियमों के अनुसार ऋण सीमा, सुरक्षा, दस्तावेज, ब्याज व पुनर्भुगतान तय करता है।"],documents:["बैंक द्वारा मांगा गया केसीसी आवेदन और पहचान/पते का प्रमाण।","बैंक द्वारा स्वीकार भूमि, किरायेदारी, पट्टे या खेती का प्रमाण।","फसल या पात्र संबद्ध गतिविधि के ऋण से जुड़े विवरण।"],process:["सहभागी बैंक या समर्थित डिजिटल माध्यम से आवेदन करें।","वर्तमान शर्तें बैंक से तय करें; स्वीकृति और सीमा बैंक के मूल्यांकन पर निर्भर हैं।"],note:"ब्याज सहायता, ऋण सीमा, जमानत और पुनर्भुगतान शर्तें बदल सकती हैं। वर्तमान शर्तें बैंक से पुष्टि करें; कोई निश्चित दर या राशि नहीं दी गई है।",sources:["भारत सरकार की myScheme पर किसान क्रेडिट कार्ड योजना"]},
    S004:{summary:"मृदा स्वास्थ्य कार्ड पहल मिट्टी जांच की जानकारी और फसल के अनुसार पोषक तत्व प्रबंधन की सलाह देती है। यह जांच और सलाह सेवा है, नकद लाभ योजना नहीं।",benefits:["मिट्टी की रिपोर्ट उसके गुणों और पोषक स्थिति का आकलन कर फसल व उर्वरक प्रबंधन में मदद करती है।","नमूना, जांच और रिपोर्ट की व्यवस्था राज्य की कृषि प्रणाली और मिट्टी जांच प्रयोगशालाएं करती हैं।"],eligibility:["यह सेवा उन कृषि खेतों के लिए है जिनकी मिट्टी का नमूना लेकर जांच की जा सकती है।","स्थानीय कृषि विभाग और जांच केंद्र प्रक्रिया तय करते हैं; अपने क्षेत्र की जानकारी के लिए संपर्क करें।"],documents:["नमूने और रिपोर्ट के लिए खेत/स्थान का विवरण।","स्थानीय विभाग या जांच केंद्र द्वारा मांगी गई जानकारी।"],process:["स्थानीय कृषि विभाग से संपर्क करें या आधिकारिक मृदा स्वास्थ्य कार्ड पोर्टल देखें।","नमूना संग्रह निर्देशों का पालन करें और रिपोर्ट की सलाह पढ़ें।"],note:"सलाह नमूने, खेत और फसल पर निर्भर करती है। रिपोर्ट और स्थानीय विशेषज्ञों की सलाह लें; प्रक्रिया राज्य के अनुसार बदल सकती है।",sources:["मृदा स्वास्थ्य कार्ड पोर्टल (कृषि एवं किसान कल्याण विभाग)"]}
  },
  Kannada: {
    S001:{summary:"ಪಿಎಂ-ಕಿಸಾನ್ ಕೇಂದ್ರ ವಲಯದ ಯೋಜನೆಯಾಗಿದ್ದು, ಅರ್ಹ ಭೂಮಿ ಹೊಂದಿರುವ ರೈತ ಕುಟುಂಬಗಳಿಗೆ ವರ್ಷಕ್ಕೆ ₹6,000 ಅನ್ನು ಮೂರು ಸಮಾನ ಕಂತುಗಳಲ್ಲಿ ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ನೀಡುತ್ತದೆ. ಫಲಾನುಭವಿಗಳನ್ನು ರಾಜ್ಯ/ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶದ ಆಡಳಿತ ಗುರುತಿಸಿ ಪರಿಶೀಲಿಸುತ್ತದೆ.",benefits:["ಪ್ರತಿ ಅರ್ಹ ರೈತ ಕುಟುಂಬಕ್ಕೆ ವರ್ಷಕ್ಕೆ ₹6,000, ಮೂರು ಸಮಾನ ಕಂತುಗಳಲ್ಲಿ.","ರೈತ ಕುಟುಂಬದಲ್ಲಿ ಗಂಡ, ಹೆಂಡತಿ ಮತ್ತು ಅಪ್ರಾಪ್ತ ಮಕ್ಕಳು ಸೇರಿರುತ್ತಾರೆ."],eligibility:["ಅರ್ಜಿದಾರರು ಅರ್ಹ ಭೂಮಿ ಹೊಂದಿರುವ ರೈತ ಕುಟುಂಬದ ಸದಸ್ಯರಾಗಿದ್ದು, ಸಂಬಂಧಿತ ರಾಜ್ಯ/ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶದಿಂದ ಪರಿಶೀಲನೆಗೊಂಡಿರಬೇಕು.","ಸಂಸ್ಥಾತ್ಮಕ ಭೂಮಾಲೀಕರು ಮತ್ತು ಕೆಲವು ಉನ್ನತ ಆರ್ಥಿಕ ವರ್ಗಗಳು ಅನರ್ಹರಾಗಬಹುದು; ಅಧಿಕೃತ ವಿನಾಯಿತಿಗಳು ಮತ್ತು ನಿಯಮಗಳು ಅನ್ವಯಿಸುತ್ತವೆ.","ನೋಂದಾಯಿತ ಫಲಾನುಭವಿಗಳಿಗೆ eKYC ಕಡ್ಡಾಯ. ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ ಮತ್ತು ಅಗತ್ಯಗಳನ್ನು ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ."],documents:["ಪೋರ್ಟಲ್ ಕೇಳುವ ಆಧಾರ್/ಗುರುತು ಮತ್ತು eKYC ವಿವರಗಳು.","ರಾಜ್ಯ/ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶದ ಭೂ ದಾಖಲೆಗಳು.","ಸಹಾಯಧನ ವರ್ಗಾವಣೆಗೆ ಬ್ಯಾಂಕ್ ಖಾತೆ ವಿವರಗಳು."],process:["ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನ ಹೊಸ ರೈತ ನೋಂದಣಿ ಮತ್ತು ಫಲಾನುಭವಿ ಸ್ಥಿತಿ ಸೇವೆ ಬಳಸಿ.","ಅಗತ್ಯ eKYC ಪೂರ್ಣಗೊಳಿಸಿ; ದಾಖಲೆಗಳ ತಪ್ಪುಗಳನ್ನು ಅಧಿಕೃತ ವಿಧಾನದ ಮೂಲಕ ಸರಿಪಡಿಸಿ."],note:"ಇದು ಸಾರಾಂಶ ಮಾತ್ರ; ಅಂತಿಮ ಅರ್ಹತೆ ನಿರ್ಧಾರವಲ್ಲ. ಅಧಿಕೃತ ಮಾರ್ಗಸೂಚಿಗಳು, ಭೂ ದಾಖಲೆಗಳು, ಕುಟುಂಬದ ವ್ಯಾಖ್ಯಾನ ಮತ್ತು ಅನರ್ಹತಾ ನಿಯಮಗಳು ಅನ್ವಯಿಸುತ್ತವೆ.",sources:["ಪಿಎಂ-ಕಿಸಾನ್ ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಮತ್ತು ಯೋಜನೆ ಮಾಹಿತಿ","ಪಿಎಂ-ಕಿಸಾನ್ ಪರಿಷ್ಕೃತ FAQ (ಅಧಿಕೃತ PDF)"]},
    S002:{summary:"ಪಿಎಂಎಫ್‌ಬಿವೈ ಅಧಿಸೂಚಿತ ಪ್ರದೇಶದಲ್ಲಿ ಅಧಿಸೂಚಿತ ಹಂಗಾಮಿನಲ್ಲಿ ಬೆಳೆಯುವ ಅಧಿಸೂಚಿತ ಬೆಳೆಗಳಿಗೆ ವಿಮೆ ಒದಗಿಸುತ್ತದೆ. ವಿಮಾ ಹಿತಾಸಕ್ತಿ, ಅಪಾಯಗಳು, ವಿಮಾ ಮೊತ್ತ, ಪ್ರೀಮಿಯಂ ಮತ್ತು ಅರ್ಜಿ ದಿನಾಂಕಗಳು ರಾಜ್ಯದ ಅಧಿಸೂಚನೆ ಹಾಗೂ ಮಾರ್ಗಸೂಚಿಗಳ ಪ್ರಕಾರ ನಿರ್ಧಾರವಾಗುತ್ತವೆ.",benefits:["ಪ್ರಸ್ತುತ ನಿಯಮಗಳಡಿ ನಿರ್ದಿಷ್ಟ ಇಳುವರಿ ನಷ್ಟ ಮತ್ತು ಇತರ ಅಧಿಸೂಚಿತ ಸಂದರ್ಭಗಳಿಗೆ ರಕ್ಷಣೆ ದೊರೆಯಬಹುದು.","ವಿಮೆ ಬೆಳೆ, ಪ್ರದೇಶ ಮತ್ತು ಹಂಗಾಮಿನ ಮೇಲೆ ಅವಲಂಬಿತವಾಗಿದೆ; ಕ್ಲೈಮ್ ಅಧಿಸೂಚಿತ ಅಪಾಯ, ವರದಿ ಮತ್ತು ಮೌಲ್ಯಮಾಪನಕ್ಕೆ ಒಳಪಟ್ಟಿದೆ."],eligibility:["ಅಧಿಸೂಚಿತ ಪ್ರದೇಶದಲ್ಲಿ ಅಧಿಸೂಚಿತ ಬೆಳೆ ಬೆಳೆದು ವಿಮಾ ಹಿತಾಸಕ್ತಿ ಹೊಂದಿರುವ ರೈತರು ಅರ್ಹರಾಗಬಹುದು.","ರಾಜ್ಯದ ನಿಯಮಗಳು ಮತ್ತು ಸ್ವೀಕೃತ ಪುರಾವೆಗೆ ಒಳಪಟ್ಟು ಗುತ್ತಿಗೆದಾರರು ಮತ್ತು ಪಾಲುದಾರ ರೈತರೂ ಅರ್ಹರಾಗಬಹುದು.","ಕೊನೆಯ ದಿನಾಂಕ, ಪ್ರೀಮಿಯಂ ಮತ್ತು ಪುರಾವೆಗಳು ಹಂಗಾಮಿನ ಪ್ರಕಾರ ಬದಲಾಗುತ್ತವೆ. ಬೆಳೆ ಹಾನಿಯೊಂದೇ ಕ್ಲೈಮ್ ಮಂಜೂರಿಗೆ ಸಾಕಾಗುವುದಿಲ್ಲ."],documents:["ಬೆಳೆ, ಹಂಗಾಮು, ಅಧಿಸೂಚಿತ ಪ್ರದೇಶ ಮತ್ತು ಬೆಳೆದ ಪ್ರದೇಶದ ವಿವರಗಳು.","ಸ್ವೀಕೃತ ಕೃಷಿ ಅಥವಾ ವಿಮಾ ಹಿತಾಸಕ್ತಿಯ ಪುರಾವೆ.","ಅರ್ಜಿ ಮಾಧ್ಯಮ ಕೇಳುವ ಗುರುತು ಮತ್ತು ಬ್ಯಾಂಕ್ ವಿವರಗಳು."],process:["ಅರ್ಜಿ ಮೊದಲು ಪ್ರಸ್ತುತ ಅಧಿಸೂಚನೆ ಮತ್ತು ಕೊನೆಯ ದಿನಾಂಕ ಪರಿಶೀಲಿಸಿ.","ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಅಥವಾ ಅಧಿಸೂಚಿತ ಬ್ಯಾಂಕ್, ವಿಮಾ ಸಂಸ್ಥೆ, ಸೇವಾ ಕೇಂದ್ರ ಅಥವಾ ರಾಜ್ಯದ ಮೂಲಕ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.","ನಷ್ಟ ವರದಿಗೆ ಅಧಿಕೃತ ಕ್ಲೈಮ್ ಸೂಚನೆಗಳನ್ನು ತಕ್ಷಣ ಪಾಲಿಸಿ."],note:"ನಿಗದಿತ ಪ್ರೀಮಿಯಂ ಅಥವಾ ಎಲ್ಲೆಡೆ ಅನ್ವಯಿಸುವ ಬೆಳೆ ಪಟ್ಟಿಯನ್ನು ಊಹಿಸಬೇಡಿ. ಪ್ರಸ್ತುತ ರಾಜ್ಯ ಅಧಿಸೂಚನೆ ಮತ್ತು ಕಾರ್ಯಾಚರಣಾ ಮಾರ್ಗಸೂಚಿಗಳು ಅನ್ವಯಿಸುತ್ತವೆ.",sources:["ಪಿಎಂಎಫ್‌ಬಿವೈ ಅಧಿಕೃತ ಪೋರ್ಟಲ್","2023 ಕಾರ್ಯಾಚರಣಾ ಮಾರ್ಗಸೂಚಿಗಳು"]},
    S003:{summary:"ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಬ್ಯಾಂಕ್‌ಗಳು ನೀಡುವ ಸಾಲ ಸೌಲಭ್ಯವಾಗಿದ್ದು, ಕೃಷಿ ಮತ್ತು ಅರ್ಹ ಕೃಷಿ-ಸಂಬಂಧಿತ ಅಗತ್ಯಗಳಿಗೆ ಸಮಯಕ್ಕೆ ಸಾಲ ಒದಗಿಸುತ್ತದೆ. ಬ್ಯಾಂಕ್‌ಗಳು ಅನ್ವಯಿಸುವ ಕೆಸಿಸಿ ನಿಯಮಗಳಡಿ ಅರ್ಜಿಯನ್ನು ಪರಿಶೀಲಿಸುತ್ತವೆ.",benefits:["ಬೆಳೆ ಉತ್ಪಾದನೆ, ಕೊಯ್ಲಿನ ನಂತರದ ವೆಚ್ಚ, ಮಾರುಕಟ್ಟೆ, ಅರ್ಹ ಗೃಹ ಬಳಕೆ, ಕಾರ್ಯನಿಧಿ ಮತ್ತು ಕೃಷಿ ಹೂಡಿಕೆ ಒಳಗೊಂಡಿರಬಹುದು.","ಇದು ಮಂಜೂರಾದ ಸಾಲಕ್ಕೆ ಪ್ರವೇಶ ನೀಡುತ್ತದೆ; ಅನುದಾನ ಅಥವಾ ಸಾಲ ಮಂಜೂರಾತಿಯ ಖಾತರಿಯಲ್ಲ."],eligibility:["myScheme ಮಾಹಿತಿಯಲ್ಲಿ ಭೂಮಾಲೀಕ-ಕೃಷಿಕರು, ಬಾಡಿಗೆದಾರರು, ಮೌಖಿಕ ಗುತ್ತಿಗೆದಾರರು ಮತ್ತು ಪಾಲುದಾರ ಕೃಷಿಕರು ಸೇರಿದ್ದಾರೆ.","ಅರ್ಹ ರೈತ ಗುಂಪುಗಳು, ಸ್ವಸಹಾಯ ಗುಂಪುಗಳು ಅಥವಾ ಜಂಟಿ ಹೊಣೆಗಾರಿಕೆ ಗುಂಪುಗಳೂ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು.","ಬ್ಯಾಂಕ್ ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ ಪ್ರಸ್ತುತ ನಿಯಮಗಳ ಪ್ರಕಾರ ಮಿತಿ, ಭದ್ರತೆ, ದಾಖಲೆ, ಬಡ್ಡಿ ಮತ್ತು ಮರುಪಾವತಿಯನ್ನು ನಿರ್ಧರಿಸುತ್ತದೆ."],documents:["ಬ್ಯಾಂಕ್ ಕೇಳುವ ಕೆಸಿಸಿ ಅರ್ಜಿ ಮತ್ತು ಗುರುತು/ವಿಳಾಸದ ಪುರಾವೆ.","ಬ್ಯಾಂಕ್ ಸ್ವೀಕರಿಸುವ ಭೂಮಿ, ಬಾಡಿಗೆ ಅಥವಾ ಕೃಷಿಯ ಪುರಾವೆ.","ಕೋರಿದ ಬೆಳೆ ಅಥವಾ ಸಂಬಂಧಿತ ಚಟುವಟಿಕೆಯ ಸಾಲಕ್ಕೆ ಬೇಕಾದ ವಿವರಗಳು."],process:["ಭಾಗವಹಿಸುವ ಬ್ಯಾಂಕ್ ಅಥವಾ ಅದರ ಡಿಜಿಟಲ್ ಮಾಧ್ಯಮದ ಮೂಲಕ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.","ಪ್ರಸ್ತುತ ನಿಯಮಗಳನ್ನು ಬ್ಯಾಂಕ್‌ನೊಂದಿಗೆ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ; ಮಂಜೂರಾತಿ ಬ್ಯಾಂಕಿನ ಪರಿಶೀಲನೆಗೆ ಒಳಪಟ್ಟಿದೆ."],note:"ಬಡ್ಡಿ ನೆರವು, ಸಾಲ ಮಿತಿ, ಜಾಮೀನು ಮತ್ತು ಮರುಪಾವತಿ ನಿಯಮಗಳು ಬದಲಾಗಬಹುದು. ಪ್ರಸ್ತುತ ನಿಯಮಗಳನ್ನು ಬ್ಯಾಂಕ್‌ನಿಂದ ದೃಢಪಡಿಸಿ; ನಿಗದಿತ ದರ ಅಥವಾ ಮೊತ್ತವನ್ನು ಇಲ್ಲಿ ಭರವಸೆ ನೀಡಲಾಗುವುದಿಲ್ಲ.",sources:["ಭಾರತ ಸರ್ಕಾರದ myScheme‌ನಲ್ಲಿರುವ ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಯೋಜನೆ"]},
    S004:{summary:"ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಉಪಕ್ರಮವು ಮಣ್ಣಿನ ಪರೀಕ್ಷೆಯ ಮಾಹಿತಿ ಮತ್ತು ಬೆಳೆ ಆಧಾರಿತ ಪೋಷಕಾಂಶ ನಿರ್ವಹಣೆಯ ಸಲಹೆಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ. ಇದು ಪರೀಕ್ಷೆ ಮತ್ತು ಸಲಹಾ ಸೇವೆ; ನಗದು ನೆರವು ಯೋಜನೆಯಲ್ಲ.",benefits:["ಮಣ್ಣಿನ ವರದಿ ಅದರ ಗುಣಲಕ್ಷಣ ಮತ್ತು ಪೋಷಕಾಂಶ ಸ್ಥಿತಿಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡು ಬೆಳೆ ಹಾಗೂ ಗೊಬ್ಬರ ನಿರ್ವಹಣೆಗೆ ನೆರವಾಗುತ್ತದೆ.","ಮಾದರಿ, ಪರೀಕ್ಷೆ ಮತ್ತು ವರದಿ ಸೇವೆಯನ್ನು ರಾಜ್ಯದ ಕೃಷಿ ವ್ಯವಸ್ಥೆ ಹಾಗೂ ಮಣ್ಣು ಪರೀಕ್ಷಾ ಪ್ರಯೋಗಾಲಯಗಳು ನಿರ್ವಹಿಸುತ್ತವೆ."],eligibility:["ಮಣ್ಣಿನ ಮಾದರಿ ಸಂಗ್ರಹಿಸಿ ಪರೀಕ್ಷಿಸಬಹುದಾದ ಕೃಷಿ ಭೂಮಿಗಳಿಗೆ ಈ ಸೇವೆ ಉದ್ದೇಶಿತವಾಗಿದೆ.","ಸ್ಥಳೀಯ ಕೃಷಿ ಇಲಾಖೆ ಮತ್ತು ಪರೀಕ್ಷಾ ಕೇಂದ್ರಗಳು ಲಭ್ಯತೆ ಹಾಗೂ ವಿಧಾನವನ್ನು ನಿರ್ವಹಿಸುತ್ತವೆ; ನಿಮ್ಮ ಪ್ರದೇಶಕ್ಕಾಗಿ ಅವರನ್ನು ಸಂಪರ್ಕಿಸಿ."],documents:["ಮಾದರಿಯನ್ನು ಗುರುತಿಸಲು ಬೇಕಾದ ಹೊಲ/ಸ್ಥಳದ ವಿವರಗಳು.","ಸ್ಥಳೀಯ ಕೃಷಿ ಇಲಾಖೆ ಅಥವಾ ಪರೀಕ್ಷಾ ಕೇಂದ್ರ ಕೇಳುವ ಮಾಹಿತಿ."],process:["ಸ್ಥಳೀಯ ಕೃಷಿ ಇಲಾಖೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ ಅಥವಾ ಅಧಿಕೃತ ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಪೋರ್ಟಲ್ ಪರಿಶೀಲಿಸಿ.","ಮಾದರಿ ಸಂಗ್ರಹ ಸೂಚನೆಗಳನ್ನು ಪಾಲಿಸಿ ಮತ್ತು ವರದಿಯಲ್ಲಿರುವ ಸಲಹೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ."],note:"ಸಲಹೆಗಳು ಮಾದರಿ, ಹೊಲ ಮತ್ತು ಬೆಳೆ ಪರಿಸ್ಥಿತಿಯನ್ನು ಅವಲಂಬಿಸಿವೆ. ವರದಿ ಮತ್ತು ಸ್ಥಳೀಯ ತಜ್ಞರ ಸಲಹೆ ಅನುಸರಿಸಿ; ವಿಧಾನ ರಾಜ್ಯಾನುಸಾರ ಬದಲಾಗಬಹುದು.",sources:["ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಪೋರ್ಟಲ್ (ಕೃಷಿ ಮತ್ತು ರೈತ ಕಲ್ಯಾಣ ಇಲಾಖೆ)"]}
  }
};

const SCHEME_DETAIL_LABELS = {
  English:{eligibility:"Eligibility and conditions",documents:"What to prepare (requirements may vary)",process:"How to proceed",official:"Official information",portal:"Official scheme portal"},
  Marathi:{eligibility:"पात्रता आणि अटी",documents:"काय तयार ठेवावे (आवश्यकता बदलू शकतात)",process:"पुढील प्रक्रिया",official:"अधिकृत माहिती",portal:"अधिकृत योजना पोर्टल"},
  Hindi:{eligibility:"पात्रता और शर्तें",documents:"क्या तैयार रखें (आवश्यकताएं बदल सकती हैं)",process:"आगे की प्रक्रिया",official:"आधिकारिक जानकारी",portal:"आधिकारिक योजना पोर्टल"},
  Kannada:{eligibility:"ಅರ್ಹತೆ ಮತ್ತು ಷರತ್ತುಗಳು",documents:"ಏನು ಸಿದ್ಧಪಡಿಸಬೇಕು (ಅವಶ್ಯಕತೆಗಳು ಬದಲಾಗಬಹುದು)",process:"ಮುಂದಿನ ಕ್ರಮ",official:"ಅಧಿಕೃತ ಮಾಹಿತಿ",portal:"ಅಧಿಕೃತ ಯೋಜನಾ ಪೋರ್ಟಲ್"}
};

function localizedLegalDetails(schemeCode,lang){
  const base=SCHEME_LEGAL_DETAILS[schemeCode]||SCHEME_LEGAL_DETAILS.S001;
  const translated=SCHEME_DETAIL_TRANSLATIONS[lang]?.[schemeCode];
  if(!translated) return base;
  return {...base,...translated,sources:base.sources.map((source,index)=>({...source,label:translated.sources[index]||source.label}))};
}

const localizedSchemes = {
  English: [
    {name:"PM Kisan Samman Nidhi",category:"Financial Support",desc:"₹6,000 annual income support for eligible landholding farmer families."},
    {name:"Pradhan Mantri Fasal Bima Yojana",category:"Insurance",desc:"Insurance for notified crops, areas and seasons under current scheme rules."},
    {name:"Kisan Credit Card (KCC)",category:"Credit",desc:"Bank credit for cultivation and eligible agricultural or allied needs."},
    {name:"Soil Health Card Scheme",category:"Soil & Crop Management",desc:"Soil-test information and nutrient-management recommendations."}
  ],
  Marathi: [
    {name:"पीएम-किसान सन्मान निधी",category:"आर्थिक सहाय्य",desc:"पात्र शेतकऱ्यांना दरवर्षी ₹6,000 आर्थिक सहाय्य."},
    {name:"प्रधानमंत्री फसल बीमा योजना",category:"विमा",desc:"नैसर्गिक आपत्तींमुळे होणाऱ्या पिकांच्या नुकसानीसाठी विमा संरक्षण."},
    {name:"किसान क्रेडिट कार्ड (KCC)",category:"कर्ज",desc:"शेतीच्या गरजांसाठी अल्पकालीन कर्ज सहाय्य."},
    {name:"मृदा आरोग्य कार्ड योजना",category:"इतर",desc:"माती परीक्षण आणि शिफारसी."}
  ],
  Hindi: [
    {name:"पीएम-किसान सम्मान निधि",category:"वित्तीय सहायता",desc:"पात्र किसानों को प्रति वर्ष ₹6,000 की वित्तीय सहायता।"},
    {name:"प्रधानमंत्री फसल बीमा योजना",category:"बीमा",desc:"प्राकृतिक आपदाओं से फसल नुकसान के लिए बीमा सुरक्षा।"},
    {name:"किसान क्रेडिट कार्ड (KCC)",category:"ऋण",desc:"कृषि आवश्यकताओं के लिए अल्पकालिक ऋण सहायता।"},
    {name:"मृदा स्वास्थ्य कार्ड योजना",category:"अन्य",desc:"मिट्टी परीक्षण और सिफारिशें।"}
  ],
  Kannada: [
    {name:"ಪಿಎಂ-ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ",category:"ಆರ್ಥಿಕ ಸಹಾಯ",desc:"ಅರ್ಹ ರೈತರಿಗೆ ವರ್ಷಕ್ಕೆ ₹6,000 ಆರ್ಥಿಕ ಸಹಾಯ."},
    {name:"ಪ್ರಧಾನಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ",category:"ವಿಮೆ",desc:"ನೈಸರ್ಗಿಕ ವಿಕೋಪಗಳಿಂದ ಬೆಳೆ ನಷ್ಟಕ್ಕೆ ವಿಮಾ ರಕ್ಷಣೆ."},
    {name:"ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ (KCC)",category:"ಸಾಲ",desc:"ಕೃಷಿ ಅಗತ್ಯಗಳಿಗೆ ಅಲ್ಪಾವಧಿಯ ಸಾಲ ಸಹಾಯ."},
    {name:"ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಯೋಜನೆ",category:"ಇತರೆ",desc:"ಮಣ್ಣು ಪರೀಕ್ಷೆ ಮತ್ತು ಶಿಫಾರಸುಗಳು."}
  ]
};

function localizedScheme(scheme, lang) {
  const localized = localizedSchemes[lang]?.[scheme.id - 1];
  return localized ? {...scheme, ...localized} : scheme;
}

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
  Marathi:{
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
  Hindi:{
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
  Kannada:{
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
  const t = translations[lang] || translations.English;

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
      {page==="home" && <Home t={t} lang={lang} go={go} setSelectedScheme={setSelectedScheme}/>}
      {page==="schemes" && <Schemes t={t} lang={lang} go={go} setSelectedScheme={setSelectedScheme}/>}
      {page==="detail" && <SchemeDetail t={t} lang={lang} go={go} scheme={selectedScheme}/>}
      {page==="voice" && <Voice t={t}/>} 
      {page==="documents" && <Documents t={t}/>} 
      {page==="guidance" && <Guidance t={t}/>} 
      {page==="profile" && isLoggedIn && <Profile t={t} user={user} setUser={setUser}/>} 
      {page==="eligibility" && <Eligibility t={t} lang={lang}/>}
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
            <option value="English">English</option><option value="Marathi">Marathi</option><option value="Hindi">Hindi</option><option value="Kannada">Kannada</option>
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
      <div className="scheme-grid">{schemes.map(s=><SchemeCard key={s.id} scheme={localizedScheme(s,lang)} t={t} onClick={()=>{setSelectedScheme(s);go("detail")}}/>)}</div>
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
  const filtered=useMemo(()=>schemes.filter(s=>{
    const localized=localizedScheme(s,lang);
    const query=q.toLowerCase();
    return [s.name,s.category,s.desc,localized.name,localized.category,localized.desc]
      .some(value=>value.toLowerCase().includes(query));
  }),[q,lang]);
  return <section className="container page">
    <div className="page-banner" style={{backgroundImage:`url(${images.field})`}}><div><span className="eyebrow">AGRI SUPPORT</span><h1>{t.schemeTitle}</h1><p>{t.schemeText}</p></div></div>
    <div className="search-row"><div className="search-box"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder={t.search}/></div><button className="outline" onClick={()=>go("eligibility")}>{t.check}</button></div>
    <div className="scheme-grid large">{filtered.map(s=><SchemeCard key={s.id} scheme={localizedScheme(s,lang)} t={t} onClick={()=>{setSelectedScheme(s);go("detail")}}/>)}</div>
  </section>
}

function SchemeDetail({t,lang,go,scheme}){
  const localized=localizedScheme(scheme,lang);
  const schemeCode=scheme?.id?`S00${scheme.id}`:"S001";
  const info=localizedLegalDetails(schemeCode,lang);
  const labels=SCHEME_DETAIL_LABELS[lang]||SCHEME_DETAIL_LABELS.English;
  return <section className="container page">
    <button className="back-btn" onClick={()=>go("schemes")}><ArrowLeft size={16}/> {t.back}</button>
    <div className="detail-card">
      <div className="detail-image"><img src={localized.image} alt={localized.name}/></div>
      <div className="detail-main"><span className="pill">{localized.category}</span><h1>{localized.name}</h1><p>{info.summary}</p><h3>{t.benefits}</h3><ul className="checks">{info.benefits.map(item=><li key={item}><CheckCircle2/> {item}</li>)}</ul><div className="scheme-action-row"><button className="primary" onClick={()=>go("eligibility")}>{t.check}<ArrowRight size={17}/></button><a className="outline" href={info.applicationLink} target="_blank" rel="noreferrer">{labels.portal}<ArrowRight size={16}/></a></div></div>
    </div>
    <div className="content-card detail-sections">
      <div><h2>{labels.eligibility}</h2><ul className="scheme-legal-list">{info.eligibility.map(item=><li key={item}>{item}</li>)}</ul></div>
      <div><h2>{labels.documents}</h2><ul className="scheme-legal-list">{info.documents.map(item=><li key={item}>{item}</li>)}</ul></div>
      <div><h2>{labels.process}</h2><ol className="scheme-legal-list">{info.process.map(item=><li key={item}>{item}</li>)}</ol></div>
      <div className="official-link-card scheme-official-card"><div><h2>{labels.official}</h2><p className="scheme-legal-note">{info.note}</p><div className="scheme-source-list">{info.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}<ArrowRight size={14}/></a>)}</div></div></div>
    </div>
  </section>
}

function renderMessage(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.split(urlRegex).map((part, i) => {
    if (/^https?:\/\//i.test(part)) {
      return <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{color:"#2e7d32",textDecoration:"underline"}}>{part}</a>;
    }
    return <span key={i}>{part}</span>;
  });
}

function Voice({t}){
  const languageMap = {
    English: { key: "english", speech: "en-IN" },
    Marathi: { key: "marathi", speech: "mr-IN" },
    Hindi: { key: "hindi", speech: "hi-IN" },
    Kannada: { key: "kannada", speech: "kn-IN" },
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
            {Object.keys(languageMap).map(name => <option key={name} value={name}>{name}</option>)}
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
            <p>{renderMessage(m.text)}</p>
            {m.role === "assistant" && <button className="voice-speak" onClick={()=>speak(m.text)}><Volume2 size={14}/> Speak</button>}
          </div>)}
        </div>}
      </div>
    </div>
  </section>
}

const ELIGIBILITY_COPY = {
  English:{intro:"Answer a few questions about your farm to find schemes that may be relevant to you.",assurance:"This check is preliminary guidance, not an official eligibility decision.",formIntro:"Share your location and farming details to get started.",required:"Required for matching",location:"Location",state:"State",statePlaceholder:"Enter your state",stateHelp:"Scheme availability can vary by state.",farmerType:"Farmer type",farmerTypePlaceholder:"Select farmer type",farmerTypes:{"Landowner":"Landowner","Owner cultivator":"Owner cultivator","Tenant farmer":"Tenant farmer","Sharecropper":"Sharecropper","Cultivator":"Cultivator","Farmer":"Farmer"},landQuestion:"Do you own agricultural land?",cultivate:"Do you currently cultivate agricultural land?",crop:"Crop (optional)",cropPlaceholder:"e.g. rice, cotton or wheat",cropHelp:"Helps identify crop-related support.",cropDamage:"Has your crop been damaged?",additional:"Additional scheme checks",taxQuestion:"Are you an income-tax payer?",taxHelp:"Used to check PM-KISAN conditions.",exclusion:"Does another PM-KISAN exclusion apply?",exclusionHelp:"For example, specified government service, constitutional office, or a registered profession.",select:"Select an answer",yes:"Yes",no:"No",submitNote:"Your answers are used to show preliminary scheme matches only.",checking:"Checking...",howWorks:"How it works",share:"Share your details",shareHelp:"Tell us about your location and farming activity.",review:"Review possible matches",reviewHelp:"We compare your answers with available scheme criteria.",confirm:"Confirm with the source",confirmHelp:"Check current requirements with the official department.",important:"Important",finalDecision:"Final eligibility is decided by the relevant scheme authority. This check is only preliminary guidance.",results:"Preliminary results",match:"potential match",matches:"potential matches",incomplete:"Complete your profile for a more accurate check",provide:"Please provide",noMatches:"No potential matches found",noMatchesHelp:"Based on these answers, no schemes matched the preliminary criteria. Verify your options with the official department.",potentiallyEligible:"Potentially eligible",noMatchStatus:"Not currently matched",official:"View official scheme information",error:"Could not check eligibility. Please try again."},
  Marathi:{intro:"आपल्या शेतीविषयी काही प्रश्नांची उत्तरे द्या आणि आपल्यासाठी संबंधित योजना पहा.",assurance:"ही प्राथमिक माहिती आहे; अधिकृत पात्रता निर्णय नाही.",formIntro:"सुरू करण्यासाठी आपले स्थान आणि शेतीची माहिती द्या.",required:"योजना जुळवण्यासाठी आवश्यक",location:"स्थान",state:"राज्य",statePlaceholder:"आपले राज्य निवडा",stateHelp:"योजनेची उपलब्धता राज्यानुसार बदलू शकते.",farmerType:"शेतकरी प्रकार",farmerTypePlaceholder:"शेतकरी प्रकार निवडा",farmerTypes:{"Landowner":"जमीनमालक","Owner cultivator":"मालक शेतकरी","Tenant farmer":"भाडेकरू शेतकरी","Sharecropper":"बटाईदार शेतकरी","Cultivator":"शेती करणारा","Farmer":"शेतकरी"},landQuestion:"तुमच्याकडे शेतीची जमीन आहे का?",cultivate:"तुम्ही सध्या शेतीची जमीन कसता का?",crop:"पीक (पर्यायी)",cropPlaceholder:"उदा. तांदूळ, कापूस किंवा गहू",cropHelp:"पिकाशी संबंधित सहाय्य तपासण्यासाठी.",cropDamage:"तुमच्या पिकाचे नुकसान झाले आहे का?",additional:"योजनेसाठी अतिरिक्त तपासणी",taxQuestion:"तुम्ही आयकरदाता आहात का?",taxHelp:"पीएम-किसानच्या अटी तपासण्यासाठी वापरले जाते.",exclusion:"पीएम-किसानची इतर कोणती अपात्रता लागू होते का?",exclusionHelp:"उदा. काही सरकारी सेवा, घटनात्मक पद किंवा नोंदणीकृत व्यवसाय.",select:"उत्तर निवडा",yes:"होय",no:"नाही",submitNote:"तुमच्या उत्तरांवरून केवळ प्राथमिक योजना जुळणी दाखवली जाते.",checking:"तपासत आहे...",howWorks:"ही प्रक्रिया कशी चालते",share:"तुमची माहिती द्या",shareHelp:"तुमचे स्थान आणि शेतीविषयी माहिती सांगा.",review:"संभाव्य योजना पहा",reviewHelp:"तुमच्या उत्तरांची उपलब्ध योजनांच्या निकषांशी तुलना केली जाते.",confirm:"अधिकृत स्रोताकडून खात्री करा",confirmHelp:"सध्याच्या अटी संबंधित अधिकृत विभागाकडून तपासा.",important:"महत्त्वाचे",finalDecision:"अंतिम पात्रता संबंधित योजना प्राधिकरण ठरवते. ही केवळ प्राथमिक माहिती आहे.",results:"प्राथमिक निकाल",match:"संभाव्य जुळणी",matches:"संभाव्य जुळण्या",incomplete:"अधिक अचूक तपासणीसाठी प्रोफाइल पूर्ण करा",provide:"कृपया ही माहिती द्या",noMatches:"संभाव्य जुळणी आढळली नाही",noMatchesHelp:"या उत्तरांनुसार प्राथमिक निकषांशी जुळणारी योजना आढळली नाही. खात्रीसाठी अधिकृत विभागाशी संपर्क साधा.",potentiallyEligible:"संभाव्यतः पात्र",noMatchStatus:"सध्या जुळणी नाही",official:"अधिकृत योजना माहिती पहा",error:"पात्रता तपासता आली नाही. कृपया पुन्हा प्रयत्न करा."},
  Hindi:{intro:"अपने खेत के बारे में कुछ सवालों के जवाब दें और अपने लिए उपयोगी योजनाएं देखें।",assurance:"यह प्रारंभिक मार्गदर्शन है, आधिकारिक पात्रता निर्णय नहीं।",formIntro:"शुरू करने के लिए अपना स्थान और खेती का विवरण दें।",required:"योजना मिलान के लिए आवश्यक",location:"स्थान",state:"राज्य",statePlaceholder:"अपना राज्य चुनें",stateHelp:"योजना की उपलब्धता राज्य के अनुसार बदल सकती है।",farmerType:"किसान का प्रकार",farmerTypePlaceholder:"किसान का प्रकार चुनें",farmerTypes:{"Landowner":"भूमि मालिक","Owner cultivator":"स्वयं खेती करने वाला","Tenant farmer":"किरायेदार किसान","Sharecropper":"बटाईदार किसान","Cultivator":"कृषक","Farmer":"किसान"},landQuestion:"क्या आपके पास कृषि भूमि है?",cultivate:"क्या आप वर्तमान में कृषि भूमि पर खेती करते हैं?",crop:"फसल (वैकल्पिक)",cropPlaceholder:"जैसे धान, कपास या गेहूं",cropHelp:"फसल संबंधी सहायता जांचने के लिए।",cropDamage:"क्या आपकी फसल को नुकसान हुआ है?",additional:"योजना से जुड़ी अतिरिक्त जांच",taxQuestion:"क्या आप आयकरदाता हैं?",taxHelp:"पीएम-किसान की शर्तें जांचने के लिए।",exclusion:"क्या पीएम-किसान की कोई अन्य अपात्रता लागू होती है?",exclusionHelp:"उदाहरण: निर्दिष्ट सरकारी सेवा, संवैधानिक पद या पंजीकृत पेशा।",select:"उत्तर चुनें",yes:"हाँ",no:"नहीं",submitNote:"आपके उत्तरों से केवल प्रारंभिक योजना मिलान दिखाया जाता है।",checking:"जांच हो रही है...",howWorks:"यह कैसे काम करता है",share:"अपना विवरण दें",shareHelp:"अपने स्थान और खेती की जानकारी बताएं।",review:"संभावित योजनाएं देखें",reviewHelp:"आपके उत्तरों की उपलब्ध योजना मानदंडों से तुलना की जाती है।",confirm:"आधिकारिक स्रोत से पुष्टि करें",confirmHelp:"वर्तमान आवश्यकताएं संबंधित आधिकारिक विभाग से जांचें।",important:"महत्वपूर्ण",finalDecision:"अंतिम पात्रता संबंधित योजना प्राधिकरण तय करता है। यह केवल प्रारंभिक मार्गदर्शन है।",results:"प्रारंभिक परिणाम",match:"संभावित योजना",matches:"संभावित योजनाएं",incomplete:"अधिक सटीक जांच के लिए अपनी प्रोफ़ाइल पूरी करें",provide:"कृपया यह जानकारी दें",noMatches:"कोई संभावित योजना नहीं मिली",noMatchesHelp:"इन उत्तरों के आधार पर प्रारंभिक मानदंडों से मेल खाने वाली योजना नहीं मिली। पुष्टि के लिए आधिकारिक विभाग से संपर्क करें।",potentiallyEligible:"संभावित रूप से पात्र",noMatchStatus:"अभी मेल नहीं मिला",official:"आधिकारिक योजना जानकारी देखें",error:"पात्रता जांच नहीं हो सकी। कृपया फिर से प्रयास करें।"},
  Kannada:{intro:"ನಿಮ್ಮ ಕೃಷಿಗೆ ಸಂಬಂಧಿಸಿದ ಕೆಲವು ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ, ನಿಮಗೆ ಹೊಂದುವ ಯೋಜನೆಗಳನ್ನು ಕಂಡುಕೊಳ್ಳಿ.",assurance:"ಇದು ಪ್ರಾಥಮಿಕ ಮಾರ್ಗದರ್ಶನ ಮಾತ್ರ; ಅಧಿಕೃತ ಅರ್ಹತಾ ನಿರ್ಧಾರವಲ್ಲ.",formIntro:"ಪ್ರಾರಂಭಿಸಲು ನಿಮ್ಮ ಸ್ಥಳ ಮತ್ತು ಕೃಷಿ ವಿವರಗಳನ್ನು ನೀಡಿ.",required:"ಯೋಜನೆ ಹೊಂದಾಣಿಕೆಗೆ ಅಗತ್ಯ",location:"ಸ್ಥಳ",state:"ರಾಜ್ಯ",statePlaceholder:"ನಿಮ್ಮ ರಾಜ್ಯವನ್ನು ನಮೂದಿಸಿ",stateHelp:"ಯೋಜನೆಯ ಲಭ್ಯತೆ ರಾಜ್ಯಾನುಸಾರ ಬದಲಾಗಬಹುದು.",farmerType:"ರೈತರ ಪ್ರಕಾರ",farmerTypePlaceholder:"ರೈತರ ಪ್ರಕಾರ ಆಯ್ಕೆಮಾಡಿ",farmerTypes:{"Landowner":"ಭೂಮಾಲೀಕ","Owner cultivator":"ಮಾಲೀಕ ಕೃಷಿಕ","Tenant farmer":"ಬಾಡಿಗೆ ರೈತ","Sharecropper":"ಪಾಲುದಾರ ರೈತ","Cultivator":"ಕೃಷಿಕ","Farmer":"ರೈತ"},landQuestion:"ನಿಮ್ಮ ಬಳಿ ಕೃಷಿ ಭೂಮಿ ಇದೆಯೇ?",cultivate:"ನೀವು ಈಗ ಕೃಷಿ ಭೂಮಿಯನ್ನು ಬೆಳೆಸುತ್ತಿದ್ದೀರಾ?",crop:"ಬೆಳೆ (ಐಚ್ಛಿಕ)",cropPlaceholder:"ಉದಾ. ಅಕ್ಕಿ, ಹತ್ತಿ ಅಥವಾ ಗೋಧಿ",cropHelp:"ಬೆಳೆ ಸಂಬಂಧಿತ ನೆರವನ್ನು ಗುರುತಿಸಲು.",cropDamage:"ನಿಮ್ಮ ಬೆಳೆಗೆ ಹಾನಿಯಾಗಿದೆಯೇ?",additional:"ಹೆಚ್ಚುವರಿ ಯೋಜನಾ ಪರಿಶೀಲನೆಗಳು",taxQuestion:"ನೀವು ಆದಾಯ ತೆರಿಗೆದಾರರೇ?",taxHelp:"ಪಿಎಂ-ಕಿಸಾನ್ ನಿಯಮಗಳನ್ನು ಪರಿಶೀಲಿಸಲು.",exclusion:"ಪಿಎಂ-ಕಿಸಾನ್‌ನ ಬೇರೆ ಅನರ್ಹತಾ ನಿಯಮ ಅನ್ವಯಿಸುತ್ತದೆಯೇ?",exclusionHelp:"ಉದಾಹರಣೆ: ನಿರ್ದಿಷ್ಟ ಸರ್ಕಾರಿ ಸೇವೆ, ಸಂವಿಧಾನಾತ್ಮಕ ಹುದ್ದೆ ಅಥವಾ ನೋಂದಾಯಿತ ವೃತ್ತಿ.",select:"ಉತ್ತರ ಆಯ್ಕೆಮಾಡಿ",yes:"ಹೌದು",no:"ಇಲ್ಲ",submitNote:"ನಿಮ್ಮ ಉತ್ತರಗಳಿಂದ ಪ್ರಾಥಮಿಕ ಯೋಜನಾ ಹೊಂದಾಣಿಕೆಗಳನ್ನು ಮಾತ್ರ ತೋರಿಸಲಾಗುತ್ತದೆ.",checking:"ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",howWorks:"ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ",share:"ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನೀಡಿ",shareHelp:"ನಿಮ್ಮ ಸ್ಥಳ ಮತ್ತು ಕೃಷಿ ಚಟುವಟಿಕೆಯ ಬಗ್ಗೆ ತಿಳಿಸಿ.",review:"ಸಂಭಾವ್ಯ ಹೊಂದಾಣಿಕೆಗಳನ್ನು ನೋಡಿ",reviewHelp:"ನಿಮ್ಮ ಉತ್ತರಗಳನ್ನು ಲಭ್ಯ ಯೋಜನೆಗಳ ಮಾನದಂಡಗಳೊಂದಿಗೆ ಹೋಲಿಸಲಾಗುತ್ತದೆ.",confirm:"ಅಧಿಕೃತ ಮೂಲದಿಂದ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ",confirmHelp:"ಪ್ರಸ್ತುತ ಅಗತ್ಯಗಳನ್ನು ಅಧಿಕೃತ ಇಲಾಖೆಯಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.",important:"ಮುಖ್ಯ",finalDecision:"ಅಂತಿಮ ಅರ್ಹತೆಯನ್ನು ಸಂಬಂಧಿತ ಯೋಜನಾ ಪ್ರಾಧಿಕಾರ ನಿರ್ಧರಿಸುತ್ತದೆ. ಇದು ಪ್ರಾಥಮಿಕ ಮಾರ್ಗದರ್ಶನ ಮಾತ್ರ.",results:"ಪ್ರಾಥಮಿಕ ಫಲಿತಾಂಶಗಳು",match:"ಸಂಭಾವ್ಯ ಹೊಂದಾಣಿಕೆ",matches:"ಸಂಭಾವ್ಯ ಹೊಂದಾಣಿಕೆಗಳು",incomplete:"ನಿಖರ ಪರಿಶೀಲನೆಗಾಗಿ ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ",provide:"ದಯವಿಟ್ಟು ಈ ವಿವರಗಳನ್ನು ನೀಡಿ",noMatches:"ಸಂಭಾವ್ಯ ಹೊಂದಾಣಿಕೆ ಕಂಡುಬಂದಿಲ್ಲ",noMatchesHelp:"ಈ ಉತ್ತರಗಳ ಆಧಾರದಲ್ಲಿ ಪ್ರಾಥಮಿಕ ಮಾನದಂಡಗಳಿಗೆ ಹೊಂದುವ ಯೋಜನೆ ಕಂಡುಬಂದಿಲ್ಲ. ಖಚಿತಪಡಿಸಲು ಅಧಿಕೃತ ಇಲಾಖೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ.",potentiallyEligible:"ಸಂಭಾವ್ಯವಾಗಿ ಅರ್ಹ",noMatchStatus:"ಪ್ರಸ್ತುತ ಹೊಂದಾಣಿಕೆ ಇಲ್ಲ",official:"ಅಧಿಕೃತ ಯೋಜನಾ ಮಾಹಿತಿ ನೋಡಿ",error:"ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಲಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."}
};

function Eligibility({t,lang}){
  const copy=ELIGIBILITY_COPY[lang]||ELIGIBILITY_COPY.English;
  const [form,setForm]=useState({
    state:"",
    land_owner:"",
    cultivates_land:"",
    farmer_type:"",
    income_tax_payer:"",
    pm_kisan_exclusion:"",
    crop:"",
    crop_damage:""
  });
  const [result,setResult]=useState(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  const update=(field,value)=>setForm(current=>({...current,[field]:value}));
  const submit=async()=>{
    setError("");
    setLoading(true);
    try{
      const profile={
        ...form,
        land_owner:form.land_owner===""?null:form.land_owner==="true",
        cultivates_land:form.cultivates_land===""?null:form.cultivates_land==="true",
        income_tax_payer:form.income_tax_payer===""?null:form.income_tax_payer==="true",
        pm_kisan_exclusion:form.pm_kisan_exclusion===""?null:form.pm_kisan_exclusion==="true",
        crop_damage:form.crop_damage===""?null:form.crop_damage==="true"
      };
      setResult(await api.checkEligibility(profile));
    }catch(err){
      setError(err.message || copy.error);
    }finally{
      setLoading(false);
    }
  };

  const yesNoOptions=<><option value="">{copy.select}</option><option value="true">{copy.yes}</option><option value="false">{copy.no}</option></>;
  const eligibleSchemes=result?.eligible_schemes || result?.results || [];
  const allResults=[...eligibleSchemes,...(result?.not_eligible_schemes || [])];

  return <section className="container page">
    <header className="eligibility-hero">
      <div className="eligibility-hero-copy">
        <span className="eyebrow green">{t.check}</span>
        <h1>{t.check}</h1>
        <p>{copy.intro}</p>
        <div className="eligibility-assurance"><ShieldCheck size={17}/><span>{copy.assurance}</span></div>
      </div>
      <div className="eligibility-hero-art" aria-hidden="true"><img src={images.field} alt=""/></div>
    </header>
    <div className="eligibility-layout">
      <main className="eligibility-main">
        <div className="eligibility-form-card">
          <div className="eligibility-card-heading">
            <span className="eligibility-step-number">01</span>
            <div><h2>{copy.farmerType}</h2><p>{copy.formIntro}</p></div>
            <span className="eligibility-required-note"><b>*</b> {copy.required}</span>
          </div>
          <div className="eligibility-form">
            <fieldset className="eligibility-fieldset">
              <legend>{copy.location} / {copy.farm}</legend>
              <div className="eligibility-field-grid">
                <label className="eligibility-field"><span>{copy.state} <b>*</b></span><input value={form.state} onChange={e=>update("state",e.target.value)} autoComplete="address-level1" placeholder={copy.statePlaceholder} required/><small>{copy.stateHelp}</small></label>
                <label className="eligibility-field"><span>{copy.farmerType} <b>*</b></span><select value={form.farmer_type} onChange={e=>update("farmer_type",e.target.value)}><option value="">{copy.farmerTypePlaceholder}</option>{Object.entries(copy.farmerTypes).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
                <label className="eligibility-field"><span>{copy.landQuestion} <b>*</b></span><select value={form.land_owner} onChange={e=>update("land_owner",e.target.value)}>{yesNoOptions}</select></label>
                <label className="eligibility-field"><span>{copy.cultivate} <b>*</b></span><select value={form.cultivates_land} onChange={e=>update("cultivates_land",e.target.value)}>{yesNoOptions}</select></label>
                <label className="eligibility-field"><span>{copy.crop}</span><input value={form.crop} onChange={e=>update("crop",e.target.value)} maxLength={40} placeholder={copy.cropPlaceholder}/><small>{copy.cropHelp}</small></label>
                <label className="eligibility-field"><span>{copy.cropDamage}</span><select value={form.crop_damage} onChange={e=>update("crop_damage",e.target.value)}>{yesNoOptions}</select></label>
              </div>
            </fieldset>
            <fieldset className="eligibility-fieldset">
              <legend>{copy.additional}</legend>
              <div className="eligibility-field-grid">
                <label className="eligibility-field"><span>{copy.taxQuestion}</span><select value={form.income_tax_payer} onChange={e=>update("income_tax_payer",e.target.value)}>{yesNoOptions}</select><small>{copy.taxHelp}</small></label>
                <label className="eligibility-field"><span>{copy.exclusion}</span><select value={form.pm_kisan_exclusion} onChange={e=>update("pm_kisan_exclusion",e.target.value)}>{yesNoOptions}</select><small>{copy.exclusionHelp}</small></label>
              </div>
            </fieldset>
            {error&&<div className="eligibility-error" role="alert">{error}</div>}
            <div className="eligibility-form-footer"><p><ShieldCheck size={17}/>{copy.submitNote}</p><button className="primary" onClick={submit} disabled={loading}>{loading?copy.checking:t.check}<ArrowRight size={16}/></button></div>
          </div>
        </div>
        <div className="eligibility-visual"><img src={images.farmer} alt="Farmer checking scheme information"/><div className="result"><CheckCircle2/><h2>{t.oneCheck}</h2><p>{t.compareAll}</p></div></div>
      </main>
      <aside className="eligibility-side-card">
        <span className="eligibility-side-icon"><ShieldCheck size={21}/></span><h2>{copy.howWorks}</h2>
        <ol><li><span>1</span><div><b>{copy.share}</b><p>{copy.shareHelp}</p></div></li><li><span>2</span><div><b>{copy.review}</b><p>{copy.reviewHelp}</p></div></li><li><span>3</span><div><b>{copy.confirm}</b><p>{copy.confirmHelp}</p></div></li></ol>
        <div className="eligibility-side-note"><b>{copy.important}</b><p>{copy.finalDecision}</p></div>
      </aside>
    </div>
    {result&&<section className="eligibility-results" aria-live="polite">
      <div className="eligibility-results-heading"><div><span className="eyebrow green">{t.result}</span><h2>{copy.results}</h2></div>{eligibleSchemes.length>0&&<span className="eligibility-match-count">{eligibleSchemes.length} {eligibleSchemes.length===1?copy.match:copy.matches}</span>}</div>
      {result.notice&&<p className="eligibility-result-notice">{result.notice}</p>}
      {result.missing_information?.length>0&&<div className="eligibility-incomplete" role="status"><b>{copy.incomplete}</b><span>{copy.provide}: {result.missing_information.join(", ").replaceAll("_"," ")}.</span></div>}
      {allResults.length===0&&result.missing_information?.length===0&&<div className="eligibility-empty"><ShieldCheck size={23}/><div><b>{copy.noMatches}</b><p>{copy.noMatchesHelp}</p></div></div>}
      <div className="eligibility-result-list">{allResults.map(item=>{const potential=item.status==="Potentially eligible";return <article className={`eligibility-result-card ${potential?"potential":"not-match"}`} key={item.scheme_id}>
        <div className="eligibility-result-top"><div><span className="eligibility-category">{item.category}</span><h3>{item.scheme}</h3></div><span className={`eligibility-status ${potential?"positive":"neutral"}`}><CheckCircle2 size={15}/>{potential?copy.potentiallyEligible:copy.noMatchStatus}</span></div>
        {item.benefits&&<p className="eligibility-benefit">{item.benefits}</p>}
        {item.reasons?.length>0&&<ul className="eligibility-reasons">{item.reasons.map(reason=><li key={reason}>{reason}</li>)}</ul>}
        {item.warnings?.length>0&&<ul className="eligibility-warnings">{item.warnings.map(warning=><li key={warning}>{warning}</li>)}</ul>}
        {item.application_link&&<a className="eligibility-official-link" href={item.application_link} target="_blank" rel="noreferrer">{copy.official}<ArrowRight size={15}/></a>}
      </article>})}</div>
    </section>}
  </section>
}

function Documents({t}){
  const docs=t.docLabels||["Aadhaar Card","Land Record / 7/12 or equivalent","Bank Passbook / Account Details","Passport Size Photo"];
  const desc=t.docDescriptions||["Identity proof","Proof of land ownership","For DBT","Recent photo"];
  const [files,setFiles]=useState({});
  const [errors,setErrors]=useState({});
  const preparedCount=Object.keys(files).length;
  const handleFile=(index,event)=>{
    const file=event.target.files?.[0];
    event.target.value="";
    if(!file)return;
    if(!["application/pdf","image/jpeg","image/png"].includes(file.type)){
      setErrors(current=>({...current,[index]:"Choose a PDF, JPG, or PNG file."}));
      return;
    }
    if(file.size>10*1024*1024){
      setErrors(current=>({...current,[index]:"File must be 10 MB or smaller."}));
      return;
    }
    setFiles(current=>({...current,[index]:file}));
    setErrors(current=>({...current,[index]:""}));
  };
  const removeFile=index=>{
    setFiles(current=>{const next={...current};delete next[index];return next});
    setErrors(current=>({...current,[index]:""}));
  };
  const formatSize=size=>size<1024*1024?`${Math.max(1,Math.round(size/1024))} KB`:`${(size/(1024*1024)).toFixed(1)} MB`;

  return <section className="container page documents-page">
    <header className="documents-hero">
      <div><span className="eyebrow green">{t.appReady}</span><h1>{t.documentsTitle}</h1><p>{t.documentsText}</p></div>
      <div className="documents-progress-summary"><span>{preparedCount}<small> / {docs.length}</small></span><b>documents prepared</b></div>
    </header>
    <div className="documents-layout">
      <main className="documents-main">
        <div className="documents-progress-card">
          <div><b>Your document checklist</b><span>{preparedCount} of {docs.length} files selected</span></div>
          <div className="documents-progress-track" role="progressbar" aria-label="Documents prepared" aria-valuemin="0" aria-valuemax={docs.length} aria-valuenow={preparedCount}><span style={{width:`${docs.length?preparedCount/docs.length*100:0}%`}}/></div>
        </div>
        <div className="documents-list">
          {docs.map((document,index)=>{
            const file=files[index];
            return <article className={`document-upload-card ${file?"is-prepared":""}`} key={document}>
              <span className="document-upload-icon"><FileText size={20}/></span>
              <div className="document-upload-info">
                <div className="document-upload-title"><h2>{document}</h2><span>{index<3?"Commonly requested":"Optional"}</span></div>
                <p>{desc[index]}</p>
                {file&&<div className="document-selected-file"><CheckCircle2 size={15}/><span>{file.name}</span><small>{formatSize(file.size)}</small></div>}
                {errors[index]&&<p className="document-file-error" role="alert">{errors[index]}</p>}
              </div>
              <div className="document-upload-actions">
                <span className={`document-file-status ${file?"ready":"needed"}`}>{file?"Selected on this device":"Not selected"}</span>
                <label className="document-choose-file"><Upload size={15}/><span>{file?"Replace file":"Choose file"}</span><input type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" aria-label={`Choose ${document}`} onChange={event=>handleFile(index,event)}/></label>
                {file&&<button className="document-remove-file" type="button" onClick={()=>removeFile(index)}>Remove</button>}
              </div>
            </article>
          })}
        </div>
        <div className="documents-local-note"><ShieldCheck size={18}/><p><b>Files stay on this device.</b> This page can help you prepare a checklist, but there is no document upload service connected yet. Selected files are not sent to AgriVoice or saved to your account.</p></div>
      </main>
      <aside className="documents-help-panel">
        <span className="documents-help-icon"><HelpCircle size={21}/></span><h2>Before you choose files</h2>
        <ul><li>Use a clear scan or photo with all details visible.</li><li>Accepted formats: PDF, JPG, and PNG.</li><li>Maximum file size: 10 MB per document.</li><li>Check the official scheme portal for its exact requirements.</li></ul>
        <div className="documents-help-callout"><b>{t.needHelp}</b><p>{t.supportTeam}</p><button className="outline" type="button">{t.contactSupport}</button></div>
      </aside>
    </div>
  </section>
}

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
