import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';

import { useStateContext } from '../context';
import { money, add, remove } from '../assets';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';

function CreateCampaign() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign } = useStateContext();
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    deadline: '',
    mileStones: [{ name: '', funds: '' }],
    category: '',
    image: ''
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleMilestoneChange = (fieldName, e, index) => {
    const newMileStones = form.mileStones.map((milestone, i) => {
      if (i === index) {
        return { ...milestone, [fieldName]: e.target.value };
      }
      return milestone;
    });
    setForm({ ...form, mileStones: newMileStones });
  }

  const handleAddMilestone = () => {
    setForm({ ...form, mileStones: [...form.mileStones, { name: '', funds: '' }] });
  };

  const handleRemoveMilestone = (index) => {
    const newMileStones = form.mileStones.filter((_, i) => i !== index);
    if (newMileStones.length > 0) {
      setForm({ ...form, mileStones: newMileStones });
    } else {
      toast.error('Atleast one milestone required');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true);
        await createCampaign({ ...form });
        setIsLoading(false);
        navigate('/');
      } else {
        toast.error('Provide valid image URL');
        setForm({ ...form, image: '' });
      }
    });
  };

  return (
    <div className='bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4'>
      {isLoading && <Loader />}
      <Toaster position="bottom-center" />
      <div className='flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]'>
        <h1 className='font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white'>Start a Campaign</h1>
      </div>

      <form onSubmit={handleSubmit} className='w-full mt-[65px] flex flex-col gap-[30px]'>
        <div className='flex md:flex-nowrap flex-wrap gap-[40px]'>
          <FormField
            labelName="Your Name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange('name', e)}
          />
          <FormField
            labelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange('title', e)}
          />
        </div>

        <FormField
          labelName="Story *"
          placeholder="Write your story"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange('description', e)}
        />

        <div className='w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]'>
          <img src={money} alt='money' className='w-[40px] h-[40px] object-contain' />
          <h4 className='font-epilogue font-bold text-[25px] text-white ml-[20px]'>You will get 100% of the raised amount</h4>
        </div>

        {form.mileStones.map((milestone, index) => (
          <div key={index} className='flex flex-wrap md:flex-nowrap gap-[25px] items-center'>
            <FormField
              labelName="Milestone Description *"
              placeholder="Enter a milestone description"
              inputType="text"
              value={milestone.name}
              handleChange={(e) => handleMilestoneChange('name', e, index)}
            />
            <FormField
              labelName="Milestone Funds *"
              placeholder="ETH 0.50"
              inputType="text"
              value={milestone.funds}
              handleChange={(e) => handleMilestoneChange('funds', e, index)}
            />
            <span
              className={`w-[36px] h-[36px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer mt-[12px]`}
              onClick={() => handleRemoveMilestone(index)}
            >
              <img src={remove} alt='remove_logo' className='w-1/2 h-1/2' />
            </span>
          </div>
        ))}

        <div
          className='w-[48px] h-[48px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer mb-4'
          onClick={handleAddMilestone}
        >
          <img src={add} alt='add_logo' className='w-1/2 h-1/2' />
        </div>

        <div className='flex flex-wrap md:flex-nowrap gap-[40px]'>
          <FormField
            labelName="End Date *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange('deadline', e)}
          />
          <FormField
            labelName="Campaign Category *"
            placeholder="Select a category"
            inputType="select"
            value={form.category}
            handleChange={(e) => handleFormFieldChange('category', e)}
            options={[
              { value: '', label: 'Select a category' },
              { value: 'Art', label: 'Art' },
              { value: 'Technology', label: 'Technology' },
              { value: 'Social Cause', label: 'Social Cause' },
              { value: 'Others', label: 'Others' },
            ]}
          />
        </div>
        <FormField
          labelName="Campaign image *"
          placeholder="Place image URL of your campaign"
          inputType="url"
          value={form.image}
          handleChange={(e) => handleFormFieldChange('image', e)}
        />

        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton
            btnType="submit"
            title="Submit new campaign"
            styles="bg-[#1dc071]"
          />
        </div>
      </form>
    </div>
  );
}

export default CreateCampaign;
