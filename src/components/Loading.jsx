import { BounceLoader } from "react-spinners";

function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <BounceLoader style={{ color: "#FF7CAF" }} />
    </div>
  );
}

export default Loading;
