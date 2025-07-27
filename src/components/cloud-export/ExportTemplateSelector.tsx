'use client';

import { ExportTemplateConfig, ExportTemplate } from '@/types';
import { CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface ExportTemplateSelectorProps {
  templates: ExportTemplateConfig[];
  selectedTemplate: ExportTemplate;
  onTemplateSelect: (template: ExportTemplate) => void;
}

export function ExportTemplateSelector({
  templates,
  selectedTemplate,
  onTemplateSelect
}: ExportTemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {templates.map((template) => (
        <div
          key={template.id}
          className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md ${
            selectedTemplate === template.id
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-20'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
          onClick={() => onTemplateSelect(template.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <span className="text-2xl">{template.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  {template.name}
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  {template.description}
                </p>

                {/* Recommended For Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {template.recommendedFor.slice(0, 2).map((use, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                    >
                      <SparklesIcon className="h-3 w-3 mr-1" />
                      {use}
                    </span>
                  ))}
                  {template.recommendedFor.length > 2 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      +{template.recommendedFor.length - 2} more
                    </span>
                  )}
                </div>

                {/* Template Features */}
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                    {template.defaultFormat.toUpperCase()}
                  </div>
                  {template.includesMetadata && (
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-1"></div>
                      Metadata
                    </div>
                  )}
                  {template.customFields && template.customFields.length > 0 && (
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-1"></div>
                      {template.customFields.length} custom fields
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedTemplate === template.id && (
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-blue-600" />
              </div>
            )}
          </div>

          {/* Preview of custom fields */}
          {selectedTemplate === template.id && template.customFields && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
              <h5 className="text-sm font-medium text-gray-900 mb-2">
                Additional Fields Included:
              </h5>
              <div className="flex flex-wrap gap-2">
                {template.customFields.map((field, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
