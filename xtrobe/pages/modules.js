import ModuleCard from "../components/ModuleCard";
import Navigation from "../components/Navigation";
import modulesData from "../data/modules-data.json";

export default function StudyModules() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation modules={modulesData.modules} />
      
      <main className="container mx-auto mt-16 py-12 px-4">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {modulesData.modules.map((module) => (
      <ModuleCard key={module.id} module={module} />
    ))}
  </div>
</main>

    </div>
  );
}