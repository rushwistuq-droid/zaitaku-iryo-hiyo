/**
 * 計算ロジック自己検証（Node.js: node verify-calculations.js）
 * app.js と同一ロジックをミラー
 */
const FEE_2026 = {
    visit: { home: 890, facility: 215 },
    houseCall: 720,
    reExam: 75,
    emergencyAddon: {
        'kinou-kyouka': 750,
        'zashin-ippan': 650,
        'other-clinic': 325
    },
    nightHolidayAddon: {
        'kinou-kyouka': 1700,
        'zashin-ippan': 1500,
        'other-clinic': 405
    },
    lateNightAddon: {
        'kinou-kyouka': 2700,
        'zashin-ippan': 2500,
        'other-clinic': 485
    },
    prescription: 68,
    noPrescriptionBonus: 300,
    management: {
        home: {
            section1: { severeMulti: 4985, multi: 4085, single: 2505 },
            section2: { severeMulti: 4585, multi: 3685, single: 2285 },
            section3: { severeMulti: 3435, multi: 2735, single: 1745 }
        },
        facility: {
            section1: {
                tier1: { severeMulti: 3585, multi: 2885, single: 1785 },
                tier2_9: { severeMulti: 2955, multi: 1535, single: 975 },
                tier10_19: { severeMulti: 2625, multi: 1085, single: 705 },
                tier20_49: { severeMulti: 2205, multi: 970, single: 615 },
                tier50plus: { severeMulti: 1935, multi: 825, single: 525 }
            },
            section2: {
                tier1: { severeMulti: 3285, multi: 2585, single: 1625 },
                tier2_9: { severeMulti: 2685, multi: 1385, single: 905 },
                tier10_19: { severeMulti: 2385, multi: 985, single: 665 },
                tier20_49: { severeMulti: 2010, multi: 875, single: 570 },
                tier50plus: { severeMulti: 1765, multi: 745, single: 490 }
            },
            section3: {
                tier1: { severeMulti: 2435, multi: 1935, single: 1265 },
                tier2_9: { severeMulti: 2010, multi: 1010, single: 710 },
                tier10_19: { severeMulti: 1785, multi: 735, single: 545 },
                tier20_49: { severeMulti: 1500, multi: 655, single: 455 },
                tier50plus: { severeMulti: 1315, multi: 555, single: 395 }
            }
        }
    },
    guidance: {
        none: 0, oxygen: 2400, injection: 650, catheter: 1400, cancer: 1500, wound: 1050
    },
    cancerCare: {
        section1: { withRx: 1650, withoutRx: 1852 },
        section2: { withRx: 1495, withoutRx: 1687 }
    },
    nursingGuide: { home: 298, facility: 286 },
    houkatsuAddon: 150,
    section3ManageRatio: 0.8,
    addons: {
        clinicTier: { jujitsu: 800, jisseki1: 300, jisseki2: 200 },
        cancerJujitsu: 300,
        infoRenkei: 100,
        dataSubmit: 50,
        earlyTransition: 100,
        onlineMgmt: 100,
        frequentVisitFirst: 800,
        continuingCare: 216,
        nursingInstruction: 300,
        specialNursingInstruction: 100,
        visitDx1: 11,
        visitDx2: 9,
        bukkaVisit: 3,
        bukkaReexam: 2,
        baseUpVisitHome: 79,
        baseUpVisitFacility: 19,
        baseUpReexam: 4,
        emergencyInfoRenkei: 200,
        pharmacistJoint: 300,
        terminalCare: { tier3500: 3500, tier4500: 4500, tier5500: 5500, tier6500: 6500 },
        miokuri: 3000
    }
};

const CLINIC_SECTION = { 'kinou-kyouka': 'section1', 'zashin-ippan': 'section2', 'other-clinic': 'section3' };

function getEmergencyVisitPoints(clinicType, timeBand = 'day') {
    const addon = FEE_2026.emergencyAddon[clinicType] || FEE_2026.emergencyAddon['other-clinic'];
    let pts = FEE_2026.houseCall + addon + FEE_2026.reExam;
    if (timeBand === 'nightHoliday') {
        pts += FEE_2026.nightHolidayAddon[clinicType] || FEE_2026.nightHolidayAddon['other-clinic'];
    } else if (timeBand === 'lateNight') {
        pts += FEE_2026.lateNightAddon[clinicType] || FEE_2026.lateNightAddon['other-clinic'];
    }
    return pts;
}

function getEmergencyVisitBreakdown(clinicType, emergencyVisits, nightHolidayVisits, lateNightVisits) {
    const nh = Math.min(nightHolidayVisits, emergencyVisits);
    const ln = Math.min(lateNightVisits, Math.max(0, emergencyVisits - nh));
    const regular = Math.max(0, emergencyVisits - nh - ln);
    return regular * getEmergencyVisitPoints(clinicType, 'day')
        + nh * getEmergencyVisitPoints(clinicType, 'nightHoliday')
        + ln * getEmergencyVisitPoints(clinicType, 'lateNight');
}

function getHighCostLimit(age, incomeKey, combinedMedicalTotal10) {
    const isSenior = age === '75' || age === '70';
    if (isSenior) {
        if (incomeKey.startsWith('o70-active')) {
            return 44400 + Math.max(0, combinedMedicalTotal10 - 567000) * 0.01;
        }
        if (incomeKey === 'o70-general') return 18000;
        if (incomeKey === 'o70-low2' || incomeKey === 'o70-low1') return 8000;
    } else {
        if (incomeKey === 'u70-a') return 252600 + Math.max(0, combinedMedicalTotal10 - 842000) * 0.01;
        if (incomeKey === 'u70-b') return 167400 + Math.max(0, combinedMedicalTotal10 - 558000) * 0.01;
        if (incomeKey === 'u70-c') return 80100 + Math.max(0, combinedMedicalTotal10 - 267000) * 0.01;
        if (incomeKey === 'u70-d') return 57600;
        if (incomeKey === 'u70-e') return 35400;
    }
    return Infinity;
}

function applyMonthlyCap(medical, medication, nursing, cap) {
    let m = medical, med = medication, n = nursing;
    const total = m + med + n;
    if (total <= cap) return { medical: m, medication: med, nursing: n, deduction: total - Math.min(total, cap) };
    let over = total - cap;
    if (m >= over) m -= over;
    else { over -= m; m = 0; if (med >= over) med -= over; else { over -= med; med = 0; n = Math.max(0, n - over); } }
    return { medical: m, medication: med, nursing: n, deduction: total - cap };
}

const NANBYOU_CAP_BY_TIER = {
    '0': { normal: 0, longTerm: 0 },
    '2500': { normal: 2500, longTerm: 2500 },
    '5000': { normal: 5000, longTerm: 5000 },
    '10000': { normal: 10000, longTerm: 5000 },
    '20000': { normal: 20000, longTerm: 10000 },
    '30000': { normal: 30000, longTerm: 20000 }
};

function getNanbyouMonthlyCap(limitKey, ventilator, longTerm) {
    if (ventilator) return 1000;
    const tier = NANBYOU_CAP_BY_TIER[String(limitKey)] || NANBYOU_CAP_BY_TIER['10000'];
    return longTerm ? tier.longTerm : tier.normal;
}

function applyPublicExpenseCore(params) {
    const {
        publicExpense, medicalTotal10, medTotal10, medicalRatio, nursingRatio,
        nursingUnits, rawMedicalCopay, rawMedCopay, rawNursingCopay,
        age, incomeKey, visitFreq, emergencyVisits, hasDisabilityCert, disabilityGrade,
        nanbyouLimit, nanbyouVentilator, nanbyouLongTerm,
        jiritsuLimit, jiritsuCoveragePct,
        localSubsidyType, localCoverNursing
    } = params;

    let medical = rawMedicalCopay;
    let medication = rawMedCopay;
    let nursing = rawNursingCopay;

    if (publicExpense === 'welfare') {
        return { medical: 0, medication: 0, nursing: 0 };
    }

    if (publicExpense === 'nanbyou') {
        const nbRatio = Math.min(0.2, medicalRatio);
        const nbNursingRatio = Math.min(0.2, nursingRatio);
        medical = Math.round(medicalTotal10 * nbRatio);
        medication = Math.round(medTotal10 * nbRatio);
        nursing = Math.round(nursingUnits * 10 * nbNursingRatio);
        const cap = getNanbyouMonthlyCap(
            nanbyouLimit ?? '10000', !!nanbyouVentilator, !!nanbyouLongTerm
        );
        const c = applyMonthlyCap(medical, medication, nursing, cap);
        return { medical: c.medical, medication: c.medication, nursing: c.nursing };
    }

    if (publicExpense === 'jiritsu') {
        const jRatio = Math.min(0.1, medicalRatio);
        const coverage = Math.min(1, Math.max(0, (jiritsuCoveragePct ?? 100) / 100));
        const coveredMed10 = medicalTotal10 * coverage;
        const uncoveredMed10 = medicalTotal10 * (1 - coverage);
        const coveredDrug10 = medTotal10 * coverage;
        const uncoveredDrug10 = medTotal10 * (1 - coverage);
        let jMedical = Math.round(coveredMed10 * jRatio);
        let jMedication = Math.round(coveredDrug10 * jRatio);
        const uMedical = Math.round(uncoveredMed10 * medicalRatio);
        const uMedication = Math.round(uncoveredDrug10 * medicalRatio);
        const limitVal = jiritsuLimit ?? '5000';
        if (limitVal !== 'none' && coverage > 0) {
            const cap = parseFloat(limitVal === '5000-mid' ? 5000 : limitVal);
            const c = applyMonthlyCap(jMedical, jMedication, 0, cap);
            jMedical = c.medical;
            jMedication = c.medication;
        }
        return {
            medical: jMedical + uMedical,
            medication: jMedication + uMedication,
            nursing
        };
    }

    if (publicExpense === 'local-subsidy') {
        const subsidyType = localSubsidyType ?? 'zero';
        const coverNursing = !!localCoverNursing;
        if (subsidyType === 'zero') {
            return {
                medical: 0, medication: 0,
                nursing: coverNursing ? 0 : nursing
            };
        }
        if (subsidyType === 'fixed-500') {
            const cap = (visitFreq + (emergencyVisits || 0)) * 500;
            const c = applyMonthlyCap(medical, medication, 0, cap);
            return { medical: c.medical, medication: c.medication, nursing };
        }
        if (subsidyType === 'fixed-1000') {
            const c = applyMonthlyCap(medical, medication, 0, 1000);
            return { medical: c.medical, medication: c.medication, nursing };
        }
        if (subsidyType.startsWith('ratio-cap-')) {
            const cap = parseInt(subsidyType.replace('ratio-cap-', ''), 10);
            const r = Math.min(0.1, medicalRatio);
            const c = applyMonthlyCap(
                Math.round(medicalTotal10 * r),
                Math.round(medTotal10 * r),
                0,
                cap
            );
            return { medical: c.medical, medication: c.medication, nursing };
        }
        return { medical, medication, nursing };
    }

    const combinedMedicalTotal10 = medicalTotal10 + medTotal10;
    const highCostLimit = getHighCostLimit(age, incomeKey, combinedMedicalTotal10);
    const medicalDrugCopay = medical + medication;
    if (medicalDrugCopay > highCostLimit) {
        const c = applyMonthlyCap(medical, medication, 0, highCostLimit);
        medical = c.medical;
        medication = c.medication;
    }

    if (hasDisabilityCert) {
        const grade = disabilityGrade || 'general';
        let disabilityCap = Infinity;
        if (grade === 'grade1-2') disabilityCap = 0;
        else if (grade === 'grade3') disabilityCap = 1000;
        if (disabilityCap !== Infinity) {
            const beforeCap = medical + medication;
            if (beforeCap > disabilityCap) {
                const c = applyMonthlyCap(medical, medication, 0, disabilityCap);
                medical = c.medical;
                medication = c.medication;
            }
        }
    }

    return { medical, medication, nursing };
}

function getManagementPoints(location, section, visitFreq, patientStatus, clinicMeets20, buildingPatientTier) {
    const locKey = location === 'home' ? 'home' : 'facility';
    const sectionRates = FEE_2026.management[locKey][section];
    const tierKey = locKey === 'facility' ? (buildingPatientTier || 'tier1') : null;
    const rates = locKey === 'facility'
        ? (sectionRates[tierKey] || sectionRates.tier1)
        : sectionRates;
    let useMulti = visitFreq >= 2;
    if (useMulti && !clinicMeets20) useMulti = false;
    let pts;
    if (useMulti && patientStatus === 'severe') pts = rates.severeMulti;
    else if (useMulti) {
        pts = rates.multi;
        if (patientStatus === 'houkatsu') pts += FEE_2026.houkatsuAddon;
    } else pts = rates.single;
    if (section === 'section3') pts = Math.round(pts * FEE_2026.section3ManageRatio);
    return pts;
}

function calculateAddonPoints(p) {
    const A = FEE_2026.addons;
    const f = p.addonFlags || {};
    const visitCount = p.applyCancerCare ? (p.cancerCareWeeks || 0) : (p.visitFreq || 0);
    let total = 0;
    const push = (pts) => { if (pts > 0) total += pts; };

    if (!p.applyCancerCare) {
        push(A.clinicTier[f.clinicTier]);
        if (f.infoRenkei) push(A.infoRenkei);
        if (f.dataSubmit) push(A.dataSubmit);
        if (f.earlyTransition) push(A.earlyTransition);
        if (f.onlineMgmt) push(A.onlineMgmt);
        if (p.visitFreq >= 4 && f.autoFrequentVisit !== false) push(A.frequentVisitFirst);
        if (f.continuingCare && p.clinicType === 'other-clinic') push(A.continuingCare);
    } else {
        if (f.infoRenkei) push(A.infoRenkei);
        if (f.dataSubmit) push(A.dataSubmit);
        if (f.clinicTier === 'jujitsu') push(A.cancerJujitsu);
    }
    if (f.nursingInstruction) push(A.nursingInstruction);
    if (f.specialNursingInstruction) push(A.specialNursingInstruction);
    if (f.dxAddon === '1') push(A.visitDx1);
    else if (f.dxAddon === '2') push(A.visitDx2);
    if (visitCount > 0 && f.bukkaVisit) push(visitCount * A.bukkaVisit);
    if (visitCount > 0 && f.baseUpVisit) {
        push(visitCount * (p.location === 'home' ? A.baseUpVisitHome : A.baseUpVisitFacility));
    }
    if (p.hasPrescription && f.bukkaVisit) push(A.bukkaReexam);
    if (p.hasPrescription && f.baseUpVisit) push(A.baseUpReexam);
    if (p.emergencyVisits > 0 && f.emergencyInfoRenkei) {
        push(p.emergencyVisits * A.emergencyInfoRenkei);
    }
    if (!p.applyCancerCare && p.location === 'home' && f.pharmacistJoint) push(A.pharmacistJoint);
    if (!p.applyCancerCare && f.terminalCare && f.terminalCare !== 'none') {
        push(A.terminalCare[f.terminalCare]);
    }
    if (!p.applyCancerCare && f.miokuri) push(A.miokuri);
    return total;
}

function calcPoints(p) {
    const section = CLINIC_SECTION[p.clinicType] || 'section2';
    if (p.applyCancerCare) {
        const r = section === 'section1' ? FEE_2026.cancerCare.section1 : FEE_2026.cancerCare.section2;
        return (p.hasPrescription ? r.withRx : r.withoutRx) * p.cancerCareWeeks + calculateAddonPoints(p);
    }
    const loc = p.location === 'home' ? 'home' : 'facility';
    let pts = FEE_2026.visit[loc] * p.visitFreq;
    pts += getManagementPoints(
        p.location, section, p.visitFreq, p.patientStatus, p.clinicMeets20, p.buildingPatientTier
    );
    pts += (FEE_2026.guidance[p.homeGuidance] || 0);
    pts += getEmergencyVisitBreakdown(
        p.clinicType,
        p.emergencyVisits || 0,
        p.nightHolidayVisits || 0,
        p.lateNightVisits || 0
    );
    pts += p.hasPrescription ? FEE_2026.prescription : FEE_2026.noPrescriptionBonus;
    pts += calculateAddonPoints(p);
    return pts;
}

function calcTotal(p) {
    const pts = calcPoints(p);
    const med10 = pts * 10;
    const medDrug10 = p.medTotal10 || 0;
    const ratio = p.ratio;
    const rawMed = Math.round(med10 * ratio);
    const rawDrug = Math.round(medDrug10 * ratio);
    let nursingUnits = 0;
    let rawNursing = 0;
    if (p.useNursing) {
        nursingUnits = (p.location === 'home' ? 298 : 286) * Math.min(2, p.visitFreq);
        rawNursing = Math.round(nursingUnits * 10 * (p.nursingRatio || 0.1));
    }

    const pe = applyPublicExpenseCore({
        publicExpense: p.publicExpense || 'none',
        medicalTotal10: med10,
        medTotal10: medDrug10,
        medicalRatio: ratio,
        nursingRatio: p.nursingRatio || 0.1,
        nursingUnits,
        rawMedicalCopay: rawMed,
        rawMedCopay: rawDrug,
        rawNursingCopay: rawNursing,
        age: p.age,
        incomeKey: p.incomeKey,
        visitFreq: p.visitFreq,
        emergencyVisits: p.emergencyVisits || 0,
        hasDisabilityCert: p.hasDisabilityCert,
        disabilityGrade: p.disabilityGrade,
        nanbyouLimit: p.nanbyouLimit,
        nanbyouVentilator: p.nanbyouVentilator,
        nanbyouLongTerm: p.nanbyouLongTerm,
        jiritsuLimit: p.jiritsuLimit,
        jiritsuCoveragePct: p.jiritsuCoveragePct,
        localSubsidyType: p.localSubsidyType,
        localCoverNursing: p.localCoverNursing
    });

    return {
        pts,
        total: pe.medical + pe.medication + pe.nursing,
        medical: pe.medical,
        medication: pe.medication,
        nursing: pe.nursing
    };
}

const tests = [
    {
        name: '標準: 自宅2回・機能強化型・3割・介護1割',
        p: { location: 'home', clinicType: 'kinou-kyouka', visitFreq: 2, patientStatus: 'no', clinicMeets20: true,
            homeGuidance: 'none', hasPrescription: true, emergencyVisits: 0, ratio: 0.3, useNursing: true,
            nursingRatio: 0.1, medTotal10: 10000, publicExpense: 'none', age: '69', incomeKey: 'u70-c' },
        expectPts: 890 * 2 + 4085 + 68,
        expectTotal: Math.round((890 * 2 + 4085 + 68) * 10 * 0.3) + 596 + 3000
    },
    {
        name: '酸素指導管理（排他・1件のみ）',
        p: { location: 'home', clinicType: 'kinou-kyouka', visitFreq: 2, patientStatus: 'no', clinicMeets20: true,
            homeGuidance: 'oxygen', hasPrescription: true, emergencyVisits: 0, ratio: 0.3, useNursing: true,
            nursingRatio: 0.1, medTotal10: 10000, publicExpense: 'none', age: '69', incomeKey: 'u70-c' },
        expectPts: 890 * 2 + 4085 + 2400 + 68
    },
    {
        name: '2割要件未達 → 月1回管理料',
        p: { location: 'home', clinicType: 'kinou-kyouka', visitFreq: 2, patientStatus: 'no', clinicMeets20: false,
            homeGuidance: 'none', hasPrescription: true, emergencyVisits: 0, ratio: 0.3, useNursing: false,
            medTotal10: 10000, publicExpense: 'none', age: '69', incomeKey: 'u70-c' },
        expectPts: 890 * 2 + 2505 + 68
    },
    {
        name: '別表8-3 → multi+150',
        p: { location: 'home', clinicType: 'kinou-kyouka', visitFreq: 2, patientStatus: 'houkatsu', clinicMeets20: true,
            homeGuidance: 'none', hasPrescription: true, emergencyVisits: 0, ratio: 0.3, useNursing: false,
            medTotal10: 10000, publicExpense: 'none', age: '69', incomeKey: 'u70-c' },
        expectPts: 890 * 2 + 4085 + 150 + 68
    },
    {
        name: '別表8-2重症 → severeMulti',
        p: { location: 'home', clinicType: 'kinou-kyouka', visitFreq: 2, patientStatus: 'severe', clinicMeets20: true,
            homeGuidance: 'none', hasPrescription: true, emergencyVisits: 0, ratio: 0.3, useNursing: false,
            medTotal10: 10000, publicExpense: 'none', age: '69', incomeKey: 'u70-c' },
        expectPts: 890 * 2 + 4985 + 68
    },
    {
        name: '一般診療所 → 管理料80%',
        p: { location: 'home', clinicType: 'other-clinic', visitFreq: 2, patientStatus: 'no', clinicMeets20: true,
            homeGuidance: 'none', hasPrescription: true, emergencyVisits: 0, ratio: 0.3, useNursing: false,
            medTotal10: 10000, publicExpense: 'none', age: '69', incomeKey: 'u70-c' },
        expectPts: 890 * 2 + Math.round(2735 * 0.8) + 68
    },
    {
        name: '施設・在支診2',
        p: { location: 'facility', clinicType: 'zashin-ippan', visitFreq: 2, patientStatus: 'no', clinicMeets20: true,
            homeGuidance: 'none', hasPrescription: true, emergencyVisits: 0, ratio: 0.3, useNursing: true,
            nursingRatio: 0.1, medTotal10: 10000, publicExpense: 'none', age: '69', incomeKey: 'u70-c' },
        expectPts: 215 * 2 + 2585 + 68
    },
    {
        name: '施設・在支診2・同一建物2〜9人',
        p: { location: 'facility', clinicType: 'zashin-ippan', visitFreq: 2, patientStatus: 'no', clinicMeets20: true,
            buildingPatientTier: 'tier2_9', homeGuidance: 'none', hasPrescription: true, emergencyVisits: 0, ratio: 0.3,
            useNursing: false, medTotal10: 10000, publicExpense: 'none', age: '69', incomeKey: 'u70-c' },
        expectPts: 215 * 2 + 1385 + 68
    },
    {
        name: '施設・在支診2・同一建物50人以上',
        p: { location: 'facility', clinicType: 'zashin-ippan', visitFreq: 2, patientStatus: 'no', clinicMeets20: true,
            buildingPatientTier: 'tier50plus', homeGuidance: 'none', hasPrescription: true, emergencyVisits: 0, ratio: 0.3,
            useNursing: false, medTotal10: 0, publicExpense: 'none', age: '69', incomeKey: 'u70-c' },
        expectPts: 215 * 2 + 745 + 68
    },
    {
        name: '施設・機能強化型・10〜19人・別表8-2',
        p: { location: 'facility', clinicType: 'kinou-kyouka', visitFreq: 2, patientStatus: 'severe', clinicMeets20: true,
            buildingPatientTier: 'tier10_19', homeGuidance: 'none', hasPrescription: true, emergencyVisits: 0, ratio: 0.3,
            useNursing: false, medTotal10: 0, publicExpense: 'none', age: '69', incomeKey: 'u70-c' },
        expectPts: 215 * 2 + 2625 + 68
    },
    {
        name: '在がん総4週・機能強化型・3割',
        p: { applyCancerCare: true, clinicType: 'kinou-kyouka', cancerCareWeeks: 4, hasPrescription: true,
            ratio: 0.3, useNursing: false, medTotal10: 10000, publicExpense: 'none', age: '69', incomeKey: 'u70-c' },
        expectPts: 1650 * 4,
        expectTotal: 1650 * 4 * 10 * 0.3 + 3000
    },
    {
        name: '後期高齢1割・一般所得・高額適用',
        p: { location: 'home', clinicType: 'kinou-kyouka', visitFreq: 2, patientStatus: 'no', clinicMeets20: true,
            homeGuidance: 'oxygen', hasPrescription: true, emergencyVisits: 0, ratio: 0.1, useNursing: true,
            nursingRatio: 0.1, medTotal10: 100000, publicExpense: 'none', age: '75', incomeKey: 'o70-general' },
        expectTotalCap: 18000 + 596
    },
    {
        name: '指定難病2割・上限10000',
        p: { location: 'home', clinicType: 'kinou-kyouka', visitFreq: 2, patientStatus: 'no', clinicMeets20: true,
            homeGuidance: 'oxygen', hasPrescription: true, emergencyVisits: 0, ratio: 0.3, useNursing: true,
            nursingRatio: 0.1, medTotal10: 10000, publicExpense: 'nanbyou', nanbyouLimit: '10000', age: '69', incomeKey: 'u70-c' },
        expectTotal: 10000
    },
    {
        name: '生活保護・自己負担0円',
        p: { location: 'home', clinicType: 'kinou-kyouka', visitFreq: 2, patientStatus: 'no', clinicMeets20: true,
            homeGuidance: 'oxygen', hasPrescription: true, emergencyVisits: 0, ratio: 0.3, useNursing: true,
            nursingRatio: 0.1, medTotal10: 10000, publicExpense: 'welfare', age: '69', incomeKey: 'u70-c' },
        expectTotal: 0
    },
    {
        name: '指定難病・1割維持（上限未達）',
        p: { location: 'home', clinicType: 'kinou-kyouka', visitFreq: 2, patientStatus: 'no', clinicMeets20: true,
            homeGuidance: 'none', hasPrescription: true, emergencyVisits: 0, ratio: 0.1, useNursing: false,
            medTotal10: 5000, publicExpense: 'nanbyou', nanbyouLimit: '10000', age: '75', incomeKey: 'o70-general' },
        expectTotal: Math.round((890 * 2 + 4085 + 68) * 10 * 0.1) + Math.round(5000 * 0.1)
    },
    {
        name: '指定難病・高額かつ長期（一般所得Ⅰ→5000）',
        p: { location: 'home', clinicType: 'kinou-kyouka', visitFreq: 2, patientStatus: 'no', clinicMeets20: true,
            homeGuidance: 'oxygen', hasPrescription: true, emergencyVisits: 0, ratio: 0.3, useNursing: true,
            nursingRatio: 0.1, medTotal10: 10000, publicExpense: 'nanbyou', nanbyouLimit: '10000',
            nanbyouLongTerm: true, age: '69', incomeKey: 'u70-c' },
        expectTotal: 5000
    },
    {
        name: '指定難病・人工呼吸器（上限1000）',
        p: { location: 'home', clinicType: 'kinou-kyouka', visitFreq: 2, patientStatus: 'no', clinicMeets20: true,
            homeGuidance: 'oxygen', hasPrescription: true, emergencyVisits: 0, ratio: 0.3, useNursing: true,
            nursingRatio: 0.1, medTotal10: 10000, publicExpense: 'nanbyou', nanbyouLimit: '10000',
            nanbyouVentilator: true, age: '69', incomeKey: 'u70-c' },
        expectTotal: 1000
    },
    {
        name: '自立支援・全額対象・上限5000・介護別',
        p: { location: 'home', clinicType: 'kinou-kyouka', visitFreq: 2, patientStatus: 'no', clinicMeets20: true,
            homeGuidance: 'none', hasPrescription: true, emergencyVisits: 0, ratio: 0.3, useNursing: true,
            nursingRatio: 0.1, medTotal10: 10000, publicExpense: 'jiritsu', jiritsuLimit: '5000',
            jiritsuCoveragePct: 100, age: '69', incomeKey: 'u70-c' },
        expectTotal: 5000 + 596
    },
    {
        name: '自立支援・50%対象・残り3割',
        p: { location: 'home', clinicType: 'kinou-kyouka', visitFreq: 2, patientStatus: 'no', clinicMeets20: true,
            homeGuidance: 'none', hasPrescription: true, emergencyVisits: 0, ratio: 0.3, useNursing: false,
            medTotal10: 10000, publicExpense: 'jiritsu', jiritsuLimit: 'none',
            jiritsuCoveragePct: 50, age: '69', incomeKey: 'u70-c' },
        expectTotal: (() => {
            const med10 = (890 * 2 + 4085 + 68) * 10;
            const drug10 = 10000;
            const jMed = Math.round(med10 * 0.5 * 0.1) + Math.round(med10 * 0.5 * 0.3);
            const jDrug = Math.round(drug10 * 0.5 * 0.1) + Math.round(drug10 * 0.5 * 0.3);
            return jMed + jDrug;
        })()
    },
    {
        name: '自治体助成・自己負担0円',
        p: { location: 'home', clinicType: 'kinou-kyouka', visitFreq: 2, patientStatus: 'no', clinicMeets20: true,
            homeGuidance: 'none', hasPrescription: true, emergencyVisits: 0, ratio: 0.3, useNursing: true,
            nursingRatio: 0.1, medTotal10: 10000, publicExpense: 'local-subsidy',
            localSubsidyType: 'zero', localCoverNursing: true, age: '69', incomeKey: 'u70-c' },
        expectTotal: 0
    },
    {
        name: '自治体助成・1割+上限1000',
        p: { location: 'home', clinicType: 'kinou-kyouka', visitFreq: 2, patientStatus: 'no', clinicMeets20: true,
            homeGuidance: 'oxygen', hasPrescription: true, emergencyVisits: 0, ratio: 0.3, useNursing: false,
            medTotal10: 10000, publicExpense: 'local-subsidy', localSubsidyType: 'ratio-cap-1000',
            age: '69', incomeKey: 'u70-c' },
        expectTotal: 1000
    },
    {
        name: '自治体助成・1回500円×4訪問',
        p: { location: 'home', clinicType: 'kinou-kyouka', visitFreq: 4, patientStatus: 'no', clinicMeets20: true,
            homeGuidance: 'none', hasPrescription: true, emergencyVisits: 0, ratio: 0.3, useNursing: false,
            medTotal10: 10000, publicExpense: 'local-subsidy', localSubsidyType: 'fixed-500',
            age: '69', incomeKey: 'u70-c' },
        expectTotal: 2000
    },
    {
        name: '障害者手帳1-2級・自己負担0円',
        p: { location: 'home', clinicType: 'kinou-kyouka', visitFreq: 2, patientStatus: 'no', clinicMeets20: true,
            homeGuidance: 'none', hasPrescription: true, emergencyVisits: 0, ratio: 0.3, useNursing: false,
            medTotal10: 10000, publicExpense: 'none', hasDisabilityCert: true, disabilityGrade: 'grade1-2',
            age: '69', incomeKey: 'u70-c' },
        expectTotal: 0
    },
    {
        name: '障害者手帳3級・高額後1000円上限',
        p: { location: 'home', clinicType: 'kinou-kyouka', visitFreq: 2, patientStatus: 'no', clinicMeets20: true,
            homeGuidance: 'oxygen', hasPrescription: true, emergencyVisits: 0, ratio: 0.1, useNursing: false,
            medTotal10: 100000, publicExpense: 'none', hasDisabilityCert: true, disabilityGrade: 'grade3',
            age: '75', incomeKey: 'o70-general' },
        expectTotal: 1000
    },
    {
        name: '緊急往診1回・機能強化型（720+750+75）',
        p: { location: 'home', clinicType: 'kinou-kyouka', visitFreq: 2, patientStatus: 'no', clinicMeets20: true,
            homeGuidance: 'none', hasPrescription: true, emergencyVisits: 1, ratio: 0.3, useNursing: false,
            medTotal10: 0, publicExpense: 'none', age: '69', incomeKey: 'u70-c' },
        expectPts: 890 * 2 + 4085 + 68 + 1545
    },
    {
        name: '緊急往診1回・一般診療所（720+325+75）',
        p: { location: 'home', clinicType: 'other-clinic', visitFreq: 2, patientStatus: 'no', clinicMeets20: true,
            homeGuidance: 'none', hasPrescription: true, emergencyVisits: 1, ratio: 0.3, useNursing: false,
            medTotal10: 0, publicExpense: 'none', age: '69', incomeKey: 'u70-c' },
        expectPts: 890 * 2 + Math.round(2735 * 0.8) + 68 + 1120
    },
    {
        name: '居宅療養管理指導費Ⅱ・自宅1人298単位',
        p: { location: 'home', clinicType: 'kinou-kyouka', visitFreq: 2, patientStatus: 'no', clinicMeets20: true,
            homeGuidance: 'none', hasPrescription: true, emergencyVisits: 0, ratio: 0.1, useNursing: true,
            nursingRatio: 0.1, medTotal10: 0, publicExpense: 'none', age: '75', incomeKey: 'o70-general' },
        expectNursing: 596
    },
    {
        name: '加算: 情報連携+DX+訪問看護指示',
        p: { location: 'home', clinicType: 'kinou-kyouka', visitFreq: 2, patientStatus: 'no', clinicMeets20: true,
            homeGuidance: 'none', hasPrescription: true, emergencyVisits: 0, ratio: 0.3, useNursing: false,
            medTotal10: 0, publicExpense: 'none', age: '69', incomeKey: 'u70-c',
            addonFlags: { clinicTier: 'none', infoRenkei: true, dxAddon: '1', nursingInstruction: true } },
        expectPts: 890 * 2 + 4085 + 68 + 100 + 11 + 300
    },
    {
        name: '加算: 充実体制+頻回訪問(4回)',
        p: { location: 'home', clinicType: 'kinou-kyouka', visitFreq: 4, patientStatus: 'no', clinicMeets20: true,
            homeGuidance: 'none', hasPrescription: true, emergencyVisits: 0, ratio: 0.1, useNursing: false,
            medTotal10: 0, publicExpense: 'none', age: '75', incomeKey: 'o70-general',
            addonFlags: { clinicTier: 'jujitsu', autoFrequentVisit: true } },
        expectPts: 890 * 4 + 4085 + 68 + 800 + 800
    },
    {
        name: '加算: 在がん総+情報連携+充実体制',
        p: { applyCancerCare: true, clinicType: 'kinou-kyouka', cancerCareWeeks: 4, hasPrescription: true,
            ratio: 0.1, useNursing: false, medTotal10: 0, publicExpense: 'none', age: '75', incomeKey: 'o70-general',
            addonFlags: { clinicTier: 'jujitsu', infoRenkei: true } },
        expectPts: 1650 * 4 + 100 + 300
    },
    {
        name: '夜間・休日往診1回・機能強化型（1545+1700）',
        p: { location: 'home', clinicType: 'kinou-kyouka', visitFreq: 2, patientStatus: 'no', clinicMeets20: true,
            homeGuidance: 'none', hasPrescription: true, emergencyVisits: 1, nightHolidayVisits: 1, lateNightVisits: 0,
            ratio: 0.3, useNursing: false, medTotal10: 0, publicExpense: 'none', age: '69', incomeKey: 'u70-c' },
        expectPts: 890 * 2 + 4085 + 68 + 1545 + 1700
    },
    {
        name: '深夜往診1回・一般診療所（1120+485）',
        p: { location: 'home', clinicType: 'other-clinic', visitFreq: 2, patientStatus: 'no', clinicMeets20: true,
            homeGuidance: 'none', hasPrescription: true, emergencyVisits: 1, nightHolidayVisits: 0, lateNightVisits: 1,
            ratio: 0.3, useNursing: false, medTotal10: 0, publicExpense: 'none', age: '69', incomeKey: 'u70-c' },
        expectPts: 890 * 2 + Math.round(2735 * 0.8) + 68 + 1120 + 485
    },
    {
        name: '加算: ターミナルケア+看取り+薬剤師同時指導',
        p: { location: 'home', clinicType: 'zashin-ippan', visitFreq: 2, patientStatus: 'no', clinicMeets20: true,
            homeGuidance: 'none', hasPrescription: true, emergencyVisits: 0, ratio: 0.1, useNursing: false,
            medTotal10: 0, publicExpense: 'none', age: '75', incomeKey: 'o70-general',
            addonFlags: { terminalCare: 'tier4500', miokuri: true, pharmacistJoint: true } },
        expectPts: 890 * 2 + 3685 + 68 + 4500 + 3000 + 300
    },
    {
        name: '当院デフォルト加算（DX1+物価+データ+連携+ベースアップ）',
        p: { location: 'home', clinicType: 'kinou-kyouka', visitFreq: 2, patientStatus: 'no', clinicMeets20: true,
            homeGuidance: 'none', hasPrescription: true, emergencyVisits: 0, ratio: 0.3, useNursing: false,
            medTotal10: 0, publicExpense: 'none', age: '69', incomeKey: 'u70-c',
            addonFlags: { dxAddon: '1', infoRenkei: true, dataSubmit: true, bukkaVisit: true, baseUpVisit: true } },
        expectPts: 890 * 2 + 4085 + 68 + 11 + 100 + 50 + (2 * 3) + (2 * 79) + 2 + 4
    }
];

let passed = 0, failed = 0;
tests.forEach(t => {
    const r = calcTotal(t.p);
    let ok = true;
    let msg = '';
    if (t.expectPts !== undefined && r.pts !== t.expectPts) {
        ok = false; msg += ` pts=${r.pts} expected=${t.expectPts}`;
    }
    if (t.expectTotal !== undefined && r.total !== t.expectTotal) {
        ok = false; msg += ` total=${r.total} expected=${t.expectTotal}`;
    }
    if (t.expectTotalCap !== undefined && r.total !== t.expectTotalCap) {
        ok = false; msg += ` total=${r.total} expected=${t.expectTotalCap}`;
    }
    if (t.expectNursing !== undefined && r.nursing !== t.expectNursing) {
        ok = false; msg += ` nursing=${r.nursing} expected=${t.expectNursing}`;
    }
    if (ok) { passed++; console.log(`✓ ${t.name}`); }
    else { failed++; console.log(`✗ ${t.name}:${msg}`); }
});
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
