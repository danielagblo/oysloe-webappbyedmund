import React from "react";

const SafetyTips: React.FC = () => (
  <div className="bg-white sm:bg-(--div-active) sm:p-6 rounded-2xl py-1 px-2 pb-5 lg:mx-6">
    <h2 className="text-xl font-bold mb-2 md:text-[1.75vw]">Safety tips</h2>
    <p className="text-gray-500 mb-3 py-1 px-2 rounded-2xl text-xs bg-(--div-active) sm:bg-white md:text-[0.9vw]">
      Follow this tips and report any suspicious activity.
    </p>
    <ul className="list-disc ml-5 marker:text-black space-y-2 font-bold text-sm md:text-[1.125vw]">
      <li>Meet in a public place</li>
      <li>Check the vehicle history</li>
      <li>Inspect the vehicle thoroughly</li>
      <li>Don't share personal information</li>
      <li>Trust your instincts</li>
    </ul>
  </div>
);

export default React.memo(SafetyTips);
