
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { AdminFunctionResult } from '@/types/adminTesting';

interface OperationResultDisplayProps {
  result: AdminFunctionResult;
}

const OperationResultDisplay: React.FC<OperationResultDisplayProps> = ({ result }) => {
  return (
    <div className={`rounded-lg p-4 border ${
      result.success 
        ? 'bg-green-50 border-green-200' 
        : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-start space-x-3">
        {result.success ? (
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
        )}
        <div className="flex-1">
          <h4 className={`font-medium mb-1 ${
            result.success ? 'text-green-900' : 'text-red-900'
          }`}>
            {result.success ? 'Operation Successful' : 'Operation Failed'}
          </h4>
          <p className={`text-sm mb-2 ${
            result.success ? 'text-green-700' : 'text-red-700'
          }`}>
            {result.success ? result.message : result.error}
          </p>
          
          {/* Debug Information */}
          {result.debug_info && (
            <details className="mt-2">
              <summary className={`text-xs cursor-pointer ${
                result.success ? 'text-green-600' : 'text-red-600'
              }`}>
                Show Debug Info
              </summary>
              <div className={`text-xs mt-2 p-2 rounded ${
                result.success ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(result.debug_info, null, 2)}
                </pre>
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );
};

export default OperationResultDisplay;
