/**
 * DYNAMIC GUARDIAN AI STATE PROMPT GENERATOR
 * Generates context-grounded, state-tailored suggested queries for Guardian AI
 * across all 36 Indian States and Union Territories in EN, HI, and KN.
 */

import type { IndianStateData } from "./india-safety-data";

export type SupportedLanguage = "en" | "hi" | "kn";

interface CuratedStatePrompts {
  en: string[];
  hi: string[];
  kn: string[];
}

const CURATED_STATE_PROMPTS: Record<string, CuratedStatePrompts> = {
  KA: {
    en: [
      "Is it safe to walk around Cubbon Park & MG Road right now?",
      "Where is the nearest Karnataka Tourist Police help desk in Bengaluru?",
      "What is the weather and crowd risk in Bengaluru today?",
      "Show me the safest route to MG Road metro station",
      "Emergency numbers for Hampi and Western Ghats trekking zones",
    ],
    hi: [
      "क्या इस समय कब्बन पार्क और एमजी रोड पर घूमना सुरक्षित है?",
      "बेंगलुरु में निकटतम कर्नाटक पर्यटन पुलिस डेस्क कहाँ है?",
      "आज बेंगलुरु में मौसम और भीड़ का जोखिम क्या है?",
      "एमजी रोड मेट्रो स्टेशन का सबसे सुरक्षित मार्ग दिखाएं",
      "कर्नाटक 112 और महिला हेल्पलाइन 1091 संपर्क विवरण",
    ],
    kn: [
      "ಈ ಸಮಯದಲ್ಲಿ ಕಬ್ಬನ್ ಪಾರ್ಕ್ ಮತ್ತು ಎಂಜಿ ರಸ್ತೆ ಸುತ್ತಲೂ ನಡೆಯುವುದು ಸುರಕ್ಷಿತವೇ?",
      "ಬೆಂಗಳೂರಿನಲ್ಲಿ ಹತ್ತಿರದ ಕರ್ನಾಟಕ ಪ್ರವಾಸಿ ಪೊಲೀಸ್ ಸಹಾಯ ಕೇಂದ್ರ ಎಲ್ಲಿದೆ?",
      "ಇಂದು ಬೆಂಗಳೂರಿನಲ್ಲಿ ಹವಾಮಾನ ಮತ್ತು ಜನಸಂದಣಿಯ ಅಪಾಯವೇನು?",
      "ಎಂಜಿ ರಸ್ತೆ ಮೆಟ್ರೋ ನಿಲ್ದಾಣಕ್ಕೆ ಸುರಕ್ಷಿತ ಮಾರ್ಗವನ್ನು ತೋರಿಸಿ",
      "ಕರ್ನಾಟಕ 112 ಮತ್ತು ಮಹಿಳಾ ಸಹಾಯವಾಣಿ 1091 ತುರ್ತು ಸಂಖ್ಯೆಗಳು",
    ],
  },
  RJ: {
    en: [
      "Is it safe to visit Hawa Mahal & Johari Bazaar after dark?",
      "Where is the nearest Rajasthan Tourist Police booth in Jaipur?",
      "What is the heat & crowd advisory for Jaipur and Amber Fort today?",
      "Safest monitored route from Jaipur Junction to Pink City heritage zone",
      "Desert safari emergency numbers and verified medical posts in Jaisalmer",
    ],
    hi: [
      "क्या रात में हवा महल और जौहरी बाज़ार घूमना सुरक्षित है?",
      "जयपुर में निकटतम राजस्थान पर्यटन पुलिस सहायता केंद्र कहाँ है?",
      "जयपुर और आमेर किले के लिए आज गर्मी और भीड़ की सलाह क्या है?",
      "पिंक सिटी हेरिटेज ज़ोन के लिए सबसे सुरक्षित मार्ग दिखाएं",
      "राजस्थान महिला सुरक्षा हेल्पलाइन और 112 सहायता नंबर",
    ],
    kn: [
      "ರಾತ್ರಿ ವೇಳೆ ಹವಾ ಮಹಲ್ ಮತ್ತು ಮಾರುಕಟ್ಟೆಗಳಿಗೆ ಭೇಟಿ ನೀಡುವುದು ಸುರಕ್ಷಿತವೇ?",
      "ಜೈಪುರದಲ್ಲಿ ಹತ್ತಿರದ ಪ್ರವಾಸಿ ಪೊಲೀಸ್ ಸಹಾಯ ಕೇಂದ್ರ ಎಲ್ಲಿದೆ?",
      "ಜೈಪುರ ಮತ್ತು ಅಂಬರ್ ಕೋಟೆಗೆ ಜನಸಂದಣಿ ಮತ್ತು ಹವಾಮಾನ ಸಲಹೆಗಳೇನು?",
      "ಪಿಂಕ್ ಸಿಟಿ ಪಾರಂಪರಿಕ ಪ್ರದೇಶಕ್ಕೆ ಸುರಕ್ಷಿತ ಮಾರ್ಗವನ್ನು ತೋರಿಸಿ",
      "ರಾಜಸ್ಥಾನ ಮಹಿಳಾ ಸಹಾಯವಾಣಿ ಮತ್ತು ತುರ್ತು ಸಂಖ್ಯೆಗಳು",
    ],
  },
  DL: {
    en: [
      "Is it safe around Chandni Chowk & Red Fort corridor right now?",
      "Delhi Tourist Police Help Desk contact at Janpath & Connaught Place?",
      "Current air quality and transit crowd risk in New Delhi",
      "Safest monitored metro route to Indira Gandhi Airport (IGI T3)",
      "Delhi 181 Women Safety & PCR van quick response dispatch numbers",
    ],
    hi: [
      "क्या इस समय चांदनी चौक और लाल किला क्षेत्र में जाना सुरक्षित है?",
      "कनॉट प्लेस और जनपथ में दिल्ली पर्यटन पुलिस सहायता केंद्र?",
      "नई दिल्ली में वर्तमान वायु गुणवत्ता और भीड़ का जोखिम क्या है?",
      "इंदिरा गांधी हवाई अड्डे (T3) के लिए सबसे सुरक्षित मेट्रो मार्ग दिखाएं",
      "दिल्ली 181 महिला सुरक्षा और पीसीआर वैन आपातकालीन संपर्क",
    ],
    kn: [
      "ಈ ಸಮಯದಲ್ಲಿ ಚಾಂದಿನಿ ಚೌಕ್ ಮತ್ತು ಕೆಂಪು ಕೋಟೆ ಪ್ರದೇಶ ಸುರಕ್ಷಿತವೇ?",
      "ಕನ್ನಾಟ್ ಪ್ಲೇಸ್‌ನಲ್ಲಿ ದೆಹಲಿ ಪ್ರವಾಸಿ ಪೊಲೀಸ್ ಸಹಾಯ ಕೇಂದ್ರ ಎಲ್ಲಿದೆ?",
      "ನವದೆಹಲಿಯಲ್ಲಿ ಪ್ರಸ್ತುತ ಗಾಳಿಯ ಗುಣಮಟ್ಟ ಮತ್ತು ಜನದಟ್ಟಣೆಯ ಅಪಾಯವೇನು?",
      "ದೆಹಲಿ ವಿಮಾನ ನಿಲ್ದಾಣಕ್ಕೆ (IGI T3) ಅತ್ಯಂತ ಸುರಕ್ಷಿತ ಮೆಟ್ರೋ ಮಾರ್ಗ",
      "ದೆಹಲಿ 181 ಮಹಿಳಾ ಸಹಾಯವಾಣಿ ಮತ್ತು ಪಿಸಿಆರ್ ವ್ಯಾನ್ ಸಂಪರ್ಕ",
    ],
  },
  MH: {
    en: [
      "Is Marine Drive & Gateway of India corridor safe tonight?",
      "Mumbai Tourist Police outpost contact near Colaba & Fort?",
      "Local train rush hour crowd advisory and coastal weather status",
      "Safest walking detour from CSMT station to hotel district",
      "Maharashtra 112 and Railway Police (GRP) emergency numbers",
    ],
    hi: [
      "क्या आज रात मरीन ड्राइव और गेटवे ऑफ इंडिया सुरक्षित है?",
      "कोलाबा के पास मुंबई पर्यटन पुलिस सहायता केंद्र कहाँ है?",
      "लोकल ट्रेन भीड़ का समय और मुंबई तटीय मौसम परामर्श",
      "सीएसएमटी स्टेशन से होटल क्षेत्र के लिए सबसे सुरक्षित पैदल मार्ग",
      "महाराष्ट्र 112 और रेलवे पुलिस (GRP) आपातकालीन नंबर",
    ],
    kn: [
      "ಇಂದು ರಾತ್ರಿ ಮರೀನ್ ಡ್ರೈವ್ ಮತ್ತು ಗೇಟ್‌ವೇ ಆಫ್ ಇಂಡಿಯಾ ಸುರಕ್ಷಿತವೇ?",
      "ಕೊಲಾಬಾ ಬಳಿ ಮುಂಬೈ ಪ್ರವಾಸಿ ಪೊಲೀಸ್ ಸಹಾಯ ಕೇಂದ್ರ ಎಲ್ಲಿದೆ?",
      "ಸ್ಥಳೀಯ ರೈಲು ಜನದಟ್ಟಣೆ ಮತ್ತು ಕರಾವಳಿ ಹವಾಮಾನ ಪರಿಸ್ಥಿತಿ ಏನು?",
      "ಸಿಎಸ್‌ಎಂಟಿ ನಿಲ್ದಾಣದಿಂದ ಸುರಕ್ಷಿತ ಪರ್ಯಾಯ ಮಾರ್ಗವನ್ನು ತೋರಿಸಿ",
      "ಮಹಾರಾಷ್ಟ್ರ 112 ಮತ್ತು ರೈಲ್ವೆ ಪೊಲೀಸ್ ತುರ್ತು ಸಂಖ್ಯೆಗಳು",
    ],
  },
  GA: {
    en: [
      "Are Baga, Calangute, and Anjuna beaches safe for late night walks?",
      "Goa Tourist Police & Beach Lifeguard emergency contact numbers?",
      "High tide, monsoon, and coastal weather advisory for North Goa",
      "Safest transit route from beach corridor to Panaji capital",
      "How to report unauthorized taxi overcharging or tout harassment in Goa?",
    ],
    hi: [
      "क्या रात में बागा और कलंगूट बीच पर घूमना सुरक्षित है?",
      "गोवा पर्यटन पुलिस और बीच लाइफगार्ड आपातकालीन संपर्क?",
      "उत्तरी गोवा के लिए उच्च ज्वार और तटीय मौसम चेतावनी",
      "बीच क्षेत्र से पणजी राजधानी तक का सबसे सुरक्षित मार्ग",
      "गोवा में आपातकालीन 112 और महिला सुरक्षा हेल्पलाइन",
    ],
    kn: [
      "ರಾತ್ರಿ ಸಮಯದಲ್ಲಿ ಬಾಗಾ ಮತ್ತು ಕಲಂಗೂಟ್ ಕಡಲತೀರಗಳಲ್ಲಿ ನಡೆಯುವುದು ಸುರಕ್ಷಿತವೇ?",
      "ಗೋವಾ ಪ್ರವಾಸಿ ಪೊಲೀಸ್ ಮತ್ತು ಬೀಚ್ ಲೈಫ್‌ಗಾರ್ಡ್ ತುರ್ತು ಸಂಖ್ಯೆ ಎಲ್ಲಿದೆ?",
      "ಉತ್ತರ ಗೋವಾದ ಕರಾವಳಿ ಹವಾಮಾನ ಮತ್ತು ಅಲೆಗಳ ಎಚ್ಚರಿಕೆ ಏನು?",
      "ಕಡಲತೀರದಿಂದ ಪಣಜಿಗೆ ಅತ್ಯಂತ ಸುರಕ್ಷಿತ ಸಂಚಾರ ಮಾರ್ಗ ತೋರಿಸಿ",
      "ಗೋವಾ ಮಹಿಳಾ ಸುರಕ್ಷತಾ ಸಹಾಯವಾಣಿ ಮತ್ತು ತುರ್ತು ಸಂಪರ್ಕಗಳು",
    ],
  },
  HP: {
    en: [
      "Are the mountain passes and Mall Road in Shimla open safely?",
      "Himachal Tourist Police & State Disaster Management (1070) helpline?",
      "Landslide and heavy snowfall / rainfall risk advisory in Manali?",
      "Safest all-weather transit corridor from Kullu to Manali",
      "High-altitude sickness emergency posts and 108 ambulance contacts",
    ],
    hi: [
      "क्या शिमला में मॉल रोड और पहाड़ी रास्ते आज सुरक्षित हैं?",
      "हिमाचल पर्यटन पुलिस और आपदा प्रबंधन (1070) हेल्पलाइन?",
      "मनाली में भूस्खलन और भारी बारिश/बर्फबारी की चेतावनी क्या है?",
      "कुल्लू से मनाली के लिए सबसे सुरक्षित ऑल-वेदर मार्ग दिखाएं",
      "हिमाचल 112 और आपातकालीन स्वास्थ्य सेवा संपर्क",
    ],
    kn: [
      "ಶಿಮ್ಲಾದ ಮಾಲ್ ರೋಡ್ ಮತ್ತು ಪರ್ವತ ಮಾರ್ಗಗಳು ಇಂದು ಸುರಕ್ಷಿತವೇ?",
      "ಹಿಮಾಚಲ ಪ್ರವಾಸಿ ಪೊಲೀಸ್ ಮತ್ತು ವಿಪತ್ತು ನಿರ್ವಹಣಾ ಸಹಾಯವಾಣಿ ಎಲ್ಲಿದೆ?",
      "ಮನಾಲಿಯಲ್ಲಿ ಭೂಕುಸಿತ ಮತ್ತು ಹಿಮಪಾತದ ಅಪಾಯದ ಸಲಹೆಗಳು ಯಾವುವು?",
      "ಕುಲ್ಲು ಮತ್ತು ಮನಾಲಿ ನಡುವೆ ಅತ್ಯಂತ ಸುರಕ್ಷಿತ ಸಂಚಾರ ಮಾರ್ಗ ತೋರಿಸಿ",
      "ಹಿಮಾಚಲ ಪ್ರದೇಶ ತುರ್ತು ವೈದ್ಯಕೀಯ ಸೇವೆಗಳು ಮತ್ತು 112 ಸಂಪರ್ಕ",
    ],
  },
  KL: {
    en: [
      "Is Fort Kochi & coastal promenade safe for evening strolls?",
      "Kerala Tourist Police & Coastal Patrol helpline contact?",
      "Monsoon backwater flood alert & high sea swell warning?",
      "Safest transit route from Mattancherry to Ernakulam Junction",
      "Kerala 112 & Women Helpline 1091 emergency details",
    ],
    hi: [
      "क्या फोर्ट कोच्चि और समुद्र तट शाम को घूमने के लिए सुरक्षित है?",
      "केरल पर्यटन पुलिस और तटीय गश्ती दल सहायता संपर्क?",
      "मानसून में बैकवाटर और भारी वर्षा की चेतावनी क्या है?",
      "मट्टनचेरी से एर्नाकुलम जंक्शन का सबसे सुरक्षित मार्ग दिखाएं",
      "केरल महिला सुरक्षा 1091 और 112 आपातकालीन नंबर",
    ],
    kn: [
      "ಫೋರ್ಟ್ ಕೊಚ್ಚಿ ಮತ್ತು ಕರಾವಳಿ ವಾಯುವಿಹಾರ ಇಂದು ಸುರಕ್ಷಿತವೇ?",
      "ಕೇರಳ ಪ್ರವಾಸಿ ಪೊಲೀಸ್ ಮತ್ತು ಕರಾವಳಿ ಗಸ್ತು ದಳದ ಸಂಪರ್ಕ ಸಂಖ್ಯೆ ಯಾವುದು?",
      "ಹಿನ್ನೀರು ಮತ್ತು ಮಳೆಗಾಲದ ಪ್ರವಾಹದ ಮುನ್ನೆಚ್ಚರಿಕೆ ಪರಿಸ್ಥಿತಿ ಏನು?",
      "ಎರ್ನಾಕುಲಂ ಜಂಕ್ಷನ್‌ಗೆ ಅತ್ಯಂತ ಸುರಕ್ಷಿತ ಸಂಚಾರ ಮಾರ್ಗ ಯಾವುದು?",
      "ಕೇರಳ 112 ಮತ್ತು ಮಹಿಳಾ ಸಹಾಯವಾಣಿ 1091 ತುರ್ತು ಮಾಹಿತಿ",
    ],
  },
  LA: {
    en: [
      "Is Pangong Lake route open and oxygen medical post available?",
      "Leh Tourist Police and high-altitude rescue helpline?",
      "Sub-zero temperature, AMS advisory, and road conditions across Khardung La?",
      "Safest travel corridor between Leh and Nubra Valley",
      "Ladakh 112 emergency rescue and military medical base locations",
    ],
    hi: [
      "क्या पैंगोंग झील का मार्ग खुला है और ऑक्सीजन केंद्र उपलब्ध है?",
      "लेह पर्यटन पुलिस और उच्च ऊंचाई बचाव हेल्पलाइन?",
      "खारदुंग ला में तापमान और सड़क की स्थिति की जानकारी दें",
      "लेह और नुब्रा घाटी के बीच सबसे सुरक्षित यात्रा मार्ग",
      "लद्दाख 112 आपातकालीन बचाव और अस्पताल संपर्क",
    ],
    kn: [
      "ಪ್ಯಾಂಗಾಂಗ್ ಸರೋವರದ ಮಾರ್ಗ ತೆರೆದಿದೆಯೇ ಮತ್ತು ಆಮ್ಲಜನಕ ಸೌಲಭ್ಯವಿದೆಯೇ?",
      "ಲೇಹ್ ಪ್ರವಾಸಿ ಪೊಲೀಸ್ ಮತ್ತು ತುರ್ತು ರಕ್ಷಣಾ ಸಹಾಯವಾಣಿ ಎಲ್ಲಿದೆ?",
      "ಖಾರ್ದುಂಗ್ ಲಾ ರಸ್ತೆ ಪರಿಸ್ಥಿತಿ ಮತ್ತು ಶೀತ ಹವಾಮಾನ ಎಚ್ಚರಿಕೆ ಏನು?",
      "ಲೇಹ್ ಮತ್ತು ನುಬ್ರಾ ಕಣಿವೆ ನಡುವೆ ಅತ್ಯಂತ ಸುರಕ್ಷಿತ ಮಾರ್ಗ ತೋರಿಸಿ",
      "ಲಡಾಖ್ 112 ತುರ್ತು ರಕ್ಷಣಾ ಸಂಪರ್ಕಗಳು",
    ],
  },
  UK: {
    en: [
      "Are Rishikesh ghats and mountain trekking trails safe today?",
      "Uttarakhand Tourist Police & SDRF disaster helpline contact?",
      "Char Dham route weather and landslide alert status?",
      "Safest travel corridor from Haridwar to Rishikesh and Dehradun",
      "State emergency helpline 112 and pilgrimage assistance desks",
    ],
    hi: [
      "क्या ऋषिकेश के घाट और ट्रैकिंग ट्रेल्स आज सुरक्षित हैं?",
      "उत्तराखंड पर्यटन पुलिस और एसडीआरएफ आपदा हेल्पलाइन संपर्क?",
      "चार धाम यात्रा मार्ग पर मौसम और भूस्खलन की क्या स्थिति है?",
      "हरिद्वार से ऋषिकेश और देहरादून का सबसे सुरक्षित मार्ग",
      "उत्तराखंड 112 और तीर्थयात्री सहायता केंद्र विवरण",
    ],
    kn: [
      "ಋಷಿಕೇಶದ ಘಾಟ್‌ಗಳು ಮತ್ತು ಟ್ರೆಕ್ಕಿಂಗ್ ಹಾದಿಗಳು ಇಂದು ಸುರಕ್ಷಿತವೇ?",
      "ಉತ್ತರಾಖಂಡ ಪ್ರವಾಸಿ ಪೊಲೀಸ್ ಮತ್ತು ಎಸ್‌ಡಿಆರ್‌ಎಫ್ ಸಹಾಯವಾಣಿ ಯಾವುದು?",
      "ಚಾರ್ ಧಾಮ್ ಯಾತ್ರಾ ಮಾರ್ಗದ ಹವಾಮಾನ ಮತ್ತು ಭೂಕುಸಿತದ ಪರಿಸ್ಥಿತಿ ಏನು?",
      "ಹರಿದ್ವಾರದಿಂದ ಋಷಿಕೇಶಕ್ಕೆ ಅತ್ಯಂತ ಸುರಕ್ಷಿತ ಸಂಚಾರ ಮಾರ್ಗ",
      "ಉತ್ತರಾಖಂಡ 112 ಮತ್ತು ಯಾತ್ರಾರ್ಥಿ ಸಹಾಯ ಕೇಂದ್ರ ಮಾಹಿತಿ",
    ],
  },
  TN: {
    en: [
      "Is Marina Beach and Mahabalipuram shore safe for evening visits?",
      "Tamil Nadu Tourist Police help desk near Chennai Central?",
      "Coastal weather warning and temple corridor crowd status?",
      "Safest route from Chennai airport to historic temple monuments",
      "Tamil Nadu 112 and Women Helpline 1091 emergency contacts",
    ],
    hi: [
      "क्या मरीना बीच और महाबलीपुरम शाम को घूमने के लिए सुरक्षित है?",
      "चेन्नई सेंट्रल के पास तमिलनाडु पर्यटन पुलिस डेस्क कहाँ है?",
      "तटीय मौसम चेतावनी और मंदिर परिसर में भीड़ की स्थिति?",
      "चेन्नई हवाई अड्डे से मुख्य स्मारकों के लिए सबसे सुरक्षित मार्ग",
      "तमिलनाडु 112 और महिला हेल्पलाइन 1091 संपर्क",
    ],
    kn: [
      "ಮೆರೀನಾ ಬೀಚ್ ಮತ್ತು ಮಹಾಬಲಿಪುರಂ ಕರಾವಳಿ ಇಂದು ಸುರಕ್ಷಿತವೇ?",
      "ಚೆನ್ನೈನಲ್ಲಿ ತಮಿಳುನಾಡು ಪ್ರವಾಸಿ ಪೊಲೀಸ್ ಸಹಾಯ ಕೇಂದ್ರ ಎಲ್ಲಿದೆ?",
      "ಕರಾವಳಿ ಹವಾಮಾನ ಎಚ್ಚರಿಕೆ ಮತ್ತು ದೇವಾಲಯಗಳ ಜನದಟ್ಟಣೆ ಪರಿಸ್ಥಿತಿ ಏನು?",
      "ಚೆನ್ನೈ ವಿಮಾನ ನಿಲ್ದಾಣದಿಂದ ಸುರಕ್ಷಿತ ಪರ್ಯಾಯ ಮಾರ್ಗ ತೋರಿಸಿ",
      "ತಮಿಳುನಾಡು 112 ಮತ್ತು ಮಹಿಳಾ ಸಹಾಯವಾಣಿ ತುರ್ತು ಸಂಖ್ಯೆಗಳು",
    ],
  },
};

/**
 * Procedurally generates context-rich localized queries for any of India's 36 States/UTs.
 */
function generateProceduralStatePrompts(
  state: IndianStateData,
  lang: SupportedLanguage
): string[] {
  const primaryDest =
    state.popularDestinations?.[0] || state.defaultLocationName || state.capital;
  const secondaryDest =
    state.popularDestinations?.[1] || state.capital || state.name;
  const policeHelpline = state.emergency?.touristPolice || state.emergency?.police || "112";
  const capital = state.capital || state.name;
  const safePoint = state.safePoints?.[0]?.name || `${capital} Police Control Room`;
  const riskZone = state.riskZones?.[0]?.name || "dense market areas";

  if (lang === "hi") {
    return [
      `क्या इस समय ${primaryDest} के आसपास घूमना सुरक्षित है?`,
      `${capital} में निकटतम ${state.name} पर्यटन पुलिस सहायता केंद्र कहाँ है?`,
      `आज ${state.name} में मौसम, आपदा और भीड़ का जोखिम क्या है?`,
      `${riskZone} से बचने के लिए ${safePoint} का सुरक्षित मार्ग दिखाएं`,
      `${state.name} महिला सुरक्षा हेल्पलाइन (${state.emergency?.womenHelpline || "1091"}) और आपातकालीन 112 विवरण`,
    ];
  }

  if (lang === "kn") {
    return [
      `ಈ ಸಮಯದಲ್ಲಿ ${primaryDest} ಸುತ್ತಲೂ ಭೇಟಿ ನೀಡುವುದು ಸುರಕ್ಷಿತವೇ?`,
      `${capital} ನಲ್ಲಿ ಹತ್ತಿರದ ${state.name} ಪ್ರವಾಸಿ ಪೊಲೀಸ್ ಸಹಾಯ ಕೇಂದ್ರ ಎಲ್ಲಿದೆ?`,
      `ಇಂದು ${state.name} ನಲ್ಲಿ ಹವಾಮಾನ ಮತ್ತು ಜನಸಂದಣಿಯ ಅಪಾಯವೇನು?`,
      `${safePoint} ಗೆ ಹೋಗಲು ಅತ್ಯಂತ ಸುರಕ್ಷಿತ ಪರ್ಯಾಯ ಮಾರ್ಗವನ್ನು ತೋರಿಸಿ`,
      `${state.name} ಮಹಿಳಾ ಸಹಾಯವಾಣಿ (${state.emergency?.womenHelpline || "1091"}) ಮತ್ತು 112 ತುರ್ತು ಸಂಖ್ಯೆಗಳು`,
    ];
  }

  // Default English
  return [
    `Is it safe to visit ${primaryDest} right now?`,
    `Where is the nearest Tourist Police help desk in ${capital} (${state.name})?`,
    `What is the weather, terrain hazard, and crowd advisory in ${state.name} today?`,
    `Show me the safest monitored corridor to ${safePoint}`,
    `Emergency numbers for ${state.name} (Tourist Police: ${policeHelpline} | Central SOS: 112)`,
  ];
}

/**
 * Returns dynamic, context-grounded suggested queries for the active state and language.
 */
export function getStateSuggestedQueries(
  state?: IndianStateData,
  language: SupportedLanguage = "en"
): string[] {
  if (!state) {
    return [
      "Is my current zone safe to walk around right now?",
      "Where is the nearest tourist police help desk?",
      "What is the weather and crowd risk in this area?",
      "Show me the safest verified route detour option",
      "Emergency SOS and police helpline numbers",
    ];
  }

  const curated = CURATED_STATE_PROMPTS[state.code];
  if (curated && curated[language]) {
    return curated[language];
  }

  return generateProceduralStatePrompts(state, language);
}
