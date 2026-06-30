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
    prescription: 68,
    noPrescriptionBonus: 300,
    management: {
        home: {
            section1: { severeMulti: 4985, multi: 4085, single: 2505 },
            section2: { severeMulti: 4585, multi: 3685, single: 2285 },
            section3: { severeMulti: 3435, multi: 2735, single: 1745 }
        },
        facility: {
            section1: { severeMulti: 3585, multi: 2885, single: 1785 },
            section2: { severeMulti: 3285, multi: 2585, single: 1625 },
            section3: { severeMulti: 2435, multi: 1935, single: 1265 }
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
    section3ManageRatio: 0.8
};

const CLINIC_SECTION = { 'kinou-kyouka': 'section1', 'zashin-ippan': 'section2', 'other-clinic': 'section3' };

function getEmergencyVisitPoints(clinicType) {
    const addon = FEE_2026.emergencyAddon[clinicType] || FEE_2026.emergencyAddon['other-clinic'];
    return FEE_2026.houseCall + addon + FEE_2026.reExam;
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

function getManagementPoints(location, section, visitFreq, patientStatus, clinicMeets20) {
    const locKey = location === 'home' ? 'home' : 'facility';
    const rates = FEE_2026.management[locKey][section];
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

function calcPoints(p) {
    const section = CLINIC_SECTION[p.clinicType] || 'section2';
    if (p.applyCancerCare) {
        const r = section === 'section1' ? FEE_2026.cancerCare.section1 : FEE_2026.cancerCare.section2;
        return (p.hasPrescription ? r.withRx : r.withoutRx) * p.cancerCareWeeks;
    }
    const loc = p.location === 'home' ? 'home' : 'facility';
    let pts = FEE_2026.visit[loc] * p.visitFreq;
    pts += getManagementPoints(p.location, section, p.visitFreq, p.patientStatus, p.clinicMeets20);
    pts += (FEE_2026.guidance[p.homeGuidance] || 0);
    pts += p.emergencyVisits * getEmergencyVisitPoints(p.clinicType);
    pts += p.hasPrescription ? FEE_2026.prescription : FEE_2026.noPrescriptionBonus;
    return pts;
}

function calcTotal(p) {
    const pts = calcPoints(p);
    const med10 = pts * 10;
    const medDrug10 = p.medTotal10 || 0;
    const rawMed = Math.round(med10 * p.ratio);
    const rawDrug = Math.round(medDrug10 * p.ratio);
    let nursing = 0;
    if (p.useNursing) {
        const u = (p.location === 'home' ? 298 : 286) * Math.min(2, p.visitFreq);
        nursing = Math.round(u * 10 * (p.nursingRatio || 0.1));
    }
    let medical = rawMed, medication = rawDrug, n = nursing;

    if (p.publicExpense === 'nanbyou') {
        const nr = Math.min(0.2, p.ratio);
        medical = Math.round(med10 * nr);
        medication = Math.round(medDrug10 * nr);
        n = Math.round((p.useNursing ? (p.location === 'home' ? 298 : 286) * Math.min(2, p.visitFreq) * 10 : 0) * Math.min(0.2, p.nursingRatio || 0.1));
        const cap = p.nanbyouCap ?? 10000;
        const c = applyMonthlyCap(medical, medication, n, cap);
        medical = c.medical; medication = c.medication; n = c.nursing;
    } else if (p.publicExpense === 'none') {
        const limit = getHighCostLimit(p.age, p.incomeKey, med10 + medDrug10);
        const combined = medical + medication;
        if (combined > limit) {
            const c = applyMonthlyCap(medical, medication, 0, limit);
            medical = c.medical; medication = c.medication;
        }
    }
    return { pts, total: medical + medication + n, medical, medication, nursing: n };
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
            nursingRatio: 0.1, medTotal10: 10000, publicExpense: 'nanbyou', nanbyouCap: 10000, age: '69', incomeKey: 'u70-c' },
        expectTotal: 10000
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
