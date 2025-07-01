import React from "react";
import Spline from "@splinetool/react-spline";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden  bg-opacity-80">
      <Spline scene="https://prod.spline.design/WV2Mx38YmY7trRFF/scene.splinecode" />
    </div>
  );
}
