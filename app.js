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

    // 令和8年度（2026年6月施行）診療報酬 — 単一建物1人想定
    const FEE_2026 = {
        visit: { home: 890, facility: 215 },
        emergency: 750,
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
            none: { points: 0, label: 'なし' },
            oxygen: { points: 2500, label: '在宅酸素療法指導管理料' },
            injection: { points: 650, label: '在宅自己注射指導管理料' },
            catheter: { points: 1800, label: '在宅自己導尿指導管理料' },
            cancer: { points: 1500, label: '在宅悪性腫瘍患者指導管理料' },
            wound: { points: 1050, label: '在宅寝たきり患者処置指導管理料' }
        },
        cancerCare: {
            section1: { withRx: 1650, withoutRx: 1852 },
            section2: { withRx: 1495, withoutRx: 1687 }
        },
        nursingGuide: { home: 299, facility: 287 },
        houkatsuAddon: 150,
        section3ManageRatio: 0.8
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

    function getManagementPoints(location, section, visitFreq, patientStatus, clinicMeets20) {
        const locKey = location === 'home' ? 'home' : 'facility';
        const rates = FEE_2026.management[locKey][section];

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
            location, visitFreq, emergencyVisits, homeGuidanceType,
            patientStatus, clinicMeets20
        } = params;

        const section = CLINIC_SECTION[clinicType] || 'section2';
        const breakdown = { visit: 0, management: 0, guidance: 0, emergency: 0, prescription: 0, cancer: 0 };

        if (applyCancerCare) {
            const rates = section === 'section1'
                ? FEE_2026.cancerCare.section1
                : FEE_2026.cancerCare.section2;
            breakdown.cancer = (hasPrescription ? rates.withRx : rates.withoutRx) * cancerCareWeeks;
            return { totalPoints: breakdown.cancer, breakdown, guidanceLabel: '在がん総に包括' };
        }

        breakdown.visit = FEE_2026.visit[location === 'home' ? 'home' : 'facility'] * visitFreq;
        breakdown.management = getManagementPoints(location, section, visitFreq, patientStatus, clinicMeets20);

        if (emergencyVisits > 0) {
            breakdown.emergency = emergencyVisits * FEE_2026.emergency;
        }

        const guidance = FEE_2026.guidance[homeGuidanceType] || FEE_2026.guidance.none;
        breakdown.guidance = guidance.points;

        if (hasPrescription) {
            breakdown.prescription = FEE_2026.prescription;
        } else {
            breakdown.prescription = FEE_2026.noPrescriptionBonus;
        }

        const totalPoints = breakdown.visit + breakdown.management + breakdown.guidance
            + breakdown.emergency + breakdown.prescription;

        return { totalPoints, breakdown, guidanceLabel: guidance.label };
    }

    function applyPublicExpense(params) {
        const {
            publicExpense, medicalTotal10, medTotal10, medicalRatio, nursingRatio,
            nursingUnits, rawMedicalCopay, rawMedCopay, rawNursingCopay,
            age, incomeKey, visitFreq, emergencyVisits, hasDisabilityCert, disabilityGrade
        } = params;

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

            let cap = parseFloat(nanbyouLimitSelect.value);
            if (nanbyouVentilatorCheck.checked) cap = 1000;

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
            medical = Math.round(medicalTotal10 * jRatio);
            medication = Math.round(medTotal10 * jRatio);

            const limitVal = jiritsuLimitSelect.value;
            if (limitVal !== 'none') {
                const cap = parseFloat(limitVal === '5000-mid' ? 5000 : limitVal);
                const capped = applyMonthlyCap(medical, medication, 0, cap);
                medical = capped.medical;
                medication = capped.medication;
            }
            publicLimitDeduction = rawTotalBefore - (medical + medication);
            if (publicLimitDeduction > 0) isPublicApplied = true;

            return {
                medical, medication, nursing,
                highCostDeduction, publicLimitDeduction, isHighCostApplied, isPublicApplied
            };
        }

        if (publicExpense === 'local-subsidy') {
            const subsidyType = localSubsidyTypeSelect.value;
            const coverNursing = localNursingSubsidyCheck && localNursingSubsidyCheck.checked;

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

    function toggleCancerCareUI() {
        const applyCancer = applyCancerCareSelect.value === 'yes';
        cancerCareDetailsPanel.classList.toggle('hidden', !applyCancer);
        if (visitPlanControls) visitPlanControls.classList.toggle('disabled-section', applyCancer);
        visitFrequencySlider.disabled = applyCancer;
        emergencyVisitsSlider.disabled = applyCancer;
        homeGuidanceSelect.disabled = applyCancer;
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
        const homeGuidanceType = homeGuidanceSelect.value;
        const patientStatus = patientSevereSelect ? patientSevereSelect.value : 'no';
        const clinicMeets20 = !clinicSevere20Check || clinicSevere20Check.checked;

        const hasPrescription = hasPrescriptionSelect.value === 'yes';
        const medTotal10 = getMedicationTotal10();
        medicationTotal10Cache = medTotal10;

        const useNursing = nursingInsuranceSelect.value === 'yes';
        const nursingRatio = parseFloat(nursingRatioSelect.value);
        const publicExpense = publicExpenseSelect.value;
        const hasDisabilityCert = disabilityCertSelect && disabilityCertSelect.value === 'yes';
        const disabilityGrade = disabilityGradeSelect ? disabilityGradeSelect.value : 'general';

        const { totalPoints, breakdown, guidanceLabel } = calculateMedicalPoints({
            applyCancerCare, clinicType, hasPrescription, cancerCareWeeks,
            location, visitFreq, emergencyVisits, homeGuidanceType,
            patientStatus, clinicMeets20
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
            disabilityGrade
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
            age, useNursing, publicExpense, hasPrescription, visitFreq,
            applyCancerCare, hasDisabilityCert, homeGuidanceType, clinicMeets20, patientStatus, clinicType
        });
        updatePrintData({
            age, medicalRatio, location, incomeKey, visitFreq, emergencyVisits,
            useNursing, publicExpense, finalPatientTotal,
            medicalCopay: result.medical, nursingCopay: result.nursing,
            medicationCopay: result.medication, applyCancerCare, cancerCareWeeks,
            hasDisabilityCert, guidanceLabel, clinicType, patientStatus
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
            age, useNursing, publicExpense, hasPrescription, visitFreq,
            applyCancerCare, hasDisabilityCert, homeGuidanceType, clinicMeets20, patientStatus, clinicType
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

        if (isSenior) {
            items.push('<strong>高額療養費（70歳以上）</strong>: 医療保険＋お薬代の「外来（個人）」上限が適用（一般18,000円/月、非課税8,000円/月）。<strong>介護保険分は別</strong>です。');
        } else {
            items.push('<strong>高額療養費（70歳未満）</strong>: 医療保険＋お薬代が所得区分の世帯上限の対象。介護保険は別制度です。');
        }

        if (useNursing) {
            items.push('<strong>居宅療養管理指導費</strong>: 介護保険の支給限度額に影響しません（別枠・全額支給）。');
        }

        if (publicExpense === 'nanbyou') {
            items.push('<strong>指定難病</strong>: 自己負担2割（1割の方は1割維持）。医療・お薬・居宅療養管理指導の<strong>合算上限</strong>が適用されます。');
        } else if (publicExpense === 'welfare') {
            items.push('<strong>生活保護</strong>: 医療扶助・介護扶助により自己負担0円。');
        } else if (publicExpense === 'jiritsu') {
            items.push('<strong>自立支援医療</strong>: 対象精神疾患等の診療・お薬が1割＋月額上限。居宅療養管理指導（介護）は対象外です。');
        } else if (publicExpense === 'local-subsidy') {
            items.push('<strong>自治体助成</strong>: 市区町村の重度障害者医療等助成。内容は自治体により異なります。');
        }

        if (hasDisabilityCert) {
            items.push('<strong>障害者手帳</strong>: 自治体助成と公費選択が重複する場合があります。');
        }

        if (hasPrescription) {
            items.push('<strong>お薬代</strong>: 負担割合変更時は10割換算で自動再計算。高額療養費・難病上限に合算されます。');
        }

        adviceContent.innerHTML = `<ul>${items.map(t => `<li>${t}</li>`).join('')}</ul>`;
    }

    function updatePrintData(data) {
        const {
            age, medicalRatio, location, incomeKey, visitFreq, emergencyVisits,
            useNursing, publicExpense, finalPatientTotal,
            medicalCopay, nursingCopay, medicationCopay,
            applyCancerCare, cancerCareWeeks, hasDisabilityCert, guidanceLabel, clinicType
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
        document.getElementById('print-location').textContent =
            location === 'home' ? '自宅' : '施設・同一建物';
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
        document.getElementById('print-advice-box').innerHTML = adviceContent.innerHTML;
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
    document.querySelectorAll('input[name="location"]').forEach(r => r.addEventListener('change', updateCalculations));
    clinicTypeSelect.addEventListener('change', updateCalculations);
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
        updateCalculations();
    });

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
    jiritsuLimitSelect.addEventListener('change', updateCalculations);
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
    toggleCancerCareUI();
    medicationTotal10Cache = getMedicationTotal10();
    updateCalculations();
});
