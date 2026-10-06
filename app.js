const APP_KEY = "ldo_app_v2";

const DEFAULT_STATE = {
  version: 2,

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


/* =========================================================
   STATE
========================================================= */

function deepClone(value) {

  return JSON.parse(
    JSON.stringify(value)
  );

}


function loadState() {

  try {

    const saved =
      localStorage.getItem(APP_KEY);


    if (!saved) {

      return deepClone(
        DEFAULT_STATE
      );

    }


    const parsed =
      JSON.parse(saved);


    return mergeState(
      deepClone(DEFAULT_STATE),
      parsed
    );

  } catch (error) {

    console.error(
      "Failed to load app state:",
      error
    );


    return deepClone(
      DEFAULT_STATE
    );

  }

}


function mergeState(
  base,
  saved
) {

  if (
    !saved ||
    typeof saved !== "object"
  ) {

    return base;

  }


  Object.keys(saved).forEach(key => {

    if (
      saved[key] &&
      typeof saved[key] === "object" &&
      !Array.isArray(saved[key]) &&
      base[key] &&
      typeof base[key] === "object" &&
      !Array.isArray(base[key])
    ) {

      base[key] =
        mergeState(
          base[key],
          saved[key]
        );

    } else {

      base[key] =
        saved[key];

    }

  });


  return base;

}


function saveState(
  state = APP_STATE
) {

  try {

    localStorage.setItem(
      APP_KEY,
      JSON.stringify(state)
    );

  } catch (error) {

    console.error(
      "Failed to save app state:",
      error
    );

  }

}


let APP_STATE =
  loadState();


function updateState(
  callback
) {

  callback(APP_STATE);

  saveState(APP_STATE);

}


/* =========================================================
   SESSION DATA
========================================================= */

function createDefaultSessionData() {

  return {

    completion: 0,

    learningStatus:
      "NOT_STARTED",

    studyMinutes: 0,

    labStatus:
      "NOT_STARTED",

    exercises: {

      L1: "LOCKED",

      L2: "LOCKED",

      L3: "LOCKED",

      L4: "LOCKED",

      L5: "LOCKED"

    },

    parts: {},

    notes: [],

    assessment: null,

    strengths: [],

    weaknesses: [],

    lastUpdated: null

  };

}


function getSessionData(
  sessionId
) {

  if (
    !APP_STATE.sessionData[
      sessionId
    ]
  ) {

    APP_STATE.sessionData[
      sessionId
    ] =
      createDefaultSessionData();

    saveState(APP_STATE);

  }


  return APP_STATE.sessionData[
    sessionId
  ];

}


function setSessionData(
  sessionId,
  data
) {

  updateState(state => {

    state.sessionData[
      sessionId
    ] = {

      ...createDefaultSessionData(),

      ...data,

      lastUpdated:
        new Date().toISOString()

    };

  });

}


/* =========================================================
   CURRENT SESSION
========================================================= */

function setCurrentSession(
  sessionId
) {

  updateState(state => {

    state.settings.currentSession =
      sessionId;

  });

}


function getCurrentSession() {

  return (
    APP_STATE.settings
      .currentSession ||
    "S01"
  );

}


/* =========================================================
   ROADMAP HELPERS
========================================================= */

function getAllSessions() {

  if (
    typeof ROADMAP === "undefined"
  ) {

    return [];

  }


  const result = [];


  ROADMAP.forEach(phase => {

    phase.sessions.forEach(
      session => {

        result.push({

          id:
            session[0],

          title:
            session[1],

          phaseId:
            phase.id,

          phaseName:
            phase.name,

          track:
            phase.track

        });

      }
    );

  });


  return result;

}


function findSession(
  sessionId
) {

  return getAllSessions()
    .find(
      session =>
        session.id ===
        sessionId
    ) || null;

}


function getPreviousSession(
  sessionId
) {

  const sessions =
    getAllSessions();


  const index =
    sessions.findIndex(
      session =>
        session.id ===
        sessionId
    );


  if (index <= 0) {

    return null;

  }


  return sessions[
    index - 1
  ];

}


function getNextSession(
  sessionId
) {

  const sessions =
    getAllSessions();


  const index =
    sessions.findIndex(
      session =>
        session.id ===
        sessionId
    );


  if (
    index < 0 ||
    index >=
      sessions.length - 1
  ) {

    return null;

  }


  return sessions[
    index + 1
  ];

}


/* =========================================================
   PROGRESS
========================================================= */

function getCompletedSessionsCount() {

  return getAllSessions()
    .filter(session => {

      const data =
        getSessionData(
          session.id
        );


      return (
        Number(
          data.completion
        ) >= 100
      );

    })
    .length;

}


function getOverallProgress() {

  const total =
    getAllSessions().length;


  if (!total) {

    return 0;

  }


  return Math.round(

    getCompletedSessionsCount()
    /
    total
    *
    100

  );

}


function getTrackProgress(
  track
) {

  const sessions =
    getAllSessions()
      .filter(
        session =>
          session.track ===
          track
      );


  if (!sessions.length) {

    return 0;

  }


  const completed =
    sessions.filter(
      session =>
        getSessionData(
          session.id
        ).completion >= 100
    ).length;


  return Math.round(

    completed /
    sessions.length *
    100

  );

}


/* =========================================================
   STUDY TIME
========================================================= */

function addStudyTime(
  sessionId,
  minutes,
  source = "manual"
) {

  minutes =
    Number(minutes);


  if (
    !Number.isFinite(minutes) ||
    minutes <= 0
  ) {

    return false;

  }


  const today =
    new Date()
      .toISOString()
      .slice(0, 10);


  updateState(state => {

    const data =
      state.sessionData[
        sessionId
      ] ||
      createDefaultSessionData();


    data.studyMinutes =
      Number(
        data.studyMinutes || 0
      ) + minutes;


    data.lastUpdated =
      new Date().toISOString();


    state.sessionData[
      sessionId
    ] = data;


    state.studyLogs.push({

      id:
        createId(),

      date:
        today,

      session:
        sessionId,

      durationMinutes:
        minutes,

      source:
        source,

      createdAt:
        new Date().toISOString()

    });

  });


  return true;

}


function getTotalStudyMinutes() {

  return APP_STATE.studyLogs
    .reduce(
      (total, log) => {

        return total +
          Number(
            log.durationMinutes || 0
          );

      },
      0
    );

}


function getTodayStudyMinutes() {

  const today =
    getTodayDate();


  return APP_STATE.studyLogs
    .filter(
      log =>
        log.date === today
    )
    .reduce(
      (total, log) => {

        return total +
          Number(
            log.durationMinutes || 0
          );

      },
      0
    );

}


/* =========================================================
   STUDY TIMER
========================================================= */

let STUDY_TIMER = {

  sessionId: null,

  startedAt: null,

  interval: null

};


function startStudyTimer(
  sessionId
) {

  if (
    STUDY_TIMER.interval
  ) {

    stopStudyTimer();

  }


  STUDY_TIMER.sessionId =
    sessionId;


  STUDY_TIMER.startedAt =
    Date.now();


  STUDY_TIMER.interval =
    setInterval(
      updateTimerDisplay,
      1000
    );


  updateTimerDisplay();


  return true;

}


function stopStudyTimer() {

  if (
    !STUDY_TIMER.startedAt
  ) {

    return 0;

  }


  const elapsed =
    Date.now() -
    STUDY_TIMER.startedAt;


  const minutes =
    Math.max(
      1,
      Math.round(
        elapsed / 60000
      )
    );


  const sessionId =
    STUDY_TIMER.sessionId;


  clearInterval(
    STUDY_TIMER.interval
  );


  STUDY_TIMER = {

    sessionId: null,

    startedAt: null,

    interval: null

  };


  if (sessionId) {

    addStudyTime(
      sessionId,
      minutes,
      "timer"
    );

  }


  return minutes;

}


function updateTimerDisplay() {

  const element =
    document.getElementById(
      "study-timer"
    );


  if (
    !element ||
    !STUDY_TIMER.startedAt
  ) {

    return;

  }


  const elapsed =
    Date.now() -
    STUDY_TIMER.startedAt;


  const seconds =
    Math.floor(
      elapsed / 1000
    );


  const hours =
    Math.floor(
      seconds / 3600
    );


  const minutes =
    Math.floor(
      (seconds % 3600) / 60
    );


  const remainingSeconds =
    seconds % 60;


  element.textContent =
    `${pad(hours)}:${pad(minutes)}:${pad(
      remainingSeconds
    )}`;

}


function pad(
  number
) {

  return String(number)
    .padStart(2, "0");

}


/* =========================================================
   NOTES
========================================================= */

function addNote(
  sessionId,
  text
) {

  text =
    String(text || "")
      .trim();


  if (!text) {

    return false;

  }


  updateState(state => {

    const data =
      state.sessionData[
        sessionId
      ] ||
      createDefaultSessionData();


    data.notes =
      Array.isArray(data.notes)
        ? data.notes
        : [];


    data.notes.push({

      id:
        createId(),

      text:
        text,

      createdAt:
        new Date().toISOString()

    });


    state.sessionData[
      sessionId
    ] = data;

  });


  return true;

}


/* =========================================================
   LEARNING STATUS
========================================================= */

const VALID_LEARNING_STATUSES = [

  "NOT_STARTED",

  "INTRODUCED",

  "PRACTICING",

  "COMPETENT",

  "MASTERED"

];


function setLearningStatus(
  sessionId,
  status
) {

  if (
    !VALID_LEARNING_STATUSES
      .includes(status)
  ) {

    return false;

  }


  updateState(state => {

    const data =
      state.sessionData[
        sessionId
      ] ||
      createDefaultSessionData();


    data.learningStatus =
      status;


    data.lastUpdated =
      new Date().toISOString();


    state.sessionData[
      sessionId
    ] = data;

  });


  return true;

}


/* =========================================================
   COMPLETION
========================================================= */

function setCompletion(
  sessionId,
  completion
) {

  completion =
    Number(completion);


  if (
    !Number.isFinite(completion)
  ) {

    return false;

  }


  completion =
    Math.max(
      0,
      Math.min(
        100,
        Math.round(
          completion
        )
      )
    );


  updateState(state => {

    const data =
      state.sessionData[
        sessionId
      ] ||
      createDefaultSessionData();


    data.completion =
      completion;


    data.lastUpdated =
      new Date().toISOString();


    state.sessionData[
      sessionId
    ] = data;

  });


  return true;

}


/* =========================================================
   LAB
========================================================= */

const VALID_LAB_STATUSES = [

  "NOT_STARTED",

  "IN_PROGRESS",

  "PASSED",

  "FAILED",

  "SKIPPED"

];


function setLabStatus(
  sessionId,
  status
) {

  if (
    !VALID_LAB_STATUSES
      .includes(status)
  ) {

    return false;

  }


  updateState(state => {

    const data =
      state.sessionData[
        sessionId
      ] ||
      createDefaultSessionData();


    data.labStatus =
      status;


    state.sessionData[
      sessionId
    ] = data;

  });


  return true;

}


/* =========================================================
   EXERCISES
========================================================= */

const EXERCISE_LEVELS = [

  "L1",

  "L2",

  "L3",

  "L4",

  "L5"

];


const VALID_EXERCISE_STATUSES = [

  "LOCKED",

  "NOT_STARTED",

  "IN_PROGRESS",

  "PASSED",

  "FAILED"

];


function setExerciseStatus(
  sessionId,
  level,
  status
) {

  if (
    !EXERCISE_LEVELS
      .includes(level)
  ) {

    return false;

  }


  if (
    !VALID_EXERCISE_STATUSES
      .includes(status)
  ) {

    return false;

  }


  updateState(state => {

    const data =
      state.sessionData[
        sessionId
      ] ||
      createDefaultSessionData();


    if (
      !data.exercises
    ) {

      data.exercises = {};

    }


    data.exercises[level] =
      status;


    state.sessionData[
      sessionId
    ] = data;

  });


  return true;

}


/* =========================================================
   ASSESSMENT
========================================================= */

function saveAssessment(
  sessionId,
  score,
  passed = null
) {

  score =
    Number(score);


  if (
    !Number.isFinite(score)
  ) {

    return false;

  }


  score =
    Math.max(
      0,
      Math.min(
        100,
        Math.round(score)
      )
    );


  if (
    passed === null
  ) {

    passed =
      score >= 80;

  }


  updateState(state => {

    const data =
      state.sessionData[
        sessionId
      ] ||
      createDefaultSessionData();


    data.assessment = {

      score:
        score,

      passed:
        Boolean(passed),

      date:
        new Date().toISOString()

    };


    state.assessments.push({

      id:
        createId(),

      type:
        "SESSION",

      target:
        sessionId,

      score:
        score,

      passed:
        Boolean(passed),

      date:
        new Date().toISOString()

    });


    state.sessionData[
      sessionId
    ] = data;

  });


  return true;

}


/* =========================================================
   STRENGTHS / WEAKNESSES
========================================================= */

function setSessionAnalysis(
  sessionId,
  strengths = [],
  weaknesses = []
) {

  updateState(state => {

    const data =
      state.sessionData[
        sessionId
      ] ||
      createDefaultSessionData();


    data.strengths =
      Array.isArray(strengths)
        ? strengths
        : [strengths];


    data.weaknesses =
      Array.isArray(weaknesses)
        ? weaknesses
        : [weaknesses];


    state.sessionData[
      sessionId
    ] = data;

  });

}


/* =========================================================
   REVIEWS
========================================================= */

const REVIEW_INTERVALS = [

  1,

  3,

  7,

  14,

  30,

  60

];


function addDays(
  date,
  days
) {

  const result =
    new Date(date);


  result.setDate(
    result.getDate() +
    Number(days)
  );


  return result
    .toISOString()
    .slice(0, 10);

}


function createReviewsForSession(
  sessionId
) {

  updateState(state => {

    const existing =
      state.reviews
        .filter(
          review =>
            review.session ===
            sessionId
        );


    REVIEW_INTERVALS.forEach(
      days => {

        const exists =
          existing.some(
            review =>
              Number(
                review.offsetDays
              ) === days
          );


        if (exists) {

          return;

        }


        state.reviews.push({

          id:
            createId(),

          session:
            sessionId,

          type:
            `+${days}d`,

          offsetDays:
            days,

          dueDate:
            addDays(
              new Date(),
              days
            ),

          status:
            "PENDING",

          score:
            null,

          note:
            ""

        });

      }
    );

  });

}


/* =========================================================
   REVIEW STATUS
========================================================= */

function completeReview(
  reviewId,
  score = null,
  note = ""
) {

  updateState(state => {

    const review =
      state.reviews.find(
        item =>
          item.id ===
          reviewId
      );


    if (!review) {

      return;

    }


    review.status =
      "DONE";


    review.score =
      score === null
        ? null
        : Number(score);


    review.note =
      note;

    review.completedAt =
      new Date().toISOString();

  });

}


/* =========================================================
   SESSION RESULT
========================================================= */

function createSessionResult(
  sessionId
) {

  const data =
    getSessionData(
      sessionId
    );


  return {

    protocol:
      "LDO_RESULT_V1",

    resultId:
      createId(),

    session:
      sessionId,

    completed:
      data.completion >= 100
        ? "YES"
        : "NO",

    status:
      data.learningStatus,

    studyMinutes:
      data.studyMinutes,

    lab:
      data.labStatus,

    L1:
      data.exercises.L1,

    L2:
      data.exercises.L2,

    L3:
      data.exercises.L3,

    L4:
      data.exercises.L4,

    L5:
      data.exercises.L5,

    assessment:
      data.assessment
        ? data.assessment.score
        : null,

    strengths:
      data.strengths,

    weaknesses:
      data.weaknesses,

    notes:
      data.notes
        .map(note => note.text),

    review:
      REVIEW_INTERVALS
        .join(",")

  };

}


/* =========================================================
   RESULT PARSER
========================================================= */

function parseSessionResult(
  rawText
) {

  const result = {

    protocol: null,

    resultId: null,

    session: null,

    completed: null,

    status: null,

    studyMinutes: null,

    lab: null,

    L1: null,

    L2: null,

    L3: null,

    L4: null,

    L5: null,

    assessment: null,

    strengths: [],

    weaknesses: [],

    note: "",

    review: null

  };


  const lines =
    String(rawText || "")
      .split(/\r?\n/)
      .map(
        line =>
          line.trim()
      )
      .filter(Boolean);


  lines.forEach(line => {

    if (
      line ===
      "LDO_RESULT_V1"
    ) {

      result.protocol =
        "LDO_RESULT_V1";

      return;

    }


    const separator =
      line.indexOf("=");


    if (
      separator === -1
    ) {

      return;

    }


    const key =
      line
        .slice(
          0,
          separator
        )
        .trim()
        .toUpperCase();


    const value =
      line
        .slice(
          separator + 1
        )
        .trim();


    switch(key) {

      case "RESULT_ID":
        result.resultId =
          value;
        break;

      case "SESSION":
        result.session =
          value;
        break;

      case "COMPLETED":
        result.completed =
          value;
        break;

      case "STATUS":
        result.status =
          value;
        break;

      case "STUDY_MINUTES":
        result.studyMinutes =
          Number(value);
        break;

      case "LAB":
        result.lab =
          value;
        break;

      case "L1":
        result.L1 =
          value;
        break;

      case "L2":
        result.L2 =
          value;
        break;

      case "L3":
        result.L3 =
          value;
        break;

      case "L4":
        result.L4 =
          value;
        break;

      case "L5":
        result.L5 =
          value;
        break;

      case "ASSESSMENT":
        result.assessment =
          Number(value);
        break;

      case "STRENGTHS":
        result.strengths =
          splitList(value);
        break;

      case "WEAKNESSES":
        result.weaknesses =
          splitList(value);
        break;

      case "NOTE":
        result.note =
          value;
        break;

      case "REVIEW":
        result.review =
          value;
        break;

      default:
        break;

    }

  });


  return result;

}


function splitList(
  value
) {

  if (!value) {

    return [];

  }


  return value
    .split(";")
    .map(
      item =>
        item.trim()
    )
    .filter(Boolean);

}


/* =========================================================
   IMPORT SESSION RESULT
========================================================= */

function validateSessionResult(
  result
) {

  const errors = [];


  if (
    result.protocol !==
    "LDO_RESULT_V1"
  ) {

    errors.push(
      "Protocol must be LDO_RESULT_V1"
    );

  }


  if (
    !result.session
  ) {

    errors.push(
      "SESSION is required"
    );

  } else if (
    !findSession(
      result.session
    )
  ) {

    errors.push(
      `Unknown session: ${result.session}`
    );

  }


  if (
    result.status &&
    !VALID_LEARNING_STATUSES
      .includes(
        result.status
      )
  ) {

    errors.push(
      `Invalid STATUS: ${result.status}`
    );

  }


  if (
    result.lab &&
    !VALID_LAB_STATUSES
      .includes(
        result.lab
      )
  ) {

    errors.push(
      `Invalid LAB: ${result.lab}`
    );

  }


  EXERCISE_LEVELS.forEach(
    level => {

      const value =
        result[level];


      if (
        value &&
        !VALID_EXERCISE_STATUSES
          .includes(value)
      ) {

        errors.push(
          `Invalid ${level}: ${value}`
        );

      }

    }
  );


  if (
    result.studyMinutes !== null &&
    (
      !Number.isFinite(
        result.studyMinutes
      ) ||
      result.studyMinutes < 0
    )
  ) {

    errors.push(
      "Invalid STUDY_MINUTES"
    );

  }


  if (
    result.assessment !== null &&
    (
      !Number.isFinite(
        result.assessment
      ) ||
      result.assessment < 0 ||
      result.assessment > 100
    )
  ) {

    errors.push(
      "Invalid ASSESSMENT"
    );

  }


  return {

    valid:
      errors.length === 0,

    errors:
      errors

  };

}


function importSessionResult(
  rawText
) {

  const result =
    parseSessionResult(
      rawText
    );


  const validation =
    validateSessionResult(
      result
    );


  if (
    !validation.valid
  ) {

    return {

      success:
        false,

      errors:
        validation.errors,

      result:
        result

    };

  }


  let duplicate = false;


  if (
    result.resultId
  ) {

    duplicate =
      APP_STATE.assessments
        .some(
          item =>
            item.resultId ===
            result.resultId
        );

  }


  if (duplicate) {

    return {

      success:
        false,

      errors: [
        "This Result ID has already been imported."
      ],

      result:
        result

    };

  }


  updateState(state => {

    const data =
      state.sessionData[
        result.session
      ] ||
      createDefaultSessionData();


    if (
      result.status
    ) {

      data.learningStatus =
        result.status;

    }


    if (
      Number.isFinite(
        result.studyMinutes
      )
    ) {

      const oldMinutes =
        Number(
          data.studyMinutes || 0
        );


      const newMinutes =
        Number(
          result.studyMinutes
        );


      if (
        newMinutes >
        oldMinutes
      ) {

        const difference =
          newMinutes -
          oldMinutes;


        const today =
          getTodayDate();


        state.studyLogs.push({

          id:
            createId(),

          date:
            today,

          session:
            result.session,

          durationMinutes:
            difference,

          source:
            "session-result",

          createdAt:
            new Date().toISOString()

        });

      }


      data.studyMinutes =
        newMinutes;

    }


    if (
      result.lab
    ) {

      data.labStatus =
        result.lab;

    }


    EXERCISE_LEVELS.forEach(
      level => {

        if (
          result[level]
        ) {

          data.exercises[
            level
          ] =
            result[level];

        }

      }
    );


    if (
      result.assessment !==
      null
    ) {

      data.assessment = {

        score:
          result.assessment,

        passed:
          result.assessment >= 80,

        date:
          new Date().toISOString()

      };


      state.assessments.push({

        id:
          createId(),

        resultId:
          result.resultId,

        type:
          "SESSION",

        target:
          result.session,

        score:
          result.assessment,

        passed:
          result.assessment >= 80,

        date:
          new Date().toISOString()

      });

    }


    data.strengths =
      result.strengths;


    data.weaknesses =
      result.weaknesses;


    if (
      result.note
    ) {

      data.notes =
        Array.isArray(data.notes)
          ? data.notes
          : [];


      data.notes.push({

        id:
          createId(),

        text:
          result.note,

        createdAt:
          new Date().toISOString()

      });

    }


    if (
      String(
        result.completed
      ).toUpperCase() ===
      "YES"
    ) {

      data.completion =
        100;

    }


    data.lastUpdated =
      new Date().toISOString();


    state.sessionData[
      result.session
    ] = data;


    state.assessments.push({

      id:
        createId(),

      resultId:
        result.resultId,

      type:
        "RESULT_IMPORT",

      target:
        result.session,

      score:
        result.assessment,

      passed:
        result.assessment !== null
          ? result.assessment >= 80
          : null,

      date:
        new Date().toISOString()

    });


    if (
      String(
        result.completed
      ).toUpperCase() ===
      "YES"
    ) {

      const existing =
        state.reviews.filter(
          review =>
            review.session ===
            result.session
        );


      REVIEW_INTERVALS.forEach(
        days => {

          const exists =
            existing.some(
              review =>
                Number(
                  review.offsetDays
                ) === days
            );


          if (!exists) {

            state.reviews.push({

              id:
                createId(),

              session:
                result.session,

              type:
                `+${days}d`,

              offsetDays:
                days,

              dueDate:
                addDays(
                  new Date(),
                  days
                ),

              status:
                "PENDING",

              score:
                null,

              note:
                ""

            });

          }

        }
      );

    }


    state.settings.currentSession =
      result.session;

  });


  evaluateGates();


  return {

    success:
      true,

    errors:
      [],

    result:
      result

  };

}


/* =========================================================
   GATE SYSTEM
========================================================= */

function evaluateLinuxGate() {

  const requirements = {

    serverInstalled:
      isCompleted(
        "S02"
      ),

    lvm:
      hasEvidence(
        [
          "S32",
          "S33"
        ]
      ),

    hardening:
      hasEvidence(
        [
          "S95",
          "S96",
          "S97",
          "S98",
          "S99",
          "S103"
        ]
      ),

    networkIncidents:
      countPassedLabs(
        [
          "S58"
        ]
      ) >= 1,

    serviceDebug:
      hasEvidence(
        [
          "S28",
          "S116"
        ]
      ),

    bashIdempotent:
      hasEvidence(
        [
          "S63",
          "S66"
        ]
      ),

    rootCause:
      hasAssessmentEvidence(),

    backupRestore:
      hasEvidence(
        [
          "S44"
        ]
      ),

    audit:
      hasEvidence(
        [
          "S100",
          "S103"
        ]
      ),

    professionalAssessment:
      getAssessmentScore(
        "S136"
      ) >= 80

  };


  const passed =
    Object.values(
      requirements
    ).every(Boolean);


  return {

    passed:
      passed,

    requirements:
      requirements

  };

}


function evaluateGates() {

  const linux =
    evaluateLinuxGate();


  updateState(state => {

    state.gates.linux = {

      status:
        linux.passed
          ? "PASSED"
          : "LOCKED",

      requirements:
        linux.requirements,

      checkedAt:
        new Date().toISOString()

    };


    if (
      linux.passed
    ) {

      state.gates.devops = {

        ...state.gates.devops,

        status:
          "UNLOCKED",

        unlockedAt:
          state.gates.devops
            .unlockedAt ||
          new Date().toISOString()

      };

    }

  });


  return APP_STATE.gates;

}


function isDevOpsUnlocked() {

  return (
    APP_STATE.gates &&
    APP_STATE.gates.linux &&
    APP_STATE.gates.linux.status ===
    "PASSED"
  );

}


/* =========================================================
   GATE HELPERS
========================================================= */

function isCompleted(
  sessionId
) {

  return (
    getSessionData(
      sessionId
    ).completion >= 100
  );

}


function hasEvidence(
  sessionIds
) {

  return sessionIds.some(
    sessionId => {

      const data =
        getSessionData(
          sessionId
        );


      return (
        data.completion >= 100 ||
        data.labStatus ===
          "PASSED" ||
        (
          data.assessment &&
          data.assessment.passed
        )
      );

    }
  );

}


function countPassedLabs(
  sessionIds
) {

  return sessionIds.filter(
    sessionId => {

      return (
        getSessionData(
          sessionId
        ).labStatus ===
        "PASSED"
      );

    }
  ).length;

}


function hasAssessmentEvidence() {

  return APP_STATE.assessments
    .some(
      assessment =>
        assessment.passed === true
    );

}


function getAssessmentScore(
  sessionId
) {

  const data =
    getSessionData(
      sessionId
    );


  if (
    !data.assessment
  ) {

    return 0;

  }


  return Number(
    data.assessment.score || 0
  );

}


/* =========================================================
   STATUS HELPERS
========================================================= */

function getStatusIcon(
  status,
  completion = 0
) {

  if (
    Number(completion) >= 100
  ) {

    return "✅";

  }


  switch(status) {

    case "INTRODUCED":
      return "🟠";

    case "PRACTICING":
      return "🟡";

    case "COMPETENT":
      return "🟢";

    case "MASTERED":
      return "🔵";

    default:
      return "🔴";

  }

}


function formatStatus(
  status
) {

  switch(status) {

    case "INTRODUCED":
      return "Introduced";

    case "PRACTICING":
      return "Practicing";

    case "COMPETENT":
      return "Competent";

    case "MASTERED":
      return "Mastered";

    default:
      return "Not Started";

  }

}


function formatLabStatus(
  status
) {

  switch(status) {

    case "PASSED":
      return "✅ Passed";

    case "FAILED":
      return "❌ Failed";

    case "IN_PROGRESS":
      return "🟡 In Progress";

    case "SKIPPED":
      return "⏭ Skipped";

    default:
      return "⚪ Not Started";

  }

}


function formatExerciseStatus(
  status
) {

  switch(status) {

    case "PASSED":
      return "✅ Passed";

    case "FAILED":
      return "❌ Failed";

    case "IN_PROGRESS":
      return "🟡 In Progress";

    case "LOCKED":
      return "🔒 Locked";

    default:
      return "⚪ Not Started";

  }

}


/* =========================================================
   DATE
========================================================= */

function getTodayDate() {

  return new Date()
    .toISOString()
    .slice(0, 10);

}


/* =========================================================
   NEXT ACTION
========================================================= */

function getPendingReviewsCount() {

  return APP_STATE.reviews
    .filter(
      review =>
        review.status !==
        "DONE"
    )
    .length;

}


function getOverdueReviewsCount() {

  const today =
    getTodayDate();


  return APP_STATE.reviews
    .filter(review => {

      return (
        review.status !==
          "DONE" &&
        review.dueDate &&
        review.dueDate <
          today
      );

    })
    .length;

}


function getNextAction() {

  if (
    getOverdueReviewsCount() >
    0
  ) {

    return (
      "مرور عقب‌افتاده را انجام بده"
    );

  }


  const current =
    getCurrentSession();


  const data =
    getSessionData(
      current
    );


  if (
    data.completion < 100
  ) {

    return (
      `ادامه ${current}`
    );

  }


  const next =
    getNextSession(
      current
    );


  if (
    next &&
    (
      next.track ===
        "Linux" ||
      isDevOpsUnlocked()
    )
  ) {

    return (
      `شروع ${next.id}`
    );

  }


  if (
    !isDevOpsUnlocked()
  ) {

    return (
      "ادامه Linux و آماده‌شدن برای Gate"
    );

  }


  return (
    "بررسی وضعیت یادگیری"
  );

}


/* =========================================================
   ID
========================================================= */

function createId() {

  return (
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .slice(2, 8)
  );

}


/* =========================================================
   BACKUP / EXPORT
========================================================= */

function exportAppState() {

  const payload = {

    app:
      "Linux DevOps SRE Learning OS",

    version:
      APP_STATE.version,

    exportedAt:
      new Date().toISOString(),

    state:
      APP_STATE

  };


  return JSON.stringify(
    payload,
    null,
    2
  );

}


function downloadBackup() {

  const content =
    exportAppState();


  const blob =
    new Blob(
      [content],
      {
        type:
          "application/json"
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      "a"
    );


  link.href =
    url;


  link.download =
    `ldo-backup-${getTodayDate()}.json`;


  document.body.appendChild(
    link
  );


  link.click();


  link.remove();


  URL.revokeObjectURL(
    url
  );

}


/* =========================================================
   IMPORT BACKUP
========================================================= */

function importBackup(
  jsonText
) {

  try {

    const payload =
      JSON.parse(
        jsonText
      );


    if (
      !payload ||
      !payload.state
    ) {

      throw new Error(
        "Invalid backup format"
      );

    }


    APP_STATE =
      mergeState(
        deepClone(
          DEFAULT_STATE
        ),
        payload.state
      );


    saveState(
      APP_STATE
    );


    return {

      success:
        true

    };

  } catch(error) {

    return {

      success:
        false,

      error:
        error.message

    };

  }

}


/* =========================================================
   DEBUG
========================================================= */

function getAppState() {

  return deepClone(
    APP_STATE
  );

}


function resetAppState() {

  localStorage.removeItem(
    APP_KEY
  );


  APP_STATE =
    deepClone(
      DEFAULT_STATE
    );

}


/* =========================================================
   STARTUP
========================================================= */

evaluateGates();


console.log(
  "LDO App loaded"
);


console.log(
  "Current Session:",
  getCurrentSession()
);


console.log(
  "Completed Sessions:",
  getCompletedSessionsCount()
);


console.log(
  "Overall Progress:",
  getOverallProgress() + "%"
);
