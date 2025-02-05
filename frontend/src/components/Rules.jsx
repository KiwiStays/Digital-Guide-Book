import React, { useState } from 'react'

const Rules = ({houseRules}) => {
    const [selectedRuleIndex, setSelectedRuleIndex] = useState(0);
  return (
    <div className="px-6 font-sans mt-10 flex flex-col items-center justify-center  md:flex-row gap-6 md:gap-40 md:items-center md:justify-start md:w-full md:pl-20 md:h-full overflow-x-hidden">
    {/* Headings Grid (Fixed Height) */}
    <div className="grid grid-cols-2 gap-4 md:flex md:flex-col md:gap-4 w-full md:w-[300px] items-center justify-center">
      {houseRules.map((rule, index) => (
        <button
          key={rule._id}
          onClick={() => setSelectedRuleIndex(index)}
          className={`p-3 text-center md:text-left rounded-lg font-medium cursor-pointer transition-all duration-300
            ${selectedRuleIndex === index 
              ? "text-primarytext font-bold shadow-green-500" 
              : "text-gray-500 hover:text-primarytext"} 
            text-xl md:text-3xl`}
        >
          {rule.heading}
        </button>
      ))}
    </div>
  
    {/* Rules Content (Fixed Height + Scroll for Large Content) */}
    <div className=" text-primarytext  border-gray-300 rounded-lg shadow-lg bg-white w-[300px] md:w-full h-[350px] overflow-y-auto">
      <h3 className="text-xl font-bold mb-2 text-center">
        {houseRules[selectedRuleIndex].heading}
      </h3>
      <ul className="list-disc md:list-none list-inside space-y-2 px-4">
        {houseRules[selectedRuleIndex].rules.map((rule, index) => {
          const [highlighted, rest] = rule.split(":"); // Split into two parts
          return (
            <li key={index} className="flex gap-1 px-2">
              <span className="font-medium">{highlighted}:</span>
              <span className="font-thin">{rest}</span>
            </li>
          );
        })}
      </ul>
    </div>
  </div>
  
  )
}

export default Rules