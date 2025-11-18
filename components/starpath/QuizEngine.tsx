"use client";

import { useState } from "react";
import { StarPathPanel, StarPathBadge } from "@/components/starpath";
import { CheckCircle, XCircle, Trophy, Brain, Clock, Play } from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  course: string;
  difficulty: "easy" | "medium" | "hard";
}

interface QuizEngineProps {
  courseId: string;
  weekNumber: number;
}

export default function QuizEngine({ courseId, weekNumber }: QuizEngineProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Sample quiz questions - in production, fetch from API based on courseId and week
  const questions: QuizQuestion[] = [
    {
      id: 1,
      question: "What is the primary focus of the Vienna Residency program?",
      options: [
        "Only athletic training",
        "Academic credits through experiential learning",
        "German language only",
        "Tourism and sightseeing"
      ],
      correctAnswer: 1,
      explanation: "The Vienna Residency integrates athletic training with academic credit through experiential learning, combining culture, language, and performance.",
      course: "Orientation",
      difficulty: "easy"
    },
    {
      id: 2,
      question: "How many NCAA credits can you earn in the 12-week Vienna Residency?",
      options: ["6 credits", "8 credits", "10 credits", "12 credits"],
      correctAnswer: 3,
      explanation: "The Vienna Residency offers 12 NCAA-recognized credits across 6 core courses over 12 weeks.",
      course: "SCI-401",
      difficulty: "easy"
    },
    {
      id: 3,
      question: "Which Human Development Record (HDR) pillar focuses on self-awareness and stress management?",
      options: [
        "Physical Development",
        "Mental Resilience",
        "Emotional Intelligence",
        "Social Skills"
      ],
      correctAnswer: 2,
      explanation: "Emotional Intelligence pillar covers self-awareness, empathy, stress management, and relationship building.",
      course: "HDR-401",
      difficulty: "medium"
    },
    {
      id: 4,
      question: "In SCI-401, which physiological system adapts during sprint training?",
      options: [
        "Only muscular system",
        "Cardiovascular, muscular, and nervous systems",
        "Only cardiovascular system",
        "Digestive system"
      ],
      correctAnswer: 1,
      explanation: "Sprint training creates adaptations across multiple systems: cardiovascular (oxygen delivery), muscular (power production), and nervous (motor unit recruitment).",
      course: "SCI-401",
      difficulty: "hard"
    },
    {
      id: 5,
      question: "What percentage of athletic instruction in Vienna occurs in German?",
      options: ["10%", "30%", "50%", "100%"],
      correctAnswer: 1,
      explanation: "Approximately 30% of athletic instruction is conducted in German with progressive complexity, allowing authentic language acquisition through training.",
      course: "LANG-401",
      difficulty: "medium"
    }
  ];

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setTimeElapsed(0);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers, selectedAnswer];
      setAnswers(newAnswers);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResults(true);
      }
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100)
    };
  };

  if (!quizStarted) {
    return (
      <StarPathPanel>
        <div className="text-center py-8">
          <Brain className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">Week {weekNumber} Assessment</h3>
          <p className="text-gray-400 mb-2">Course: {courseId}</p>
          <p className="text-gray-300 mb-6">
            {questions.length} questions • Multiple choice • Estimated time: {questions.length * 2} minutes
          </p>
          <div className="flex gap-2 justify-center mb-6">
            <StarPathBadge variant="blue">NCAA Compliant</StarPathBadge>
            <StarPathBadge variant="green">Auto-Graded</StarPathBadge>
          </div>
          <button
            onClick={handleStartQuiz}
            className="bg-amber-500 hover:bg-amber-400 text-black px-8 py-4 rounded-lg font-bold text-lg transition inline-flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            Start Assessment
          </button>
        </div>
      </StarPathPanel>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const passed = score.percentage >= 70;

    return (
      <StarPathPanel>
        <div className="text-center py-8">
          {passed ? (
            <Trophy className="w-20 h-20 text-amber-500 mx-auto mb-4 animate-bounce" />
          ) : (
            <Brain className="w-20 h-20 text-blue-400 mx-auto mb-4" />
          )}
          
          <h3 className="text-3xl font-bold text-white mb-2">
            {passed ? "Assessment Passed!" : "Keep Learning!"}
          </h3>
          
          <div className="text-6xl font-bold text-amber-500 my-6">
            {score.percentage}%
          </div>
          
          <p className="text-xl text-gray-300 mb-8">
            {score.correct} out of {score.total} correct
          </p>

          {passed ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
              <p className="text-green-400 font-medium">
                ✓ Credit earned for Week {weekNumber} • {courseId}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Progress updated in your transcript
              </p>
            </div>
          ) : (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
              <p className="text-blue-400 font-medium">
                Review the material and try again
              </p>
              <p className="text-sm text-gray-400 mt-2">
                70% required to earn credit
              </p>
            </div>
          )}

          <div className="space-y-4 mb-8">
            <h4 className="text-lg font-bold text-white">Answer Review</h4>
            {questions.map((q, index) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer === q.correctAnswer;
              
              return (
                <div
                  key={q.id}
                  className={`text-left p-4 rounded-lg border ${
                    isCorrect
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-red-500/10 border-red-500/30"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="text-white font-medium mb-2">{q.question}</p>
                      <p className="text-sm text-gray-400">
                        Your answer: <span className={isCorrect ? "text-green-400" : "text-red-400"}>
                          {q.options[userAnswer]}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-gray-400 mt-1">
                          Correct answer: <span className="text-green-400">{q.options[q.correctAnswer]}</span>
                        </p>
                      )}
                      <p className="text-sm text-gray-300 mt-2 italic">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleStartQuiz}
              className="bg-white/10 hover:bg-white/20 border border-amber-500/30 text-white px-6 py-3 rounded-lg font-bold transition"
            >
              Retake Assessment
            </button>
            <a
              href="/dashboard"
              className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 rounded-lg font-bold transition"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </StarPathPanel>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <StarPathPanel>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <StarPathBadge variant="blue">
              Question {currentQuestion + 1} of {questions.length}
            </StarPathBadge>
            <StarPathBadge variant="warm">{currentQ.difficulty}</StarPathBadge>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className="bg-amber-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-6">{currentQ.question}</h3>
        
        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedAnswer === index
                  ? "border-amber-500 bg-amber-500/20"
                  : "border-gray-700 bg-gray-800/50 hover:border-amber-500/50 hover:bg-gray-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === index
                      ? "border-amber-500 bg-amber-500"
                      : "border-gray-600"
                  }`}
                >
                  {selectedAnswer === index && (
                    <CheckCircle className="w-4 h-4 text-black" />
                  )}
                </div>
                <span className="text-white">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">
          Course: <span className="text-amber-500 font-medium">{currentQ.course}</span>
        </p>
        <button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className={`px-8 py-3 rounded-lg font-bold transition ${
            selectedAnswer !== null
              ? "bg-amber-500 hover:bg-amber-400 text-black"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          {currentQuestion < questions.length - 1 ? "Next Question" : "Submit Assessment"}
        </button>
      </div>
    </StarPathPanel>
  );
}
