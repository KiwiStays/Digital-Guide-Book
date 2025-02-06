import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../Context/Authcontext';

const FoodCard = ({ title, description, img, location, tag }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <img
      src={img}
      alt={title}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold text-primarytext">{title}</h3>
        <span className="px-2 py-1 bg-red-100 text-primarytext rounded-full text-sm">
          {tag}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <a
        href={location}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        View on Maps
      </a>
    </div>
  </div>
);


const Nearby = () => {
  const [selectedTag, setSelectedTag] = useState(null);
  const { propertyData } = useContext(AuthContext);
  const foodAndDrinks = propertyData?.data?.foodAndDrinks || [];

  // Group items by tag
  const groupedByTag = foodAndDrinks.reduce((acc, item) => {
    const tag = item.tag;
    if (!acc[tag]) {
      acc[tag] = [];
    }
    acc[tag].push(item);
    return acc;
  }, {});

  useEffect(() => {
    const firstTag = Object.keys(groupedByTag)[0];
    setSelectedTag(firstTag);
  }, []);

  return (
    <section className="p-4 md:p-8 md:flex md:flex-col md:items-center md:w-full">
      <h2 className="text-2xl font-semibold text-primarytext mb-6">Our Recomendations</h2>

      {/* Tags */}
      <div className="flex gap-4 mb-8 w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
        {Object.keys(groupedByTag).map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            className={`px-4 py-2 rounded-full transition-all duration-300 flex-shrink-0
        ${selectedTag === tag
                ? 'bg-primarytext text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {tag} ({groupedByTag[tag].length})
          </button>
        ))}
      </div>



      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedTag &&
          groupedByTag[selectedTag].map((item) => (
            <FoodCard
              key={item._id}
              title={item.title}
              description={item.description}
              img={item.img}
              location={item.location}
              tag={item.tag}
            />
          ))}
      </div>
    </section>);
}

export default Nearby