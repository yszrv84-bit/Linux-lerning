const APP_KEY = "ldo_app_v1";

const DEFAULT_STATE = {
  version: 1,

  settings: {
    language: "fa",
    theme: "dark",
    currentSession: "S01"
  },

  sessionData: {},

  studyLogs: [],

  reviews: [],

  assessments: [],

  gates: {
    linux: {
      status: "LOCKED"
    },
    devops: {
      status: "LOCKED"
    }
  }
};

function loadState() {
  try {
    const saved = localStorage.getItem(APP_KEY);

    if (!saved) {
      return structuredClone(DEFAULT_STATE);
    }

    return {
      ...structuredClone(DEFAULT_STATE),
      ...JSON.parse(saved)
    };
  } catch (error) {
    console.error("Failed to load app state:", error);
    return structuredClone(DEFAULT_STATE);
  }
}

function saveState(state) {
  localStorage.setItem(APP_KEY, JSON.stringify(state));
}

let APP_STATE = loadState();

function updateState(callback) {
  callback(APP_STATE);
  saveState(APP_STATE);
}

function getSessionData(sessionId) {
  return APP_STATE.sessionData[sessionId] || {
    completion: 0,
    learningStatus: "NOT_STARTED",
    studyMinutes: 0,
    labStatus: "NOT_STARTED",
    exercises: {
      L1: "LOCKED",
      L2: "LOCKED",
      L3: "LOCKED",
      L4: "LOCKED",
      L5: "LOCKED"
    },
    notes: []
  };
}

function setCurrentSession(sessionId) {
  updateState(state => {
    state.settings.currentSession = sessionId;
  });
}

function getCurrentSession() {
  return APP_STATE.settings.currentSession;
}

console.log("LDO App loaded");
console.log("Current Session:", getCurrentSession());
