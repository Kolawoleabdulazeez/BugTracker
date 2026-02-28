interface ErrorTextProps {
  text: string;
}
const ErrorText = ({ text }: ErrorTextProps) => {
  return <p className="text-xs font-semibold text-errorRed my-2">{text}</p>;
};

export default ErrorText;
