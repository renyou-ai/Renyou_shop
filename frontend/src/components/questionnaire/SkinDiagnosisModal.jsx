import { useState } from "react";
import api from "../../api/axiosInstance";

const questions = [
  {
    id: "ageRange",
    question: "How old are you?",
    options: [
      "18 - 25",
      "26 - 35",
      "36 - 45",
      "46 - 55",
      "Over 55",
    ],
  },

  {
    id: "gender",
    question: "What is your gender?",
    options: ["Male", "Female"],
  },

  {
    id: "skinType",
    question: "What is your skin type?",
    options: [
      "Dry",
      "Combination",
      "Oily",
      "Normal",
      "Sensitive",
    ],
  },

  {
    id: "dehydration",
    question:
      "Does your skin often feel dehydrated?",
    options: [
      "Yes, all the time",
      "Yes, sometimes",
      "No, never",
    ],
  },

  {
    id: "redness",
    question:
      "Does your skin tend to get red or irritated?",
    options: [
      "Yes, often",
      "Sometimes",
      "No",
    ],
  },

  {
    id: "wrinkles",
    question:
      "Do you have visible fine lines or wrinkles?",
    options: [
      "Yes, a lot",
      "A little",
      "No",
    ],
  },

  {
    id: "darkSpots",
    question:
      "Do you have dark spots or uneven skin tone?",
    options: [
      "Yes",
      "A little",
      "No",
    ],
  },
];

export default function SkinDiagnosisModal({
  onClose,
}) {
  const [currentStep, setCurrentStep] =
    useState(0);

  const [answers, setAnswers] = useState({});

  const [loading, setLoading] = useState(false);

  const [completed, setCompleted] =
    useState(false);

  const currentQuestion =
    questions[currentStep];

  const progress =
    ((currentStep + 1) / questions.length) *
    100;

  const isAnswered =
    answers[currentQuestion.id];

  const handleSelect = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = async () => {
    if (!isAnswered) return;

    if (
      currentStep <
      questions.length - 1
    ) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    try {
      setLoading(true);

      await api.put(
        "/auth/skin-profile",
        answers
      );

      setTimeout(() => {
        setLoading(false);
        setCompleted(true);
      }, 2500);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 0) return;

    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-2xl rounded-[32px] bg-[#ECE4FF] p-8 shadow-2xl overflow-hidden">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-[#524E8D] text-2xl font-light hover:scale-110 transition"
        >
          ×
        </button>

        {/* LOADING SCREEN */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-20 h-20 rounded-full border-4 border-[#d8cef8] border-t-[#6C63FF] animate-spin mb-8"></div>

            <h2 className="text-3xl font-bold text-[#2F2B5B] mb-3">
              Analyzing Your Skin
            </h2>

            <p className="text-[#5B578A] text-lg">
              Please wait a moment...
            </p>
          </div>
        )}

        {/* RESULT SCREEN */}
        {!loading && completed && (
          <div className="py-10">
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#9E96FF] flex items-center justify-center text-white text-4xl shadow-lg">
                ✨
              </div>
            </div>

            <h2 className="text-center text-4xl font-bold text-[#2F2B5B] mb-4">
              Diagnosis Complete
            </h2>

            <p className="text-center text-[#5B578A] text-lg leading-relaxed max-w-xl mx-auto mb-8">
              Your skin profile has been
              successfully analyzed and saved
              to your account.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="rounded-3xl bg-white p-5 shadow-md">
                <p className="text-sm text-[#7A74A8] mb-2">
                  Skin Type
                </p>

                <h3 className="text-2xl font-bold text-[#2F2B5B]">
                  {answers.skinType}
                </h3>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-md">
                <p className="text-sm text-[#7A74A8] mb-2">
                  Sensitivity
                </p>

                <h3 className="text-2xl font-bold text-[#2F2B5B]">
                  {answers.redness}
                </h3>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-md mb-8">
              <h3 className="text-xl font-bold text-[#2F2B5B] mb-3">
                AI Skin Analysis
              </h3>

              <p className="text-[#5B578A] leading-relaxed">
                Your skin appears to need
                hydration support and barrier
                protection. A gentle skincare
                routine with moisturizing and
                SPF products would highly
                benefit your skin condition.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full rounded-2xl bg-gradient-to-r from-[#524E8D] to-[#6C63FF] py-4 text-white text-lg font-semibold shadow-lg hover:scale-[1.02] transition"
            >
              Continue Shopping
            </button>
          </div>
        )}

        {/* QUESTIONS */}
        {!loading && !completed && (
          <>
            {/* HEADER */}
            <div className="mb-8">
              <p className="text-[#7A74A8] text-sm mb-3">
                Question {currentStep + 1} of{" "}
                {questions.length}
              </p>

              <div className="w-full h-3 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#524E8D] to-[#6C63FF] transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>

            {/* QUESTION */}
            <div className="mb-10">
              <h2 className="text-4xl font-bold text-[#2F2B5B] leading-tight">
                {currentQuestion.question}
              </h2>
            </div>

            {/* OPTIONS */}
            <div className="space-y-4 mb-10">
              {currentQuestion.options.map(
                (option) => {
                  const selected =
                    answers[
                      currentQuestion.id
                    ] === option;

                  return (
                    <button
                      key={option}
                      onClick={() =>
                        handleSelect(option)
                      }
                      className={`w-full rounded-2xl border-2 px-6 py-5 text-left text-lg font-medium transition-all duration-300 ${
                        selected
                          ? "border-[#6C63FF] bg-gradient-to-r from-[#524E8D] to-[#6C63FF] text-white shadow-lg scale-[1.01]"
                          : "border-transparent bg-white text-[#2F2B5B] hover:border-[#C6B9FF]"
                      }`}
                    >
                      {option}
                    </button>
                  );
                }
              )}
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="w-full rounded-2xl border border-[#CFC5F5] bg-white py-4 text-[#524E8D] font-semibold disabled:opacity-40"
              >
                Back
              </button>

              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className="w-full rounded-2xl bg-gradient-to-r from-[#524E8D] to-[#6C63FF] py-4 text-white font-semibold shadow-lg disabled:opacity-50"
              >
                {currentStep ===
                questions.length - 1
                  ? "Finish Diagnosis"
                  : "Next"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}