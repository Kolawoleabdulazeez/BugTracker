import Image from "next/image";
import EmptyEnvelope from "../../../public/menu-envelope.svg"

const NoRecord = () => {
  return (
    <div className="flex flex-col justify-center mt-[3rem] text-gray-200 items-center">
      <Image src={EmptyEnvelope} alt="No Record" height={200} width={200} />
      <p className="text-black">No Results Found</p>
    </div>
  );
};

export default NoRecord;
