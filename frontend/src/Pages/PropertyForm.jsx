import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Upload, Plus } from 'lucide-react';
import { perks } from '../data/perks';
import axios from 'axios';

function PropertyForm() {
  const [formData, setFormData] = useState({
    title: '',
    hostName: '',
    address: '',
    location: '',
    selfcheckin: '',
    wifi: { password: '', username: '' },
    contacts: [{ name: '', info: '' }],
    perks: [],
    quickResponse: [{ icon: '', description: '', number: '' }],
    foodAndDrinks: [{ tag: '', title: '', img: '', location: '', description: '' }],
    houseRules: [],
    faqs: [],
    info: '',
    kitchenItems: [],
    appliancesItems: [],
    perkInfo: {},
    imageDescriptions: [], // Separate array for image descriptions
  });

  const [imageFiles, setImageFiles] = useState([]); // Separate state for image files
  const [imagePreviews, setImagePreviews] = useState([]); // State for preview URLs

  const [newHouseRule, setNewHouseRule] = useState(''); // For the heading
  const [newRule, setNewRule] = useState({}); // For individual rules under each heading
  const [newFaq, setNewFaq] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleObjectArrayChange = (index, field, subField, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? { ...item, [subField]: value } : item)
    }));
  };

  const handleChangeWifi = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
        ...prev,
        wifi: {
            ...prev.wifi,
            [name]: value,
        },
    }));
};
  const handleImageFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);

      // Add new files to imageFiles array
      setImageFiles(prev => [...prev, ...files]);

      // Create preview URLs for new files
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);

      // Add empty descriptions for new images
      setFormData(prev => ({
        ...prev,
        imageDescriptions: [...prev.imageDescriptions, ...files.map(() => '')]
      }));
    }
  };

  const handleImageDescriptionChange = (index, description) => {
    setFormData(prev => ({
      ...prev,
      imageDescriptions: prev.imageDescriptions.map((desc, i) =>
        i === index ? description : desc
      )
    }));
  };

  const removeImage = (index) => {
    // Revoke the preview URL to free up memory
    URL.revokeObjectURL(imagePreviews[index]);

    // Remove the image file, preview, and description
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      imageDescriptions: prev.imageDescriptions.filter((_, i) => i !== index)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], field === 'quickResponse' ? { icon: '', description: '', number: '' } :
        field === 'foodAndDrinks' ? { tag: '', title: '', img: '', location: '' } :
          field === 'contacts' ? { name: '', info: '' } : '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const togglePerk = (perkName) => {
    setFormData((prev) => ({
      ...prev,
      perks: prev.perks.includes(perkName)
        ? prev.perks.filter((p) => p !== perkName)
        : [...prev.perks, perkName],
    }));
  };

  const handlePerkInfoChange = (perkName, value) => {
    setFormData(prev => ({
      ...prev,
      perkInfo: {
        ...prev.perkInfo,
        [perkName]: value
      }
    }));
  };

  const handleSubItemChange = (field, value) => {
    setFormData((prev) => {
      const currentItems = prev[field];
      if (currentItems.includes(value)) {
        return {
          ...prev,
          [field]: currentItems.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [field]: [...currentItems, value]
        };
      }
    });
  };

  // const addHouseRule = () => {
  //   if (newHouseRule.trim()) {
  //     setFormData(prev => ({
  //       ...prev,
  //       houseRules: [...prev.houseRules, newHouseRule]
  //     }));
  //     setNewHouseRule('');
  //   }
  // };

  const addHouseRule = () => {
    if (newHouseRule.trim()) {
      setFormData(prev => ({
        ...prev,
        houseRules: [...prev.houseRules, { heading: newHouseRule, rules: [] }],
      }));
      setNewHouseRule('');
    }
  };

  const addRule = (headingIndex) => {
    const ruleText = newRule[headingIndex]?.trim();
    if (ruleText) {
      setFormData((prev) => {
        // Copy the houseRules array immutably
        const updatedHouseRules = prev.houseRules.map((item, index) =>
          index === headingIndex
            ? { ...item, rules: [...item.rules, ruleText] } // Add the new rule immutably
            : item
        );

        return { ...prev, houseRules: updatedHouseRules };
      });

      // Clear the input for the specific heading
      setNewRule((prev) => ({ ...prev, [headingIndex]: '' }));
    }
  };

  const removeRule = (headingIndex, ruleIndex) => {
    setFormData(prev => {
      const updatedHouseRules = [...prev.houseRules];
      updatedHouseRules[headingIndex].rules = updatedHouseRules[headingIndex].rules.filter(
        (_, i) => i !== ruleIndex
      );
      return { ...prev, houseRules: updatedHouseRules };
    });
  };
  const removeHouseRule = (index) => {
    setFormData(prev => ({
      ...prev,
      houseRules: prev.houseRules.filter((_, i) => i !== index),
    }));
  };



  // const removeHouseRule = (index) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     houseRules: prev.houseRules.filter((_, i) => i !== index)
  //   }));
  // };

  const addFaq = () => {
    if (newFaq.question?.trim() && newFaq.answer?.trim()) {
      setFormData(prev => ({
        ...prev,
        faqs: [...prev.faqs, newFaq]
      }));
      setNewFaq({ question: '', answer: '' });
    }
  };

  const removeFaq = (index) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Add basic form fields to the FormData
    formDataToSend.append('title', formData.title);
    formDataToSend.append('hostName', formData.hostName);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('info', formData.info);
    formDataToSend.append('selfcheckin', formData.selfcheckin);
    formDataToSend.append('wifi', JSON.stringify({
      username: formData.wifi.username,
      password: formData.wifi.password,
  }));

    // Append contacts array (each contact as an object)
    formData.contacts.forEach((contact, index) => {
      formDataToSend.append(`contacts[${index}][name]`, contact.name);
      formDataToSend.append(`contacts[${index}][info]`, contact.info);
    });

    // Append perks array
    formData.perks.forEach((perk, index) => {
      formDataToSend.append(`perks[${index}]`, perk);
    });

    // Append quickResponse array
    formData.quickResponse.forEach((qr, index) => {
      formDataToSend.append(`quickResponse[${index}][icon]`, qr.icon);
      formDataToSend.append(`quickResponse[${index}][description]`, qr.description);
      formDataToSend.append(`quickResponse[${index}][number]`, qr.number);
    });

    // Append foodAndDrinks array
    formData.foodAndDrinks.forEach((fd, index) => {
      formDataToSend.append(`foodAndDrinks[${index}][tag]`, fd.tag);
      formDataToSend.append(`foodAndDrinks[${index}][title]`, fd.title);
      formDataToSend.append(`foodAndDrinks[${index}][img]`, fd.img);
      formDataToSend.append(`foodAndDrinks[${index}][description]`, fd.description);
      formDataToSend.append(`foodAndDrinks[${index}][location]`, fd.location);
    });

    // house rules
    formData.houseRules.forEach((houseRule, index) => {
      // Append the heading
      formDataToSend.append(`houseRules[${index}][heading]`, houseRule.heading);

      // Append each rule under the `rules` array
      houseRule.rules.forEach((rule, ruleIndex) => {
        formDataToSend.append(`houseRules[${index}][rules][${ruleIndex}]`, rule);
      });
    });


    // Append faqs array
    formData.faqs.forEach((faq, index) => {
      formDataToSend.append(`faqs[${index}][question]`, faq.question);
      formDataToSend.append(`faqs[${index}][answer]`, faq.answer);
    });

    // Append kitchenItems array
    formData.kitchenItems.forEach((item, index) => {
      formDataToSend.append(`kitchenItems[${index}]`, item);
    });

    // Append appliancesItems array
    formData.appliancesItems.forEach((item, index) => {
      formDataToSend.append(`appliancesItems[${index}]`, item);
    });

    // Append perkInfo object (each key-value pair as a field)
    Object.keys(formData.perkInfo).forEach((key) => {
      formDataToSend.append(`perkInfo[${key}]`, formData.perkInfo[key]);
    });

    formData.imageDescriptions.forEach((item, index) => {
      formDataToSend.append(`imageDescriptions[${index}]`, item);
    });

    // Add images and their descriptions
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formDataToSend.append('images', file); // Append each image file
        // formDataToSend.append('imageDescriptions', formData.imageDescriptions[index] || ''); // Append corresponding description
      });
    } else {
      console.error("No images to upload.");
    }

    console.log("formData useState: " , formData);
    console.log("formDataToSend from Frontend: " ,formDataToSend);

    try {
      const response = await axios.post('http://localhost:3000/api/admin/property', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Property data submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting property data:', error);
    }
  };


  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  // Update the images section in the JSX
  return (
    <div className="w-full max-w-md md:max-w-max lg:max-w-max mx-auto bg-gray-100 rounded-lg shadow-lg p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="w-full  mx-auto bg-white rounded-lg border-2 shadow-md p-4 sm:p-6 lg:p-8">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-center text-gray-800">Create Property Listing</h1>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-full md:max-w-max lg:max-w-full mx-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-2xl font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300  focus:border-indigo-500 focus:ring-indigo-500 shadow-md"
              />
            </div>

            <div>
              <label className="block text-2xl font-medium text-gray-700">Host Name</label>
              <input
                type="text"
                value={formData.hostName}
                onChange={e => setFormData(prev => ({ ...prev, hostName: e.target.value }))}
                className="mt-1 block w-full border-b-4 border-black  rounded-md  shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-2xl font-medium text-gray-700">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-2xl font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-2xl font-medium text-gray-700">SelfCheckin Info</label>
              <input
                type="text"
                value={formData.selfcheckin}
                onChange={e => setFormData(prev => ({ ...prev, selfcheckin: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
            <label className="block text-2xl font-medium text-gray-700">Wifi</label>
            
            <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                    type="text"
                    name="username"
                    value={formData.wifi.username}
                    onChange={e=>setFormData(prev=>({...prev,wifi:{...prev.wifi,username:e.target.value}}))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.wifi.password}
                    onChange={e=>setFormData(prev=>({...prev,wifi:{...prev.wifi,password:e.target.value}}))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>
        </div>

          </div>

          {/* Updated Images Section */}
          <div>
            <label className="block text-2xl font-medium text-gray-700">Property Images</label>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                  id="image-upload"
                  multiple
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex items-center justify-center w-full h-10 px-4 py-2 text-2xl font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Images
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative space-y-2">
                    <div className="w-full h-48 bg-gray-200 rounded-md overflow-hidden">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Image description"
                      value={formData.imageDescriptions[index] || ''}
                      onChange={(e) => handleImageDescriptionChange(index, e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contacts Section */}
          <div>
            <label className="block text-2xl font-medium text-gray-700">Contacts</label>
            {formData.contacts.map((contact, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <input
                  value={contact.name}
                  onChange={(e) => handleObjectArrayChange(index, 'contacts', 'name', e.target.value)}
                  placeholder="Contact Name"
                  className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <input
                  value={contact.info}
                  onChange={(e) => handleObjectArrayChange(index, 'contacts', 'info', e.target.value)}
                  placeholder="Contact Info"
                  className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <button
                  type="button"
                  className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  onClick={() => removeArrayItem('contacts', index)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('contacts')}
              className="mt-2 flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Contact
            </button>
          </div>

          {/* Perks Section */}
          <div>
            <label className="block text-2xl font-medium text-gray-700">Perks</label>
            <div className="grid grid-cols-4 gap-4 mt-2">
              {perks.map((perk) => (
                <div key={perk.name} className="relative">
                  <label className="flex flex-col items-center space-y-1  cursor-pointer group">
                    <input
                      type="checkbox"
                      className="form-checkbox text-blue-500"
                      checked={formData.perks.includes(perk.name)}
                      onChange={() => togglePerk(perk.name)}
                    />
                    <span>{perk.icon}</span>
                    <span className="text-xs text-center">{perk.name}</span>
                  </label>
                  {formData.perks.includes(perk.name) && (
                    <textarea
                      className="mt-2 ml-4 mr-4 max-w-md border-2  rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      placeholder={`${perk.name} details`}
                      value={formData.perkInfo[perk.name] || ''}
                      onChange={(e) => handlePerkInfoChange(perk.name, e.target.value)}
                    />
                  )}
                  {(perk.name === 'Kitchen' || perk.name === 'Appliances') && formData.perks.includes(perk.name) && (
                    <div className="mt-2">
                      <select
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        onChange={(e) => handleSubItemChange(perk.name.toLowerCase() + 'Items', e.target.value)}
                      >
                        <option value="">Select items</option>
                        {perk.subItems?.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                      <div className="mt-2">
                        {formData[perk.name.toLowerCase() + 'Items'].map((item) => (
                          <span key={item} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-2xl font-semibold text-gray-700 mr-2 mb-2">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Response Section */}
          <div>
            <label className="block text-2xl font-medium text-gray-700">Quick Response</label>
            {formData.quickResponse.map((response, index) => (
              <div key={index} className="mt-2 p-4 bg-gray-50 rounded-md">
                <div className="space-y-2">
                  <input
                    value={response.icon}
                    onChange={(e) => handleObjectArrayChange(index, 'quickResponse', 'icon', e.target.value)}
                    placeholder="Icon/Image URL"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <input
                    value={response.description}
                    onChange={(e) => handleObjectArrayChange(index, 'quickResponse', 'description', e.target.value)}
                    placeholder="Description"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <input
                    value={response.number}
                    onChange={(e) => handleObjectArrayChange(index, 'quickResponse', 'number', e.target.value)}
                    placeholder="Number"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('quickResponse', index)}
                    className="mt-2 w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('quickResponse')}
              className="mt-2 flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Quick Response
            </button>
          </div>

          {/* Food & Drinks Section */}
          <div>
            <label className="block text-2xl font-medium text-gray-700">Food & Drinks</label>
            {formData.foodAndDrinks.map((item, index) => (
              <div key={index} className="mt-2 p-4 bg-gray-50 rounded-md">
                <div className="space-y-2">
                  <input
                    value={item.tag}
                    onChange={(e) => handleObjectArrayChange(index, 'foodAndDrinks', 'tag', e.target.value)}
                    placeholder="Tag"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <input
                    value={item.title}
                    onChange={(e) => handleObjectArrayChange(index, 'foodAndDrinks', 'title', e.target.value)}
                    placeholder="Title"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <input
                    value={item.img}
                    onChange={(e) => handleObjectArrayChange(index, 'foodAndDrinks', 'img', e.target.value)}
                    placeholder="Image URL"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <input
                    value={item.location}
                    onChange={(e) => handleObjectArrayChange(index, 'foodAndDrinks', 'location', e.target.value)}
                    placeholder="Location"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <input
                    value={item.description}
                    onChange={(e) => handleObjectArrayChange(index, 'foodAndDrinks', 'description', e.target.value)}
                    placeholder="Description"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('foodAndDrinks', index)}
                    className="mt-2 w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('foodAndDrinks')}
              className="mt-2 flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Food & Drink
            </button>
          </div>

          {/* House Rules Section */}
          <div>
            <label className="block text-2xl font-medium text-gray-700">House Rules</label>
            <div className="space-y-4">
              {/* Input for adding a new heading */}
              <div className="flex   space-x-2">
                <input
                  type="text"
                  value={newHouseRule}
                  onChange={(e) => setNewHouseRule(e.target.value)}
                  placeholder="Add a heading"
                  className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <button
                  type="button"
                  onClick={addHouseRule}
                  className="px-4 py-2 flex  items-center bg-green-500  gap-1 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                  <PlusCircle className='w-4 h-4 flex items-center justify-center mr-2' /> Add Heading
                </button>
              </div>

              {/* Display headings and their rules */}
              {formData.houseRules.map((section, headingIndex) => (
                <div key={headingIndex} className="p-4 bg-white shadow-lg rounded-md space-y-2">
                  {/* Heading Title */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{section.heading}</span>
                    <button
                      type="button"
                      onClick={() => removeHouseRule(headingIndex)}
                      className="p-1 text-red-500 hover:text-red-600"
                    >
                      <Plus className='rotate-45' />
                    </button>
                  </div>

                  {/* Input for adding rules under the heading */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newRule[headingIndex] || ""}
                      onChange={(e) =>
                        setNewRule((prev) => ({ ...prev, [headingIndex]: e.target.value }))
                      }
                      placeholder="Add a rule"
                      className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => addRule(headingIndex)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      Add Rule
                    </button>
                  </div>

                  {/* Display list of rules */}
                  {section.rules.map((rule, ruleIndex) => (
                    <div key={ruleIndex} className="flex items-center justify-between p-2 bg-white rounded-md">
                      <span>{rule}</span>
                      <button
                        type="button"
                        onClick={() => removeRule(headingIndex, ruleIndex)}
                        className="p-1 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {/* FAQs Section */}
          <div className='flex flex-col '>
            <label className="block text-2xl font-medium text-gray-700">FAQs</label>
            <div className="space-y-2">
              <div className="md:flex flex-col gap-2 shadow-md p-4 bg-gray-50 rounded-md">
                <input
                  type="text"
                  value={newFaq.question || ''}
                  onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="Add a FAQ question"
                  className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <input
                  type="text"
                  value={newFaq.answer || ''}
                  onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                  placeholder="Add a FAQ answer"
                  className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <button
                  type="button"
                  onClick={addFaq}
                  className="px-4 py-2  flex  gap-2 items-center bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 max-w-max"
                >
                  <PlusCircle className="h-4 w-4  " /> Add FAQ
                </button>
              </div>
              {formData.faqs.map((faq, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div>
                    <span className="font-semibold">Q: {faq.question}</span><br />
                    <span>A: {faq.answer}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="p-1 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info Section */}
          <div>
            <label htmlFor="info" className="block text-2xl font-medium text-gray-700">Additional Info</label>
            <textarea
              id="info"
              name="info"
              value={formData.info}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create Property
          </button>
        </form>
      </div>
    </div>
  )
}

export default PropertyForm;
