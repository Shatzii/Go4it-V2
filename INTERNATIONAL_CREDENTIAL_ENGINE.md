# 🌍 International Credential Engine

**Purpose**: Transform international transcripts into NCAA eligibility reports for student-athletes worldwide.

## 📋 Overview

The International Credential Engine is a **rule-based evaluation system** that:
- Ingests international transcripts (UK A-Levels, IB Diploma, German Abitur, etc.)
- Matches courses to NCAA core requirements
- Normalizes grades to US 4.0 GPA scale
- Calculates Carnegie units based on instructional hours
- Generates NCAA Division I & II eligibility projections
- Produces audit-ready PDF reports

**No ML. No external APIs.** Fast, reliable, and fully auditable.

---

## 🏗️ Architecture

### Database Schema (`lib/db/schema-intl.ts`)
9 tables, all **additive** (link to existing `users` table):

| Table | Purpose |
|-------|---------|
| `intl_countries` | Supported countries (ISO 3166-1 alpha-2) |
| `intl_systems` | Education systems (e.g., "uk_alevel", "ib_diploma") |
| `intl_grade_scales` | Grade → US GPA mappings |
| `intl_course_equivalencies` | Course → NCAA category mappings |
| `intl_transcripts` | Student transcript metadata |
| `intl_student_courses` | Individual course records with NCAA categorization |
| `intl_evaluations` | Final eligibility assessment |
| `intl_audit_log` | Compliance tracking (Enhanced mode) |
| `intl_translation_jobs` | Document translation tracking (Enhanced mode) |

### Evaluator (`lib/intl/evaluator-mvp.ts`)
4-phase pipeline:

1. **Ingest**: Upload transcript + courses
2. **Suggest**: Match courses to NCAA categories via heuristics
3. **Evaluate**: Calculate GPA, core units, eligibility status
4. **Report**: Generate PDF-ready JSON summary

---

## 🚀 Quick Start

### 1. Setup
```bash
# Add to .env
NEXT_PUBLIC_FEATURE_INTL="true"
FEATURE_INTL_DB="true"
INTL_ENHANCED="false"  # Start with MVP mode

# Push schema to database
npm run db:push

# Seed reference data (countries, systems, grade scales)
npm run seed:intl
```

### 2. API Usage

#### **Ingest Transcript**
```bash
POST /api/intl/ingest
Authorization: Bearer <clerk_token>

{
  "countryId": "GB",
  "systemId": "uk_alevel",
  "schoolName": "London International Academy",
  "language": "en",
  "courses": [
    {
      "year": 2023,
      "subject": "A-Level Mathematics",
      "level": "A2",
      "localGrade": "A*",
      "hoursPerWeek": 5,
      "weeksPerYear": 36,
      "isCompleted": true
    },
    {
      "year": 2023,
      "subject": "A-Level Physics",
      "level": "A2",
      "localGrade": "A",
      "hoursPerWeek": 5,
      "weeksPerYear": 36,
      "isCompleted": true
    }
  ]
}

# Response:
{
  "success": true,
  "transcriptId": 42,
  "status": "processing"
}
```

#### **Match Courses (Suggest)**
```bash
POST /api/intl/suggest
Authorization: Bearer <clerk_token>

{
  "transcriptId": 42
}

# Response:
{
  "success": true,
  "transcriptId": 42,
  "coursesProcessed": 2
}
```

#### **Evaluate Eligibility**
```bash
POST /api/intl/evaluate
Authorization: Bearer <clerk_token>

{
  "transcriptId": 42
}

# Response:
{
  "success": true,
  "evaluationId": 15,
  "coreGpa": 3.85,
  "coreUnits": 12.0,
  "divisionIStatus": "at_risk",
  "divisionIIStatus": "eligible",
  "missingRequirements": ["English: 1 unit short"],
  "riskFactors": [],
  "recommendedActions": ["Complete missing core course requirements"]
}
```

#### **Generate Report**
```bash
GET /api/intl/report/15
Authorization: Bearer <clerk_token>

# Response: Full JSON report (see below)
```

---

## 📊 Sample Report Output

```json
{
  "success": true,
  "report": {
    "studentInfo": {
      "userId": "user_abc123",
      "schoolName": "London International Academy",
      "country": "GB",
      "system": "uk_alevel"
    },
    "summary": {
      "coreGpa": 3.85,
      "overallGpa": 3.85,
      "totalCoreUnits": 12.0,
      "divisionIStatus": "at_risk",
      "divisionIIStatus": "eligible"
    },
    "creditBreakdown": {
      "english": 3.0,
      "mathAlgebraI": 3.0,
      "science": 4.0,
      "scienceLab": 4.0,
      "socialScience": 2.0,
      "additionalAcademic": 0,
      "foreignLanguage": 0
    },
    "requirements": {
      "divisionI": {
        "english": 4,
        "mathAlgebraI": 3,
        "science": 2,
        "scienceLab": 2,
        "socialScience": 2,
        "additionalAcademic": 4,
        "total": 16
      }
    },
    "courses": [
      {
        "year": 2023,
        "subject": "A-Level Mathematics",
        "level": "A2",
        "localGrade": "A*",
        "normalizedGrade": 4.0,
        "ncaaCategory": "math",
        "usEquivalent": "Algebra II / Pre-Calculus",
        "creditHours": 1.5,
        "isLabScience": false
      }
    ],
    "analysis": {
      "missingRequirements": ["English: 1 unit short"],
      "riskFactors": [],
      "recommendedActions": ["Complete missing core course requirements"]
    }
  }
}
```

---

## 🔧 Configuration

### Feature Flags
| Flag | Purpose |
|------|---------|
| `NEXT_PUBLIC_FEATURE_INTL` | Show International Credential Engine UI |
| `FEATURE_INTL_DB` | Enable international database tables |
| `INTL_ENHANCED` | Enable confidence scoring & DI/DII projections |

### NCAA Requirements (Hardcoded)
- **Division I**: 16 core units, 2.3 GPA
- **Division II**: 16 core units, 2.2 GPA

### Carnegie Unit Calculation
```
Total Hours = hoursPerWeek × weeksPerYear
Credit Units = Total Hours ÷ 120
```

Example:
- UK A-Level (5 hrs/week × 36 weeks = 180 hrs) = **1.5 units**
- IB Higher Level (4 hrs/week × 36 weeks = 144 hrs) = **1.2 units**

---

## 🌐 Supported Systems (MVP)

| Country | System ID | Grading Scale | Status |
|---------|-----------|---------------|--------|
| 🇬🇧 UK | `uk_alevel` | A*-E | ✅ Ready |
| 🌍 International | `ib_diploma` | 1-7 | ✅ Ready |
| 🇩🇪 Germany | `de_abitur` | 1.0-6.0 | ✅ Ready |

**Future**: France (Baccalauréat), Spain (Bachillerato), China (Gaokao), India (CBSE), Brazil (Vestibular)

---

## 🎯 Integration Points

### 1. Dashboard Widget
Add to `app/dashboard/page.tsx`:
```tsx
import IntlCredentialWidget from "@/components/dashboard/intl-credential-widget";

<IntlCredentialWidget userId={user.id} />
```

### 2. Stripe $299 Audit Flow
Webhook handler in `lib/stripe-integration.ts`:
```ts
if (metadata.product === "intl_audit") {
  await triggerN8nWebhook("intl-audit-paid", {
    userId: metadata.userId,
    transcriptId: metadata.transcriptId,
  });
}
```

### 3. PostHog Analytics
Track key events:
```ts
posthog.capture("intl_transcript_uploaded", {
  countryId: "GB",
  systemId: "uk_alevel",
  coursesCount: 12,
});

posthog.capture("intl_evaluation_completed", {
  divisionIStatus: "eligible",
  coreGpa: 3.85,
});
```

---

## 🧪 Testing

### Manual Test Flow
1. **Ingest** sample UK A-Level transcript
2. **Suggest** course matches (auto-categorize)
3. **Evaluate** eligibility (calculate GPA/units)
4. **Report** view JSON output

### Sample Test Data
See `lib/db/seed-intl.ts` for:
- 10 countries (UK, Germany, France, Spain, Italy, China, India, Japan, Brazil, Mexico)
- 3 education systems (UK A-Levels, IB Diploma, German Abitur)
- 24 course equivalencies
- Complete grade scale mappings

---

## 🔐 Security

### Authentication
- All `/api/intl/*` endpoints require Clerk auth
- Transcripts scoped to `userId` (users can only access their own data)

### Webhook Auth (Screenshot Service)
```bash
POST /api/screenshot
Authorization: Bearer <SCREENSHOT_SECRET>

{
  "url": "https://go4itsports.org/audit-report/123",
  "width": 1200,
  "height": 630
}
```

---

## 📈 Roadmap

### MVP (Current)
- ✅ Rule-based evaluation
- ✅ UK A-Levels, IB Diploma, German Abitur
- ✅ Division I & II eligibility projection
- ✅ JSON reports

### Enhanced Mode (`INTL_ENHANCED=true`)
- [ ] Confidence scoring (0.0-1.0) for course matches
- [ ] Audit log for compliance tracking
- [ ] Translation job workflow
- [ ] Manual review queue for low-confidence matches

### Future
- [ ] Machine learning course matcher (GPT-4 + embeddings)
- [ ] PDF report generation with Puppeteer
- [ ] NAIA & NJCAA eligibility rules
- [ ] Real-time transcript parsing via OCR
- [ ] Integration with WES/ECE credential evaluation services

---

## 🐛 Troubleshooting

### Issue: Course not matching
**Solution**: Check `intl_course_equivalencies` table. Add new equivalency:
```sql
INSERT INTO intl_course_equivalencies (
  system_id, local_course_name, ncaa_category, us_equivalent, 
  default_credit_hours, match_keywords
) VALUES (
  'uk_alevel', 'A-Level Further Maths', 'math', 
  'Advanced Calculus', 1.5, '["further maths", "advanced mathematics"]'
);
```

### Issue: Grade not normalizing
**Solution**: Check `intl_grade_scales` table. Add missing grade:
```sql
INSERT INTO intl_grade_scales (
  system_id, local_grade, us_gpa_equivalent, description
) VALUES (
  'uk_alevel', 'A**', 4.0, 'Exceptional (rare)'
);
```

### Issue: Credit hours incorrect
**Solution**: Recalculate using Carnegie formula:
```
hours_per_week × weeks_per_year ÷ 120 = credit_hours
```

---

## 📚 References

- [NCAA Eligibility Center](https://web3.ncaa.org/ecwr3/)
- [Carnegie Unit Definition](https://en.wikipedia.org/wiki/Carnegie_Unit_and_Student_Hour)
- [UK A-Level Equivalency Guide](https://www.ucas.com/undergraduate/applying-university/ucas-undergraduate-tariff-points)
- [IB Diploma Programme](https://www.ibo.org/programmes/diploma-programme/)

---

## 📞 Support

For questions or feature requests:
- **Slack**: #international-students
- **Email**: support@go4itsports.org
- **Docs**: /docs/international-credential-engine
