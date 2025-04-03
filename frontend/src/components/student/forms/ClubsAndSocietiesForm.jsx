import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const clubCategoryOptions = [
    'Technical Club',
    'Cultural Club',
    'Sports Club',
    'Literary Club',
    'Other'
];

const positionOptions = [
    'President',
    'Vice President',
    'Secretary',
    'Treasurer',
    'Core Member',
    'Member'
];

const ClubsAndSocietiesForm = ({ record, onClose, onSave, refreshTable }) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        title: '',
        position: '',
        startDate: '',
        endDate: '',
        clubCategory: '',
        description: '',
        documentPath: null,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const userToken = JSON.parse(localStorage.getItem("user"));
    const userId = userToken ? userToken.id : null;

    useEffect(() => {
        if (record) {
            setFormData(record);
        }
    }, [record]);

    const validateDates = () => {
        // If end date is provided, validate it's after start date
        if (formData.endDate && formData.startDate) {
            return new Date(formData.startDate) <= new Date(formData.endDate);
        }
        // If end date is not provided, it's valid
        return true;
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.position) newErrors.position = 'Position is required';
        if (!formData.clubCategory) newErrors.clubCategory = 'Category is required';
        if (!formData.startDate) {
            newErrors.startDate = 'Start date is required';
        }
        // if (!formData.endDate) {
            // newErrors.endDate = 'End date is required';
        if (!validateDates()) {
            newErrors.endDate = 'End date must be after start date';
        }
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, documentPath: e.target.files[0] }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        if (!userId) {
            toast({ title: 'Error', description: 'No student ID found', variant: 'destructive' });
            return;
        }

        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('studentId', userId);
            formDataToSend.append('title', formData.title);
            formDataToSend.append('position', formData.position);
            formDataToSend.append('startDate', formData.startDate);
            formDataToSend.append('endDate', formData.endDate);
            formDataToSend.append('clubCategory', formData.clubCategory);
            formDataToSend.append('description', formData.description);
            if (formData.documentPath) {
                formDataToSend.append('documentPath', formData.documentPath); // File field
            }

            const response = await axios.post(
                'http://localhost:8080/api/clubs/submit',
                formDataToSend,
                { 
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );

            toast({ title: 'Success', description: 'Club record saved!' });
            onClose();
            refreshTable();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to save record',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-200 rounded-lg p-6 mb-6">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block">
                        <span className="text-gray-700"><span className="text-red-500">*</span>  Title</span>
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
                        <span className="text-gray-700"><span className="text-red-500">*</span>  Position</span>
                        <select
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.position ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                        >
                            <option value="">Select position</option>
                            {positionOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position}</p>}
                    </label>

                    <label className="block">
                        <span className="text-gray-700"><span className="text-red-500">*</span>  Club Category</span>
                        <select
                            name="clubCategory"
                            value={formData.clubCategory}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.clubCategory ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                        >
                            <option value="">Select category</option>
                            {clubCategoryOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        {errors.clubCategory && <p className="mt-1 text-sm text-red-600">{errors.clubCategory}</p>}
                    </label>

                    <label className="block">
                        <span className="text-gray-700"><span className="text-red-500">*</span>  Start Date</span>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            max={new Date().toISOString().split('T')[0]}
                            className={`mt-1 block w-full rounded-md border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                        />
                        {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
                    </label>

                    <label className="block">
                        <span className="text-gray-700"> End Date</span>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            min={formData.startDate}
                            max={new Date().toISOString().split('T')[0]}
                            className={`mt-1 block w-full rounded-md border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                        />
                        {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
                    </label>

                    <label className="block md:col-span-2">
                        <span className="text-gray-700"><span className="text-red-500">*</span>  Description</span>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.description ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                            rows={3}
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
                        </div>
                    </label>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={onClose}
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

export default ClubsAndSocietiesForm;