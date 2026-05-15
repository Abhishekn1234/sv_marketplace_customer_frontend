"use client";

import React from "react";
import { X, CheckCircle2 } from "lucide-react";

import Button from "../input/Button";
import AppProgress from "./CommonAppProgress";

export interface OnboardingStep {
  id: string;
  label: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface Props {
  steps: OnboardingStep[];
  completion: Record<string, boolean>;
  onClose: () => void;
  allDone: boolean;
}

const OnboardingChecklist: React.FC<Props> = ({
  steps,
  completion,
  onClose,
  allDone,
}) => {
  const doneCount = steps.filter((s) => completion[s.id]).length;

  const progress =
    steps.length > 0 ? (doneCount / steps.length) * 100 : 0;

  return (
    <div className="absolute top-full mt-3 w-72 bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 z-[9999]">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">
            {allDone ? "You're all set! 🎉" : "Complete setup"}
          </h3>

          <p className="text-xs text-gray-500 mt-0.5">
            {allDone
              ? "Setup complete, closing shortly…"
              : `${doneCount} of ${steps.length} steps done`}
          </p>
        </div>

        <Button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Progress (REUSABLE COMPONENT) */}
      <AppProgress
        value={progress}
        height={6}
        color="bg-blue-600"
        showLabel
        label="Setup Progress"
      />

      {/* Steps */}
      <div className="space-y-2 mt-3">
        {steps.map((step, index) => {
          const done = completion[step.id];

          return (
            <div
              key={step.id}
              className={`flex items-center justify-between rounded-xl p-3 transition-colors ${
                done ? "bg-green-50" : "bg-blue-50"
              }`}
            >
              {/* Left */}
              <div className="flex items-center gap-3">
                {done ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {index + 1}
                  </div>
                )}

                <div>
                  <p
                    className={`text-sm font-medium ${
                      done
                        ? "text-green-700 line-through"
                        : "text-gray-800"
                    }`}
                  >
                    {step.label}
                  </p>

                  {step.description && (
                    <p className="text-xs text-gray-500">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action */}
              {!done && step.onAction && (
                <Button
                  onClick={step.onAction}
                  className="px-3 py-1 text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-700 shrink-0"
                >
                  {step.actionLabel || "Use"}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingChecklist;