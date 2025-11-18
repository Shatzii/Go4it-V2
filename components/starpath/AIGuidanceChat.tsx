"use client";

import { useState } from "react";
import { StarPathPanel, StarPathBadge } from "@/components/starpath";
import { Send, Brain, Sparkles, X, MessageCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIGuidanceChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your StarPath AI Assistant. I can help you with:\n\n• Week planning and lesson ideas\n• German language activities\n• Mapping training to NCAA credits\n• Creating assessments and quizzes\n• Portfolio evidence suggestions\n• HDR pillar integration\n\nWhat would you like help with today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Quick command templates
  const quickCommands = [
    { cmd: "/week-plan", desc: "Generate weekly curriculum", icon: "📅" },
    { cmd: "/german-lesson", desc: "Create German activity", icon: "🇩🇪" },
    { cmd: "/credit-map", desc: "Map training to credits", icon: "🎓" },
    { cmd: "/assessment", desc: "Create quiz/test", icon: "📊" }
  ];

  const handleQuickCommand = (command: string) => {
    setInput(command + " ");
  };

  const simulateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Week plan generation
    if (lowerMessage.includes("/week-plan") || lowerMessage.includes("week plan")) {
      return `**Week 3 Curriculum Plan: Leadership & Nutrition**

**Monday - Leadership Foundation**
- SCI-401: Team dynamics and communication physiology
- Activity: Lead warmup session in German
- HDR Focus: Social Skills, Emotional Intelligence
- Evidence: Video of leadership moment + reflection

**Tuesday - Nutrition Science**
- HE-401: Macronutrients and performance fueling
- Activity: Track meals with German labels
- HDR Focus: Nutrition & Recovery, Life Skills
- Evidence: Food journal with cultural comparisons

**Wednesday - Cultural Integration**
- SOC-401: Austrian food culture study
- Activity: Farmers market visit (German practice)
- HDR Focus: Cultural & Experiential
- Evidence: Photo journal + vocabulary list

**Thursday - Performance Analytics**
- MATH-401: Calculate nutrition ratios and macros
- Activity: Analyze weekly meal data
- HDR Focus: Technical & Mechanical
- Evidence: Spreadsheet analysis + presentation

**Friday - Synthesis & Assessment**
- ELA-401: Reflection writing on growth
- LANG-401: Present learning in German
- HDR Focus: Mental & Emotional, Leadership
- Assessment: Week 3 quiz (all courses)

**Weekend Integration:**
- Competition application of nutrition strategy
- Cultural excursion with language tasks
- Portfolio updates and evidence organization

Would you like me to expand on any specific day or activity?`;
    }

    // German lesson
    if (lowerMessage.includes("/german-lesson") || lowerMessage.includes("german")) {
      return `**German Lesson: Soccer Training Vocabulary (A1 Level)**

**Theme:** Soccer Training Commands & Body Parts

**Vocabulary (10 words):**
1. **Schießen** (shoot)
2. **Passen** (pass)
3. **Laufen** (run)
4. **Springen** (jump)
5. **Bein** (leg)
6. **Fuß** (foot)
7. **Kopf** (head)
8. **Schnell** (fast)
9. **Langsam** (slow)
10. **Stop!** (stop)

**Activity Sequence:**
1. **Warmup (10 min):** Coach calls commands in German only
2. **Drill Practice (20 min):** Players respond to German instructions
3. **Game Application (15 min):** Mini-game with German tactical calls
4. **Reflection (5 min):** Students record themselves using 5 new words

**Evidence Collection:**
- Video: Responding to German commands
- Audio: Self-recording using vocabulary
- Journal: How did language impact performance?

**Assessment:**
- Can follow 8/10 commands correctly
- Use 5+ words in context during training
- Cultural note: Compare German vs English coaching style

**NCAA Credit Mapping:**
- LANG-401: Language acquisition through authentic use
- SCI-401: Movement biomechanics with German terminology
- HDR-401: Cultural & Experiential pillar

Ready to implement this lesson?`;
    }

    // Credit mapping
    if (lowerMessage.includes("/credit-map") || lowerMessage.includes("credit")) {
      return `**Training → NCAA Credit Mapping: Strength Session**

**Training Activity:** Lower body strength workout (90 min)

**Academic Credit Breakdown:**

**SCI-401: Human Performance Biology (0.25 cr)**
- Muscle physiology: Fiber recruitment patterns
- Evidence: Record sets, reps, load progressions
- Analysis: How muscles adapt to progressive overload
- Reflection: Physiological changes observed

**MATH-401: Performance Analytics (0.15 cr)**
- Calculate 1RM percentages for each lift
- Track volume (sets × reps × weight)
- Create performance graph (4-week trend)
- Statistical analysis: What predicts best gains?

**HDR-401: Physical Development Pillar (0.10 cr)**
- Pre-session readiness assessment
- Technique video documentation
- Post-session recovery protocol
- Weekly progress reflection

**ELA-401: Communication (Optional +0.05 cr)**
- Written reflection on mental approach
- Coaching cue analysis and response
- Leadership: How I help teammates with form

**Total Potential Credit: 0.50 per session**
**12-week program: 24 sessions = 12 credits**

**Evidence Requirements:**
✓ Training log with data
✓ Video of technique progression
✓ Weekly analysis essays
✓ Performance graphs and calculations
✓ HDR daily check-ins

Want me to map a specific sport or training type?`;
    }

    // Assessment creation
    if (lowerMessage.includes("/assessment") || lowerMessage.includes("quiz") || lowerMessage.includes("test")) {
      return `**Assessment Generator: SCI-401 Week 2**

**Quiz Type:** Multiple Choice + Short Answer
**Duration:** 15 minutes
**Passing Score:** 70%

**Sample Questions:**

**Q1 (Easy):** What are the three energy systems used in sports?
a) Fast, Medium, Slow
b) ATP-CP, Glycolytic, Oxidative ✓
c) Cardio, Strength, Flexibility
d) Anaerobic, Aerobic, Mixed

**Q2 (Medium):** During a 400m sprint, which energy system provides most of the energy?
a) ATP-CP system
b) Glycolytic system ✓
c) Oxidative system
d) All equally

**Q3 (Hard):** Why does heart rate stay elevated after intense exercise?
a) You're still nervous
b) EPOC - body is repaying oxygen debt ✓
c) Dehydration only
d) Muscle damage

**Q4 (Short Answer):** Explain in 2-3 sentences how your body adapts to repeated sprint training.

**Q5 (Application):** Look at your training data from this week. Which energy system did you use most? Provide evidence.

**Grading Rubric:**
- MC Questions: 2 points each (8 total)
- Short answer: 4 points (content + clarity)
- Application: 8 points (evidence + analysis)
- Total: 20 points (14+ to pass)

**Auto-grading:** MC questions
**Teacher review:** Written responses

Would you like me to generate questions for a different topic or course?`;
    }

    // Default helpful response
    return `I can help you with that! Here are some suggestions:

**For Curriculum Planning:**
- Use \`/week-plan\` to generate a full weekly schedule
- Specify week number and focus areas for better results

**For Language Integration:**
- Try \`/german-lesson [activity]\` for sport-specific vocabulary
- I can adapt for any training context

**For Credit Documentation:**
- Use \`/credit-map [training type]\` to see NCAA alignment
- I'll show exactly what evidence you need

**For Assessments:**
- Request \`/assessment [course] [topic]\` for quizzes
- I can create multiple choice, short answer, or projects

What specific area would you like help with?`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        role: "assistant",
        content: simulateAIResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50 group"
      >
        <div className="relative">
          <Brain className="w-6 h-6" />
          <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
        </div>
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Ask AI Assistant
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] z-50">
      <StarPathPanel>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Brain className="w-6 h-6 text-amber-500" />
              <div className="w-2 h-2 bg-green-400 rounded-full absolute -bottom-0.5 -right-0.5 animate-pulse"></div>
            </div>
            <div>
              <h3 className="font-bold text-white">StarPath AI Assistant</h3>
              <p className="text-xs text-gray-400">Powered by Ollama Llama 3.2 (Local)</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Commands */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quickCommands.map((cmd, i) => (
            <button
              key={i}
              onClick={() => handleQuickCommand(cmd.cmd)}
              className="text-xs bg-black/50 hover:bg-black/70 border border-amber-500/30 text-gray-300 px-3 py-1.5 rounded-full transition flex items-center gap-1"
            >
              <span>{cmd.icon}</span>
              <span>{cmd.cmd}</span>
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto mb-4 space-y-3 pr-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === "user"
                    ? "bg-amber-500 text-black"
                    : "bg-black/50 border border-amber-500/20 text-gray-200"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                <div className="text-xs opacity-60 mt-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-black/50 border border-amber-500/20 rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question or use /command..."
            className="flex-1 bg-black/50 border border-amber-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`p-2 rounded-lg transition ${
              input.trim()
                ? "bg-amber-500 hover:bg-amber-400 text-black"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-3 pt-3 border-t border-amber-500/20 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-400">AI ready • 100% private • No cloud</span>
        </div>
      </StarPathPanel>
    </div>
  );
}
