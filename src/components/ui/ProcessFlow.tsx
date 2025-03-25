
import React from 'react';
import { CheckCircle, Clock, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProcessStep } from '@/types';

interface ProcessFlowProps {
  currentStep: ProcessStep;
  className?: string;
}

const steps: { step: ProcessStep; label: string }[] = [
  { step: 'request_received', label: 'Request Received' },
  { step: 'item_registered', label: 'Item Registered' },
  { step: 'testing_assigned', label: 'Testing Assigned' },
  { step: 'testing_completed', label: 'Testing Completed' },
  { step: 'results_compiled', label: 'Results Compiled' },
  { step: 'customer_review', label: 'Customer Review' },
  { step: 'manager_approval', label: 'Manager Approval' },
  { step: 'report_finalized', label: 'Report Finalized' },
];

export default function ProcessFlow({ currentStep, className }: ProcessFlowProps) {
  const currentStepIndex = steps.findIndex((s) => s.step === currentStep);

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="flex items-center justify-between w-full overflow-x-auto pb-4">
        {steps.map((step, index) => {
          // Determine step status
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isPending = index > currentStepIndex;
          
          // Determine connector status (the line between steps)
          const showConnector = index < steps.length - 1;
          const isConnectorCompleted = index < currentStepIndex;
          
          return (
            <React.Fragment key={step.step}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center transition-all",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent && "bg-primary text-primary-foreground animate-pulse-subtle",
                    isPending && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted && <CheckCircle size={20} />}
                  {isCurrent && <Clock size={20} />}
                  {isPending && <Circle size={20} />}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs whitespace-nowrap px-2",
                    isCompleted && "text-foreground font-medium",
                    isCurrent && "text-foreground font-medium",
                    isPending && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              
              {showConnector && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-1",
                    isConnectorCompleted ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
