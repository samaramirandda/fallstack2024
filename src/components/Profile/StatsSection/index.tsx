import { SavedStudentWithSavedBy } from "@/types/SavedStudentWithSavedBy";

import HistorySection from "../../HistorySection";

interface StatsProps {
  stats: number[];
  companiesLeft: number;
  historyData: SavedStudentWithSavedBy[];
}

const StatsSection: React.FC<StatsProps> = ({
  stats,
  companiesLeft,
  historyData,
}) => {
  const totalScans = stats[0];
  const totalSaves = stats[1];

  return (
    <section className="flex w-full flex-col items-center justify-center rounded-t-3xl bg-white p-4 md:rounded-md md:p-8">
      <h1 className="mx-auto my-6 w-1/2 text-center  text-2xl font-extrabold uppercase text-black md:my-2">
        Visão Geral
      </h1>
      <div className="mb-6 grid w-full grid-cols-1 items-center justify-center gap-y-4 md:my-6 md:grid-cols-3">
        <div className="flex flex-col items-center gap-y-2 md:gap-y-4">
          <p className="mt-4 text-4xl font-bold text-black">{totalScans}</p>
          <h2 className="text-center  font-semibold leading-6 text-gray-600 md:text-xl">
            {totalScans === 1 ? "Scan" : "Scans"}
          </h2>
        </div>
        <div className="flex flex-col items-center gap-y-2 md:gap-y-4 md:border-x-4">
          <p className="mt-4 text-4xl font-bold text-black">{totalSaves}</p>
          <h2 className=" text-center  font-semibold leading-6 text-gray-600 md:text-xl">
            {totalSaves === 1 ? "Gravação de Perfil" : "Gravações de Perfil"}
          </h2>
        </div>
        <div className="flex flex-col items-center gap-y-2 md:gap-y-4">
          <p className="mt-4 text-4xl font-bold text-black">{companiesLeft}</p>
          <h2 className="text-center  font-semibold leading-6 text-gray-600 md:text-xl">
            Empresas restantes
          </h2>
        </div>
      </div>
      <HistorySection historyData={historyData} />
    </section>
  );
};

export default StatsSection;
