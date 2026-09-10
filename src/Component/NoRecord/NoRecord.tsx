import Image from "next/image";
import EmptyEnvelope from "../../../public/menu-envelope.svg";

const NoRecord = () => {
  return (
    <div className="flex flex-col justify-center mt-[3rem] items-center">
      <Image
        src={EmptyEnvelope}
        alt="No Record"
        height={200}
        width={200}
        className="opacity-100 dark:opacity-10 dark:invert dark:brightness-0"
      />
      <p className="text-slate-500 dark:text-secondary-400 mt-2">
        No Results Found
      </p>
    </div>
  );
};

export default NoRecord;