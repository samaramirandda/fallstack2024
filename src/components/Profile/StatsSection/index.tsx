import { Student } from "@prisma/client";

import HistorySection from "../../HistorySection";

interface StatsProps {
  student: Student;
  stats?: number[];
}

const StatsSection: React.FC<StatsProps> = ({ stats, student }) => {
  return (
    <section className="flex w-full flex-col items-center justify-center rounded-t-3xl bg-white p-4 md:rounded-md md:p-8">
      <div className="mb-6 grid grid-cols-1 items-center justify-center gap-4 md:grid-cols-3 md:gap-24">
        <div className="flex flex-col items-start">
          <h2 className="font-poppins text-xl font-semibold text-gray-600">
            Total de <br />
            scans
          </h2>
          <p className="mt-4 text-xl font-bold text-black md:text-4xl">
            {stats ? stats[0] : 0}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-left font-poppins text-xl font-semibold text-gray-600">
            Total de gravações <br />
            de perfil
          </h2>
          <p className="mt-4 font-bold text-black md:text-4xl">
            {stats ? stats[1] : 0}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <h2 className="text-start font-poppins text-xl font-semibold text-gray-600">
            Empresas <br />
            restantes
          </h2>
          <p className="mt-4 font-bold text-black md:text-4xl">{10}</p>
        </div>
      </div>
      <HistorySection code={student.code} />
    </section>
  );
};

export default StatsSection;
