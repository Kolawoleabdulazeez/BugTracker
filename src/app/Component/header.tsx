import Image from "next/image";

const Header = () => {
  const repeatImage = Array(6).fill(0);

  return (
    <div className="p-5 min-w-0">
      <div className="company-details flex items-center">
        <Image src="/tracker-logo.png" height={50} width={50} alt="Company's logo" />
        <span className="font-bold text-lg px-3">Rover Solutions</span>
      </div>

      <div className="team-members mt-3">
        <span>
          12 <span className="text-blue-700 px-1">Team Members</span> | 2{" "}
          <span className="text-gray-900">Guest</span>
        </span>
      </div>

      <div className="members-image flex flex-wrap gap-2 my-4">
        {repeatImage.map((_, index) => (
          <img
            key={index}
            src="/member-6.jpg"
            alt={`avatar-${index}`}
            className="w-10 h-10 rounded-md object-cover"
          />
        ))}
        <button className="bg-gray-100 hover:bg-gray-200 px-3 rounded-xl">
          <span className="text-gray-500 text-xl">⋯</span>
        </button>
      </div>
    </div>
  );
};

export default Header;