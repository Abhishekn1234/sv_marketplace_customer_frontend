import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/features/context/LanguageContext";
const ProgressStepper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {t}=useLanguage();
  const steps = [
    {
      id: 1,
      label: t.stepper.language,
      path: "/language",
      status: location.pathname !== "/language" ? "completed" : "active",
    },
    {
      id: 2,
      label: t.stepper.location,
      path: "/location",
      status:
        location.pathname === "/location"
          ? "active"
          : location.pathname === "/register"
          ? "completed"
          : "upcoming",
    },
    {
      id: 3,
      label: t.stepper.registration,
      path: "/register",
      status: location.pathname === "/register" ? "active" : "upcoming",
    },
  ];

  const handleStepClick = (step: (typeof steps)[0]) => {
    navigate(step.path);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-6 sm:gap-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
             
              <div
                onClick={() => handleStepClick(step)}
                className="flex items-center gap-4 cursor-pointer group"
              >
              
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                    step.status === "completed"
                      ? "bg-success text-white"
                      : step.status === "active"
                      ? "bg-primary-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step.status === "completed" ? (
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span className="text-xs font-bold">{step.id}</span>
                  )}
                </div>

               
                <span className={`text-xs font-bold uppercase tracking-wider ${ step.status === 'completed' ? 'text-success' : step.status === 'active' ? 'text-primary-600' : 'text-gray-400' } `} > {step.label} </span>
              </div>

           
              {index < steps.length - 1 && (
                <>
                  {/* Mobile vertical connector */}
                  <div className="sm:hidden ml-4 w-px h-6 bg-gray-200" />

                  {/* Desktop horizontal connector */}
                  <div className="hidden sm:block w-16 h-0.5 bg-gray-200" />
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressStepper;
