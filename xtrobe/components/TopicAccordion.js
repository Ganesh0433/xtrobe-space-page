import { useState } from "react";

export default function TopicAccordion({ topic }) {
  const [isOpen, setIsOpen] = useState(false);

  const renderContent = (content) => {
    if (typeof content === 'string') {
      return <p className="text-slate-300 whitespace-pre-line">{content}</p>;
    }
    
    return (
      <div className="space-y-4">
        {content.overview && (
          <p className="text-slate-300">{content.overview}</p>
        )}
        
        {content.key_concepts && (
          <div>
            <h4 className="font-medium text-white mb-2">Key Concepts:</h4>
            <ul className="list-disc pl-5 text-slate-300 space-y-1">
              {content.key_concepts.map((concept, i) => (
                <li key={i}>{concept}</li>
              ))}
            </ul>
          </div>
        )}

        {content.resources && (
          <div>
            <h4 className="font-medium text-white mb-2">Resources:</h4>
            <div className="space-y-2">
              {content.resources.map((resource, i) => (
                <a 
                  key={i}
                  href={resource.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-400 hover:text-blue-300"
                >
                  {resource.type === 'video' ? '▶️' : '📄'} {resource.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 bg-slate-800 hover:bg-slate-700 transition-colors"
      >
        <h3 className="text-lg font-medium text-white">{topic.title}</h3>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 bg-slate-900">
          {renderContent(topic.content)}
          {topic.activities && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <h4 className="font-medium text-white mb-2">Activities:</h4>
              {topic.activities.map((activity, i) => (
                <div key={i} className="mb-4 p-3 bg-slate-800 rounded">
                  <h5 className="font-medium text-blue-300">{activity.title}</h5>
                  <p className="text-slate-300 text-sm mt-1">{activity.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}