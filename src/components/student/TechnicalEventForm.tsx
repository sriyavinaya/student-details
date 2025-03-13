
import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TechnicalEvent } from './TechnicalEventsTable';

interface TechnicalEventFormProps {
  event?: TechnicalEvent;
  onClose: () => void;
  onSave: (event: Partial<TechnicalEvent>) => void;
}

// In a real app, these would be fetched from a database or API
// which would be updated when admins edit fields
const categoryOptions = [
  'Hackathon',
  'Workshop',
  'Competitions',
  'Technical fest - Tathva',
  'Technical fest of other colleges',
  'Other'
];

const statusOptions = [
  'Pending',
  'Ongoing',
  'Completed'
];

const TechnicalEventForm = ({ event, onClose, onSave }: TechnicalEventFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<TechnicalEvent>>({
    name: '',
    date: '',
    host: '',
    category: '',
    achievement: '',
    status: 'Pending'
  });

  useEffect(() => {
    if (event) {
      setFormData(event);
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.host || !formData.category || !formData.date) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    onSave(formData);
    toast({
      title: "Success",
      description: "Event details saved successfully"
    });
  };

  const handleDiscard = () => {
    onClose();
    toast({
      title: "Discarded",
      description: "Changes were discarded"
    });
  };

  return (
    <div className="bg-gray-200 rounded-lg p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block">
              <span className="text-gray-700">
                <span className="text-red-500">*</span> Event Name
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="Enter a value"
              />
            </label>
          </div>

          <div className="space-y-2">
            <label className="block">
              <span className="text-gray-700">
                <span className="text-red-500">*</span> Host of the event
              </span>
              <input
                type="text"
                name="host"
                value={formData.host}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="Enter a value"
              />
            </label>
          </div>

          <div className="space-y-2">
            <label className="block">
              <span className="text-gray-700">
                <span className="text-red-500">*</span> Category
              </span>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select a value</option>
                {categoryOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="space-y-2">
            <label className="block">
              <span className="text-gray-700">Achievement</span>
              <input
                type="text"
                name="achievement"
                value={formData.achievement}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="Enter a value"
              />
            </label>
          </div>

          <div className="space-y-2">
            <label className="block">
              <span className="text-gray-700">
                <span className="text-red-500">*</span> Date
              </span>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </label>
          </div>

          {/* <div className="space-y-2">
            <label className="block">
              <span className="text-gray-700">Status</span>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          </div> */}
        </div>

        <div className="mt-6">
          <button
            type="button"
            className="inline-flex items-center space-x-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-md shadow-sm"
          >
            <Upload size={16} />
            <span>UPLOAD</span>
          </button>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleDiscard}
            className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 bg-white hover:bg-gray-50"
          >
            DISCARD
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
          >
            SAVE
          </button>
        </div>
      </form>
    </div>
  );
};

export default TechnicalEventForm;
