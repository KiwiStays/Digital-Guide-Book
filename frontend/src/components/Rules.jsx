import React, { useState } from 'react'

const Rules = ({houseRules}) => {
    const [selectedRuleIndex, setSelectedRuleIndex] = useState(0);
  return (
    <div className="p-6 font-sans mt-10 md:flex  md:gap-40  md:items-center md:justify-start md:w-full md:pl-20 md:h-full  ">
      {/* Headings Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6  md:flex md:flex-col md:gap-4">
        {houseRules.map((rule, index) => (
          <button
            key={rule._id}
            onClick={() => setSelectedRuleIndex(index)}
            className={`p-3 md:text-left  text-center rounded-lg font-medium md:font-bold md:text-5xl  cursor-pointer ${
              selectedRuleIndex === index
                ? " text-green-800 md:text-4xl text-3xl  font-bold shadow-green-500  "
                : " text-gray-300  md:text-3xl  text-2xl hover:text-green-900 "
            }`}
          >
            {rule.heading}
          </button>
        ))}
      </div>

      {/* Rules Content */}
      <div className="p-4  text-green-900  md:w-md md:text-2xl ">
        <h3 className="text-lg font-bold mb-2">
          {houseRules[selectedRuleIndex].heading}
        </h3>
        <ul className="list-disc md:list-none list-inside space-y-4 ">
          {houseRules[selectedRuleIndex].rules.map((rule, index) => {
            const [highlighted, rest] = rule.split(":"); // Split into two parts
            return (
              <li key={index}>
                <span className="font-bold md:text-3xl">{highlighted}:</span>{" "}
                <span className=''>{rest}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  )
}

export default Rules