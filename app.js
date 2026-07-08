document.addEventListener('DOMContentLoaded', () => {
    const ageSelect = document.getElementById('age-select');
    const copayRatioSelect = document.getElementById('copay-ratio');
    const incomeLevelSelect = document.getElementById('income-level');
    const clinicTypeSelect = document.getElementById('clinic-type');
    const clinicSevere20Check = document.getElementById('clinic-severe-20');
    const patientSevereSelect = document.getElementById('patient-severe');
    const applyCancerCareSelect = document.getElementById('apply-cancer-care');
    const cancerCareDetailsPanel = document.getElementById('cancer-care-details');
    const cancerCareWeeksSlider = document.getElementById('cancer-care-weeks');
    const cancerCareWeeksVal = document.getElementById('cancer-care-weeks-val');
    const visitFrequencySlider = document.getElementById('visit-frequency');
    const visitFrequencyVal = document.getElementById('visit-frequency-val');
    const emergencyVisitsSlider = document.getElementById('emergency-visits');
    const emergencyVisitsVal = document.getElementById('emergency-visits-val');
    const emergencyNightHolidaySlider = document.getElementById('emergency-night-holiday');
    const emergencyNightHolidayVal = document.getElementById('emergency-night-holiday-val');
    const emergencyLateNightSlider = document.getElementById('emergency-late-night');
    const emergencyLateNightVal = document.getElementById('emergency-late-night-val');
    const emergencyTimeAddonsGroup = document.getElementById('emergency-time-addons-group');
    const addonPharmacistRow = document.getElementById('addon-pharmacist-row');
    const addonTerminalGroup = document.getElementById('addon-terminal-group');
    const homeGuidanceSelect = document.getElementById('home-guidance-type');

    const hasPrescriptionSelect = document.getElementById('has-prescription');
    const medicationCostInput = document.getElementById('medication-cost');
    const medicationCostGroup = document.getElementById('medication-cost-group');
    const medicationCostLabel = document.getElementById('medication-cost-label');

    const nursingInsuranceSelect = document.getElementById('nursing-insurance');
    const nursingInsuranceDetails = document.getElementById('nursing-insurance-details');
    const nursingRatioSelect = document.getElementById('nursing-ratio');
    const publicExpenseSelect = document.getElementById('public-expense');

    const publicNanbyouDetails = document.getElementById('public-nanbyou-details');
    const nanbyouLimitSelect = document.getElementById('nanbyou-limit');
    const nanbyouVentilatorCheck = document.getElementById('nanbyou-ventilator');

    const publicJiritsuDetails = document.getElementById('public-jiritsu-details');
    const jiritsuLimitSelect = document.getElementById('jiritsu-limit');
    const jiritsuCoverageSelect = document.getElementById('jiritsu-coverage');
    const nanbyouLongTermCheck = document.getElementById('nanbyou-long-term');

    const publicLocalDetails = document.getElementById('public-local-details');
    const localSubsidyTypeSelect = document.getElementById('local-subsidy-type');
    const localNursingSubsidyCheck = document.getElementById('local-nursing-subsidy');

    const disabilityCertSelect = document.getElementById('disability-cert');
    const disabilityDetailsPanel = document.getElementById('disability-details');
    const disabilityGradeSelect = document.getElementById('disability-grade');

    const totalPatientCostText = document.getElementById('total-patient-cost');
    const tableTotalMedical10 = document.getElementById('table-total-medical-10');
    const tableMedicalCopay = document.getElementById('table-medical-copay');
    const rowHighCostApplied = document.getElementById('row-high-cost-applied');
    const tableMedicalLimitApplied = document.getElementById('table-medical-limit-applied');
    const rowPublicApplied = document.getElementById('row-public-applied');
    const tablePublicLimitApplied = document.getElementById('table-public-limit-applied');
    const rowNursingDetail = document.getElementById('row-nursing-detail');
    const tableNursingCopay = document.getElementById('table-nursing-copay');
    const tableMedicationCopay = document.getElementById('table-medication-copay');
    const tableMedicalRatioLabel = document.getElementById('table-medical-ratio-label');
    const tableGuidanceNote = document.getElementById('table-guidance-note');
    const rowAddonsDetail = document.getElementById('row-addons-detail');
    const tableAddonsNote = document.getElementById('table-addons-note');
    const tableAddonsPoints = document.getElementById('table-addons-points');
    const addonContinuingCareRow = document.getElementById('addon-continuing-care-row');

    const donutMedical = document.getElementById('donut-segment-medical');
    const donutNursing = document.getElementById('donut-segment-nursing');
    const donutSelf = document.getElementById('donut-segment-self');
    const legendMedical = document.getElementById('legend-val-medical');
    const legendNursing = document.getElementById('legend-val-nursing');
    const legendSelf = document.getElementById('legend-val-self');

    const adviceContent = document.getElementById('advice-content');
    const btnPrint = document.getElementById('btn-print');
    const infoButtons = document.querySelectorAll('.btn-info-modal');
    const closeButtons = document.querySelectorAll('.btn-close-modal');
    const modals = document.querySelectorAll('.modal');
    const visitPlanControls = document.getElementById('visit-plan-controls');
    const facilityPatientTierGroup = document.getElementById('facility-patient-tier-group');
    const facilityBuildingPatientsSelect = document.getElementById('facility-building-patients');

    const BUILDING_PATIENT_TIER_LABELS = {
        tier1: '1人',
        tier2_9: '2〜9人',
        tier10_19: '10〜19人',
        tier20_49: '20〜49人',
        tier50plus: '50人以上'
    };

    // 令和8年度（2026年6月施行）診療報酬
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
            none: { points: 0, label: 'なし' },
            oxygen: { points: 2400, label: '在宅酸素療法指導管理料' },
            injection: { points: 650, label: '在宅自己注射指導管理料' },
            catheter: { points: 1400, label: '在宅自己導尿指導管理料' },
            cancer: { points: 1500, label: '在宅悪性腫瘍患者指導管理料' },
            wound: { points: 1050, label: '在宅寝たきり患者処置指導管理料' }
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

    const CLINIC_SECTION = {
        'kinou-kyouka': 'section1',
        'zashin-ippan': 'section2',
        'other-clinic': 'section3'
    };

    const incomeOptions = {
        under70: [
            { value: 'u70-a', text: '区分ア (年収約1,160万円〜 / 健保: 標準報酬月額83万円以上)' },
            { value: 'u70-b', text: '区分イ (年収約770万〜1,160万円 / 健保: 標準報酬月額53万〜79万円)' },
            { value: 'u70-c', text: '区分ウ (年収約370万〜770万円 / 健保: 標準報酬月額28万〜50万円) ★一般家庭' },
            { value: 'u70-d', text: '区分エ (年収約156万〜370万円 / 健保: 標準報酬月額26万円以下)' },
            { value: 'u70-e', text: '区分オ (住民税非課税世帯)' }
        ],
        over70: [
            { value: 'o70-active3', text: '現役並みⅢ (年収約1,160万円〜 / 課税所得145万円以上かつ年収高)' },
            { value: 'o70-active2', text: '現役並みⅡ (年収約770万〜1,160万円)' },
            { value: 'o70-active1', text: '現役並みⅠ (年収約370万〜770万円)' },
            { value: 'o70-general', text: '一般 (年収約156万〜370万円) ★一般的' },
            { value: 'o70-low2', text: '低所得Ⅱ (世帯全員が住民税非課税)' },
            { value: 'o70-low1', text: '低所得Ⅰ (世帯全員が住民税非課税かつ年金収入80万円以下等)' }
        ]
    };

    let medicationTotal10Cache = 10000;

    function getMedicalRatio() {
        return parseFloat(copayRatioSelect.value);
    }

    function getMedicationTotal10() {
        if (hasPrescriptionSelect.value !== 'yes') return 0;
        const copay = parseFloat(medicationCostInput.value || 0);
        const ratio = getMedicalRatio();
        if (ratio <= 0) return 0;
        return copay / ratio;
    }

    function syncMedicationInputFromCache() {
        if (hasPrescriptionSelect.value !== 'yes') return;
        const ratio = getMedicalRatio();
        medicationCostInput.value = Math.round(medicationTotal10Cache * ratio);
        updateMedicationLabel();
    }

    function updateMedicationLabel() {
        const ratio = Math.round(getMedicalRatio() * 10);
        if (medicationCostLabel) {
            medicationCostLabel.textContent =
                `月々の概算お薬代（薬局支払分・${ratio}割負担時の自己負担額）`;
        }
    }

    function getHighCostLimit(age, incomeKey, combinedMedicalTotal10) {
        const isSenior = age === '75' || age === '70';
        if (isSenior) {
            // 70歳以上は「外来（個人）」限度額（訪問診療＋院外薬局）
            if (incomeKey === 'o70-active3' || incomeKey === 'o70-active2' || incomeKey === 'o70-active1') {
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
        let m = medical;
        let med = medication;
        let n = nursing;
        const total = m + med + n;
        if (total <= cap) return { medical: m, medication: med, nursing: n, deduction: 0 };

        let over = total - cap;
        if (m >= over) {
            m -= over;
        } else {
            over -= m;
            m = 0;
            if (med >= over) {
                med -= over;
            } else {
                over -= med;
                med = 0;
                n = Math.max(0, n - over);
            }
        }
        return { medical: m, medication: med, nursing: n, deduction: total - cap };
    }

    function getEmergencyVisitPoints(clinicType, timeBand = 'day') {
        const addon = FEE_2026.emergencyAddon[clinicType] || FEE_2026.emergencyAddon['other-clinic'];
        let points = FEE_2026.houseCall + addon + FEE_2026.reExam;
        if (timeBand === 'nightHoliday') {
            points += FEE_2026.nightHolidayAddon[clinicType] || FEE_2026.nightHolidayAddon['other-clinic'];
        } else if (timeBand === 'lateNight') {
            points += FEE_2026.lateNightAddon[clinicType] || FEE_2026.lateNightAddon['other-clinic'];
        }
        return points;
    }

    function getEmergencyVisitBreakdown(clinicType, emergencyVisits, nightHolidayVisits, lateNightVisits) {
        const nh = Math.min(nightHolidayVisits, emergencyVisits);
        const ln = Math.min(lateNightVisits, Math.max(0, emergencyVisits - nh));
        const regular = Math.max(0, emergencyVisits - nh - ln);
        return {
            regular,
            nightHoliday: nh,
            lateNight: ln,
            total: regular * getEmergencyVisitPoints(clinicType, 'day')
                + nh * getEmergencyVisitPoints(clinicType, 'nightHoliday')
                + ln * getEmergencyVisitPoints(clinicType, 'lateNight')
        };
    }

    function getAddonFlags() {
        return {
            clinicTier: document.querySelector('input[name="clinic-tier"]:checked')?.value || 'none',
            infoRenkei: !!document.getElementById('addon-info-renkei')?.checked,
            dataSubmit: !!document.getElementById('addon-data-submit')?.checked,
            earlyTransition: !!document.getElementById('addon-early-transition')?.checked,
            onlineMgmt: !!document.getElementById('addon-online-mgmt')?.checked,
            nursingInstruction: !!document.getElementById('addon-nursing-instruction')?.checked,
            specialNursingInstruction: !!document.getElementById('addon-special-nursing')?.checked,
            continuingCare: !!document.getElementById('addon-continuing-care')?.checked,
            emergencyInfoRenkei: !!document.getElementById('addon-emergency-info')?.checked,
            dxAddon: document.getElementById('addon-dx')?.value || 'none',
            autoFrequentVisit: !!document.getElementById('addon-auto-frequent')?.checked,
            bukkaVisit: document.getElementById('addon-bukka')?.checked !== false,
            baseUpVisit: document.getElementById('addon-base-up')?.checked !== false,
            pharmacistJoint: !!document.getElementById('addon-pharmacist-joint')?.checked,
            terminalCare: document.getElementById('addon-terminal-care')?.value || 'none',
            miokuri: !!document.getElementById('addon-miokuri')?.checked
        };
    }

    function calculateAddonPoints(params) {
        const {
            applyCancerCare, clinicType, visitFreq, cancerCareWeeks, emergencyVisits,
            addonFlags, location, hasPrescription
        } = params;
        const A = FEE_2026.addons;
        const items = [];
        let total = 0;

        const push = (label, points) => {
            if (!points || points <= 0) return;
            items.push({ label, points });
            total += points;
        };

        if (!applyCancerCare) {
            const tierPts = A.clinicTier[addonFlags.clinicTier];
            if (tierPts) {
                const tierLabels = {
                    jujitsu: '在宅医療充実体制加算（在医総管）',
                    jisseki1: '在宅療養実績加算1（在医総管）',
                    jisseki2: '在宅療養実績加算2（在医総管）'
                };
                push(tierLabels[addonFlags.clinicTier], tierPts);
            }
            if (addonFlags.infoRenkei) push('在宅医療情報連携加算', A.infoRenkei);
            if (addonFlags.dataSubmit) push('在宅データ提出加算', A.dataSubmit);
            if (addonFlags.earlyTransition) push('在宅移行早期加算', A.earlyTransition);
            if (addonFlags.onlineMgmt) push('オンライン在宅管理料', A.onlineMgmt);
            if (visitFreq >= 4 && addonFlags.autoFrequentVisit) {
                push('頻回訪問加算（初回・月4回以上）', A.frequentVisitFirst);
            }
            if (addonFlags.continuingCare && clinicType === 'other-clinic') {
                push('継続診療加算', A.continuingCare);
            }
        } else {
            if (addonFlags.infoRenkei) push('在宅医療情報連携加算（在がん総）', A.infoRenkei);
            if (addonFlags.dataSubmit) push('在宅データ提出加算（在がん総）', A.dataSubmit);
            if (addonFlags.clinicTier === 'jujitsu') {
                push('在宅医療充実体制加算（在がん総）', A.cancerJujitsu);
            }
        }

        if (addonFlags.nursingInstruction) push('訪問看護指示料', A.nursingInstruction);
        if (addonFlags.specialNursingInstruction) push('特別訪問看護指示加算', A.specialNursingInstruction);

        if (addonFlags.dxAddon === '1') push('在宅医療DX情報活用加算1', A.visitDx1);
        else if (addonFlags.dxAddon === '2') push('在宅医療DX情報活用加算2', A.visitDx2);

        const visitCount = applyCancerCare ? (cancerCareWeeks || 0) : visitFreq;
        if (visitCount > 0 && addonFlags.bukkaVisit) {
            push('外来・在宅物価対応料（訪問診療時）', visitCount * A.bukkaVisit);
        }
        if (visitCount > 0 && addonFlags.baseUpVisit) {
            const baseUpPts = location === 'home' ? A.baseUpVisitHome : A.baseUpVisitFacility;
            push('外来・在宅ベースアップ評価料（Ⅰ）3・訪問診療', visitCount * baseUpPts);
        }
        if (hasPrescription && addonFlags.bukkaVisit) {
            push('外来・在宅物価対応料（再診時等）', A.bukkaReexam);
        }
        if (hasPrescription && addonFlags.baseUpVisit) {
            push('外来・在宅ベースアップ評価料（Ⅰ）2・再診時等', A.baseUpReexam);
        }

        if (emergencyVisits > 0 && addonFlags.emergencyInfoRenkei) {
            push('往診時医療情報連携加算', emergencyVisits * A.emergencyInfoRenkei);
        }

        if (!applyCancerCare && location === 'home' && addonFlags.pharmacistJoint) {
            push('訪問診療薬剤師同時指導料', A.pharmacistJoint);
        }

        if (!applyCancerCare && addonFlags.terminalCare !== 'none') {
            const tcPts = A.terminalCare[addonFlags.terminalCare];
            if (tcPts) {
                const tcLabels = {
                    tier3500: '在宅ターミナルケア加算（その他の診療所等・3,500点）',
                    tier4500: '在宅ターミナルケア加算（在宅療養支援診療所等・4,500点）',
                    tier5500: '在宅ターミナルケア加算（大臣定め・病床なし・5,500点）',
                    tier6500: '在宅ターミナルケア加算（大臣定め・病床あり・6,500点）'
                };
                push(tcLabels[addonFlags.terminalCare], tcPts);
            }
        }

        if (!applyCancerCare && addonFlags.miokuri) {
            push('看取り加算', A.miokuri);
        }

        return { total, items };
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

        let points;
        if (useMulti && patientStatus === 'severe') {
            points = rates.severeMulti;
        } else if (useMulti) {
            points = rates.multi;
            if (patientStatus === 'houkatsu') {
                points += FEE_2026.houkatsuAddon;
            }
        } else {
            points = rates.single;
        }

        if (section === 'section3') {
            points = Math.round(points * FEE_2026.section3ManageRatio);
        }
        return points;
    }

    function calculateMedicalPoints(params) {
        const {
            applyCancerCare, clinicType, hasPrescription, cancerCareWeeks,
            location, visitFreq, emergencyVisits, nightHolidayVisits, lateNightVisits,
            homeGuidanceType, patientStatus, clinicMeets20, buildingPatientTier, addonFlags
        } = params;

        const section = CLINIC_SECTION[clinicType] || 'section2';
        const breakdown = { visit: 0, management: 0, guidance: 0, emergency: 0, prescription: 0, cancer: 0, addons: 0 };
        let addonItems = [];

        if (applyCancerCare) {
            const rates = section === 'section1'
                ? FEE_2026.cancerCare.section1
                : FEE_2026.cancerCare.section2;
            breakdown.cancer = (hasPrescription ? rates.withRx : rates.withoutRx) * cancerCareWeeks;
            const addonResult = calculateAddonPoints({
                applyCancerCare, clinicType, visitFreq, cancerCareWeeks, emergencyVisits: 0,
                addonFlags, location, hasPrescription
            });
            breakdown.addons = addonResult.total;
            addonItems = addonResult.items;
            const totalPoints = breakdown.cancer + breakdown.addons;
            return { totalPoints, breakdown, addonItems, guidanceLabel: '在がん総に包括' };
        }

        breakdown.visit = FEE_2026.visit[location === 'home' ? 'home' : 'facility'] * visitFreq;
        breakdown.management = getManagementPoints(
            location, section, visitFreq, patientStatus, clinicMeets20, buildingPatientTier
        );

        if (emergencyVisits > 0) {
            breakdown.emergency = getEmergencyVisitBreakdown(
                clinicType, emergencyVisits, nightHolidayVisits, lateNightVisits
            ).total;
        }

        const guidance = FEE_2026.guidance[homeGuidanceType] || FEE_2026.guidance.none;
        breakdown.guidance = guidance.points;

        if (hasPrescription) {
            breakdown.prescription = FEE_2026.prescription;
        } else {
            breakdown.prescription = FEE_2026.noPrescriptionBonus;
        }

        const addonResult = calculateAddonPoints({
            applyCancerCare, clinicType, visitFreq, cancerCareWeeks, emergencyVisits,
            addonFlags, location, hasPrescription
        });
        breakdown.addons = addonResult.total;
        addonItems = addonResult.items;

        const totalPoints = breakdown.visit + breakdown.management + breakdown.guidance
            + breakdown.emergency + breakdown.prescription + breakdown.addons;

        return { totalPoints, breakdown, addonItems, guidanceLabel: guidance.label };
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

    function applyPublicExpense(params) {
        const {
            publicExpense, medicalTotal10, medTotal10, medicalRatio, nursingRatio,
            nursingUnits, rawMedicalCopay, rawMedCopay, rawNursingCopay,
            age, incomeKey, visitFreq, emergencyVisits, hasDisabilityCert, disabilityGrade,
            nanbyouLimit, nanbyouVentilator, nanbyouLongTerm,
            jiritsuLimit, jiritsuCoveragePct,
            localSubsidyType, localCoverNursing
        } = params;

        const nbLimitKey = nanbyouLimit ?? nanbyouLimitSelect?.value ?? '10000';
        const nbVentilator = nanbyouVentilator ?? !!nanbyouVentilatorCheck?.checked;
        const nbLongTerm = nanbyouLongTerm ?? !!nanbyouLongTermCheck?.checked;
        const jLimitVal = jiritsuLimit ?? jiritsuLimitSelect?.value ?? '5000';
        const jCoveragePct = jiritsuCoveragePct
            ?? parseInt(jiritsuCoverageSelect?.value || '100', 10);
        const subsidyType = localSubsidyType ?? localSubsidyTypeSelect?.value ?? 'zero';
        const coverNursing = localCoverNursing
            ?? !!(localNursingSubsidyCheck && localNursingSubsidyCheck.checked);

        let medical = rawMedicalCopay;
        let medication = rawMedCopay;
        let nursing = rawNursingCopay;
        let highCostDeduction = 0;
        let publicLimitDeduction = 0;
        let isHighCostApplied = false;
        let isPublicApplied = false;

        if (publicExpense === 'welfare') {
            publicLimitDeduction = medical + medication + nursing;
            return {
                medical: 0, medication: 0, nursing: 0,
                highCostDeduction, publicLimitDeduction, isHighCostApplied, isPublicApplied: true
            };
        }

        if (publicExpense === 'nanbyou') {
            const rawTotalBefore = rawMedicalCopay + rawMedCopay + rawNursingCopay;
            const nbRatio = Math.min(0.2, medicalRatio);
            const nbNursingRatio = Math.min(0.2, nursingRatio);
            medical = Math.round(medicalTotal10 * nbRatio);
            medication = Math.round(medTotal10 * nbRatio);
            nursing = Math.round(nursingUnits * 10 * nbNursingRatio);

            const cap = getNanbyouMonthlyCap(nbLimitKey, nbVentilator, nbLongTerm);
            const capped = applyMonthlyCap(medical, medication, nursing, cap);
            medical = capped.medical;
            medication = capped.medication;
            nursing = capped.nursing;
            publicLimitDeduction = rawTotalBefore - (medical + medication + nursing);
            if (publicLimitDeduction > 0) isPublicApplied = true;

            return {
                medical, medication, nursing,
                highCostDeduction, publicLimitDeduction, isHighCostApplied, isPublicApplied
            };
        }

        if (publicExpense === 'jiritsu') {
            const rawTotalBefore = rawMedicalCopay + rawMedCopay;
            const jRatio = Math.min(0.1, medicalRatio);
            const coverage = Math.min(1, Math.max(0, jCoveragePct / 100));

            const coveredMed10 = medicalTotal10 * coverage;
            const uncoveredMed10 = medicalTotal10 * (1 - coverage);
            const coveredDrug10 = medTotal10 * coverage;
            const uncoveredDrug10 = medTotal10 * (1 - coverage);

            let jMedical = Math.round(coveredMed10 * jRatio);
            let jMedication = Math.round(coveredDrug10 * jRatio);
            const uMedical = Math.round(uncoveredMed10 * medicalRatio);
            const uMedication = Math.round(uncoveredDrug10 * medicalRatio);

            if (jLimitVal !== 'none' && coverage > 0) {
                const cap = parseFloat(jLimitVal === '5000-mid' ? 5000 : jLimitVal);
                const capped = applyMonthlyCap(jMedical, jMedication, 0, cap);
                jMedical = capped.medical;
                jMedication = capped.medication;
            }

            medical = jMedical + uMedical;
            medication = jMedication + uMedication;
            publicLimitDeduction = rawTotalBefore - (medical + medication);
            if (publicLimitDeduction > 0) isPublicApplied = true;

            return {
                medical, medication, nursing,
                highCostDeduction, publicLimitDeduction, isHighCostApplied, isPublicApplied
            };
        }

        if (publicExpense === 'local-subsidy') {
            if (subsidyType === 'zero') {
                publicLimitDeduction = medical + medication + (coverNursing ? nursing : 0);
                medical = 0;
                medication = 0;
                if (coverNursing) nursing = 0;
                isPublicApplied = true;
            } else if (subsidyType === 'fixed-500') {
                const visits = visitFreq + emergencyVisits;
                const cap = visits * 500;
                const beforeCap = medical + medication;
                if (beforeCap > cap) {
                    const capped = applyMonthlyCap(medical, medication, 0, cap);
                    publicLimitDeduction = beforeCap - (capped.medical + capped.medication);
                    medical = capped.medical;
                    medication = capped.medication;
                    isPublicApplied = true;
                }
            } else if (subsidyType === 'fixed-1000') {
                const beforeCap = medical + medication;
                if (beforeCap > 1000) {
                    const capped = applyMonthlyCap(medical, medication, 0, 1000);
                    publicLimitDeduction = beforeCap - (capped.medical + capped.medication);
                    medical = capped.medical;
                    medication = capped.medication;
                    isPublicApplied = true;
                }
            } else if (subsidyType.startsWith('ratio-cap-')) {
                const cap = parseInt(subsidyType.replace('ratio-cap-', ''), 10);
                const subsidizedRatio = Math.min(0.1, medicalRatio);
                const beforeCap = medical + medication;
                const targetMed = Math.round(medicalTotal10 * subsidizedRatio);
                const targetDrug = Math.round(medTotal10 * subsidizedRatio);
                const capped = applyMonthlyCap(targetMed, targetDrug, 0, cap);
                publicLimitDeduction = beforeCap - (capped.medical + capped.medication);
                medical = capped.medical;
                medication = capped.medication;
                if (publicLimitDeduction > 0) isPublicApplied = true;
            }

            return {
                medical, medication, nursing,
                highCostDeduction, publicLimitDeduction, isHighCostApplied, isPublicApplied
            };
        }

        const combinedMedicalTotal10 = medicalTotal10 + medTotal10;
        const highCostLimit = getHighCostLimit(age, incomeKey, combinedMedicalTotal10);
        const medicalDrugCopay = medical + medication;
        if (medicalDrugCopay > highCostLimit) {
            highCostDeduction = medicalDrugCopay - highCostLimit;
            const capped = applyMonthlyCap(medical, medication, 0, highCostLimit);
            medical = capped.medical;
            medication = capped.medication;
            isHighCostApplied = true;
        }

        if (hasDisabilityCert) {
            const grade = disabilityGrade || 'general';
            let disabilityCap = Infinity;
            if (grade === 'grade1-2') disabilityCap = 0;
            else if (grade === 'grade3') disabilityCap = 1000;

            if (disabilityCap !== Infinity) {
                const beforeCap = medical + medication;
                if (beforeCap > disabilityCap) {
                    const capped = applyMonthlyCap(medical, medication, 0, disabilityCap);
                    publicLimitDeduction += beforeCap - (capped.medical + capped.medication);
                    medical = capped.medical;
                    medication = capped.medication;
                    isPublicApplied = true;
                }
            }
        }

        return {
            medical, medication, nursing,
            highCostDeduction, publicLimitDeduction, isHighCostApplied, isPublicApplied
        };
    }

    function updateIncomeOptions() {
        const isSenior = ageSelect.value === '75' || ageSelect.value === '70';
        const key = isSenior ? 'over70' : 'under70';
        incomeLevelSelect.innerHTML = '';
        incomeOptions[key].forEach(opt => {
            const el = document.createElement('option');
            el.value = opt.value;
            el.textContent = opt.text;
            if ((key === 'over70' && opt.value === 'o70-general') ||
                (key === 'under70' && opt.value === 'u70-c')) {
                el.selected = true;
            }
            incomeLevelSelect.appendChild(el);
        });
    }

    function toggleFacilityPatientTierUI() {
        const location = document.querySelector('input[name="location"]:checked')?.value || 'home';
        const showTier = location === 'facility';
        if (facilityPatientTierGroup) {
            facilityPatientTierGroup.classList.toggle('hidden', !showTier);
        }
    }

    function toggleAddonPanels() {
        const applyCancer = applyCancerCareSelect.value === 'yes';
        const isOtherClinic = clinicTypeSelect.value === 'other-clinic';
        const addonNormalPanel = document.getElementById('addon-normal-panel');
        const addonCancerNote = document.getElementById('addon-cancer-note');
        if (addonNormalPanel) addonNormalPanel.classList.toggle('hidden', applyCancer);
        if (addonCancerNote) addonCancerNote.classList.toggle('hidden', !applyCancer);
        document.querySelectorAll('.tier-normal-only').forEach(el => {
            el.style.display = applyCancer ? 'none' : 'flex';
        });
        if (applyCancer) {
            const selected = document.querySelector('input[name="clinic-tier"]:checked');
            if (selected && (selected.value === 'jisseki1' || selected.value === 'jisseki2')) {
                const noneRadio = document.querySelector('input[name="clinic-tier"][value="none"]');
                if (noneRadio) noneRadio.checked = true;
            }
        }
        if (addonContinuingCareRow) {
            addonContinuingCareRow.style.display = isOtherClinic && !applyCancer ? 'flex' : 'none';
        }
        const location = document.querySelector('input[name="location"]:checked')?.value || 'home';
        if (addonPharmacistRow) {
            addonPharmacistRow.style.display = !applyCancer && location === 'home' ? 'flex' : 'none';
        }
        if (addonTerminalGroup) {
            addonTerminalGroup.classList.toggle('hidden', applyCancer);
        }
    }

    function syncEmergencyTimeSliders() {
        const max = parseInt(emergencyVisitsSlider.value, 10);
        if (emergencyTimeAddonsGroup) {
            emergencyTimeAddonsGroup.classList.toggle('hidden', max === 0);
        }
        if (emergencyNightHolidaySlider) {
            emergencyNightHolidaySlider.max = max;
            if (parseInt(emergencyNightHolidaySlider.value, 10) > max) {
                emergencyNightHolidaySlider.value = max;
            }
        }
        if (emergencyLateNightSlider) {
            const nh = parseInt(emergencyNightHolidaySlider?.value || 0, 10);
            const lateMax = Math.max(0, max - nh);
            emergencyLateNightSlider.max = lateMax;
            if (parseInt(emergencyLateNightSlider.value, 10) > lateMax) {
                emergencyLateNightSlider.value = lateMax;
            }
        }
        if (emergencyNightHolidayVal) {
            emergencyNightHolidayVal.textContent = emergencyNightHolidaySlider?.value || '0';
        }
        if (emergencyLateNightVal) {
            emergencyLateNightVal.textContent = emergencyLateNightSlider?.value || '0';
        }
    }

    function toggleCancerCareUI() {
        const applyCancer = applyCancerCareSelect.value === 'yes';
        cancerCareDetailsPanel.classList.toggle('hidden', !applyCancer);
        if (visitPlanControls) visitPlanControls.classList.toggle('disabled-section', applyCancer);
        visitFrequencySlider.disabled = applyCancer;
        emergencyVisitsSlider.disabled = applyCancer;
        if (emergencyNightHolidaySlider) emergencyNightHolidaySlider.disabled = applyCancer;
        if (emergencyLateNightSlider) emergencyLateNightSlider.disabled = applyCancer;
        homeGuidanceSelect.disabled = applyCancer;
        toggleAddonPanels();
    }

    function updateCalculations() {
        const age = ageSelect.value;
        const medicalRatio = getMedicalRatio();
        const incomeKey = incomeLevelSelect.value;
        const location = document.querySelector('input[name="location"]:checked').value;
        const clinicType = clinicTypeSelect.value;
        const applyCancerCare = applyCancerCareSelect.value === 'yes';
        const cancerCareWeeks = parseInt(cancerCareWeeksSlider.value, 10);
        const visitFreq = parseInt(visitFrequencySlider.value, 10);
        const emergencyVisits = parseInt(emergencyVisitsSlider.value, 10);
        const nightHolidayVisits = parseInt(emergencyNightHolidaySlider?.value || 0, 10);
        const lateNightVisits = parseInt(emergencyLateNightSlider?.value || 0, 10);
        const homeGuidanceType = homeGuidanceSelect.value;
        const patientStatus = patientSevereSelect ? patientSevereSelect.value : 'no';
        const clinicMeets20 = !clinicSevere20Check || clinicSevere20Check.checked;
        const buildingPatientTier = facilityBuildingPatientsSelect?.value || 'tier1';

        const hasPrescription = hasPrescriptionSelect.value === 'yes';
        const medTotal10 = getMedicationTotal10();
        medicationTotal10Cache = medTotal10;

        const useNursing = nursingInsuranceSelect.value === 'yes';
        const nursingRatio = parseFloat(nursingRatioSelect.value);
        const publicExpense = publicExpenseSelect.value;
        const hasDisabilityCert = disabilityCertSelect && disabilityCertSelect.value === 'yes';
        const disabilityGrade = disabilityGradeSelect ? disabilityGradeSelect.value : 'general';
        const addonFlags = getAddonFlags();

        const { totalPoints, breakdown, addonItems, guidanceLabel } = calculateMedicalPoints({
            applyCancerCare, clinicType, hasPrescription, cancerCareWeeks,
            location, visitFreq, emergencyVisits, nightHolidayVisits, lateNightVisits,
            homeGuidanceType, patientStatus, clinicMeets20, buildingPatientTier, addonFlags
        });

        const medicalTotal10 = totalPoints * 10;
        const combinedMedicalTotal10 = medicalTotal10 + medTotal10;

        const rawMedicalCopay = Math.round(medicalTotal10 * medicalRatio);
        const rawMedCopay = Math.round(medTotal10 * medicalRatio);
        let rawNursingCopay = 0;
        let nursingUnits = 0;

        if (useNursing) {
            const unitPerVisit = location === 'home'
                ? FEE_2026.nursingGuide.home
                : FEE_2026.nursingGuide.facility;
            nursingUnits = unitPerVisit * Math.min(2, visitFreq);
            rawNursingCopay = Math.round(nursingUnits * 10 * nursingRatio);
        }

        const result = applyPublicExpense({
            publicExpense, medicalTotal10, medTotal10, medicalRatio, nursingRatio,
            nursingUnits, rawMedicalCopay, rawMedCopay, rawNursingCopay,
            age, incomeKey, visitFreq, emergencyVisits,
            hasDisabilityCert: hasDisabilityCert && publicExpense === 'none',
            disabilityGrade,
            nanbyouLimit: nanbyouLimitSelect?.value,
            nanbyouVentilator: nanbyouVentilatorCheck?.checked,
            nanbyouLongTerm: nanbyouLongTermCheck?.checked,
            jiritsuLimit: jiritsuLimitSelect?.value,
            jiritsuCoveragePct: parseInt(jiritsuCoverageSelect?.value || '100', 10),
            localSubsidyType: localSubsidyTypeSelect?.value,
            localCoverNursing: localNursingSubsidyCheck?.checked
        });

        const finalPatientTotal = result.medical + result.nursing + result.medication;

        totalPatientCostText.textContent = finalPatientTotal.toLocaleString();
        tableTotalMedical10.textContent = Math.round(combinedMedicalTotal10).toLocaleString();
        tableMedicalCopay.textContent = result.medical.toLocaleString();
        tableMedicalRatioLabel.textContent = `(${Math.round(medicalRatio * 10)}割)`;

        if (tableGuidanceNote) {
            tableGuidanceNote.textContent = applyCancerCare
                ? '在がん総に包括'
                : `${guidanceLabel}（主たる1件のみ算定）`;
        }

        if (rowAddonsDetail && tableAddonsNote && tableAddonsPoints) {
            const hasAddons = breakdown.addons > 0 && addonItems.length > 0;
            rowAddonsDetail.style.display = hasAddons ? 'table-row' : 'none';
            if (hasAddons) {
                tableAddonsNote.textContent = `診療加算（${addonItems.length}件）`;
                tableAddonsPoints.textContent = `${breakdown.addons.toLocaleString()}点`;
            }
        }

        rowHighCostApplied.style.display = result.isHighCostApplied ? 'table-row' : 'none';
        if (result.isHighCostApplied) {
            tableMedicalLimitApplied.textContent = `-${Math.round(result.highCostDeduction).toLocaleString()}`;
        }

        rowPublicApplied.style.display = result.isPublicApplied ? 'table-row' : 'none';
        if (result.isPublicApplied) {
            tablePublicLimitApplied.textContent = `-${Math.round(result.publicLimitDeduction).toLocaleString()}`;
        }

        tableNursingCopay.textContent = result.nursing.toLocaleString();
        tableMedicationCopay.textContent = result.medication.toLocaleString();

        updateDonutChart(result.medical, result.nursing, result.medication);
        updateAdvice({
            age, useNursing, publicExpense, hasPrescription, visitFreq, emergencyVisits,
            applyCancerCare, hasDisabilityCert, homeGuidanceType, clinicMeets20, patientStatus, clinicType,
            buildingPatientTier, addonItems, addonFlags
        });
        updatePrintData({
            age, medicalRatio, location, incomeKey, visitFreq, emergencyVisits,
            useNursing, publicExpense, finalPatientTotal,
            medicalCopay: result.medical, nursingCopay: result.nursing,
            medicationCopay: result.medication, applyCancerCare, cancerCareWeeks,
            hasDisabilityCert, guidanceLabel, clinicType, patientStatus, buildingPatientTier, addonItems
        });
    }

    function updateDonutChart(medical, nursing, medication) {
        const total = medical + nursing + medication;
        legendMedical.textContent = `${medical.toLocaleString()}円`;
        legendNursing.textContent = `${nursing.toLocaleString()}円`;
        legendSelf.textContent = `${medication.toLocaleString()}円`;

        const circumference = 2 * Math.PI * 40;
        if (total === 0) {
            [donutMedical, donutNursing, donutSelf].forEach(el => {
                el.setAttribute('stroke-dasharray', `0 ${circumference}`);
            });
            return;
        }

        const segments = [
            { el: donutMedical, pct: medical / total },
            { el: donutNursing, pct: nursing / total },
            { el: donutSelf, pct: medication / total }
        ];

        let offset = 0;
        segments.forEach(({ el, pct }) => {
            const dash = pct * circumference;
            el.setAttribute('stroke-dasharray', `${dash} ${circumference}`);
            el.setAttribute('stroke-dashoffset', `${offset}`);
            offset -= dash;
        });
    }

    function updateAdvice(ctx) {
        const {
            age, useNursing, publicExpense, hasPrescription, visitFreq, emergencyVisits,
            applyCancerCare, hasDisabilityCert, homeGuidanceType, clinicMeets20, patientStatus, clinicType,
            buildingPatientTier, addonItems, addonFlags
        } = ctx;
        const isSenior = age === '75' || age === '70';
        const items = [];

        items.push('<strong>2026年度改定</strong>（令和8年6月施行）の診療報酬点数に基づく概算です。');

        if (applyCancerCare) {
            items.push('<strong>在がん総</strong>: 週単位の包括請求です。訪問診療・管理料・在宅療養指導管理料・往診・酸素・処方等が包括され、在宅療養指導管理料は別途算定できません。');
        } else {
            items.push('<strong>在宅療養指導管理料</strong>: 同一月・同一医療機関では<strong>主たる1件のみ</strong>算定（点数の高いもの）。材料加算・薬剤は別途算定可。');
            if (homeGuidanceType !== 'none') {
                items.push(`今回の主たる管理: <strong>${FEE_2026.guidance[homeGuidanceType].label}</strong>（${FEE_2026.guidance[homeGuidanceType].points.toLocaleString()}点/月）`);
            }
        }

        if (visitFreq >= 2 && !clinicMeets20) {
            items.push('<strong>月2回管理料の要件</strong>: クリニックが「重症患者2割要件」を満たさない場合、月2回訪問でも<strong>月1回区分の管理料</strong>が適用されます（2026年改定）。');
        } else if (visitFreq >= 2 && patientStatus === 'severe') {
            items.push('<strong>別表8-2（重症患者）</strong>: 月2回訪問時は在医総管の「月2回以上・重症患者」区分（最高区分）が適用されます。');
        } else if (visitFreq >= 2 && patientStatus === 'houkatsu') {
            items.push('<strong>別表8-3（包括的支援加算）</strong>: 月2回訪問時は在医総管「月2回以上」＋包括的支援加算150点が適用されます。');
        }

        if (clinicType === 'other-clinic' && !applyCancerCare) {
            items.push('<strong>一般診療所</strong>: 在医総管・施設総管は2026年改定により<strong>80%に減算</strong>されます（C002通知25）。');
        }

        if (!applyCancerCare && document.querySelector('input[name="location"]:checked')?.value === 'facility') {
            const tierLabel = BUILDING_PATIENT_TIER_LABELS[buildingPatientTier] || '1人';
            items.push(`<strong>施設入居時等医学総合管理料</strong>: 同一建物診療患者数 <strong>${tierLabel}</strong> 区分で算定しています。人数が多いほど管理料の点数は低くなります。`);
        }

        if (isSenior) {
            items.push('<strong>高額療養費（70歳以上）</strong>: 医療保険＋お薬代の「外来（個人）」上限が適用（一般18,000円/月、非課税8,000円/月）。<strong>介護保険分は別</strong>です。');
        } else {
            items.push('<strong>高額療養費（70歳未満）</strong>: 医療保険＋お薬代が所得区分の世帯上限の対象。介護保険は別制度です。');
        }

        if (useNursing) {
            items.push('<strong>居宅療養管理指導費</strong>: 介護保険の支給限度額に影響しません（別枠・全額支給）。');
        }

        if (publicExpense === 'nanbyou') {
            const longTermNote = nanbyouLongTermCheck?.checked
                ? '高額かつ長期該当の軽減上限を適用しています。'
                : '';
            items.push(`<strong>指定難病</strong>: 自己負担2割（1割の方は1割維持）。医療・お薬・居宅療養管理指導の<strong>合算上限</strong>が適用されます。${longTermNote}`);
        } else if (publicExpense === 'welfare') {
            items.push('<strong>生活保護</strong>: 医療扶助・介護扶助により自己負担0円。');
        } else if (publicExpense === 'jiritsu') {
            const cov = parseInt(jiritsuCoverageSelect?.value || '100', 10);
            const covNote = cov < 100
                ? `精神疾患関連の診療を<strong>約${cov}%</strong>とみなし、該当分のみ1割＋上限を適用。それ以外は保険割合のままです。`
                : '精神疾患が主病で診療費の全額が対象となる想定です。';
            items.push(`<strong>自立支援医療</strong>: ${covNote}居宅療養管理指導（介護）は対象外で、介護保険の自己負担が別途かかります。`);
        } else if (publicExpense === 'local-subsidy') {
            items.push('<strong>自治体助成</strong>: 市区町村の重度障害者医療等助成の典型パターンから選択しています。実際の助成内容は自治体により異なります。');
        }

        if (hasDisabilityCert && publicExpense === 'none') {
            items.push('<strong>障害者手帳</strong>: 公費「なし」選択時のみ、手帳等級に応じた助成上限（1・2級0円／3級1,000円）を高額療養費の後に適用しています。自治体助成と併用する場合は「自治体助成」を選んでください。');
        } else if (hasDisabilityCert) {
            items.push('<strong>障害者手帳</strong>: 公費制度を選択中のため、手帳による助成は計算に含めていません。');
        }

        if (hasPrescription) {
            items.push('<strong>お薬代</strong>: 負担割合変更時は10割換算で自動再計算。高額療養費・難病上限に合算されます。');
        }

        if (emergencyVisits > 0) {
            const nh = Math.min(nightHolidayVisits, emergencyVisits);
            const ln = Math.min(lateNightVisits, Math.max(0, emergencyVisits - nh));
            const regular = Math.max(0, emergencyVisits - nh - ln);
            const nhPts = FEE_2026.nightHolidayAddon[clinicType] || FEE_2026.nightHolidayAddon['other-clinic'];
            const lnPts = FEE_2026.lateNightAddon[clinicType] || FEE_2026.lateNightAddon['other-clinic'];
            let emergencyNote = '<strong>緊急往診</strong>: 往診料720点＋緊急往診加算＋再診料75点の概算です。';
            if (nh > 0 || ln > 0) {
                emergencyNote += ` 内訳: 通常${regular}回`;
                if (nh > 0) emergencyNote += `、夜間・休日${nh}回（+${nhPts}点/回）`;
                if (ln > 0) emergencyNote += `、深夜${ln}回（+${lnPts}点/回）`;
                emergencyNote += '。';
            }
            items.push(emergencyNote);
        }

        if (addonItems && addonItems.length > 0) {
            const addonSummary = addonItems.map(a => `${a.label}（${a.points.toLocaleString()}点）`).join('、');
            items.push(`<strong>選択中の加算</strong>: ${addonSummary}`);
        } else {
            items.push('<strong>診療加算</strong>: クリニックの届出・算定状況により加算が加わります。「クリニックの加算・評価」から該当項目を選択してください。');
        }

        if (visitFreq >= 4 && addonFlags?.autoFrequentVisit && !applyCancerCare) {
            items.push('<strong>頻回訪問加算</strong>: 月4回以上の訪問で初回800点が自動加算されています（別表8-2等の対象患者）。');
        }

        adviceContent.innerHTML = `<ul>${items.map(t => `<li>${t}</li>`).join('')}</ul>`;
    }

    function updatePrintData(data) {
        const {
            age, medicalRatio, location, incomeKey, visitFreq, emergencyVisits,
            useNursing, publicExpense, finalPatientTotal,
            medicalCopay, nursingCopay, medicationCopay,
            applyCancerCare, cancerCareWeeks, hasDisabilityCert, guidanceLabel, clinicType,
            buildingPatientTier, addonItems
        } = data;

        const now = new Date();
        document.getElementById('print-date-val').textContent =
            `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;

        const clinicLabels = {
            'kinou-kyouka': '機能強化型在宅療養支援診療所',
            'zashin-ippan': '在宅療養支援診療所（従来型）',
            'other-clinic': '一般診療所'
        };

        document.getElementById('print-age').textContent =
            age === '75' ? '75歳以上' : (age === '70' ? '70〜74歳' : '70歳未満');
        document.getElementById('print-copay').textContent = `${Math.round(medicalRatio * 10)}割負担`;
        const tierLabel = BUILDING_PATIENT_TIER_LABELS[buildingPatientTier] || '1人';
        document.getElementById('print-location').textContent = location === 'home'
            ? '自宅'
            : `施設・同一建物（診療患者${tierLabel}）`;
        document.getElementById('print-clinic').textContent = clinicLabels[clinicType] || '';

        const isSenior = age === '75' || age === '70';
        let incomeText = isSenior
            ? (incomeKey.includes('active') ? '現役並み' : incomeKey === 'o70-general' ? '一般' : '低所得')
            : (incomeKey === 'u70-a' || incomeKey === 'u70-b' ? '高所得' : incomeKey === 'u70-e' ? '非課税' : '一般');
        document.getElementById('print-income').textContent = incomeText;

        document.getElementById('print-frequency').textContent = applyCancerCare
            ? `在がん総 ${cancerCareWeeks}週`
            : `${visitFreq}回/月`;
        document.getElementById('print-emergency').textContent = applyCancerCare
            ? '包括内' : `${emergencyVisits}回/月`;
        document.getElementById('print-nursing').textContent = useNursing ? 'あり' : 'なし';

        const publicLabels = {
            welfare: '生活保護', nanbyou: '指定難病', jiritsu: '自立支援',
            'local-subsidy': '自治体助成', none: hasDisabilityCert ? 'なし（手帳あり）' : 'なし'
        };
        document.getElementById('print-public').textContent = publicLabels[publicExpense] || 'なし';

        document.getElementById('print-total-amount').textContent = finalPatientTotal.toLocaleString();
        document.getElementById('print-detail-medical-val').textContent = medicalCopay.toLocaleString();
        document.getElementById('print-detail-nursing-val').textContent = nursingCopay.toLocaleString();
        document.getElementById('print-detail-medication-val').textContent = medicationCopay.toLocaleString();

        document.getElementById('print-detail-medical-desc').textContent = applyCancerCare
            ? `在宅がん医療総合診療料（${cancerCareWeeks}週）`
            : `訪問診療＋在宅管理料＋${guidanceLabel}`;
        const addonText = addonItems && addonItems.length > 0
            ? addonItems.map(a => `${a.label} ${a.points}点`).join(' / ')
            : 'なし';
        const printAddonEl = document.getElementById('print-addons');
        if (printAddonEl) printAddonEl.textContent = addonText;
        document.getElementById('print-advice-box').innerHTML = adviceContent.innerHTML;
    }

    function bindAddonInputs() {
        const addonIds = [
            'addon-info-renkei', 'addon-data-submit', 'addon-early-transition',
            'addon-online-mgmt', 'addon-nursing-instruction', 'addon-special-nursing',
            'addon-continuing-care', 'addon-emergency-info', 'addon-auto-frequent',
            'addon-pharmacist-joint', 'addon-miokuri', 'addon-bukka', 'addon-base-up'
        ];
        addonIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('change', updateCalculations);
        });
        document.querySelectorAll('input[name="clinic-tier"]').forEach(r => {
            r.addEventListener('change', updateCalculations);
        });
        const dxSelect = document.getElementById('addon-dx');
        if (dxSelect) dxSelect.addEventListener('change', updateCalculations);
        const terminalSelect = document.getElementById('addon-terminal-care');
        if (terminalSelect) terminalSelect.addEventListener('change', updateCalculations);
    }

    ageSelect.addEventListener('change', () => {
        if (ageSelect.value === '75') copayRatioSelect.value = '0.1';
        else if (ageSelect.value === '70') copayRatioSelect.value = '0.2';
        else copayRatioSelect.value = '0.3';
        updateIncomeOptions();
        syncMedicationInputFromCache();
        updateCalculations();
    });

    copayRatioSelect.addEventListener('change', () => {
        syncMedicationInputFromCache();
        updateCalculations();
    });

    incomeLevelSelect.addEventListener('change', updateCalculations);
    document.querySelectorAll('input[name="location"]').forEach(r => r.addEventListener('change', () => {
        toggleFacilityPatientTierUI();
        toggleAddonPanels();
        updateCalculations();
    }));
    if (facilityBuildingPatientsSelect) {
        facilityBuildingPatientsSelect.addEventListener('change', updateCalculations);
    }
    clinicTypeSelect.addEventListener('change', () => {
        toggleAddonPanels();
        updateCalculations();
    });
    if (clinicSevere20Check) clinicSevere20Check.addEventListener('change', updateCalculations);
    if (patientSevereSelect) patientSevereSelect.addEventListener('change', updateCalculations);

    applyCancerCareSelect.addEventListener('change', () => {
        toggleCancerCareUI();
        updateCalculations();
    });

    cancerCareWeeksSlider.addEventListener('input', () => {
        cancerCareWeeksVal.textContent = cancerCareWeeksSlider.value;
        updateCalculations();
    });

    visitFrequencySlider.addEventListener('input', () => {
        visitFrequencyVal.textContent = visitFrequencySlider.value;
        updateCalculations();
    });

    emergencyVisitsSlider.addEventListener('input', () => {
        emergencyVisitsVal.textContent = emergencyVisitsSlider.value;
        syncEmergencyTimeSliders();
        updateCalculations();
    });

    if (emergencyNightHolidaySlider) {
        emergencyNightHolidaySlider.addEventListener('input', () => {
            syncEmergencyTimeSliders();
            updateCalculations();
        });
    }
    if (emergencyLateNightSlider) {
        emergencyLateNightSlider.addEventListener('input', () => {
            syncEmergencyTimeSliders();
            updateCalculations();
        });
    }

    homeGuidanceSelect.addEventListener('change', updateCalculations);

    hasPrescriptionSelect.addEventListener('change', () => {
        medicationCostGroup.style.display = hasPrescriptionSelect.value === 'yes' ? 'block' : 'none';
        updateCalculations();
    });

    medicationCostInput.addEventListener('input', () => {
        medicationTotal10Cache = getMedicationTotal10();
        updateCalculations();
    });

    nursingInsuranceSelect.addEventListener('change', () => {
        const useNursing = nursingInsuranceSelect.value === 'yes';
        nursingInsuranceDetails.style.display = useNursing ? 'block' : 'none';
        rowNursingDetail.style.display = useNursing ? 'table-row' : 'none';
        updateCalculations();
    });

    nursingRatioSelect.addEventListener('change', updateCalculations);

    publicExpenseSelect.addEventListener('change', () => {
        [publicNanbyouDetails, publicJiritsuDetails, publicLocalDetails].forEach(el => el.classList.add('hidden'));
        if (publicExpenseSelect.value === 'nanbyou') publicNanbyouDetails.classList.remove('hidden');
        else if (publicExpenseSelect.value === 'jiritsu') publicJiritsuDetails.classList.remove('hidden');
        else if (publicExpenseSelect.value === 'local-subsidy') publicLocalDetails.classList.remove('hidden');
        updateCalculations();
    });

    nanbyouLimitSelect.addEventListener('change', updateCalculations);
    nanbyouVentilatorCheck.addEventListener('change', updateCalculations);
    if (nanbyouLongTermCheck) nanbyouLongTermCheck.addEventListener('change', updateCalculations);
    jiritsuLimitSelect.addEventListener('change', updateCalculations);
    if (jiritsuCoverageSelect) jiritsuCoverageSelect.addEventListener('change', updateCalculations);
    localSubsidyTypeSelect.addEventListener('change', updateCalculations);
    if (localNursingSubsidyCheck) localNursingSubsidyCheck.addEventListener('change', updateCalculations);

    if (disabilityCertSelect) {
        disabilityCertSelect.addEventListener('change', () => {
            if (disabilityDetailsPanel) {
                disabilityDetailsPanel.classList.toggle('hidden', disabilityCertSelect.value !== 'yes');
            }
            updateCalculations();
        });
    }
    if (disabilityGradeSelect) disabilityGradeSelect.addEventListener('change', updateCalculations);

    infoButtons.forEach(btn => btn.addEventListener('click', () => {
        const modal = document.getElementById(btn.getAttribute('data-target'));
        if (modal) modal.classList.add('open');
    }));
    closeButtons.forEach(btn => btn.addEventListener('click', () => {
        btn.closest('.modal')?.classList.remove('open');
    }));
    modals.forEach(modal => modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
    }));
    btnPrint.addEventListener('click', () => window.print());

    updateIncomeOptions();
    updateMedicationLabel();
    toggleFacilityPatientTierUI();
    toggleCancerCareUI();
    bindAddonInputs();
    syncEmergencyTimeSliders();
    medicationTotal10Cache = getMedicationTotal10();
    updateCalculations();
});
