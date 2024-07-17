import { MathJax } from "better-react-mathjax";

interface Props {
  mathExp: string;
}

export default function mdRenderer({ mathExp }: Props) {
  return (
    <div>
      <h4>
        <MathJax>{mathExp}</MathJax>
      </h4>
    </div>
  );
}
