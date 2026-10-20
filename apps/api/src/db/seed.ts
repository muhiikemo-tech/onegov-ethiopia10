import { db, withTransaction } from "./pg.js";

async function main() {
  console.log("🌱 Seeding database with extensive MESOB services & custom forms...");

  await withTransaction(async (client) => {
    // 1. Categories
    const categories = [
      { slug: "identity", en: "Identity & Passport", am: "ማንነት እና ፓስፖርት", om: "Eenyummaa fi Paaspoortii" },
      { slug: "business", en: "Business & Trade", am: "ንግድ", om: "Daldala" },
      { slug: "tax", en: "Revenue & Tax", am: "ገቢ እና ግብር", om: "Galii fi Gibira" },
      { slug: "transport", en: "Transport & Vehicles", am: "ትራንስፖርት", om: "Transport" },
      { slug: "health", en: "Health & Medical", am: "ጤና", om: "Fayyaa" },
      { slug: "education", en: "Education & Schools", am: "ትምህርት", om: "Barnoota" },
      { slug: "land", en: "Land & Property", am: "መሬት እና ንብረት", om: "Lafa fi Qabeenya" },
      { slug: "justice", en: "Justice & Documents", am: "ፍትህ እና ሰነዶች", om: "Dhugaa fi Sanada" },
      { slug: "utility", en: "Utilities & Telecom", am: "መሰረተ ልማት", om: "Tajaajila Bu'uuraa" },
      { slug: "fayda", en: "Fayda National ID", am: "ፋይዳ", om: "Fayda" },
    ];
    
    for (const cat of categories) {
      await client.query(
        `INSERT INTO "ServiceCategory" (id, slug, "nameJson") 
         VALUES (gen_random_uuid()::text, $1, $2) ON CONFLICT (slug) DO NOTHING`,
        [cat.slug, JSON.stringify({ en: cat.en, am: cat.am, om: cat.om })]
      );
    }

    // 2. Services with CUSTOM form fields
    const services = [
      // --- Identity ---
      { slug: "renew-passport", cat: "identity", en: "Renew Passport", am: "ፓስፖርት አድስ", om: "Paaspoortii Haaromsi", fee: 1000, days: 10, 
        fields: [{ id: "oldPassportNumber", label: { en: "Old Passport Number", am: "የድሮ ፓስፖርት ቁጥር", om: "Lakkoofsa Paaspoortii Duraanii" }, type: "text", required: true }] },
      
      { slug: "birth-certificate", cat: "justice", en: "Birth Certificate", am: "የልደት የምስክር ወረቀት", om: "Ragaa Dhalootaa", fee: 50, days: 3, 
        fields: [
          { id: "dateOfBirth", label: { en: "Date of Birth", am: "የትውልድ ቀን", om: "Guyyaa Dhalootaa" }, type: "date", required: true },
          { id: "motherName", label: { en: "Mother's Full Name", am: "የእናት ሙሉ ስም", om: "Maqaa Haadhaa" }, type: "text", required: true },
          { id: "placeOfBirth", label: { en: "Place of Birth (City/Region)", am: "የትውልድ ቦታ", om: "Bakka Dhalootaa" }, type: "text", required: true }
        ] },{ slug: "birth-certificate", cat: "justice", en: "Birth Certificate", am: "የልደት የምስክር ወረቀት", om: "Ragaa Dhalootaa", fee: 50, days: 3, 
  fields: [
    { id: "fullName", label: { en: "Full Name (Child)", am: "ሙሉ ስም (ልጅ)", om: "Maqaa Guutuu (Daa'imaa)" }, type: "text", required: true },
    { id: "dateOfBirth", label: { en: "Date of Birth", am: "የትውልድ ቀን", om: "Guyyaa Dhalootaa" }, type: "date", required: true },
    { id: "motherName", label: { en: "Mother's Full Name", am: "የእናት ሙሉ ስም", om: "Maqaa Haadhaa" }, type: "text", required: true },
    { id: "placeOfBirth", label: { en: "Place of Birth (City/Region)", am: "የትውልድ ቦታ", om: "Bakka Dhalootaa" }, type: "text", required: true }
  ] },
      { slug: "marriage-certificate", cat: "justice", en: "Marriage Certificate", am: "የጋብቻ የምስክር ወረቀት", om: "Ragaa Gaa'elaa", fee: 100, days: 5, 
        fields: [
          { id: "spouseName", label: { en: "Spouse Full Name", am: "የባል/ሚስት ሙሉ ስም", om: "Maqaa Hiriyaa" }, type: "text", required: true },
          { id: "marriageDate", label: { en: "Date of Marriage", am: "የጋብቻ ቀን", om: "Guyyaa Gaa'elaa" }, type: "date", required: true }
        ] },

      // --- Business ---
      { slug: "register-business", cat: "business", en: "Register Business Name", am: "የንግድ ስም ምዝገባ", om: "Maqaa Daldalaa Galmeessi", fee: 500, days: 5, 
        fields: [
          { id: "businessName", label: { en: "Proposed Business Name", am: "የሚመዘገብ የንግድ ስም", om: "Maqaa Daldalaa" }, type: "text", required: true },
          { id: "businessType", label: { en: "Business Type", am: "የንግድ ዓይነት", om: "Gosa Daldalaa" }, type: "select", options: ["Sole Proprietor", "PLC", "Share Company"], required: true }
        ] },

      { slug: "business-license", cat: "business", en: "Business License", am: "የንግድ ፈቃድ", om: "Hayyama Daldalaa", fee: 750, days: 7, 
        fields: [
          { id: "tinNumber", label: { en: "TIN Number", am: "TIN ቁጥር", om: "Lakkoofsa TIN" }, type: "text", required: true },
          { id: "capital", label: { en: "Capital (ETB)", am: "ካፒታል", om: "Kaappitaala" }, type: "number", required: true }
        ] },

      // --- Tax ---
      { slug: "tin-registration", cat: "tax", en: "TIN Registration", am: "TIN ምዝገባ", om: "Galmee TIN", fee: 0, days: 1, 
        fields: [
          { id: "tinType", label: { en: "TIN Type", am: "የTIN ዓይነት", om: "Gosa TIN" }, type: "select", options: ["Individual", "Business"], required: true }
        ] },

      // --- Transport ---
      { slug: "driver-license", cat: "transport", en: "Driver License Renewal", am: "የመንጃ ፈቃድ እድሳት", om: "Hayyama Konkolaachisaa Haaromsi", fee: 300, days: 3, 
        fields: [
          { id: "licenseNumber", label: { en: "License Number", am: "የፈቃድ ቁጥር", om: "Lakkoofsa Hayyamaa" }, type: "text", required: true },
          { id: "bloodType", label: { en: "Blood Type", am: "የደም ዓይነት", om: "Gosa Dhiigaa" }, type: "select", options: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"], required: true }
        ] },

      // --- Health ---
      { slug: "health-certificate", cat: "health", en: "Health Certificate", am: "የጤና ሰርተፍኬት", om: "Ragaa Fayyaa", fee: 150, days: 2, 
        fields: [
          { id: "bloodType", label: { en: "Blood Type", am: "የደም ዓይነት", om: "Gosa Dhiigaa" }, type: "select", options: ["A+", "B+", "O+", "AB+"], required: true },
          { id: "medicalReason", label: { en: "Reason for Certificate", am: "ለሰርተፍኬቱ ምክንያት", om: "Sababa Ragaa" }, type: "textarea", required: true }
        ] },

      // --- Education ---
      { slug: "school-registration", cat: "education", en: "School Registration", am: "የትምህርት ቤት ምዝገባ", om: "Galmee Mana Barumsaa", fee: 200, days: 5, 
        fields: [
          { id: "gradeLevel", label: { en: "Grade Level", am: "የክፍል ደረጃ", om: "Sadarkaa Kutaa" }, type: "number", required: true },
          { id: "previousSchool", label: { en: "Previous School Name", am: "የቀድሞ ትምህርት ቤት", om: "Mana Barumsaa Duraanii" }, type: "text", required: false }
        ] },

      // --- Land ---
      { slug: "land-registration", cat: "land", en: "Land Registration", am: "የመሬት ምዝገባ", om: "Galmee Lafa", fee: 1500, days: 30, 
        fields: [
          { id: "plotNumber", label: { en: "Plot Number", am: "የመሬት ቁጥር", om: "Lakkoofsa Lafa" }, type: "text", required: true },
          { id: "areaSize", label: { en: "Area Size (sqm)", am: "ስፋት (ካሬ ሜትር)", om: "Bal'ina (sqm)" }, type: "number", required: true }
        ] },

      // --- Others (default form)
      { slug: "replace-passport", cat: "identity", en: "Replace Lost Passport", am: "የጠፋ ፓስፖርት ምትክ", om: "Paaspoortii Bade Bakka Buusi", fee: 1500, days: 15, fields: [] },
      { slug: "national-id", cat: "fayda", en: "National ID (Fayda) Registration", am: "ብሔራዊ መታወቂያ ምዝገባ", om: "Galmee Eenyummaa Biyyaalessaa", fee: 0, days: 5, fields: [] },
      { slug: "sim-registration", cat: "utility", en: "SIM Card Registration", am: "ሲም ካርድ ምዝገባ", om: "Galmee SIM Kaardii", fee: 50, days: 1, fields: [] },
    ];

    for (const svc of services) {
      // Default form if custom fields not provided
      const formSchema = svc.fields.length > 0 ? svc.fields : [
        { id: "reason", label: { en: "Reason / Notes", am: "ምክንያት", om: "Sababa" }, type: "textarea", required: false }
      ];

      await client.query(
        `INSERT INTO "Service" (id, slug, "categoryId", "nameJson", "descriptionJson", fee, currency, "processingDays", "requiredDocuments", "formSchemaJson")
         VALUES (gen_random_uuid()::text, $1, (SELECT id FROM "ServiceCategory" WHERE slug = $2 LIMIT 1), $3, $4, $5, 'ETB', $6, $7, $8)
         ON CONFLICT (slug) DO UPDATE SET "formSchemaJson" = $8`, // Updates form schema if exists
        [
          svc.slug, svc.cat,
          JSON.stringify({ en: svc.en, am: svc.am, om: svc.om }),
          JSON.stringify({ en: `Apply for ${svc.en}`, am: `ለ${svc.am} ያመልክቱ`, om: `${svc.om} iyyadhu` }),
          svc.fee, svc.days,
          JSON.stringify(["Fayda ID", "Supporting Document"]),
          JSON.stringify(formSchema)
        ]
      );
    }
  });

  console.log("✅ Seed complete with custom forms for each service!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
