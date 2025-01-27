import React, { useContext } from 'react'
import { AuthContext } from '../Context/Authcontext';
import { ContactsList } from '../data/Contactlist';

const getIconFromList = (name) => {
  const contact = ContactsList.find(item => 
    item.name.toLowerCase() === name.toLowerCase()
  );
  return contact ? contact.url : null;
};

const ContactCard = ({ name, info }) => {
  const imageUrl = getIconFromList(name);

  return (
    <a href={`tel:${info}`} className="flex flex-col items-center">
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="mt-2 text-lg font-medium text-green-900">{name}</h3>
    </a>
  );
};
  
  const Contacts = () => {
    const { propertyData } = useContext(AuthContext);
    const contacts = propertyData?.data?.contacts || [];
  
    return (
      <div className="p-6 max-w-4xl mx-auto ">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {contacts.map((contact) => (
            <ContactCard 
              key={contact._id}
              name={contact.name}
              info={contact.info}
            />
          ))}
        </div>
      </div>
    );
  };
  
  export default Contacts;