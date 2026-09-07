import { THEMATIC_AREAS, DIMENSIONS, QUESTION_TYPES } from './thematicAreas.js';

/**
 * Raw SIRE 2.0 style question content, organised by INTERTANKO thematic area
 * and inspection dimension (Hardware / Procedures / Human Factors).
 *
 * This is a representative library (not the full ~1000+ question OCIMF set)
 * used to demonstrate the dynamic CVIQ generation, probability weighting and
 * three-dimensional grading described in the app requirements.
 */
const RAW_QUESTIONS = {
  'Navigation and Bridge Management': {
    Hardware: [
      'Are ECDIS units correctly configured with up-to-date permanent and temporary corrections?',
      'Is the radar/ARPA equipment functioning correctly on all ranges with no unexplained faults?',
      'Are navigation lights, sound signalling apparatus and day shapes in good working order?',
      'Is the magnetic compass correctly adjusted with a valid deviation card on display?',
      'Are bridge wing repeaters, VDR and AIS units fully operational?',
      'Is emergency steering gear tested and changeover arrangements clearly marked?',
    ],
    Procedures: [
      'Is passage planning carried out berth-to-berth in accordance with the SMS and including UKC calculations?',
      'Are bridge team management and bridge resource management procedures documented and followed?',
      'Is a master/pilot exchange checklist used and completed prior to pilotage?',
      'Are watchkeeping arrangements compliant with STCW rest hour requirements?',
      'Is there a documented procedure for navigation in restricted visibility?',
    ],
    'Human Factors': [
      'Can the officer of the watch demonstrate correct use of ECDIS alarms and safety settings?',
      'Does the bridge team demonstrate effective closed-loop communication during a simulated close-quarters situation?',
      'Can the master explain the vessel\'s passage plan and identify no-go areas for the current voyage?',
      'Is the crew aware of company fatigue management policy and able to describe recent rest hour records?',
      'Can the second officer demonstrate correct use of a sextant or backup celestial navigation method?',
    ],
  },
  'Cargo and Ballast Operations': {
    Hardware: [
      'Are cargo pumps, valves and remote control systems in good operating condition with no leaks?',
      'Is the inert gas system, including deck seal and non-return devices, functioning correctly?',
      'Are cargo tank high level alarms and overfill protection systems tested and operational?',
      'Is the crude oil washing (COW) system, if fitted, fully functional?',
      'Are ballast tank sounding/level gauges and remote monitoring systems operational?',
    ],
    Procedures: [
      'Is there an approved cargo/ballast plan for the current operation reviewed by the chief officer and master?',
      'Are ship/shore safety checklists completed and signed prior to cargo operations?',
      'Is there a documented procedure for tank cleaning and gas freeing operations?',
      'Are enclosed space entry procedures followed prior to any tank or void entry?',
      'Is a documented procedure in place for crude oil washing and stripping sequences?',
    ],
    'Human Factors': [
      'Can the chief officer explain the cargo plan, including loading rates and topping-off sequence?',
      'Can crew demonstrate correct donning of a gas detector and understanding of alarm set points?',
      'Does the duty officer understand the actions required in the event of a cargo spill on deck?',
      'Can crew explain static electricity precautions during tank cleaning operations?',
      'Is the crew able to describe the vessel\'s ballast water management plan and exchange method?',
    ],
  },
  'Machinery and Engine Room': {
    Hardware: [
      'Is the main engine and auxiliary machinery free of significant leaks and in good material condition?',
      'Are emergency generator and emergency fire pump able to start and run correctly on test?',
      'Is the oily water separator (OWS) and 15 ppm alarm functioning and correctly calibrated?',
      'Are engine room bilge alarms and high level alarms tested and operational?',
      'Is the steering gear hydraulic system free from leaks with correct oil levels?',
    ],
    Procedures: [
      'Is planned maintenance system (PMS) up to date for critical machinery items?',
      'Are permit-to-work procedures followed for hot work and enclosed space entry in the engine room?',
      'Is there a documented procedure for the safe operation of the incinerator and sludge management?',
      'Are engine room resource management procedures documented for critical operations?',
    ],
    'Human Factors': [
      'Can the duty engineer explain the actions required in the event of a black-out?',
      'Can crew demonstrate correct use of self-contained breathing apparatus in the engine room?',
      'Is the chief engineer able to describe recent critical machinery defects and corrective actions?',
      'Can crew explain the procedure for changeover from heavy fuel oil to low sulphur fuel?',
    ],
  },
  'Safety and Security': {
    Hardware: [
      'Are lifeboats, davits and release gear in good condition and correctly maintained?',
      'Is fixed fire-fighting equipment (CO2/foam systems) tested and tagged within schedule?',
      'Are fire dampers, quick closing valves and emergency shut-offs operational?',
      'Is personal protective equipment available and in good condition for all crew?',
      'Are ship security alert system (SSAS) and access control equipment functional?',
    ],
    Procedures: [
      'Are the ship security plan (SSP) and security level procedures being implemented correctly?',
      'Is there a documented permit-to-work system covering hot work, working aloft and over side?',
      'Are emergency response procedures and muster lists up to date and posted?',
      'Is a documented procedure in place for enclosed space entry and rescue drills?',
    ],
    'Human Factors': [
      'Can crew demonstrate correct donning of firefighting outfit and breathing apparatus within the expected time?',
      'Can the crew demonstrate a realistic abandon ship drill including lifeboat lowering procedures?',
      'Is crew aware of current security level and associated ship protection measures?',
      'Can crew demonstrate proper use of an immersion suit and lifejacket?',
      'Does the safety officer understand near-miss and hazard reporting requirements?',
    ],
  },
  'Pollution Prevention (MARPOL)': {
    Hardware: [
      'Is the oil record book accurately maintained and consistent with OWS/ODMCS records?',
      'Is the shipboard oil pollution emergency plan (SOPEP) equipment complete and accessible?',
      'Are scupper plugs and deck drainage arrangements in place to prevent accidental discharge?',
      'Is the sewage treatment plant functioning correctly and discharge valves correctly locked/sealed?',
    ],
    Procedures: [
      'Is the garbage management plan implemented and garbage record book correctly completed?',
      'Are procedures in place for bunkering operations to prevent oil spills, including drip trays?',
      'Is the ballast water management plan being implemented in line with the BWM Convention?',
    ],
    'Human Factors': [
      'Can crew explain the actions required in the event of an oil spill during bunkering?',
      'Can the crew responsible for oil record book entries explain recent entries and any transfers?',
      'Is crew aware of MARPOL Annex VI sulphur limit requirements and fuel changeover procedures?',
      'Can crew demonstrate correct deployment of SOPEP equipment during a drill?',
    ],
  },
  'Crew Management & Training': {
    Hardware: [
      'Are training manuals, safety videos and familiarisation materials available onboard?',
      'Is onboard training equipment (fire trainer, drill equipment) in serviceable condition?',
    ],
    Procedures: [
      'Is there a documented onboard training plan covering drills, familiarisation and refresher training?',
      'Are crew certificates of competency and endorsements verified against manning requirements?',
      'Is a documented procedure in place for new crew familiarisation prior to taking up duties?',
    ],
    'Human Factors': [
      'Can newly joined crew describe their familiarisation with safety equipment and escape routes?',
      'Is the crew able to describe the company\'s policy on fatigue, alcohol and drug abuse?',
      'Can crew demonstrate understanding of their specific duties from the muster list?',
      'Does crew demonstrate awareness of the company\'s just culture and near-miss reporting policy?',
    ],
  },
  'Ship Maintenance': {
    Hardware: [
      'Is the vessel\'s hull, superstructure and deck fittings free from excessive corrosion or damage?',
      'Are accommodation ladders, pilot ladders and combination rigs in good, certified condition?',
      'Is mooring equipment, including wires, ropes and winches, in good condition and correctly maintained?',
      'Are hatch covers, tank vents and closing appliances weathertight and well maintained?',
    ],
    Procedures: [
      'Is planned maintenance for hull and deck equipment being carried out and recorded?',
      'Is there a documented procedure for pilot ladder rigging and inspection prior to use?',
      'Are defect reporting and corrective action procedures used consistently for maintenance items?',
    ],
    'Human Factors': [
      'Can the bosun explain the inspection process for the pilot ladder prior to rigging?',
      'Can crew describe how maintenance backlog items are prioritised and reported to the office?',
    ],
  },
  'Certification & Documentation': {
    Hardware: [
      'Are all statutory and class certificates onboard, valid and correctly displayed?',
      'Is the ship\'s log (deck, engine, radio) being accurately and consistently completed?',
    ],
    Procedures: [
      'Is the safety management system (SMS) documentation controlled and the current revision in use?',
      'Are audit and inspection findings from previous vettings tracked to closure with documented evidence?',
      'Is there a documented procedure for verifying certificate validity prior to port arrival?',
    ],
    'Human Factors': [
      'Can the master describe the process for closing out corrective actions from previous vetting inspections?',
      'Can crew locate and explain the relevant SMS procedure for an operation being observed?',
      'Is the designated person ashore (DPA) contact and reporting process understood by the crew?',
    ],
  },
};

let idCounter = 1;
function nextId() {
  return `Q${String(idCounter++).padStart(4, '0')}`;
}

// Deterministic pseudo-random probability generator (seeded), so the library
// is stable across restarts instead of using Math.random().
function seededProbability(seed) {
  const x = Math.sin(seed * 999.37) * 10000;
  const frac = x - Math.floor(x);
  // Map into a realistic probability range of 0.15 - 0.98
  return Math.round((0.15 + frac * 0.83) * 100) / 100;
}

export function buildQuestionLibrary() {
  const questions = [];
  let seed = 1;
  for (const area of THEMATIC_AREAS) {
    const byDimension = RAW_QUESTIONS[area] || {};
    for (const dimension of DIMENSIONS) {
      const texts = byDimension[dimension] || [];
      texts.forEach((text, index) => {
        const type = QUESTION_TYPES[seed % QUESTION_TYPES.length];
        const probability = seededProbability(seed);
        // Human Factors and "Not as Expected" prone items carry more risk weight.
        const riskWeight = dimension === 'Human Factors' ? 1.2 : dimension === 'Hardware' ? 1.0 : 0.9;
        questions.push({
          id: nextId(),
          thematicArea: area,
          dimension,
          text,
          questionType: type,
          probability,
          riskWeight,
        });
        seed += 1;
      });
    }
  }
  return questions;
}

export const QUESTION_LIBRARY = buildQuestionLibrary();
