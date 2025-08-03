    import { useState } from 'react';

export default function ModuleCard({ module }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-2xl font-semibold text-blue-300 mb-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        {module.title}
      </h2>
      <p className="text-gray-300 mb-4">{module.description}</p>
      <div className="w-full bg-gray-700 rounded-full h-4">
        <div
          className="bg-blue-500 h-4 rounded-full transition-all duration-500"
          style={{ width: `${module.progress}%` }}
        ></div>
      </div>
      <p className="text-gray-400 mt-2">{module.progress}% Complete</p>
      {isOpen && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-blue-400">Submodules:</h3>
          <ul className="list-disc pl-5 text-gray-300">
            {module.submodules.map((submodule, index) => (
              <li key={index} className="mt-1">{submodule}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}