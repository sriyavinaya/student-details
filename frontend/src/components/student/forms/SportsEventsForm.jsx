import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const categoryOptions = [
    'Athletics',
    'Badminton',
    'Basketball',
    'Cricket',
    'Football',
    'Hockey',
    'Table Tennis',
    'Tennis',
    'Volleyball',
    'Other'
];

const eventLevelOptions = [
    'Intra-College',
    'Inter-College',
    'State',
    'National',
    'International'
];

const roleOptions = [
    'Player',
    'Captain',
    'Vice-Captain',
    'Manager',
    'Coach',
    'Other'
];

const outcomeOptions = [
    'Winner',
    'Runner-Up',
    'Semi-Finalist',
    'Quarter-Finalist',
    'Participant',
    'Other'
];

const SportsEventsForm = ({ event, onClose, onSave, refreshTable }) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        title: '',
        eventDate: '',
        host: '',
        category: '',
        achievement: '',
        eventLevel: '',
        role: '',
        outcome: '',
        description: '',
        documentPath: null,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const userToken = JSON.parse(localStorage.getItem("user"));
    const userId = userToken ? userToken.id : null;

    useEffect(() => {
        if (event) {
            setFormData(event);
        }
    }, [event]);

    const validateDate = (dateString) => {
        if (!dateString) return false;
        
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        if (!datePattern.test(dateString)) return false;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const inputDate = new Date(dateString);
        
        return inputDate <= today;
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Event name is required';
        if (!formData.host.trim()) newErrors.host = 'Host is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.eventLevel) newErrors.eventLevel = 'Event level is required';
        if (!formData.role) newErrors.role = 'Role is required';
        if (!formData.outcome) newErrors.outcome = 'Outcome is required';
        if (!formData.eventDate) {
            newErrors.eventDate = 'Date is required';
        } else if (!validateDate(formData.eventDate)) {
            newErrors.eventDate = 'Date must be in YYYY-MM-DD format and cannot be in the future';
        }
        if (!formData.achievement.trim()) newErrors.achievement = 'Achievement is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, documentPath: e.target.files[0] }));
    };

    const uploadProofDocument = async () => {
        if (!formData.documentPath) return null;

        const fileData = new FormData();
        fileData.append('file', formData.documentPath); // Field name must be "file"

        try {
            const response = await axios.post(
                'http://localhost:8080/api/main/upload',
                fileData,
                {
                    withCredentials: true, // Include credentials (cookies)
                    headers: {
                        'Content-Type': 'multipart/form-data', // Set content type
                    },
                }
            );

            if (response.status !== 200) throw new Error('Upload failed');
            const documentLink = response.data; // Backend returns the file path
         

            // console.log(documentLink);
         

            return documentLink;
        } catch (error) {
            toast({
                title: 'Upload Failed',
                description: 'Error uploading the file.',
                variant: 'destructive',
            });
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!userId) {
            toast({
                title: 'Error',
                description: 'No student ID found. Please log in again.',
                variant: 'destructive',
            });
            return;
        }

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // let documentLink = await uploadProofDocument();

            const formDataToSend = new FormData();
            formDataToSend.append('studentId', userId);
            formDataToSend.append('title', formData.title);
            formDataToSend.append('eventDate', formData.eventDate);
            formDataToSend.append('host', formData.host);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('achievement', formData.achievement);
            formDataToSend.append('eventLevel', formData.eventLevel);
            formDataToSend.append('role', formData.role);
            formDataToSend.append('outcome', formData.outcome);
            formDataToSend.append('description', formData.description);
            if (formData.documentPath) {
                formDataToSend.append('documentPath', formData.documentPath); // File field
            }

            const response = await axios.post(
                'http://localhost:8080/api/sports/submit',
                formDataToSend,
                { 
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            toast({
                title: 'Success',
                description: 'Sports event saved successfully!',
            });

            onClose();
            refreshTable();

        } catch (error) {
            console.error('Submission error:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to save sports event',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDiscard = () => {
        onClose();
        toast({
            title: 'Discarded',
            description: 'Changes were discarded.',
        });
    };

    return (
        <div className="bg-gray-200 rounded-lg p-6 mb-6">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Event Name
                        </span>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.title ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                    </label>

                    <label className="block">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Host
                        </span>
                        <input
                            type="text"
                            name="host"
                            value={formData.host}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.host ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                        />
                        {errors.host && <p className="mt-1 text-sm text-red-600">{errors.host}</p>}
                    </label>

                    <label className="block">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Sport Category
                        </span>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.category ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                        >
                            <option value="">Select category</option>
                            {categoryOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                    </label>

                    <label className="block">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Event Level
                        </span>
                        <select
                            name="eventLevel"
                            value={formData.eventLevel}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.eventLevel ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                        >
                            <option value="">Select level</option>
                            {eventLevelOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        {errors.eventLevel && <p className="mt-1 text-sm text-red-600">{errors.eventLevel}</p>}
                    </label>

                    <label className="block">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Your Role
                        </span>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.role ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                        >
                            <option value="">Select role</option>
                            {roleOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
                    </label>

                    <label className="block">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Outcome
                        </span>
                        <select
                            name="outcome"
                            value={formData.outcome}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.outcome ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                        >
                            <option value="">Select outcome</option>
                            {outcomeOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        {errors.outcome && <p className="mt-1 text-sm text-red-600">{errors.outcome}</p>}
                    </label>

                    <label className="block">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Date
                        </span>
                        <input
                            type="date"
                            name="eventDate"
                            value={formData.eventDate}
                            onChange={handleChange}
                            max={new Date().toISOString().split('T')[0]}
                            className={`mt-1 block w-full rounded-md border ${errors.eventDate ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                        />
                        {errors.eventDate && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.eventDate}
                            </p>
                        )}
                    </label>

                    <label className="block">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Achievement
                        </span>
                        <input
                            type="text"
                            name="achievement"
                            value={formData.achievement}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.achievement ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                        />
                        {errors.achievement && <p className="mt-1 text-sm text-red-600">{errors.achievement}</p>}
                    </label>

                    <label className="block md:col-span-2">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Description
                        </span>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.description ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                            rows={4}
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                    </label>

                    <label className="block md:col-span-2">
                        <span className="text-gray-700">Proof Document</span>
                        <div className="mt-1 flex items-center">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="block w-full border border-gray-300 rounded-md px-3 py-2"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                            {formData.documentPath && (
                                <span className="ml-2 text-sm text-gray-600">
                                    {formData.documentPath.name || 'File selected'}
                                </span>
                            )}
                        </div>
                    </label>
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
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                    >
                        {isSubmitting ? 'Submitting...' : 'SUBMIT'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SportsEventsForm;