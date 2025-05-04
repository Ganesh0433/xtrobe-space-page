import React from 'react';

const renderContentItem = (key, value) => {
  // Handle arrays
  if (Array.isArray(value)) {
    return (
      <div key={key} className="mb-8">
        <h4 className="font-medium text-white capitalize mb-3 text-lg tracking-wide">
          {key.replace(/_/g, ' ')}
        </h4>
        <ul className="list-disc pl-7 space-y-3 text-slate-300 text-base leading-relaxed">
          {value.map((item, i) => (
            <li key={i} className="pl-2 marker:text-slate-500">
              {typeof item === 'object' 
                ? Object.entries(item).map(([subKey, subValue]) => (
                    <div key={subKey} className="mb-2">
                      <span className="font-medium text-slate-100 bg-slate-800/40 px-2 py-1 rounded">
                        {subKey}: 
                      </span>
                      <span className="ml-2">
                        {Array.isArray(subValue) 
                          ? subValue.join(', ') 
                          : subValue.toString()}
                      </span>
                    </div>
                  ))
                : <span className="bg-slate-800/20 px-2 py-1 rounded inline-block">{item.toString()}</span>}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Handle objects
  if (typeof value === 'object' && value !== null) {
    return (
      <div key={key} className="mb-8">
        <h4 className="font-medium text-white capitalize mb-4 text-lg tracking-wide">
          {key.replace(/_/g, ' ')}
        </h4>
        <div className="pl-6 border-l-2 border-slate-700/50 space-y-4">
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey} className="mb-3">
              <span className="font-medium text-slate-200 capitalize text-base bg-slate-800/40 px-2 py-1 rounded">
                {subKey.replace(/_/g, ' ')}:
              </span>
              {Array.isArray(subValue)
                ? <ul className="list-disc pl-7 mt-3 space-y-2">
                    {subValue.map((item, i) => (
                      <li key={i} className="text-slate-300 text-base leading-relaxed marker:text-slate-500">
                        {item.toString()}
                      </li>
                    ))}
                  </ul>
                : <p className="text-slate-300 mt-2 ml-2 text-base leading-relaxed bg-slate-800/20 px-3 py-2 rounded">
                    {subValue.toString()}
                  </p>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Handle primitive values
  return (
    <div key={key} className="mb-8">
      <h4 className="font-medium text-white capitalize mb-3 text-lg tracking-wide">
        {key.replace(/_/g, ' ')}
      </h4>
      <p className="text-slate-300 pl-3 text-base leading-relaxed bg-slate-800/20 px-4 py-2 rounded">
        {value.toString()}
      </p>
    </div>
  );
};

export default function ModuleDetail({ module }) {
  if (!module) return (
    <div className="text-red-400 p-12 text-center text-lg">
      Module not found
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pt-16 pb-12 px-6 font-sans">
      <div className="mb-12">
        <h1 className=" mt-24 text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
          {module.title}
        </h1>
        {module.subtitle && (
          <p className="text-xl text-slate-300 mb-6">{module.subtitle}</p>
        )}
        <div className="w-24 h-1 bg-blue-500/80 rounded-full mt-6"></div>
      </div>
      
      {module.sections?.length > 0 ? (
        <div className="space-y-12">
          {module.sections.map((section) => (
            <div 
              key={section.id} 
              className="bg-slate-800/20 p-8 rounded-xl border border-slate-700/30 shadow-lg backdrop-blur-sm"
            >
              <div className="flex items-center mb-7">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <h2 className="text-2xl font-semibold text-white tracking-wide">
                  {section.title}
                </h2>
              </div>
              
              {section.content && (
                <div className="space-y-8 pl-2">
                  {Object.entries(section.content).map(([key, value]) => (
                    renderContentItem(key, value)
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-slate-400 p-10 bg-slate-800/20 rounded-xl text-center text-lg border border-slate-700/30">
          No sections available for this module yet.
        </div>
      )}
    </div>
  );
}