import { useRouter } from "next/router";
import ModuleDetail from "../../components/ModuleDetail";
import Navigation from "../../components/Navigation";
import curriculum from "../../data/modules-data.json"; // Direct import

export async function getStaticProps() {
  return {
    props: {
      modules: curriculum.modules || [] // Access modules from imported JSON
    }
  };
}

export async function getStaticPaths() {
  // Use the imported JSON data directly
  const paths = curriculum.modules.map(module => ({
    params: { moduleId: module.id }
  }));

  return {
    paths,
    fallback: false
  };
}

export default function ModulePage({ modules }) {
  const router = useRouter();
  const { moduleId } = router.query;
  
  const module = modules.find(m => m.id === moduleId);

  if (!module) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navigation modules={modules} />
        <div className="container mx-auto p-8 text-center">
          <h1 className="text-2xl text-red-400">Module not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation modules={modules} />
      <ModuleDetail module={module} />
    </div>
  );
}