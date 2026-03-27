import Image from "next/image";
import spinner from "../../../public/loading-spinner1.gif";

interface ISpinnerProps {
  light?: boolean;
  overlay?: boolean;
  className?: string;
  size?: string;
}
const Spinner = ({ light, overlay, className, size }: ISpinnerProps) => {
  return (
    <div className={`${overlay ? "flexItem-modal" : ""} ${className}`}>
      {overlay && <div className="modal_overlay " />}
      <Image
        alt="loading spinner"
        src={spinner}
        style={{
          width: `${size ?? 20}px`,
          margin: "auto",
          filter: light ? "contrast(0.1)" : "",
        }}
        unoptimized
      />
    </div>
  );
};

export default Spinner;
