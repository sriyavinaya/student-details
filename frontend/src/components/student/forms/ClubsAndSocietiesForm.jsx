import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const ClubsAndSocietiesForm = ({ record, onClose, onSave, refreshTable }) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        title: '',
        position: '',
        startDate: '',
        endDate: '',
        clubCategory: '',
        description: '',
        verificationStatus: 'Pending',
        documentPath: null,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dropdownOptions, setDropdownOptions] = useState({
        ClubCategory: [],
        Position: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const userToken = JSON.parse(localStorage.getItem("user"));
    const userId = userToken ? userToken.id : null;

    // Fetch dropdown options from backend
    useEffect(() => {
        const fetchDropdownOptions = async () => {
            setIsLoading(true);
            try {
                // Fetch club category options
                const categoryResponse = await fetch(
                    `http://localhost:8080/api/dropdown/fetch?category=clubs&dropdownName=Category`
                );
                const categoryData = await categoryResponse.json();
                
                // Fetch position options
                const positionResponse = await fetch(
                    `http://localhost:8080/api/dropdown/fetch?category=clubs&dropdownName=Position`
                );
                const positionData = await positionResponse.json();
                
                setDropdownOptions({
                    ClubCategory: categoryData,
                    Position: positionData
                });
            } catch (error) {
                console.error("Error fetching dropdown options:", error);
                toast({
                    title: 'Error',
                    description: 'Failed to load dropdown options',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchDropdownOptions();

        if (record) {
            setFormData(record);
        }
    }, [record]);

    const validateDate = (dateString) => {
        if (!dateString) return { isValid: false, message: 'Date is required' };
        
        // Check format is YYYY-MM-DD
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        if (!datePattern.test(dateString)) {
            return { isValid: false, message: 'Date must be in YYYY-MM-DD format' };
        }
        
        const inputDate = new Date(dateString);
        
        // Check if date is valid (e.g., not 2023-02-31)
        if (isNaN(inputDate.getTime())) {
            return { isValid: false, message: 'Invalid date' };
        }
        
        // Ensure the date string parts match what we expect after parsing
        const [year, month, day] = dateString.split('-').map(Number);
        const parsedDate = new Date(inputDate);
        if (
            parsedDate.getFullYear() !== year || 
            parsedDate.getMonth() + 1 !== month || 
            parsedDate.getDate() !== day
        ) {
            return { isValid: false, message: 'Invalid date for the given month' };
        }
        
        // Check if date is in the future
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time part
        
        if (inputDate > today) {
            return { isValid: false, message: 'Date cannot be in the future' };
        }
        
        return { isValid: true, message: '' };
    };

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
        
        const startDateValidation = validateDate(formData.startDate);
        if (!startDateValidation.isValid) {
            newErrors.startDate = startDateValidation.message;
        }
        
        if (formData.endDate) {
            const endDateValidation = validateDate(formData.endDate);
            if (!endDateValidation.isValid) {
                newErrors.endDate = endDateValidation.message;
            }
        }
        
        if (!validateDates()) {
            newErrors.endDate = 'End date must be after start date';
        }
        
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        
        // Check if a document is required for new submissions
        if (!record?.id && !formData.documentPath) {
            newErrors.documentPath = 'Proof document is required';
        }
        
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
        const file = e.target.files[0];
        if (file) {
            // Check file size (limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ 
                    ...prev, 
                    documentPath: 'File size must be less than 5MB' 
                }));
                return;
            }
            
            // Check file type
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({ 
                    ...prev, 
                    documentPath: 'Invalid file type. Please upload PDF, DOC, DOCX, JPG or PNG files only' 
                }));
                return;
            }
            
            setFormData(prev => ({ ...prev, documentPath: file }));
            // Clear error if any
            if (errors.documentPath) {
                setErrors(prev => ({ ...prev, documentPath: '' }));
            }
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
            toast({
                title: 'Error',
                description: 'Please fill all required fields before submitting.',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('studentId', userId);
            formDataToSend.append('id', formData.id || '0');
            formDataToSend.append('title', formData.title);
            formDataToSend.append('position', formData.position);
            formDataToSend.append('startDate', formData.startDate);
            formDataToSend.append('endDate', formData.endDate);
            formDataToSend.append('clubCategory', formData.clubCategory);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('verificationStatus', formData.verificationStatus);
            if (formData.documentPath) {
                formDataToSend.append('documentPath', formData.documentPath);
            }

            const response = await axios.post(
                'http://localhost:8080/api/clubs/submit',
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
                description: 'Club record saved successfully!',
            });

            onSave();

        } catch (error) {
            console.error('Submission error:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to save club record',
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
                    {/* Title */}
                    <label className="block">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Title
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

                    {/* Position */}
                    <label className="block">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Position
                        </span>
                        <select
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.position ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                            disabled={isLoading}
                        >
                            <option value="">Select position</option>
                            {dropdownOptions.Position.map((option) => (
                                <option key={option.id} value={option.optionValue}>
                                    {option.optionValue}
                                </option>
                            ))}
                        </select>
                        {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position}</p>}
                        {isLoading && !dropdownOptions.Position.length && (
                            <p className="mt-1 text-sm text-gray-500">Loading positions...</p>
                        )}
                    </label>

                    {/* Club Category */}
                    <label className="block">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Club Category
                        </span>
                        <select
                            name="clubCategory"
                            value={formData.clubCategory}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.clubCategory ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                            disabled={isLoading}
                        >
                            <option value="">Select category</option>
                            {dropdownOptions.ClubCategory.map((option) => (
                                <option key={option.id} value={option.optionValue}>
                                    {option.optionValue}
                                </option>
                            ))}
                        </select>
                        {errors.clubCategory && <p className="mt-1 text-sm text-red-600">{errors.clubCategory}</p>}
                        {isLoading && !dropdownOptions.ClubCategory.length && (
                            <p className="mt-1 text-sm text-gray-500">Loading categories...</p>
                        )}
                    </label>

                    {/* Start Date */}
                    <label className="block">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Start Date
                        </span>
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

                    {/* End Date */}
                    <label className="block">
                        <span className="text-gray-700">End Date</span>
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

                    {/* Description (full width) */}
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

                    {/* Proof Document (full width) */}
                    <label className="block md:col-span-2">
                        <span className="text-gray-700">
                            {!record?.id && <span className="text-red-500">*</span>} Proof Document
                        </span>
                        <div className="mt-1 flex items-center">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className={`block w-full border ${errors.documentPath ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                            {formData.documentPath && typeof formData.documentPath === 'object' && (
                                <span className="ml-2 text-sm text-gray-600">
                                    {formData.documentPath.name}
                                </span>
                            )}
                        </div>
                        {errors.documentPath && <p className="mt-1 text-sm text-red-600">{errors.documentPath}</p>}
                        <p className="mt-1 text-xs text-gray-500">
                            Accepted formats: PDF, DOC, DOCX, JPG, PNG. Max size: 5MB
                        </p>
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
                        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-400"
                    >
                        {isSubmitting ? 'Submitting...' : 'SUBMIT'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ClubsAndSocietiesForm;