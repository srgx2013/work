import "./Button.css";
interface Props {
  label: string;
  paternMethod: () => void;
}
export const Button = ({ label, paternMethod }: Props) => {
  return (
    <button className="custom-button" onClick={paternMethod}>
      {label}
    </button>
  );
};
