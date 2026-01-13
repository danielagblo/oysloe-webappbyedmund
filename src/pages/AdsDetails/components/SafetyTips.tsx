import React from "react";

const SafetyTips: React.FC<{ textxs?: boolean }> = ({ textxs }) => (
  <div className="bg-white sm:bg-(--div-active) sm:p-6 rounded-2xl py-1 px-4 pb-5 lg:mx-6">
    <h2 className={`${textxs ? "text-base" : "text-xl"} font-bold mb-2 sm:text-5 lg:text-[1.75vw]`}>Safety tips</h2>
    <p className="text-gray-500 mb-3 py-1 px-2 rounded-2xl text-xs bg-(--div-active) sm:bg-white sm:text-4 lg:text-[0.9vw]">
      Follow this tips and report any suspicious activity.
    </p>
    <ol className={`list-disc ml-5 marker:text-black space-y-2 font-medium ${textxs ? "text-[11px]" : "text-sm"} sm:text-4 lg:text-[1.125vw]`}>
      <li>Check the item carefully and ask relevant questions.</li>
      <li>Payment for item is made upon delivery or Pickup.</li>
      <li>Do not make payment for item or for delivery in advance.</li>
      <li>Report any ad or user seems fake, misleading, right away.</li>
      <li>For self-pickup, always meet in well-lit, busy, public places.</li>
    </ol>
  </div>
);

export default React.memo(SafetyTips);
