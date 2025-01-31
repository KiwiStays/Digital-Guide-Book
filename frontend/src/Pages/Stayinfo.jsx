import React, { useContext, useState } from 'react'
import { AuthContext } from '../Context/Authcontext';
import { perks } from '../data/perks';
import { QuickResponseItems } from '../data/quickresponse';
import { AiFillHome } from 'react-icons/ai';
import { Home, X } from 'lucide-react';

const getIconFromImport = (description) => {
  const matchedItem = QuickResponseItems.find(
    item => item.name.toLowerCase() === description.toLowerCase()
  );
  return matchedItem ? matchedItem.url : null; // Use `url` instead of `icon`
};


const InfoCard = ({ description, number,isOpen, setIsOpen }) => {
  const importedIcon = getIconFromImport(description);

  return (
    <div className="relative">
      <div className="flex flex-col items-center" onClick={() => setIsOpen(!isOpen)}>
        {importedIcon && (
          <div className="w-12 h-12 md:w-32 md:h-32 rounded-full overflow-hidden">
                <img
              // Render the image from the URL
                      src={importedIcon}
                      alt={description}
                      className="w-full h-full object-cover"
                    />
                    </div>
                  )}
                  <p className="mt-2 text-sm font-medium text-green-600">{description}</p>
                  </div>

                  {isOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-auto overflow-hidden animate-fadeIn">
                    <div className="flex justify-between items-center bg-primarybg px-6 py-4">
                      <h3 className="text-xl font-semibold text-green-900">{description}</h3>
                      <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-gray-800">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="text-gray-700 font-semibold text-center">
                      <p className="text-2xl text-red-600 mb-2">{number}</p>
                      <p>{description}</p>
                      </div>
                    </div>
                    </div>
                  </div>
                  )}
                </div>
                );
              };

// const InfoCard = ({ description, number, icon }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="relative">
//       <div className="flex flex-col items-center">
//         <img
//           src={icon}
//           alt={description}
//           className="w-24 h-24 cursor-pointer hover:opacity-90 transition-all duration-300 transform hover:scale-105"
//           onClick={() => setIsOpen(true)}
//         />
//         {isOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-auto overflow-hidden animate-fadeIn">
//               <div className="flex justify-between items-center bg-primarybg px-6 py-4">
//                 <h3 className="text-xl font-semibold text-green-900">{description}</h3>
//                 <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-gray-800">
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
//               <div className="p-6">
//                 <div className="text-gray-700 font-semibold text-center">
//                   <p className="text-2xl text-red-600 mb-2">{number}</p>
//                   <p>{description}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

const formatArrayContent = (items) => {
  if (!items || !Array.isArray(items)) return '';
  return items.map(item => `• ${item}`).join('\n');
};

const PerkCard = ({ name, icon, content, items, isOpen, setIsOpen }) => {
  const displayContent = items ? formatArrayContent(items) : content;

  return (
    <div className="relative">
      <div className="flex flex-col items-center justify-center p-4 hover:border-green-40000 rounded-lg cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}>
        <div className="w-12 h-12 md:w-32 md:h-32 border-2 border-black rounded-full text-green-900 flex  items-center justify-center ">
          {icon}
        </div>
        <p className="mt-2 text-sm font-medium text-green-600  flex  text-center ">{name}</p>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-auto">
            <div className="flex justify-between items-center bg-primarybg px-6 py-4">
              <h3 className="text-xl font-semibold text-green-900 ">{name}</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-gray-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="text-gray-700 whitespace-pre-line">
                {displayContent.split('\n').map((line, index) => {
                  const parts = line.split(':');
                  if (parts.length === 1) {
                    // No colon found
                    return <p key={index}>{line}</p>;
                  } else {
                    const [highlighted, ...rest] = parts;
                    return (
                      <p key={index}>
                        <span className="font-semibold text-green-900">{highlighted}</span> {rest.join(':')}
                      </p>
                    );
                  }
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FoodCard = ({ title, description, img, location, tag }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <img
      src={img}
      alt={title}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold text-green-900">{title}</h3>
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
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


const FoodAndDrinksSection = ({ foodAndDrinks }) => {
  const [selectedTag, setSelectedTag] = useState(null);

  // Group items by tag
  const groupedByTag = foodAndDrinks.reduce((acc, item) => {
    const tag = item.tag;
    if (!acc[tag]) {
      acc[tag] = [];
    }
    acc[tag].push(item);
    return acc;
  }, {});

  return (
    <section className="p-4 md:p-8 md:flex md:flex-col md:items-center md:w-full">
      <h2 className="text-2xl font-semibold text-green-900 mb-6">Food & Drinks Nearby</h2>

      {/* Tags */}
      <div className="flex gap-4 mb-8">
        {Object.keys(groupedByTag).map((tag) => (
          <button
          key={tag}
          onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
          className={`px-4 py-2 rounded-full transition-all duration-300 ${
            selectedTag === tag
              ? 'bg-green-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
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
    </section>
  );
};
const HouseTourCard = ({ images }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Debug to see if images is populated
  // console.log('HouseTourCard images:', images);

  // Render a card anyway, even if images is empty, so it’s always visible
  return (
    <div className="my-4">
      <div
        onClick={() => {
          if (images?.length) setIsOpen(true);
        }}
        className="cursor-pointer flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition"
      >
        <Home className="text-green-800" size={24} />
        <span className="font-semibold text-green-800">House Tour</span>
      </div>

      {/* Modal only if there are images */}
      {images?.length > 0 && isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-lg overflow-y-auto max-h-[90vh] relative">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-700 hover:text-gray-900"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-6">
              <h2 className="text-xl font-bold text-green-900 mb-4">House Tour</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {images.map((img) => (
                  <div key={img._id} className="border rounded-md overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.description}
                      className="w-full h-auto object-cover"
                    />
                    {img.description && (
                      <p className="p-2 text-gray-600 text-sm">{img.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// const PerkCard = ({ name, icon, content, isOpen, setIsOpen }) => {
//   return (
//     <div className="relative">
//       <div className="flex flex-col items-center jus p-4 hover:bg-gray-50 rounded-lg cursor-pointer"
//            onClick={() => setIsOpen(!isOpen)}>
//         <div className="w-12 h-12 md:w-16 md:h-16 text-green-900 flex items-center justify-center  rounded-full">
//           {icon} {/* SVG icon will render directly */}
//         </div>
//         <p className="mt-2 text-sm font-medium text-gray-600">{name}</p>
//       </div>

//       {isOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-auto">
//             <div className="flex justify-between items-center bg-primarybg px-6 py-4">
//               <h3 className="text-xl font-semibold text-green-900">{name}</h3>
//               <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-gray-800">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//             <div className="p-6">
//               <div className="text-gray-700 whitespace-pre-line">{content}</div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
const Stayinfo = () => {
  const { propertyData } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  // console.log("perk info",propertyData.data.perkInfo);
  const quickResponse = propertyData?.data?.quickResponse || [];
  const perkInfo = propertyData?.data?.perkInfo || {};
  const foodAndDrinks = propertyData?.data?.foodAndDrinks || [];
  const [openModals, setOpenModals] = useState({});



  const getPerkContent = (perkName, perkInfo) => {
    switch (perkName.toLowerCase()) {
      case 'kitchen':
        return { content: perkInfo[perkName], items: propertyData?.data?.kitchenItems };
      case 'appliances':
        return { content: perkInfo[perkName], items: propertyData?.data?.appliancesItems };
      default:
        return { content: perkInfo[perkName] };
    }
  };



  
  return (
    <main className="">
     { /* quick response */}
        <section className="p-4 md:flex md:flex-col md:items-center md:w-full">
          <h1 className="text-2xl font-semibold text-green-900 mb-6">Quick Resources</h1>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quickResponse.map(item => {
          
          return (
            <InfoCard
              key={item._id}
              description={item.description}
              number={item.number}
              isOpen={openModals[item.description] || false}
              setIsOpen={() => setOpenModals((prev) => ({
                ...prev,
                [item.description]: !prev[item.description],
              }))}
            />
          );
            })}
          </div>
        </section>

         {/* House Tour Card */}
       <section className="p-4 md:flex md:flex-col md:items-center">
        <HouseTourCard images={propertyData?.data?.images} />
      </section>


      {/* perks section */}
      <section className="p-4 md:flex md:flex-col md:items-center">
  <h2 className="text-2xl font-semibold text-green-900 mb-6">Available Amenities</h2>
  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
    {perks.map((perk) => {
      const apiKey = Object.keys(perkInfo).find(
        key => key.toLowerCase() === perk.name.toLowerCase()
      );

      if (apiKey) {
        const { content, items } = getPerkContent(perk.name, perkInfo);
        return (
          <PerkCard
            key={perk.name}
            name={perk.name}
            icon={perk.icon}
            content={content}
            items={items}
            isOpen={openModals[perk.name] || false}
            setIsOpen={() => {
              setOpenModals((prev) => ({
                ...prev,
                [perk.name]: !prev[perk.name],
              }));
            }}
          />
        );
      }
      return null;
    })}
  </div>
</section>
      {/* food and drinks */}
      {/* <section className="p-4 md:p-8">
        <h2 className="text-2xl font-semibold text-green-900 mb-6">Food & Drinks Nearby</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foodAndDrinks.map((item) => (
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
      </section> */}

      <FoodAndDrinksSection foodAndDrinks={foodAndDrinks} />


    </main>
  )
}

export default Stayinfo