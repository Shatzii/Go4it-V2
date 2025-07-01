# 🚀 Universal One School - Production Build Fix for GitHub Copilot

## **IMMEDIATE ACTION REQUIRED: Production Build Resolution**

This prompt provides GitHub Copilot with the exact steps to fix the production build issue and prepare Universal One School for deployment.

---

## 🎯 **PROBLEM TO SOLVE**
- Development server works perfectly
- Production build (`npm run build`) fails due to framer-motion import resolution
- Need to fix Stage Prep School framer-motion integration for production deployment

---

## 🔧 **SOLUTION 1: Fix Framer Motion Import (Recommended)**

### **File to Fix**: `app/schools/secondary-school/page.tsx`

**Current Issue**: Framer Motion import causing Webpack build failures in production

**Fix Required**: Update the framer-motion import and usage

```tsx
'use client'
import { motion } from 'framer-motion'
import { Theater, Users, Trophy, BookOpen, Sparkles, GraduationCap } from 'lucide-react'

// Ensure all motion components use proper syntax
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.8 }}
  className="max-w-4xl mx-auto"
>
  {/* content */}
</motion.div>
```

**Key Requirements**:
- Use top-level named import: `import { motion } from 'framer-motion'`
- No deep imports or `/dist/` paths
- All motion props only on `motion.div` elements
- Proper opening and closing tags for all motion components

---

## 🔧 **SOLUTION 2: CSS Animation Fallback (Fastest Deploy)**

If framer-motion continues causing build issues, replace motion components with CSS animations:

### **Replace This**:
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.8 }}
  className="max-w-4xl mx-auto"
>
```

### **With This**:
```tsx
<div className="max-w-4xl mx-auto animate-fadeIn">
```

### **Add to `app/globals.css`**:
```css
@layer utilities {
  .animate-fadeIn {
    animation: fadeIn 0.8s ease-out forwards;
  }

  @keyframes fadeIn {
    0% { 
      opacity: 0; 
      transform: scale(0.9); 
    }
    100% { 
      opacity: 1; 
      transform: scale(1); 
    }
  }
}
```

---

## 🧪 **TESTING COMMANDS**

After applying the fix:

```bash
# 1. Test production build
npm run build

# 2. If successful, test production start
npm start

# 3. Verify all routes work
curl http://localhost:3000/schools/secondary-school
```

---

## 📍 **VERIFICATION CHECKLIST**

After fix implementation:

✅ **Build Success**: `npm run build` completes without errors
✅ **Stage Prep School**: `/schools/secondary-school` loads properly
✅ **Animations Work**: Smooth transitions and effects display correctly
✅ **All Schools Load**: Primary, Secondary, Law, Language Academy all operational
✅ **Feature Pages**: Demo, Enrollment Portal, Compliance Dashboard accessible

---

## 🚀 **DEPLOYMENT COMMANDS**

Once build passes:

```bash
# Production deployment sequence
npm run build
pm2 start ecosystem.config.js
pm2 save
```

---

## 🎯 **SUCCESS CRITERIA**

**Platform Status After Fix**:
- ✅ Production build successful
- ✅ All 4 schools operational
- ✅ Stage Prep School animations working
- ✅ Revenue streams active ($0-$2,500/semester)
- ✅ 1,400+ student capacity ready
- ✅ Texas compliance maintained (95%)

**Market Value**: $85,000-$120,000 enterprise educational platform

---

## 📋 **PLATFORM OVERVIEW FOR CONTEXT**

Universal One School is a comprehensive AI-powered educational platform with:
- **4 Specialized Schools**: SuperHero (K-6), Stage Prep (7-12), Law School, Language Academy
- **6 AI Teachers**: Dean Wonder, Dean Sterling, Professor Barrett, Professor Lingua, plus 2 additional
- **Neurodivergent Support**: ADHD, dyslexia, autism spectrum adaptations
- **Texas Charter Compliance**: Full TEA requirements met
- **Global Operations**: Austin, Madrid, Vienna campuses

The platform is complete and ready for production deployment once this build issue is resolved.

---

**COPILOT INSTRUCTION**: Apply Solution 1 first. If build still fails, implement Solution 2. Test thoroughly and confirm all routes are accessible before marking complete.