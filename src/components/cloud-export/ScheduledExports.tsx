'use client';

import { ClockIcon, CalendarIcon, CogIcon } from '@heroicons/react/24/outline';

export function ScheduledExports() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Automated Exports
        </h3>
        <p className="text-gray-600 mb-6">
          Set up recurring exports to keep your data synchronized across all your tools automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Schedules */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <ClockIcon className="h-5 w-5 mr-2 text-green-600" />
            Active Schedules
          </h4>

          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium text-green-900">Monthly Tax Report</h5>
                  <p className="text-sm text-green-700">Every 1st of the month → Google Sheets</p>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium text-blue-900">Weekly Summary</h5>
                  <p className="text-sm text-blue-700">Every Sunday → Email to accountant</p>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Create New Schedule */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-purple-600" />
            Create New Schedule
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
              <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Quarterly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
              <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500">
                <option>Tax Report</option>
                <option>Monthly Summary</option>
                <option>Category Analysis</option>
              </select>
            </div>

            <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700">
              Create Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Automation Stats */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h4 className="text-lg font-semibold mb-4 flex items-center">
          <CogIcon className="h-5 w-5 mr-2 text-blue-600" />
          Automation Statistics
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">47</div>
            <div className="text-sm text-gray-600">Automated Exports</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">2.3h</div>
            <div className="text-sm text-gray-600">Time Saved</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">99.2%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">5</div>
            <div className="text-sm text-gray-600">Active Schedules</div>
          </div>
        </div>
      </div>
    </div>
  );
}
