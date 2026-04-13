const API_ROOT = "templates/1_integrations/api/";
const API_SHARED = API_ROOT + "3_shared api/";
const API_NUM = API_ROOT + "1_num of events/";
const API_EVENTS = API_ROOT + "2_type of events/";

function apiAppendix() {
  return [
    "templates/0_shared/05_End To End Testing And Event Validation.txt",
    "templates/0_shared/06_Resources.txt",
    API_SHARED + "90_A_Creating a Test Partner Account.txt",
    API_SHARED + "91_A_How to Access a Test Tracking Link.txt",
    API_SHARED + "92_A_Ad Code.txt",
    API_SHARED + "93_A_How to Execute an End to End Test with a Test Partner.txt"
  ];
}

function getApiStandardFiles(eventType, eventCount) {
  const overview = eventCount === "1" ? API_NUM + "01_Sale or Lead Overview 1.txt" : API_NUM + "02_Sale or Lead Overview 2.txt";
  const callAndParam = eventType === "sale"
    ? [API_EVENTS + "01_Sale api Call.txt", API_EVENTS + "02_Sale api Parameter Table.txt"]
    : [API_EVENTS + "03_Lead api Call.txt", API_EVENTS + "04_Lead api Parameter Table.txt"];

  return [
    "templates/0_shared/01_Brand Header.txt",
    overview,
    "templates/0_shared/02_Document History.txt",
    API_SHARED + "01_Technical Requirements.txt",
    "templates/0_shared/03_How to Contact impact.com.txt",
    "templates/0_shared/04_Guidelines For Custom Tracking Domains.txt",
    API_SHARED + "03_Capturing and Storing ClickID.txt",
    API_SHARED + "04_Reporting Conversion Events via Conversions API.txt",
    ...callAndParam,
    ...apiAppendix()
  ];
}

function getApiLeadParent2Files() {
  return [
    "templates/0_shared/01_Brand Header.txt",
    API_NUM + "04_Lead Parent Overview 2.txt",
    "templates/0_shared/02_Document History.txt",
    API_SHARED + "02_Technical Requirements Parent & PLA.txt",
    "templates/0_shared/03_How to Contact impact.com.txt",
    "templates/0_shared/04_Guidelines For Custom Tracking Domains.txt",
    API_SHARED + "03_Capturing and Storing ClickID.txt",
    API_SHARED + "04_Reporting Conversion Events via Conversions API.txt",
    API_EVENTS + "03_Lead api Call.txt",
    API_EVENTS + "01_Sale api Call.txt",
    API_EVENTS + "06_Lead Parent Conversions Parameter Table.txt",
    ...apiAppendix()
  ];
}

function getApiSaleParent2Files() {
  return [
    "templates/0_shared/01_Brand Header.txt",
    API_NUM + "03_Sale Parent Overview 2.txt",
    "templates/0_shared/02_Document History.txt",
    API_SHARED + "02_Technical Requirements Parent & PLA.txt",
    "templates/0_shared/03_How to Contact impact.com.txt",
    "templates/0_shared/04_Guidelines For Custom Tracking Domains.txt",
    API_SHARED + "03_Capturing and Storing ClickID.txt",
    API_SHARED + "04_Reporting Conversion Events via Conversions API.txt",
    API_EVENTS + "03_Lead api Call.txt",
    API_EVENTS + "01_Sale api Call.txt",
    API_EVENTS + "05_Sale Parent Conversions Parameter Table.txt",
    ...apiAppendix()
  ];
}

function getApiPlaVariantFiles(overviewFile, finalConversionsParamTable) {
  return [
    "templates/0_shared/01_Brand Header.txt",
    overviewFile,
    "templates/0_shared/02_Document History.txt",
    API_SHARED + "02_Technical Requirements Parent & PLA.txt",
    "templates/0_shared/03_How to Contact impact.com.txt",
    "templates/0_shared/04_Guidelines For Custom Tracking Domains.txt",
    API_SHARED + "03_Capturing and Storing ClickID.txt",
    API_EVENTS + "07_Sale or Lead PLA Call.txt",
    API_EVENTS + "08_Sale or Lead PLA Parameter Table.txt",
    API_EVENTS + "09_Sale or Lead PLA Example Responses.txt",
    API_SHARED + "04_Reporting Conversion Events via Conversions API.txt",
    API_EVENTS + "03_Lead api Call.txt",
    API_EVENTS + "01_Sale api Call.txt",
    finalConversionsParamTable,
    ...apiAppendix()
  ];
}

function getApiFilesByVariant(variant, eventType, eventCount) {
  switch (variant) {
    case "standard":
      return getApiStandardFiles(eventType, eventCount);
    case "lead_parent_2":
      return getApiLeadParent2Files();
    case "sale_parent_2":
      return getApiSaleParent2Files();
    case "lead_sale_pla_2":
      return getApiPlaVariantFiles(API_NUM + "05_Lead & Sale Overview 2.txt", API_EVENTS + "10_Lead & Sale PLA Conversions Parameter Table.txt");
    case "lead_parent_pla_2":
      return getApiPlaVariantFiles(API_NUM + "04_Lead Parent Overview 2.txt", API_EVENTS + "11_Lead Parent PLA Conversions Parameter Table.txt");
    case "sale_parent_pla_2":
      return getApiPlaVariantFiles(API_NUM + "03_Sale Parent Overview 2.txt", API_EVENTS + "12_Sale Parent PLA Conversions Parameter Table.txt");
    default:
      return getApiStandardFiles(eventType, eventCount);
  }
}

function getJsFiles(eventType, eventCount) {
  const files = [];
  files.push("templates/0_shared/01_Brand Header.txt");

  if (eventType === "sale") {
    files.push(eventCount === "1"
      ? "templates/1_integrations/js/1_num of events/01_Sale 1 Overview.txt"
      : "templates/1_integrations/js/1_num of events/03_Sale 2 Overview.txt");
  } else {
    files.push("templates/1_integrations/js/1_num of events/05_Lead 1 or 2 Overview.txt");
  }

  files.push("templates/0_shared/02_Document History.txt");
  files.push("templates/1_integrations/js/3_shared js/01_Technical Requirements.txt");
  files.push("templates/0_shared/03_How to Contact impact.com.txt");
  files.push("templates/0_shared/04_Guidelines For Custom Tracking Domains.txt");
  files.push("templates/1_integrations/js/3_shared js/03_Guidelines For Custom Profile IDs.txt");
  files.push("templates/1_integrations/js/3_shared js/04_Universal Tracking Tag.txt");
  files.push("templates/1_integrations/js/3_shared js/05_Identity Function.txt");

  if (eventType === "sale") {
    files.push(eventCount === "1"
      ? "templates/1_integrations/js/1_num of events/02_Sale 1 Conversion Tracking Header.txt"
      : "templates/1_integrations/js/1_num of events/04_Sale 2 Conversion Tracking Header.txt");
    files.push("templates/1_integrations/js/2_type of events/01_Sale js Conversion Tracking.txt");
    files.push("templates/1_integrations/js/2_type of events/02_Sale js Parameter Table.txt");
  } else {
    files.push("templates/1_integrations/js/1_num of events/06_Lead 1 or 2 Conversion Tracking Header.txt");
    files.push("templates/1_integrations/js/2_type of events/03_Lead js Conversion Tracking.txt");
    files.push("templates/1_integrations/js/2_type of events/04_Lead js Parameter Table.txt");
  }

  files.push("templates/0_shared/05_End To End Testing And Event Validation.txt");
  files.push("templates/0_shared/06_Resources.txt");
  files.push("templates/1_integrations/js/3_shared js/93_A_Cookie Banners & Cookie Policies.txt");
  files.push("templates/1_integrations/js/3_shared js/94_A_Capturing and Storing Click ID.txt");
  files.push(eventCount === "1"
    ? "templates/1_integrations/js/1_num of events/07_A_Sale 1 User Journey .txt"
    : "templates/1_integrations/js/1_num of events/08_A_Sale or Lead 2 User Journey.txt");
  files.push("templates/1_integrations/js/3_shared js/95_A_Creating a Test Partner Account.txt");
  files.push("templates/1_integrations/js/3_shared js/96_A_How to Access a Test Tracking Link.txt");
  files.push("templates/1_integrations/js/3_shared js/97_A_Ad Code.txt");
  files.push("templates/1_integrations/js/3_shared js/98_A_How to Execute an End to End Test with Test Partner.txt");

  return files;
}

function getFilesForSelection({ integrationType, eventType, eventCount, apiPlanVariant }) {
  if (integrationType === "api") {
    return getApiFilesByVariant(apiPlanVariant, eventType, eventCount);
  }
  return getJsFiles(eventType, eventCount);
}

module.exports = {
  getFilesForSelection
};
