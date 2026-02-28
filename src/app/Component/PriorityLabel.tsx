  export type PriorityType = "Critical" | "High" | "Mid" | "Low";

  const priorityColor: Record<PriorityType, string> = {
    Critical: "bg-red-500",
    High: "bg-orange-400",
    Mid: "bg-yellow-400",
    Low: "bg-blue-400"
  };
  


type PriorityLabelProps = {
    level: PriorityType;
  };
  
 
 const PriorityLabel = ({ level }: PriorityLabelProps) => {
    return (
      <div className="flex items-center space-x-2">
        <span className={`w-2.5 h-2.5 rounded-full ${priorityColor[level]}`}></span>
        <span className=" font-medium text-gray-800">{level}</span>
      </div>
    );
  };

  export default PriorityLabel;