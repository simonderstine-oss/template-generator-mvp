/**
 * Enumerates every distinct template bundle the generator can produce (same matrix as the main UI).
 */

const PLANS = [
  {
    id: "js_sale_1",
    label: "JS · Sale · 1 event",
    selection: {
      integrationType: "js",
      eventType: "sale",
      eventCount: "1",
      apiPlanVariant: null
    }
  },
  {
    id: "js_sale_2plus",
    label: "JS · Sale · 2+ events",
    selection: {
      integrationType: "js",
      eventType: "sale",
      eventCount: "2plus",
      apiPlanVariant: null
    }
  },
  {
    id: "js_lead_1",
    label: "JS · Lead · 1 event",
    selection: {
      integrationType: "js",
      eventType: "lead",
      eventCount: "1",
      apiPlanVariant: null
    }
  },
  {
    id: "js_lead_2plus",
    label: "JS · Lead · 2+ events",
    selection: {
      integrationType: "js",
      eventType: "lead",
      eventCount: "2plus",
      apiPlanVariant: null
    }
  },
  {
    id: "api_standard_sale_1",
    label: "API · Standard · Sale · 1 event",
    selection: {
      integrationType: "api",
      eventType: "sale",
      eventCount: "1",
      apiPlanVariant: "standard"
    }
  },
  {
    id: "api_standard_sale_2plus",
    label: "API · Standard · Sale · 2+ events",
    selection: {
      integrationType: "api",
      eventType: "sale",
      eventCount: "2plus",
      apiPlanVariant: "standard"
    }
  },
  {
    id: "api_standard_lead_1",
    label: "API · Standard · Lead · 1 event",
    selection: {
      integrationType: "api",
      eventType: "lead",
      eventCount: "1",
      apiPlanVariant: "standard"
    }
  },
  {
    id: "api_standard_lead_2plus",
    label: "API · Standard · Lead · 2+ events",
    selection: {
      integrationType: "api",
      eventType: "lead",
      eventCount: "2plus",
      apiPlanVariant: "standard"
    }
  },
  {
    id: "api_lead_parent_2",
    label: "API · Lead Parent API 2",
    selection: {
      integrationType: "api",
      eventType: "sale",
      eventCount: "1",
      apiPlanVariant: "lead_parent_2"
    }
  },
  {
    id: "api_sale_parent_2",
    label: "API · Sale Parent API 2",
    selection: {
      integrationType: "api",
      eventType: "sale",
      eventCount: "1",
      apiPlanVariant: "sale_parent_2"
    }
  },
  {
    id: "api_lead_sale_pla_2",
    label: "API · Lead & Sale PLA API 2",
    selection: {
      integrationType: "api",
      eventType: "sale",
      eventCount: "1",
      apiPlanVariant: "lead_sale_pla_2"
    }
  },
  {
    id: "api_lead_parent_pla_2",
    label: "API · Lead Parent PLA API 2",
    selection: {
      integrationType: "api",
      eventType: "sale",
      eventCount: "1",
      apiPlanVariant: "lead_parent_pla_2"
    }
  },
  {
    id: "api_sale_parent_pla_2",
    label: "API · Sale Parent PLA API 2",
    selection: {
      integrationType: "api",
      eventType: "sale",
      eventCount: "1",
      apiPlanVariant: "sale_parent_pla_2"
    }
  }
];

const idToPlan = new Map(PLANS.map((p) => [p.id, p]));

function listLibraryPlans() {
  return PLANS.map((p) => ({
    id: p.id,
    label: p.label,
    selection: { ...p.selection }
  }));
}

function parseLibraryPlanId(planId) {
  const entry = idToPlan.get(String(planId || "").trim());
  if (!entry) {
    return null;
  }
  return { ...entry.selection };
}

module.exports = {
  listLibraryPlans,
  parseLibraryPlanId,
  LIBRARY_PLAN_COUNT: PLANS.length
};
