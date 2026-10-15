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
  {id:1,backendId:"S001",name:"PM Kisan Samman Nidhi", category:"Financial Support", desc:"₹6,000 annual income support for eligible landholding farmer families.", image:images.farmer},
  {id:2,backendId:"S002",name:"Pradhan Mantri Fasal Bima Yojana", category:"Insurance", desc:"Insurance for notified crops, areas and seasons under current scheme rules.", image:images.field},
  {id:3,backendId:"S003",name:"Kisan Credit Card (KCC)", category:"Credit", desc:"Bank credit for cultivation and eligible agricultural or allied needs.", image:images.crop},
  {id:4,backendId:"S004",name:"Soil Health Card Scheme", category:"Soil & Crop Management", desc:"Soil-test information and nutrient-management recommendations.", image:images.plant}
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
  मराठी: {
    S001: {
      summary:"पीएम-किसान ही केंद्र सरकारची योजना असून, पात्र जमीनधारक शेतकरी कुटुंबांना दरवर्षी ₹6,000 तीन समान हप्त्यांत थेट बँक खात्यात दिले जातात. लाभार्थी कुटुंबांची ओळख व पडताळणी राज्य किंवा केंद्रशासित प्रदेश प्रशासन करते.",
      benefits:["प्रति पात्र शेतकरी कुटुंब दरवर्षी ₹6,000, तीन समान हप्त्यांत.","योजनेतील शेतकरी कुटुंबात पती, पत्नी आणि अल्पवयीन मुले यांचा समावेश होतो."],
      eligibility:["अर्जदार योजनेच्या निकषांनुसार पात्र जमीनधारक शेतकरी कुटुंबाचा सदस्य असावा आणि संबंधित राज्य/केंद्रशासित प्रदेशाकडून त्याची पडताळणी झालेली असावी.","संस्थात्मक जमीनधारक आणि काही उच्च आर्थिक स्थितीचे गट अपात्र असू शकतात. यामध्ये मागील निर्धारण वर्षातील आयकरदाते, काही सार्वजनिक पदाधिकारी/कर्मचारी, काही निवृत्तीवेतनधारक आणि नोंदणीकृत व्यावसायिकांचा समावेश होऊ शकतो; अधिकृत अपवाद व नियम लागू होतात.","नोंदणीकृत लाभार्थ्यांसाठी eKYC अनिवार्य आहे. सद्यस्थिती आणि पडताळणीच्या अटी अधिकृत पोर्टलवर तपासा."],
      documents:["पोर्टलने मागितलेली आधार/ओळख व eKYC माहिती.","राज्य किंवा केंद्रशासित प्रदेशातील जमीनधारणा नोंदी.","लाभ हस्तांतरणासाठी बँक खात्याची माहिती."],
      process:["अधिकृत पोर्टलवरील नवीन शेतकरी नोंदणी आणि लाभार्थी स्थिती सेवा वापरा.","आवश्यक eKYC पूर्ण करा. नोंदींमध्ये त्रुटी असल्यास अधिकृत प्रक्रियेनुसार किंवा संबंधित राज्य/केंद्रशासित प्रदेशाच्या नोडल कार्यालयामार्फत दुरुस्ती करा."],
      note:"ही माहिती केवळ सारांश आहे; अंतिम पात्रता ठरवत नाही. अधिकृत पीएम-किसान मार्गदर्शक तत्त्वे, राज्य/केंद्रशासित प्रदेशातील जमीन नोंदी, कुटुंबाची व्याख्या आणि अपात्रता नियम लागू होतात.",
      sources:["पीएम-किसान अधिकृत पोर्टल व योजना माहिती","पीएम-किसान सुधारित वारंवार विचारले जाणारे प्रश्न (अधिकृत PDF)"]
    },
    S002: {
      summary:"पीएमएफबीवाय अंतर्गत अधिसूचित क्षेत्रात, अधिसूचित हंगामात घेतलेल्या अधिसूचित पिकांसाठी पीक विमा उपलब्ध होतो. विमायोग्य हितसंबंध, जोखीम, विमा रक्कम, हप्ता आणि अर्जाच्या तारखा संबंधित राज्य/केंद्रशासित प्रदेशाची अधिसूचना व योजनेच्या मार्गदर्शक तत्त्वांनुसार ठरतात.",
      benefits:["सध्याच्या नियमांनुसार विशिष्ट उत्पादन घट आणि इतर अधिसूचित परिस्थितींमध्ये संरक्षण मिळू शकते.","संरक्षण पीक, क्षेत्र आणि हंगामानुसार बदलते; दावा मंजुरी अधिसूचित जोखीम, वेळेवर अहवाल आणि मूल्यांकनावर अवलंबून असते."],
      eligibility:["अधिसूचित क्षेत्रात अधिसूचित पीक घेणारे आणि त्या पिकात विमायोग्य हितसंबंध असलेले शेतकरी पात्र असू शकतात.","राज्य/केंद्रशासित प्रदेशाच्या नियमांनुसार आणि स्वीकारार्ह लागवड किंवा विमायोग्य हिताच्या पुराव्यासह भाडेकरू व बटाईदार शेतकरी पात्र असू शकतात.","अर्जाची अंतिम तारीख, विमा हप्ता आणि पुरावे हंगाम व अधिसूचनेनुसार बदलतात. केवळ पीक नुकसान झाल्याने दावा मंजूर होत नाही."],
      documents:["पीक, हंगाम, अधिसूचित क्षेत्र आणि लागवड क्षेत्राची माहिती.","संबंधित हंगाम व राज्यासाठी स्वीकारार्ह लागवड/विमायोग्य हिताचा पुरावा.","अर्ज माध्यमाने मागितलेली ओळख व बँक माहिती."],
      process:["अर्जापूर्वी सध्याची पीक, क्षेत्र, हंगाम अधिसूचना आणि अंतिम तारीख तपासा.","अधिकृत पोर्टल किंवा अधिसूचित बँक, विमा कंपनी, कॉमन सर्व्हिस सेंटर अथवा राज्याच्या माध्यमातून अर्ज करा आणि पोच जतन करा.","नुकसान कळवताना सद्य अधिसूचना व अधिकृत दावा सूचनांचे त्वरित पालन करा."],
      note:"निश्चित हप्ता, अंतिम तारीख किंवा सर्वत्र लागू पीक यादी गृहीत धरू नका. संबंधित राज्य/केंद्रशासित प्रदेशाची सध्याची अधिसूचना आणि कार्यपद्धतीचे नियम लागू होतात.",
      sources:["पीएमएफबीवाय अधिकृत पोर्टल","२०२३ कार्यपद्धती मार्गदर्शक तत्त्वे (पीएमएफबीवाय पोर्टलवरील दुवा)"]
    },
    S003: {
      summary:"किसान क्रेडिट कार्ड ही बँकांमार्फत दिली जाणारी पतसुविधा आहे. शेती आणि पात्र कृषी किंवा संलग्न गरजांसाठी वेळेवर कर्ज उपलब्ध करून देणे हा तिचा उद्देश आहे. अर्जाचे मूल्यांकन आणि व्यवस्थापन लागू केसीसी नियमांनुसार बँक करते.",
      benefits:["पीक उत्पादन, काढणीनंतरचे खर्च, विक्री, पात्र घरगुती गरजा, शेती/संलग्न व्यवसायासाठी खेळते भांडवल आणि कृषी गुंतवणूक यांचा समावेश होऊ शकतो.","कार्डमुळे मंजूर कर्ज वापरता येते; हे अनुदान नाही आणि कर्ज मंजुरीची हमी नाही."],
      eligibility:["अधिकृत myScheme माहितीनुसार वैयक्तिक/संयुक्त जमीनधारक, भाडेकरू, तोंडी भाडेपट्टाधारक आणि बटाईदार शेतकरी अर्ज करू शकतात.","भाडेकरू किंवा बटाईदारांचा समावेश असलेले पात्र शेतकरी गट, स्वयं-सहायता गट किंवा संयुक्त दायित्व गटही अर्ज करू शकतात.","सहभागी बँक पात्रता तपासते आणि सध्याच्या नियमांनुसार मर्यादा, तारण, कागदपत्रे, व्याज व परतफेड ठरवते."],
      documents:["बँकेने मागितलेला केसीसी अर्ज आणि ओळख/पत्ता पुरावा.","बँकेला मान्य असलेला जमीनधारणा, भाडेपट्टा, बटाई किंवा लागवडीचा पुरावा.","मागितलेल्या पीक किंवा पात्र संलग्न व्यवसायाच्या कर्जासाठी आवश्यक तपशील."],
      process:["सहभागी बँकेत किंवा त्या बँकेने समर्थित डिजिटल माध्यमातून अर्ज करा.","सध्याच्या अटी आणि आवश्यक पुरावे बँकेकडून निश्चित करा; मंजुरी व कर्जमर्यादा बँकेच्या तपासणीवर अवलंबून असते."],
      note:"व्याज सवलत, कर्जमर्यादा, तारणाची मर्यादा आणि परतफेडीच्या अटी बदलू शकतात. सध्याच्या अटी कर्जदात्या बँकेकडून तपासा; येथे कोणताही निश्चित दर किंवा कर्जरक्कम दिलेली नाही.",
      sources:["भारत सरकारच्या myScheme वरील किसान क्रेडिट कार्ड योजना"]
    },
    S004: {
      summary:"मृदा आरोग्य कार्ड उपक्रम माती परीक्षणाची माहिती आणि पीकनिहाय पोषक व्यवस्थापनाच्या शिफारसी देतो. माती सुधारणा व खत वापराबाबत निर्णय घेण्यास मदत करणे हा उद्देश आहे. ही परीक्षण आणि सल्ला सेवा आहे; रोख लाभ योजना नाही.",
      benefits:["मातीचा अहवाल मातीचे गुणधर्म व पोषक स्थिती समजून पीक आणि खत व्यवस्थापनाचे निर्णय घेण्यास मदत करतो.","नमुना संकलन, परीक्षण आणि अहवालाची उपलब्धता संबंधित राज्य/केंद्रशासित प्रदेशाची कृषी यंत्रणा व मृदा परीक्षण प्रयोगशाळा व्यवस्थापित करतात."],
      eligibility:["मातीचा नमुना घेऊन परीक्षण करता येणाऱ्या शेतजमिनींसाठी ही सेवा आहे.","स्थानिक कृषी विभाग आणि परीक्षण केंद्रे उपलब्धता, नमुना संकलन व अहवालाची प्रक्रिया ठरवतात; आपल्या भागातील प्रक्रियेसाठी त्यांच्याशी संपर्क साधा."],
      documents:["नमुना ओळखण्यासाठी आणि अहवाल देण्यासाठी आवश्यक शेत/ठिकाणाची माहिती.","स्थानिक कृषी विभाग किंवा परीक्षण केंद्राने मागितलेली शेतकरी/जमिनीची माहिती."],
      process:["स्थानिक कृषी विभागाशी संपर्क साधा किंवा अधिकृत मृदा आरोग्य कार्ड पोर्टलवर उपलब्ध सेवा तपासा.","स्थानिक नमुना संकलन सूचनांचे पालन करा आणि अहवालातील पीक व पोषक शिफारसी पाहा."],
      note:"शिफारसी नमुना, शेत आणि पिकाच्या परिस्थितीनुसार असतात. अहवाल व स्थानिक कृषी तज्ज्ञांचा सल्ला घ्या; सेवा आणि प्रक्रिया राज्यानुसार बदलू शकते.",
      sources:["मृदा आरोग्य कार्ड पोर्टल (कृषी व शेतकरी कल्याण विभाग)"]
    }
  },
  हिंदी: {
    S001: {
      summary:"पीएम-किसान केंद्र सरकार की योजना है, जिसके तहत पात्र भूमि-धारक किसान परिवारों को हर वर्ष ₹6,000 की सहायता तीन समान किस्तों में सीधे बैंक खाते में दी जाती है। लाभार्थी परिवारों की पहचान और सत्यापन राज्य/केंद्रशासित प्रदेश प्रशासन करता है।",
      benefits:["प्रति पात्र किसान परिवार हर वर्ष ₹6,000, तीन समान किस्तों में।","योजना में किसान परिवार का अर्थ पति, पत्नी और नाबालिग बच्चे हैं।"],
      eligibility:["आवेदक योजना के नियमों के अनुसार पात्र भूमि-धारक किसान परिवार का सदस्य हो और संबंधित राज्य/केंद्रशासित प्रदेश से सत्यापित हो।","संस्थागत भूमि-धारक और कुछ उच्च आर्थिक स्थिति वाली श्रेणियां अपात्र हो सकती हैं। इनमें पिछले आकलन वर्ष के आयकरदाता, कुछ सार्वजनिक पदाधिकारी/कर्मचारी, कुछ पेंशनभोगी और पंजीकृत पेशेवर शामिल हो सकते हैं; आधिकारिक अपवाद और नियम लागू होंगे।","पंजीकृत लाभार्थियों के लिए eKYC अनिवार्य है। वर्तमान स्थिति और सत्यापन आवश्यकताएं आधिकारिक पोर्टल पर जांचें।"],
      documents:["पोर्टल द्वारा मांगी गई आधार/पहचान और eKYC जानकारी।","राज्य/केंद्रशासित प्रदेश के भूमि-अभिलेख।","लाभ हस्तांतरण के लिए बैंक खाते का विवरण।"],
      process:["आधिकारिक पोर्टल की नए किसान पंजीकरण और लाभार्थी स्थिति सेवाओं का उपयोग करें।","आवश्यक eKYC पूरा करें। अभिलेखों में त्रुटि हो तो आधिकारिक प्रक्रिया या संबंधित राज्य/केंद्रशासित प्रदेश के नोडल कार्यालय से सुधार कराएं।"],
      note:"यह केवल सारांश है, अंतिम पात्रता निर्णय नहीं। आधिकारिक पीएम-किसान दिशानिर्देश, राज्य/केंद्रशासित प्रदेश के भूमि-अभिलेख, परिवार की परिभाषा और अपात्रता नियम लागू होंगे।",
      sources:["पीएम-किसान आधिकारिक पोर्टल और योजना जानकारी","पीएम-किसान संशोधित अक्सर पूछे जाने वाले प्रश्न (आधिकारिक PDF)"]
    },
    S002: {
      summary:"पीएमएफबीवाई अधिसूचित क्षेत्र में अधिसूचित मौसम के दौरान उगाई गई अधिसूचित फसलों के लिए फसल बीमा प्रदान करती है। बीमा योग्य हित, कवर जोखिम, बीमित राशि, प्रीमियम और आवेदन की तारीखें संबंधित राज्य/केंद्रशासित प्रदेश की अधिसूचना और योजना दिशानिर्देशों से तय होती हैं।",
      benefits:["वर्तमान नियमों के तहत निर्दिष्ट उपज हानि और अन्य अधिसूचित परिस्थितियों में सुरक्षा मिल सकती है।","कवरेज फसल, क्षेत्र और मौसम पर निर्भर है; दावा अधिसूचित जोखिम, समय पर सूचना और मूल्यांकन पर निर्भर करता है।"],
      eligibility:["अधिसूचित क्षेत्र में अधिसूचित फसल उगाने और उसमें बीमा योग्य हित रखने वाले किसान पात्र हो सकते हैं।","राज्य/केंद्रशासित प्रदेश के नियमों और स्वीकार्य खेती/बीमा योग्य हित के प्रमाण के अधीन किरायेदार और बटाईदार किसान भी पात्र हो सकते हैं।","आवेदन की अंतिम तिथि, प्रीमियम और आवश्यक प्रमाण मौसम व अधिसूचना के अनुसार बदलते हैं। केवल फसल नुकसान से दावा स्वीकृत नहीं होता।"],
      documents:["फसल, मौसम, अधिसूचित क्षेत्र और बोए गए क्षेत्र का विवरण।","संबंधित राज्य और मौसम के लिए स्वीकार्य खेती/बीमा योग्य हित का प्रमाण।","आवेदन माध्यम द्वारा मांगी गई पहचान और बैंक जानकारी।"],
      process:["आवेदन से पहले वर्तमान फसल, क्षेत्र, मौसम अधिसूचना और अंतिम तिथि जांचें।","आधिकारिक पोर्टल या अधिसूचित बैंक, बीमाकर्ता, कॉमन सर्विस सेंटर अथवा राज्य माध्यम से आवेदन करें और रसीद संभालकर रखें।","नुकसान की सूचना देने के लिए वर्तमान अधिसूचना और आधिकारिक दावा निर्देशों का तुरंत पालन करें।"],
      note:"किसी निश्चित प्रीमियम, अंतिम तिथि या सभी जगह लागू फसल सूची पर भरोसा न करें। संबंधित राज्य/केंद्रशासित प्रदेश की वर्तमान अधिसूचना और परिचालन दिशानिर्देश लागू होंगे।",
      sources:["पीएमएफबीवाई आधिकारिक पोर्टल","2023 परिचालन दिशानिर्देश (पीएमएफबीवाई पोर्टल पर उपलब्ध)"]
    },
    S003: {
      summary:"किसान क्रेडिट कार्ड बैंकों द्वारा दी जाने वाली ऋण सुविधा है, जिसका उद्देश्य खेती और पात्र कृषि या संबंधित जरूरतों के लिए समय पर ऋण देना है। बैंक लागू केसीसी ढांचे के तहत आवेदन का मूल्यांकन और प्रबंधन करते हैं।",
      benefits:["फसल उत्पादन, कटाई के बाद के खर्च, विपणन, पात्र घरेलू जरूरतें, कृषि/संबद्ध गतिविधियों के लिए कार्यशील पूंजी और कृषि निवेश शामिल हो सकते हैं।","कार्ड स्वीकृत ऋण तक पहुंच देता है; यह अनुदान नहीं है और ऋण स्वीकृति की गारंटी नहीं देता।"],
      eligibility:["भारत सरकार की myScheme जानकारी में व्यक्तिगत/संयुक्त मालिक-किसान, किरायेदार, मौखिक पट्टेदार और बटाईदार किसान शामिल हैं।","किरायेदार या बटाईदार किसानों वाले पात्र किसान समूह, स्वयं सहायता समूह या संयुक्त देयता समूह भी आवेदन कर सकते हैं।","सहभागी बैंक पात्रता सत्यापित करता है और वर्तमान नियमों के अनुसार ऋण सीमा, सुरक्षा, दस्तावेज, ब्याज व पुनर्भुगतान तय करता है।"],
      documents:["बैंक द्वारा मांगा गया केसीसी आवेदन और पहचान/पते का प्रमाण।","बैंक द्वारा स्वीकार भूमि, किरायेदारी, पट्टे, बटाई या खेती का प्रमाण।","मांगी गई फसल या पात्र संबद्ध गतिविधि के ऋण से जुड़े विवरण।"],
      process:["सहभागी बैंक या उस बैंक द्वारा समर्थित डिजिटल माध्यम से आवेदन करें।","वर्तमान शर्तें और आवश्यक प्रमाण बैंक से तय करें; स्वीकृति और ऋण सीमा बैंक के मूल्यांकन पर निर्भर हैं।"],
      note:"ब्याज सहायता, ऋण सीमा, जमानत की सीमा और पुनर्भुगतान शर्तें बदल सकती हैं। वर्तमान शर्तें ऋणदाता बैंक से पुष्टि करें; यहां कोई निश्चित दर या ऋण राशि नहीं दी गई है।",
      sources:["भारत सरकार की myScheme पर किसान क्रेडिट कार्ड योजना"]
    },
    S004: {
      summary:"मृदा स्वास्थ्य कार्ड पहल मिट्टी जांच की जानकारी और फसल के अनुसार पोषक तत्व प्रबंधन की सलाह देती है, ताकि किसान मिट्टी सुधार और उर्वरक उपयोग के बारे में निर्णय ले सकें। यह जांच और सलाह सेवा है, नकद लाभ योजना नहीं।",
      benefits:["मिट्टी की रिपोर्ट उसके गुणों और पोषक स्थिति का आकलन कर फसल व पोषक प्रबंधन के निर्णयों में मदद करती है।","नमूना संग्रह, जांच और रिपोर्ट की व्यवस्था संबंधित राज्य/केंद्रशासित प्रदेश की कृषि प्रणाली और मिट्टी जांच प्रयोगशालाएं करती हैं।"],
      eligibility:["यह सेवा उन कृषि खेतों के लिए है जिनकी मिट्टी का नमूना लेकर जांच की जा सकती है।","स्थानीय कृषि विभाग और जांच केंद्र उपलब्धता, नमूना संग्रह और रिपोर्ट की प्रक्रिया तय करते हैं; अपने क्षेत्र की प्रक्रिया के लिए उनसे संपर्क करें।"],
      documents:["नमूने की पहचान और रिपोर्ट लौटाने के लिए खेत/स्थान का विवरण।","स्थानीय कृषि विभाग या जांच केंद्र द्वारा मांगी गई किसान/भूमि की जानकारी।"],
      process:["स्थानीय कृषि विभाग से संपर्क करें या आधिकारिक मृदा स्वास्थ्य कार्ड पोर्टल पर उपलब्ध सेवा देखें।","स्थानीय नमूना संग्रह निर्देशों का पालन करें और रिपोर्ट में दी गई फसल व पोषक तत्व संबंधी सलाह पढ़ें।"],
      note:"सलाह नमूने, खेत और फसल की स्थिति पर निर्भर करती है। रिपोर्ट और स्थानीय कृषि विशेषज्ञों की सलाह लें; उपलब्धता और प्रक्रिया राज्य के अनुसार बदल सकती है।",
      sources:["मृदा स्वास्थ्य कार्ड पोर्टल (कृषि एवं किसान कल्याण विभाग)"]
    }
  },
  कन्नड: {
    S001: {
      summary:"ಪಿಎಂ-ಕಿಸಾನ್ ಕೇಂದ್ರ ವಲಯದ ಯೋಜನೆಯಾಗಿದ್ದು, ಅರ್ಹ ಭೂಮಿ ಹೊಂದಿರುವ ರೈತ ಕುಟುಂಬಗಳಿಗೆ ವರ್ಷಕ್ಕೆ ₹6,000 ಅನ್ನು ಮೂರು ಸಮಾನ ಕಂತುಗಳಲ್ಲಿ ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ನೀಡುತ್ತದೆ. ಫಲಾನುಭವಿ ಕುಟುಂಬಗಳನ್ನು ರಾಜ್ಯ/ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶದ ಆಡಳಿತ ಗುರುತಿಸಿ ಪರಿಶೀಲಿಸುತ್ತದೆ.",
      benefits:["ಪ್ರತಿ ಅರ್ಹ ರೈತ ಕುಟುಂಬಕ್ಕೆ ವರ್ಷಕ್ಕೆ ₹6,000, ಮೂರು ಸಮಾನ ಕಂತುಗಳಲ್ಲಿ.","ಯೋಜನೆಯ ಪ್ರಕಾರ ರೈತ ಕುಟುಂಬದಲ್ಲಿ ಗಂಡ, ಹೆಂಡತಿ ಮತ್ತು ಅಪ್ರಾಪ್ತ ಮಕ್ಕಳು ಸೇರಿರುತ್ತಾರೆ."],
      eligibility:["ಅರ್ಜಿದಾರರು ಯೋಜನೆಯ ನಿಯಮಗಳ ಪ್ರಕಾರ ಅರ್ಹ ಭೂಮಿ ಹೊಂದಿರುವ ರೈತ ಕುಟುಂಬದ ಸದಸ್ಯರಾಗಿದ್ದು, ಸಂಬಂಧಿತ ರಾಜ್ಯ/ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶದಿಂದ ಪರಿಶೀಲನೆಗೊಂಡಿರಬೇಕು.","ಸಂಸ್ಥಾತ್ಮಕ ಭೂಮಾಲೀಕರು ಮತ್ತು ಕೆಲವು ಉನ್ನತ ಆರ್ಥಿಕ ಸ್ಥಿತಿಯ ವರ್ಗಗಳು ಅನರ್ಹರಾಗಬಹುದು. ಹಿಂದಿನ ಮೌಲ್ಯಮಾಪನ ವರ್ಷದ ಆದಾಯ ತೆರಿಗೆ ಪಾವತಿದಾರರು, ಕೆಲವು ಸಾರ್ವಜನಿಕ ಹುದ್ದೆಯವರು/ನೌಕರರು, ಕೆಲವು ಪಿಂಚಣಿದಾರರು ಮತ್ತು ನೋಂದಾಯಿತ ವೃತ್ತಿಪರರು ಇದರಲ್ಲಿ ಸೇರಬಹುದು; ಅಧಿಕೃತ ವಿನಾಯಿತಿಗಳು ಮತ್ತು ನಿಯಮಗಳು ಅನ್ವಯಿಸುತ್ತವೆ.","ನೋಂದಾಯಿತ ಫಲಾನುಭವಿಗಳಿಗೆ eKYC ಕಡ್ಡಾಯ. ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ ಮತ್ತು ಪರಿಶೀಲನಾ ಅಗತ್ಯಗಳನ್ನು ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ."],
      documents:["ಪೋರ್ಟಲ್ ಕೇಳುವ ಆಧಾರ್/ಗುರುತು ಮತ್ತು eKYC ವಿವರಗಳು.","ರಾಜ್ಯ/ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶದ ಭೂ ದಾಖಲೆಗಳು.","ಸಹಾಯಧನ ವರ್ಗಾವಣೆಗೆ ಬ್ಯಾಂಕ್ ಖಾತೆ ವಿವರಗಳು."],
      process:["ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನ ಹೊಸ ರೈತ ನೋಂದಣಿ ಮತ್ತು ಫಲಾನುಭವಿ ಸ್ಥಿತಿ ಸೇವೆಗಳನ್ನು ಬಳಸಿ.","ಅಗತ್ಯ eKYC ಪೂರ್ಣಗೊಳಿಸಿ. ದಾಖಲೆಗಳಲ್ಲಿ ತಪ್ಪಿದ್ದರೆ ಅಧಿಕೃತ ವಿಧಾನ ಅಥವಾ ಸಂಬಂಧಿತ ರಾಜ್ಯ/ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶದ ನೋಡಲ್ ಕಚೇರಿಯ ಮೂಲಕ ಸರಿಪಡಿಸಿ."],
      note:"ಇದು ಸಾರಾಂಶ ಮಾತ್ರ; ಅಂತಿಮ ಅರ್ಹತೆ ನಿರ್ಧಾರವಲ್ಲ. ಅಧಿಕೃತ ಪಿಎಂ-ಕಿಸಾನ್ ಮಾರ್ಗಸೂಚಿಗಳು, ರಾಜ್ಯ/ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶದ ಭೂ ದಾಖಲೆಗಳು, ಕುಟುಂಬದ ವ್ಯಾಖ್ಯಾನ ಮತ್ತು ಅನರ್ಹತಾ ನಿಯಮಗಳು ಅನ್ವಯಿಸುತ್ತವೆ.",
      sources:["ಪಿಎಂ-ಕಿಸಾನ್ ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಮತ್ತು ಯೋಜನೆ ಮಾಹಿತಿ","ಪಿಎಂ-ಕಿಸಾನ್ ಪರಿಷ್ಕೃತ FAQ (ಅಧಿಕೃತ PDF)"]
    },
    S002: {
      summary:"ಪಿಎಂಎಫ್‌ಬಿವೈ ಅಧಿಸೂಚಿತ ಪ್ರದೇಶದಲ್ಲಿ ಅಧಿಸೂಚಿತ ಹಂಗಾಮಿನಲ್ಲಿ ಬೆಳೆಯುವ ಅಧಿಸೂಚಿತ ಬೆಳೆಗಳಿಗೆ ವಿಮೆ ಒದಗಿಸುತ್ತದೆ. ವಿಮೆ ಮಾಡಬಹುದಾದ ಹಿತಾಸಕ್ತಿ, ರಕ್ಷಿತ ಅಪಾಯಗಳು, ವಿಮಾ ಮೊತ್ತ, ಪ್ರೀಮಿಯಂ ಮತ್ತು ಅರ್ಜಿ ದಿನಾಂಕಗಳು ಸಂಬಂಧಿತ ರಾಜ್ಯ/ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶದ ಅಧಿಸೂಚನೆ ಹಾಗೂ ಯೋಜನಾ ಮಾರ್ಗಸೂಚಿಗಳ ಪ್ರಕಾರ ನಿರ್ಧಾರವಾಗುತ್ತವೆ.",
      benefits:["ಪ್ರಸ್ತುತ ನಿಯಮಗಳಡಿ ನಿರ್ದಿಷ್ಟ ಇಳುವರಿ ನಷ್ಟ ಮತ್ತು ಇತರ ಅಧಿಸೂಚಿತ ಸಂದರ್ಭಗಳಿಗೆ ರಕ್ಷಣೆ ದೊರೆಯಬಹುದು.","ವಿಮೆ ಬೆಳೆ, ಪ್ರದೇಶ ಮತ್ತು ಹಂಗಾಮಿನ ಮೇಲೆ ಅವಲಂಬಿತವಾಗಿದೆ; ಕ್ಲೈಮ್ ಅರ್ಹತೆ ಅಧಿಸೂಚಿತ ಅಪಾಯ, ಸಮಯೋಚಿತ ವರದಿ ಮತ್ತು ಮೌಲ್ಯಮಾಪನಕ್ಕೆ ಒಳಪಟ್ಟಿದೆ."],
      eligibility:["ಅಧಿಸೂಚಿತ ಪ್ರದೇಶದಲ್ಲಿ ಅಧಿಸೂಚಿತ ಬೆಳೆ ಬೆಳೆದು, ಆ ಬೆಳೆಯಲ್ಲಿ ವಿಮೆ ಮಾಡಬಹುದಾದ ಹಿತಾಸಕ್ತಿ ಹೊಂದಿರುವ ರೈತರು ಅರ್ಹರಾಗಬಹುದು.","ರಾಜ್ಯ/ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶದ ನಿಯಮಗಳು ಮತ್ತು ಸ್ವೀಕೃತ ಕೃಷಿ ಅಥವಾ ವಿಮಾ ಹಿತಾಸಕ್ತಿಯ ಪುರಾವೆಗೆ ಒಳಪಟ್ಟು ಗುತ್ತಿಗೆದಾರರು ಮತ್ತು ಪಾಲುದಾರ ರೈತರೂ ಅರ್ಹರಾಗಬಹುದು.","ಅರ್ಜಿ ಕೊನೆಯ ದಿನಾಂಕ, ಪ್ರೀಮಿಯಂ ಮತ್ತು ಪುರಾವೆಗಳು ಹಂಗಾಮು ಹಾಗೂ ಅಧಿಸೂಚನೆಯ ಪ್ರಕಾರ ಬದಲಾಗುತ್ತವೆ. ಬೆಳೆ ಹಾನಿಯೊಂದೇ ಕ್ಲೈಮ್ ಮಂಜೂರಿಗೆ ಸಾಕಾಗುವುದಿಲ್ಲ."],
      documents:["ಬೆಳೆ, ಹಂಗಾಮು, ಅಧಿಸೂಚಿತ ಪ್ರದೇಶ ಮತ್ತು ಬೆಳೆದ ಪ್ರದೇಶದ ವಿವರಗಳು.","ಸಂಬಂಧಿತ ರಾಜ್ಯ/ಹಂಗಾಮಿಗೆ ಸ್ವೀಕೃತ ಕೃಷಿ ಅಥವಾ ವಿಮಾ ಹಿತಾಸಕ್ತಿಯ ಪುರಾವೆ.","ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಮಾಧ್ಯಮ ಕೇಳುವ ಗುರುತು ಮತ್ತು ಬ್ಯಾಂಕ್ ವಿವರಗಳು."],
      process:["ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಮೊದಲು ಪ್ರಸ್ತುತ ಬೆಳೆ, ಪ್ರದೇಶ, ಹಂಗಾಮಿನ ಅಧಿಸೂಚನೆ ಮತ್ತು ಕೊನೆಯ ದಿನಾಂಕ ಪರಿಶೀಲಿಸಿ.","ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಅಥವಾ ಅಧಿಸೂಚಿತ ಬ್ಯಾಂಕ್, ವಿಮಾ ಸಂಸ್ಥೆ, ಸಾಮಾನ್ಯ ಸೇವಾ ಕೇಂದ್ರ ಅಥವಾ ರಾಜ್ಯದ ಮೂಲಕ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ; ಸ್ವೀಕೃತಿಯನ್ನು ಉಳಿಸಿಕೊಳ್ಳಿ.","ನಷ್ಟ ವರದಿಗೆ ಪ್ರಸ್ತುತ ಅಧಿಸೂಚನೆ ಮತ್ತು ಅಧಿಕೃತ ಕ್ಲೈಮ್ ಸೂಚನೆಗಳನ್ನು ತಕ್ಷಣ ಪಾಲಿಸಿ."],
      note:"ನಿಗದಿತ ಪ್ರೀಮಿಯಂ, ಕೊನೆಯ ದಿನಾಂಕ ಅಥವಾ ಎಲ್ಲೆಡೆ ಅನ್ವಯಿಸುವ ಬೆಳೆ ಪಟ್ಟಿಯನ್ನು ಊಹಿಸಬೇಡಿ. ಸಂಬಂಧಿತ ರಾಜ್ಯ/ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶದ ಪ್ರಸ್ತುತ ಅಧಿಸೂಚನೆ ಮತ್ತು ಕಾರ್ಯಾಚರಣಾ ಮಾರ್ಗಸೂಚಿಗಳು ಅನ್ವಯಿಸುತ್ತವೆ.",
      sources:["ಪಿಎಂಎಫ್‌ಬಿವೈ ಅಧಿಕೃತ ಪೋರ್ಟಲ್","2023 ಕಾರ್ಯಾಚರಣಾ ಮಾರ್ಗಸೂಚಿಗಳು (ಪಿಎಂಎಫ್‌ಬಿವೈ ಪೋರ್ಟಲ್‌ನಲ್ಲಿರುವ ಲಿಂಕ್)"]
    },
    S003: {
      summary:"ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಬ್ಯಾಂಕ್‌ಗಳು ನೀಡುವ ಸಾಲ ಸೌಲಭ್ಯವಾಗಿದ್ದು, ಕೃಷಿ ಮತ್ತು ಅರ್ಹ ಕೃಷಿ-ಸಂಬಂಧಿತ ಅಗತ್ಯಗಳಿಗೆ ಸಮಯಕ್ಕೆ ಸಾಲ ಒದಗಿಸುವ ಉದ್ದೇಶ ಹೊಂದಿದೆ. ಅನ್ವಯಿಸುವ ಕೆಸಿಸಿ ನಿಯಮಗಳಡಿ ಬ್ಯಾಂಕ್‌ಗಳು ಅರ್ಜಿಯನ್ನು ಪರಿಶೀಲಿಸಿ ನಿರ್ವಹಿಸುತ್ತವೆ.",
      benefits:["ಬೆಳೆ ಉತ್ಪಾದನೆ, ಕೊಯ್ಲಿನ ನಂತರದ ವೆಚ್ಚ, ಮಾರುಕಟ್ಟೆ, ಅರ್ಹ ಗೃಹ ಬಳಕೆ, ಕೃಷಿ/ಸಂಬಂಧಿತ ಚಟುವಟಿಕೆಗಳ ಕಾರ್ಯನಿಧಿ ಮತ್ತು ಕೃಷಿ ಹೂಡಿಕೆ ಒಳಗೊಂಡಿರಬಹುದು.","ಕಾರ್ಡ್ ಮಂಜೂರಾದ ಸಾಲಕ್ಕೆ ಪ್ರವೇಶ ನೀಡುತ್ತದೆ; ಇದು ಅನುದಾನವಲ್ಲ ಮತ್ತು ಸಾಲ ಮಂಜೂರಾತಿಯ ಖಾತರಿಯೂ ಅಲ್ಲ."],
      eligibility:["ಭಾರತ ಸರ್ಕಾರದ myScheme ಮಾಹಿತಿಯಲ್ಲಿ ವೈಯಕ್ತಿಕ/ಜಂಟಿ ಭೂಮಾಲೀಕ-ಕೃಷಿಕರು, ಬಾಡಿಗೆದಾರರು, ಮೌಖಿಕ ಗುತ್ತಿಗೆದಾರರು ಮತ್ತು ಪಾಲುದಾರ ಕೃಷಿಕರು ಸೇರಿದ್ದಾರೆ.","ಬಾಡಿಗೆದಾರರು ಅಥವಾ ಪಾಲುದಾರ ಕೃಷಿಕರನ್ನು ಹೊಂದಿರುವ ಅರ್ಹ ರೈತ ಗುಂಪುಗಳು, ಸ್ವಸಹಾಯ ಗುಂಪುಗಳು ಅಥವಾ ಜಂಟಿ ಹೊಣೆಗಾರಿಕೆ ಗುಂಪುಗಳೂ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು.","ಭಾಗವಹಿಸುವ ಬ್ಯಾಂಕ್ ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ, ಪ್ರಸ್ತುತ ನಿಯಮಗಳ ಪ್ರಕಾರ ಸಾಲ ಮಿತಿ, ಭದ್ರತೆ, ದಾಖಲೆಗಳು, ಬಡ್ಡಿ ಮತ್ತು ಮರುಪಾವತಿಯನ್ನು ನಿರ್ಧರಿಸುತ್ತದೆ."],
      documents:["ಬ್ಯಾಂಕ್ ಕೇಳುವ ಕೆಸಿಸಿ ಅರ್ಜಿ ಮತ್ತು ಗುರುತು/ವಿಳಾಸದ ಪುರಾವೆ.","ಬ್ಯಾಂಕ್ ಸ್ವೀಕರಿಸುವ ಭೂಮಿ, ಬಾಡಿಗೆ, ಗುತ್ತಿಗೆ, ಪಾಲುದಾರಿಕೆ ಅಥವಾ ಕೃಷಿಯ ಪುರಾವೆ.","ಕೋರಿದ ಬೆಳೆ ಅಥವಾ ಅರ್ಹ ಸಂಬಂಧಿತ ಚಟುವಟಿಕೆಯ ಸಾಲಕ್ಕೆ ಬೇಕಾದ ವಿವರಗಳು."],
      process:["ಭಾಗವಹಿಸುವ ಬ್ಯಾಂಕ್ ಅಥವಾ ಆ ಬ್ಯಾಂಕ್ ಬೆಂಬಲಿಸುವ ಡಿಜಿಟಲ್ ಮಾಧ್ಯಮದ ಮೂಲಕ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.","ಪ್ರಸ್ತುತ ನಿಯಮಗಳು ಮತ್ತು ಅಗತ್ಯ ಪುರಾವೆಗಳನ್ನು ಬ್ಯಾಂಕ್‌ನೊಂದಿಗೆ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ; ಮಂಜೂರಾತಿ ಮತ್ತು ಸಾಲ ಮಿತಿ ಬ್ಯಾಂಕಿನ ಪರಿಶೀಲನೆಗೆ ಒಳಪಟ್ಟಿರುತ್ತದೆ."],
      note:"ಬಡ್ಡಿ ನೆರವು, ಸಾಲ ಮಿತಿ, ಜಾಮೀನಿನ ಮಿತಿಗಳು ಮತ್ತು ಮರುಪಾವತಿ ನಿಯಮಗಳು ಬದಲಾಗಬಹುದು. ಪ್ರಸ್ತುತ ನಿಯಮಗಳನ್ನು ಸಾಲದಾತ ಬ್ಯಾಂಕ್‌ನಿಂದ ದೃಢಪಡಿಸಿ; ಇಲ್ಲಿ ನಿಗದಿತ ದರ ಅಥವಾ ಸಾಲ ಮೊತ್ತವನ್ನು ಭರವಸೆ ನೀಡಲಾಗುವುದಿಲ್ಲ.",
      sources:["ಭಾರತ ಸರ್ಕಾರದ myScheme‌ನಲ್ಲಿರುವ ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಯೋಜನೆ"]
    },
    S004: {
      summary:"ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಉಪಕ್ರಮವು ಮಣ್ಣಿನ ಪರೀಕ್ಷೆಯ ಮಾಹಿತಿ ಮತ್ತು ಬೆಳೆ ಆಧಾರಿತ ಪೋಷಕಾಂಶ ನಿರ್ವಹಣೆಯ ಸಲಹೆಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ. ಮಣ್ಣಿನ ಸುಧಾರಣೆ ಮತ್ತು ರಸಗೊಬ್ಬರ ಬಳಕೆಯ ಬಗ್ಗೆ ರೈತರಿಗೆ ನಿರ್ಧಾರ ಕೈಗೊಳ್ಳಲು ಇದು ನೆರವಾಗುತ್ತದೆ. ಇದು ಪರೀಕ್ಷೆ ಮತ್ತು ಸಲಹಾ ಸೇವೆ; ನಗದು ನೆರವು ಯೋಜನೆಯಲ್ಲ.",
      benefits:["ಮಣ್ಣಿನ ವರದಿ ಅದರ ಗುಣಲಕ್ಷಣ ಮತ್ತು ಪೋಷಕಾಂಶ ಸ್ಥಿತಿಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡು ಬೆಳೆ ಹಾಗೂ ಪೋಷಕಾಂಶ ನಿರ್ವಹಣೆಯ ನಿರ್ಧಾರಗಳಿಗೆ ನೆರವಾಗುತ್ತದೆ.","ಮಾದರಿ ಸಂಗ್ರಹ, ಪರೀಕ್ಷೆ ಮತ್ತು ವರದಿ ಲಭ್ಯತೆಯನ್ನು ಸಂಬಂಧಿತ ರಾಜ್ಯ/ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶದ ಕೃಷಿ ವ್ಯವಸ್ಥೆ ಹಾಗೂ ಮಣ್ಣು ಪರೀಕ್ಷಾ ಪ್ರಯೋಗಾಲಯಗಳು ನಿರ್ವಹಿಸುತ್ತವೆ."],
      eligibility:["ಮಣ್ಣಿನ ಮಾದರಿ ಸಂಗ್ರಹಿಸಿ ಪರೀಕ್ಷಿಸಬಹುದಾದ ಕೃಷಿ ಭೂಮಿಗಳಿಗೆ ಈ ಸೇವೆ ಉದ್ದೇಶಿತವಾಗಿದೆ.","ಸ್ಥಳೀಯ ಕೃಷಿ ಇಲಾಖೆ ಮತ್ತು ಪರೀಕ್ಷಾ ಕೇಂದ್ರಗಳು ಲಭ್ಯತೆ, ಮಾದರಿ ಸಂಗ್ರಹ ಹಾಗೂ ವರದಿ ಪ್ರಕ್ರಿಯೆಯನ್ನು ನಿರ್ವಹಿಸುತ್ತವೆ; ನಿಮ್ಮ ಪ್ರದೇಶದ ವಿಧಾನಕ್ಕಾಗಿ ಅವರನ್ನು ಸಂಪರ್ಕಿಸಿ."],
      documents:["ಮಾದರಿಯನ್ನು ಗುರುತಿಸಿ ವರದಿ ನೀಡಲು ಬೇಕಾದ ಹೊಲ/ಸ್ಥಳದ ವಿವರಗಳು.","ಸ್ಥಳೀಯ ಕೃಷಿ ಇಲಾಖೆ ಅಥವಾ ಪರೀಕ್ಷಾ ಕೇಂದ್ರ ಕೇಳುವ ರೈತ/ಭೂಮಿಯ ವಿವರಗಳು."],
      process:["ಸ್ಥಳೀಯ ಕೃಷಿ ಇಲಾಖೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ ಅಥವಾ ಅಧಿಕೃತ ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಲಭ್ಯ ಸೇವೆ ಪರಿಶೀಲಿಸಿ.","ಸ್ಥಳೀಯ ಮಾದರಿ ಸಂಗ್ರಹ ಸೂಚನೆಗಳನ್ನು ಪಾಲಿಸಿ, ವರದಿಯಲ್ಲಿರುವ ಬೆಳೆ ಮತ್ತು ಪೋಷಕಾಂಶ ಸಲಹೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ."],
      note:"ಸಲಹೆಗಳು ಮಾದರಿ, ಹೊಲ ಮತ್ತು ಬೆಳೆ ಪರಿಸ್ಥಿತಿಯನ್ನು ಅವಲಂಬಿಸಿವೆ. ವರದಿ ಮತ್ತು ಸ್ಥಳೀಯ ಕೃಷಿ ತಜ್ಞರ ಸಲಹೆ ಅನುಸರಿಸಿ; ಲಭ್ಯತೆ ಹಾಗೂ ವಿಧಾನ ರಾಜ್ಯಾನುಸಾರ ಬದಲಾಗಬಹುದು.",
      sources:["ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಪೋರ್ಟಲ್ (ಕೃಷಿ ಮತ್ತು ರೈತ ಕಲ್ಯಾಣ ಇಲಾಖೆ)"]
    }
  }
};

const SCHEME_DETAIL_LABELS = {
  English:{eligibility:"Eligibility and conditions",documents:"What to prepare (requirements may vary)",process:"How to proceed",official:"Official information",portal:"Official scheme portal"},
  मराठी:{eligibility:"पात्रता आणि अटी",documents:"काय तयार ठेवावे (आवश्यकता बदलू शकतात)",process:"पुढील प्रक्रिया",official:"अधिकृत माहिती",portal:"अधिकृत योजना पोर्टल"},
  हिंदी:{eligibility:"पात्रता और शर्तें",documents:"क्या तैयार रखें (आवश्यकताएं बदल सकती हैं)",process:"आगे की प्रक्रिया",official:"आधिकारिक जानकारी",portal:"आधिकारिक योजना पोर्टल"},
  कन्नड:{eligibility:"ಅರ್ಹತೆ ಮತ್ತು ಷರತ್ತುಗಳು",documents:"ಏನು ಸಿದ್ಧಪಡಿಸಬೇಕು (ಅವಶ್ಯಕತೆಗಳು ಬದಲಾಗಬಹುದು)",process:"ಮುಂದಿನ ಕ್ರಮ",official:"ಅಧಿಕೃತ ಮಾಹಿತಿ",portal:"ಅಧಿಕೃತ ಯೋಜನಾ ಪೋರ್ಟಲ್"},
  Marathi:{eligibility:"पात्रता आणि अटी",documents:"काय तयार ठेवावे (आवश्यकता बदलू शकतात)",process:"पुढील प्रक्रिया",official:"अधिकृत माहिती",portal:"अधिकृत योजना पोर्टल"},
  Hindi:{eligibility:"पात्रता और शर्तें",documents:"क्या तैयार रखें (आवश्यकताएं बदल सकती हैं)",process:"आगे की प्रक्रिया",official:"आधिकारिक जानकारी",portal:"आधिकारिक योजना पोर्टल"},
  Kannada:{eligibility:"ಅರ್ಹತೆ ಮತ್ತು ಷರತ್ತುಗಳು",documents:"ಏನು ಸಿದ್ಧಪಡಿಸಬೇಕು (ಅವಶ್ಯಕತೆಗಳು ಬದಲಾಗಬಹುದು)",process:"ಮುಂದಿನ ಕ್ರಮ",official:"ಅಧಿಕೃತ ಮಾಹಿತಿ",portal:"ಅಧಿಕೃತ ಯೋಜನಾ ಪೋರ್ಟಲ್"}
};

function localizedLegalDetails(schemeCode, lang) {
  const base=SCHEME_LEGAL_DETAILS[schemeCode] || SCHEME_LEGAL_DETAILS.S001;
  const translated=SCHEME_DETAIL_TRANSLATIONS[lang]?.[schemeCode];
  if(!translated) return base;
  return {
    ...base,
    ...translated,
    sources:base.sources.map((source,index)=>({...source,label:translated.sources[index]||source.label}))
  };
}


const STATIC_SCHEME_LOCAL = {
  English: {
    S001:{name:"PM Kisan Samman Nidhi",category:"Financial Support",desc:"₹6,000 annual income support for eligible landholding farmer families."},
    S002:{name:"Pradhan Mantri Fasal Bima Yojana",category:"Insurance",desc:"Insurance for notified crops, areas and seasons under current scheme rules."},
    S003:{name:"Kisan Credit Card (KCC)",category:"Credit",desc:"Bank credit for cultivation and eligible agricultural or allied needs."},
    S004:{name:"Soil Health Card Scheme",category:"Soil & Crop Management",desc:"Soil-test information and nutrient-management recommendations."}
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
function localizedStaticScheme(scheme, lang){
  const localized=STATIC_SCHEME_LOCAL[lang]?.[scheme.backendId];
  return localized ? {...scheme,...localized} : scheme;
}

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
  const cardScheme=localizedStaticScheme(scheme||schemes[0],lang);
  const info=localizedLegalDetails(scheme?.backendId,lang);
  const labels=SCHEME_DETAIL_LABELS[lang]||SCHEME_DETAIL_LABELS.English;
  return <section className="container page">
    <button className="back-btn" onClick={()=>go("schemes")}><ArrowLeft size={16}/> {t.back}</button>
    <div className="detail-card">
      <div className="detail-image"><img src={cardScheme.image} alt={cardScheme.name}/></div>
      <div className="detail-main">
        <span className="pill">{cardScheme.category}</span><h1>{cardScheme.name}</h1>
        <p>{info.summary}</p>
        <h3>{t.benefits}</h3>
        <ul className="checks">{info.benefits.map(item=><li key={item}><CheckCircle2/> {item}</li>)}</ul>
        <div className="scheme-action-row"><button className="primary" onClick={()=>go("eligibility")}>{t.check}<ArrowRight size={17}/></button><a className="outline" href={info.applicationLink} target="_blank" rel="noreferrer">{labels.portal}<ArrowRight size={16}/></a></div>
      </div>
    </div>
    <div className="content-card detail-sections">
      <div><h2>{labels.eligibility}</h2><ul className="scheme-legal-list">{info.eligibility.map(item=><li key={item}>{item}</li>)}</ul></div>
      <div><h2>{labels.documents}</h2><ul className="scheme-legal-list">{info.documents.map(item=><li key={item}>{item}</li>)}</ul></div>
      <div><h2>{labels.process}</h2><ol className="scheme-legal-list">{info.process.map(item=><li key={item}>{item}</li>)}</ol></div>
      <div className="official-link-card scheme-official-card"><div><h2>{labels.official}</h2><p className="scheme-legal-note">{info.note}</p><div className="scheme-source-list">{info.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}<ArrowRight size={14}/></a>)}</div></div></div>
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

const ELIGIBILITY_COPY = {
  English:{intro:"Answer a few questions about your farm to find schemes that may be relevant to you.",assurance:"This check is preliminary guidance, not an official eligibility decision.",formIntro:"Share your location and farming details to get started.",required:"Required for matching",location:"Location",farm:"Farming profile",stateHelp:"Scheme availability may vary by state.",cultivate:"Do you currently cultivate agricultural land?",cropHelp:"Optional — used to check crop-specific support.",additional:"Additional scheme checks",taxHelp:"Used to check PM-KISAN conditions.",exclusion:"Does any other PM-KISAN exclusion apply?",exclusionHelp:"Examples include specified government service, constitutional office, or a registered profession.",submitNote:"Your answers are used to show preliminary scheme matches only.",checking:"Checking...",howWorks:"How it works",share:"Share your details",shareHelp:"Tell us about your location and farming activity.",review:"Review possible matches",reviewHelp:"We compare your answers with available scheme criteria.",confirm:"Confirm with the source",confirmHelp:"Check current requirements with the official department.",important:"Important",finalDecision:"Final eligibility is decided by the relevant scheme authority. This check is only preliminary guidance.",results:"Preliminary results",match:"potential match",matches:"potential matches",complete:"Complete your profile for a more accurate check",provide:"Please provide",noMatches:"No potential matches found",noMatchesHelp:"Based on these answers, no schemes matched the preliminary criteria. Contact your local agriculture department to verify your options.",potentiallyEligible:"Potentially eligible",noLongerMatched:"Not currently matched",officialInfo:"View official scheme information",error:"Could not check eligibility. Please try again."},
  मराठी:{intro:"आपल्या शेतीविषयी काही प्रश्नांची उत्तरे द्या आणि आपल्यासाठी संबंधित योजना पहा.",assurance:"ही प्राथमिक माहिती आहे; अधिकृत पात्रता निर्णय नाही.",formIntro:"सुरू करण्यासाठी आपले स्थान आणि शेतीची माहिती द्या.",required:"योजना जुळवण्यासाठी आवश्यक",location:"स्थान",farm:"शेतीविषयक माहिती",stateHelp:"योजनेची उपलब्धता राज्यानुसार बदलू शकते.",cultivate:"तुम्ही सध्या शेतीची जमीन कसता का?",cropHelp:"पर्यायी — पिकाशी संबंधित सहाय्य तपासण्यासाठी.",additional:"योजनेसाठी अतिरिक्त तपासणी",taxHelp:"पीएम-किसानच्या अटी तपासण्यासाठी वापरले जाते.",exclusion:"पीएम-किसानची इतर कोणती अपात्रता लागू होते का?",exclusionHelp:"उदा. काही सरकारी सेवा, घटनात्मक पद किंवा नोंदणीकृत व्यवसाय.",submitNote:"तुमच्या उत्तरांवरून केवळ प्राथमिक योजना जुळणी दाखवली जाते.",checking:"तपासत आहे...",howWorks:"ही प्रक्रिया कशी चालते",share:"तुमची माहिती द्या",shareHelp:"तुमचे स्थान आणि शेतीविषयी माहिती सांगा.",review:"संभाव्य योजना पहा",reviewHelp:"तुमच्या उत्तरांची उपलब्ध योजनांच्या निकषांशी तुलना केली जाते.",confirm:"अधिकृत स्रोताकडून खात्री करा",confirmHelp:"सध्याच्या अटी संबंधित अधिकृत विभागाकडून तपासा.",important:"महत्त्वाचे",finalDecision:"अंतिम पात्रता संबंधित योजना प्राधिकरण ठरवते. ही केवळ प्राथमिक माहिती आहे.",results:"प्राथमिक निकाल",match:"संभाव्य जुळणी",matches:"संभाव्य जुळण्या",complete:"अधिक अचूक तपासणीसाठी प्रोफाइल पूर्ण करा",provide:"कृपया ही माहिती द्या",noMatches:"संभाव्य जुळणी आढळली नाही",noMatchesHelp:"या उत्तरांनुसार प्राथमिक निकषांशी जुळणारी योजना आढळली नाही. खात्रीसाठी स्थानिक कृषी विभागाशी संपर्क साधा.",potentiallyEligible:"संभाव्यतः पात्र",noLongerMatched:"सध्या जुळणी नाही",officialInfo:"अधिकृत योजना माहिती पहा",error:"पात्रता तपासता आली नाही. कृपया पुन्हा प्रयत्न करा."},
  हिंदी:{intro:"अपने खेत के बारे में कुछ सवालों के जवाब दें और अपने लिए उपयोगी योजनाएं देखें।",assurance:"यह प्रारंभिक मार्गदर्शन है, आधिकारिक पात्रता निर्णय नहीं।",formIntro:"शुरू करने के लिए अपना स्थान और खेती का विवरण दें।",required:"योजना मिलान के लिए आवश्यक",location:"स्थान",farm:"खेती का विवरण",stateHelp:"योजना की उपलब्धता राज्य के अनुसार बदल सकती है।",cultivate:"क्या आप वर्तमान में कृषि भूमि पर खेती करते हैं?",cropHelp:"वैकल्पिक — फसल संबंधी सहायता जांचने के लिए।",additional:"योजना से जुड़ी अतिरिक्त जांच",taxHelp:"पीएम-किसान की शर्तें जांचने के लिए।",exclusion:"क्या पीएम-किसान की कोई अन्य अपात्रता लागू होती है?",exclusionHelp:"उदाहरण: निर्दिष्ट सरकारी सेवा, संवैधानिक पद या पंजीकृत पेशा।",submitNote:"आपके उत्तरों से केवल प्रारंभिक योजना मिलान दिखाया जाता है।",checking:"जांच हो रही है...",howWorks:"यह कैसे काम करता है",share:"अपना विवरण दें",shareHelp:"अपने स्थान और खेती की जानकारी बताएं।",review:"संभावित योजनाएं देखें",reviewHelp:"आपके उत्तरों की उपलब्ध योजना मानदंडों से तुलना की जाती है।",confirm:"आधिकारिक स्रोत से पुष्टि करें",confirmHelp:"वर्तमान आवश्यकताएं संबंधित आधिकारिक विभाग से जांचें।",important:"महत्वपूर्ण",finalDecision:"अंतिम पात्रता संबंधित योजना प्राधिकरण तय करता है। यह केवल प्रारंभिक मार्गदर्शन है।",results:"प्रारंभिक परिणाम",match:"संभावित योजना",matches:"संभावित योजनाएं",complete:"अधिक सटीक जांच के लिए अपनी प्रोफ़ाइल पूरी करें",provide:"कृपया यह जानकारी दें",noMatches:"कोई संभावित योजना नहीं मिली",noMatchesHelp:"इन उत्तरों के आधार पर प्रारंभिक मानदंडों से मेल खाने वाली योजना नहीं मिली। पुष्टि के लिए स्थानीय कृषि विभाग से संपर्क करें।",potentiallyEligible:"संभावित रूप से पात्र",noLongerMatched:"अभी मेल नहीं मिला",officialInfo:"आधिकारिक योजना जानकारी देखें",error:"पात्रता जांच नहीं हो सकी। कृपया फिर से प्रयास करें।"},
  कन्नड:{intro:"ನಿಮ್ಮ ಕೃಷಿಗೆ ಸಂಬಂಧಿಸಿದ ಕೆಲವು ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ, ನಿಮಗೆ ಹೊಂದುವ ಯೋಜನೆಗಳನ್ನು ಕಂಡುಕೊಳ್ಳಿ.",assurance:"ಇದು ಪ್ರಾಥಮಿಕ ಮಾರ್ಗದರ್ಶನ ಮಾತ್ರ; ಅಧಿಕೃತ ಅರ್ಹತಾ ನಿರ್ಧಾರವಲ್ಲ.",formIntro:"ಪ್ರಾರಂಭಿಸಲು ನಿಮ್ಮ ಸ್ಥಳ ಮತ್ತು ಕೃಷಿ ವಿವರಗಳನ್ನು ನೀಡಿ.",required:"ಯೋಜನೆ ಹೊಂದಾಣಿಕೆಗೆ ಅಗತ್ಯ",location:"ಸ್ಥಳ",farm:"ಕೃಷಿ ವಿವರಗಳು",stateHelp:"ಯೋಜನೆಯ ಲಭ್ಯತೆ ರಾಜ್ಯಾನುಸಾರ ಬದಲಾಗಬಹುದು.",cultivate:"ನೀವು ಈಗ ಕೃಷಿ ಭೂಮಿಯನ್ನು ಬೆಳೆಸುತ್ತಿದ್ದೀರಾ?",cropHelp:"ಐಚ್ಛಿಕ — ಬೆಳೆ ಸಂಬಂಧಿತ ನೆರವನ್ನು ಪರಿಶೀಲಿಸಲು.",additional:"ಹೆಚ್ಚುವರಿ ಯೋಜನಾ ಪರಿಶೀಲನೆಗಳು",taxHelp:"ಪಿಎಂ-ಕಿಸಾನ್ ನಿಯಮಗಳನ್ನು ಪರಿಶೀಲಿಸಲು.",exclusion:"ಪಿಎಂ-ಕಿಸಾನ್‌ನ ಬೇರೆ ಅನರ್ಹತಾ ನಿಯಮ ಅನ್ವಯಿಸುತ್ತದೆಯೇ?",exclusionHelp:"ಉದಾಹರಣೆ: ನಿರ್ದಿಷ್ಟ ಸರ್ಕಾರಿ ಸೇವೆ, ಸಂವಿಧಾನಾತ್ಮಕ ಹುದ್ದೆ ಅಥವಾ ನೋಂದಾಯಿತ ವೃತ್ತಿ.",submitNote:"ನಿಮ್ಮ ಉತ್ತರಗಳಿಂದ ಪ್ರಾಥಮಿಕ ಯೋಜನಾ ಹೊಂದಾಣಿಕೆಗಳನ್ನು ಮಾತ್ರ ತೋರಿಸಲಾಗುತ್ತದೆ.",checking:"ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",howWorks:"ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ",share:"ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನೀಡಿ",shareHelp:"ನಿಮ್ಮ ಸ್ಥಳ ಮತ್ತು ಕೃಷಿ ಚಟುವಟಿಕೆಯ ಬಗ್ಗೆ ತಿಳಿಸಿ.",review:"ಸಂಭಾವ್ಯ ಹೊಂದಾಣಿಕೆಗಳನ್ನು ನೋಡಿ",reviewHelp:"ನಿಮ್ಮ ಉತ್ತರಗಳನ್ನು ಲಭ್ಯ ಯೋಜನೆಗಳ ಮಾನದಂಡಗಳೊಂದಿಗೆ ಹೋಲಿಸಲಾಗುತ್ತದೆ.",confirm:"ಅಧಿಕೃತ ಮೂಲದಿಂದ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ",confirmHelp:"ಪ್ರಸ್ತುತ ಅಗತ್ಯಗಳನ್ನು ಅಧಿಕೃತ ಇಲಾಖೆಯಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.",important:"ಮುಖ್ಯ",finalDecision:"ಅಂತಿಮ ಅರ್ಹತೆಯನ್ನು ಸಂಬಂಧಿತ ಯೋಜನಾ ಪ್ರಾಧಿಕಾರ ನಿರ್ಧರಿಸುತ್ತದೆ. ಇದು ಪ್ರಾಥಮಿಕ ಮಾರ್ಗದರ್ಶನ ಮಾತ್ರ.",results:"ಪ್ರಾಥಮಿಕ ಫಲಿತಾಂಶಗಳು",match:"ಸಂಭಾವ್ಯ ಹೊಂದಾಣಿಕೆ",matches:"ಸಂಭಾವ್ಯ ಹೊಂದಾಣಿಕೆಗಳು",complete:"ನಿಖರ ಪರಿಶೀಲನೆಗಾಗಿ ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ",provide:"ದಯವಿಟ್ಟು ಈ ವಿವರಗಳನ್ನು ನೀಡಿ",noMatches:"ಸಂಭಾವ್ಯ ಹೊಂದಾಣಿಕೆ ಕಂಡುಬಂದಿಲ್ಲ",noMatchesHelp:"ಈ ಉತ್ತರಗಳ ಆಧಾರದಲ್ಲಿ ಪ್ರಾಥಮಿಕ ಮಾನದಂಡಗಳಿಗೆ ಹೊಂದುವ ಯೋಜನೆ ಕಂಡುಬಂದಿಲ್ಲ. ಖಚಿತಪಡಿಸಲು ಸ್ಥಳೀಯ ಕೃಷಿ ಇಲಾಖೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ.",potentiallyEligible:"ಸಂಭಾವ್ಯವಾಗಿ ಅರ್ಹ",noLongerMatched:"ಪ್ರಸ್ತುತ ಹೊಂದಾಣಿಕೆ ಇಲ್ಲ",officialInfo:"ಅಧಿಕೃತ ಯೋಜನಾ ಮಾಹಿತಿ ನೋಡಿ",error:"ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಲಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."}
};

function Eligibility({t,token,user,selectedScheme,lang}){
  const copy=ELIGIBILITY_COPY[lang]||ELIGIBILITY_COPY.English;
  const [form,setForm]=useState({country:user?.country||"India",land_owner:"",cultivates_land:"",pm_kisan_exclusion:"",farmer_type:user?.farmerType||"",income_tax_payer:"",crop:"",crop_damage:"",state:user?.state||"",district:user?.district||"",taluka:user?.taluka||"",village:user?.village||""});
  const [result,setResult]=useState(null); const [loading,setLoading]=useState(false); const [error,setError]=useState(""); const update=(k,v)=>setForm(f=>({...f,[k]:v}));
  const submit=async()=>{setError("");setResult(null);setLoading(true);try{const profile={...form,land_owner:form.land_owner===""?null:form.land_owner==="true",cultivates_land:form.cultivates_land===""?null:form.cultivates_land==="true",pm_kisan_exclusion:form.pm_kisan_exclusion===""?null:form.pm_kisan_exclusion==="true",income_tax_payer:form.income_tax_payer===""?null:form.income_tax_payer==="true",crop_damage:form.crop_damage===""?null:form.crop_damage==="true",farmer_type:form.farmer_type};const data=await api.checkEligibility(profile);setResult(data)}catch(err){setError(err.message||copy.error)}finally{setLoading(false)}};
  const sorted=result?.results ? [...result.results].sort((a,b)=>(a.scheme_id===selectedScheme?.backendId?-1:0)-(b.scheme_id===selectedScheme?.backendId?-1:0)) : [];
  return <section className="container page eligibility-page">
    <header className="eligibility-hero">
      <div className="eligibility-hero-copy">
        <span className="eyebrow green">{t.checkAll}</span>
        <h1>{t.checkAll}</h1>
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
            <div><h2>{t.farmerInfo}</h2><p>{copy.formIntro}</p></div>
            <span className="eligibility-required-note"><b>*</b> {copy.required}</span>
          </div>
          <div className="eligibility-form">
            <fieldset className="eligibility-fieldset">
              <legend>{copy.location}</legend>
              <div className="eligibility-field-grid">
                <label className="eligibility-field">
                  <span>{t.country}</span>
                  <select value={form.country} onChange={e=>{update("country",e.target.value);update("state","");update("district","")}}>
                    <option value="">{t.selectCountry}</option><option>India</option>
                  </select>
                </label>
                <label className="eligibility-field">
                  <span>{t.state} <b>*</b></span>
                  <select value={form.state} disabled={form.country!=="India"} onChange={e=>{update("state",e.target.value);update("district","")}} aria-required="true">
                    <option value="">{t.selectState}</option>{INDIA_STATES.map(x=><option key={x}>{x}</option>)}
                  </select>
                  <small>{copy.stateHelp}</small>
                </label>
                <label className="eligibility-field">
                  <span>{t.district}</span>
                  <select value={form.district} disabled={!form.state} onChange={e=>update("district",e.target.value)}>
                    <option value="">{t.selectDistrict}</option>{(INDIA_DISTRICTS[form.state]||[]).map(x=><option key={x}>{x}</option>)}
                  </select>
                </label>
              </div>
            </fieldset>
            <fieldset className="eligibility-fieldset">
              <legend>Farming profile</legend>
              <div className="eligibility-field-grid">
                <label className="eligibility-field">
                  <span>{t.farmerType} <b>*</b></span>
                  <select value={form.farmer_type} onChange={e=>update("farmer_type",e.target.value)} aria-required="true">
                    <option value="">{t.selectFarmerType}</option>{FARMER_TYPES.map(x=><option key={x} value={x}>{localizedFarmerType(t,x)}</option>)}
                  </select>
                </label>
                <label className="eligibility-field">
                  <span>{t.landQuestion} <b>*</b></span>
                  <select value={form.land_owner} onChange={e=>update("land_owner",e.target.value)} aria-required="true">
                    <option value="">{t.select}</option><option value="true">{t.yes}</option><option value="false">{t.no}</option>
                  </select>
                </label>
                <label className="eligibility-field">
                  <span>{copy.cultivate} <b>*</b></span>
                  <select value={form.cultivates_land} onChange={e=>update("cultivates_land",e.target.value)} aria-required="true">
                    <option value="">{t.select}</option><option value="true">{t.yes}</option><option value="false">{t.no}</option>
                  </select>
                </label>
                <label className="eligibility-field">
                  <span>{t.cropOptional}</span>
                  <input value={form.crop} maxLength={40} onChange={e=>update("crop",e.target.value.replace(/[^\p{L} ]/gu,""))} placeholder={t.cropExample || "e.g. sugarcane"}/>
                  <small>{copy.cropHelp}</small>
                </label>
                <label className="eligibility-field">
                  <span>{t.cropDamageQuestion}</span>
                  <select value={form.crop_damage} onChange={e=>update("crop_damage",e.target.value)}>
                    <option value="">{t.notSure}</option><option value="true">{t.yes}</option><option value="false">{t.no}</option>
                  </select>
                </label>
              </div>
            </fieldset>
            <fieldset className="eligibility-fieldset">
              <legend>{copy.additional}</legend>
              <div className="eligibility-field-grid">
                <label className="eligibility-field">
                  <span>{t.taxQuestion}</span>
                  <select value={form.income_tax_payer} onChange={e=>update("income_tax_payer",e.target.value)}>
                    <option value="">{t.select}</option><option value="true">{t.yes}</option><option value="false">{t.no}</option>
                  </select>
                  <small>{copy.taxHelp}</small>
                </label>
                <label className="eligibility-field">
                  <span>{copy.exclusion}</span>
                  <select value={form.pm_kisan_exclusion} onChange={e=>update("pm_kisan_exclusion",e.target.value)}>
                    <option value="">{t.select}</option><option value="true">{t.yes}</option><option value="false">{t.no}</option>
                  </select>
                  <small>{copy.exclusionHelp}</small>
                </label>
              </div>
            </fieldset>
            {error&&<div className="eligibility-error" role="alert">{error}</div>}
            <div className="eligibility-form-footer">
              <p><ShieldCheck size={17}/>{copy.submitNote}</p>
              <button className="primary" onClick={submit} disabled={loading}>{loading?copy.checking:t.checkAll}<ArrowRight size={16}/></button>
            </div>
          </div>
        </div>
        <div className="eligibility-visual">
          <img src={images.farmer} alt="Farmer checking scheme information"/>
          <div className="result"><CheckCircle2/><h2>{t.oneCheck}</h2><p>{t.compareAll}</p></div>
        </div>
      </main>
      <aside className="eligibility-side-card">
        <span className="eligibility-side-icon"><ShieldCheck size={21}/></span>
        <h2>{copy.howWorks}</h2>
        <ol>
          <li><span>1</span><div><b>{copy.share}</b><p>{copy.shareHelp}</p></div></li>
          <li><span>2</span><div><b>{copy.review}</b><p>{copy.reviewHelp}</p></div></li>
          <li><span>3</span><div><b>{copy.confirm}</b><p>{copy.confirmHelp}</p></div></li>
        </ol>
        <div className="eligibility-side-note"><b>{copy.important}</b><p>{copy.finalDecision}</p></div>
      </aside>
    </div>
    {result&&<section className="eligibility-results" aria-live="polite">
      <div className="eligibility-results-heading">
        <div><span className="eyebrow green">{t.result}</span><h2>{copy.results}</h2></div>
        {sorted.length>0&&<span className="eligibility-match-count">{sorted.length} {sorted.length===1?copy.match:copy.matches}</span>}
      </div>
      {result.notice&&<p className="eligibility-result-notice">{result.notice}</p>}
      {result.missing_information?.length>0&&<div className="eligibility-incomplete" role="status">
        <b>{copy.complete}</b>
        <span>{copy.provide}: {result.missing_information.join(", ").replaceAll("_"," ")}.</span>
      </div>}
      {sorted.length===0&&(!result.missing_information||result.missing_information.length===0)&&<div className="eligibility-empty">
        <ShieldCheck size={23}/><div><b>{copy.noMatches}</b><p>{copy.noMatchesHelp}</p></div>
      </div>}
      <div className="eligibility-result-list">{sorted.map(item=>{
        const display=localizeResultItem(item,lang);
        const potential=item.status.includes("Potentially");
        return <article className={`eligibility-result-card ${potential?"potential":"not-match"}`} key={item.scheme_id}>
          <div className="eligibility-result-top">
            <div><span className="eligibility-category">{item.category}</span><h3>{display.scheme}</h3></div>
            <span className={`eligibility-status ${potential?"positive":"neutral"}`}><CheckCircle2 size={15}/>{potential?copy.potentiallyEligible:copy.noLongerMatched}</span>
          </div>
          <p className="eligibility-benefit">{display.benefits}</p>
          {item.reasons?.length>0&&<p className="eligibility-detail"><b>{t.why}:</b> {item.reasons.join(" ")}</p>}
          {item.warnings?.length>0&&<p className="eligibility-detail eligibility-warning"><b>{t.important}:</b> {item.warnings.join(" ")}</p>}
          <div className="result-actions"><a className="primary" href={item.application_link} target="_blank" rel="noreferrer">{t.officialWebsite}<ArrowRight size={15}/></a><SchemeMiniDetails schemeId={item.scheme_id} lang={lang} t={t}/></div>
        </article>
      })}</div>
    </section>}
  </section>
}

function SchemeMiniDetails({schemeId,lang,t}){
  const [data,setData]=useState(null); useEffect(()=>{api.getScheme(schemeId).then(d=>setData(localizedScheme(d,lang))).catch(()=>{})},[schemeId,lang]);
  if(!data)return <span className="loading-inline">{t.loading}</span>;
  return <details className="scheme-mini-details"><summary>{t.eligibilityDetails}, {t.requiredDocuments} & {t.howToApply}</summary><div><h4>{t.eligibilityDetails}</h4><p>{data.eligibility?.[0]?.other_conditions||t.seeOfficialRules}</p><h4>{t.requiredDocuments}</h4><ul>{data.documents?.map(d=><li key={d.document_id}><b>{d.document_name}</b> — {d.mandatory?t.required:t.mayBeRequired}{d.description&&<small className="doc-explanation">{d.description}</small>}</li>)}</ul><h4>{t.howToApply}</h4><ol>{data.application_steps?.map(s=><li key={s.step_order}><b>{s.title}</b>{s.description?`: ${s.description}`:""}</li>)}</ol><a className="primary" href={data.application_link} target="_blank" rel="noreferrer">{t.officialWebsite} <ArrowRight size={15}/></a></div></details>
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
    const allowed=["application/pdf","image/jpeg","image/png"];
    if(!allowed.includes(file.type)){
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
        <span className="documents-help-icon"><HelpCircle size={21}/></span>
        <h2>Before you choose files</h2>
        <ul><li>Use a clear scan or photo with all details visible.</li><li>Accepted formats: PDF, JPG, and PNG.</li><li>Maximum file size: 10 MB per document.</li><li>Check the official scheme portal for its exact requirements.</li></ul>
        <div className="documents-help-callout"><b>{t.needHelp}</b><p>{t.supportTeam}</p><button className="outline" type="button">{t.contactSupport}</button></div>
      </aside>
    </div>
  </section>
}

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
