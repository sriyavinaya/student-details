import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

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
        verificationStatus: 'Pending',
        documentPath: null,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dropdownOptions, setDropdownOptions] = useState({
        Category: [],
        EventLevel: [],
        Role: [],
        Outcome: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const userToken = JSON.parse(localStorage.getItem("user"));
    const userId = userToken ? userToken.id : null;

    // Fetch dropdown options from backend
    useEffect(() => {
        const fetchDropdownOptions = async () => {
            setIsLoading(true);
            try {
                // Fetch category options (sports category)
                const categoryResponse = await fetch(
                    `http://localhost:8080/api/dropdown/fetch?category=sports&dropdownName=Category`
                );
                const categoryData = await categoryResponse.json();
                
                // Fetch event level options
                const eventLevelResponse = await fetch(
                    `http://localhost:8080/api/dropdown/fetch?category=sports&dropdownName=EventLevel`
                );
                const eventLevelData = await eventLevelResponse.json();
                
                // Fetch role options
                const roleResponse = await fetch(
                    `http://localhost:8080/api/dropdown/fetch?category=sports&dropdownName=Role`
                );
                const roleData = await roleResponse.json();
                
                // Fetch outcome options
                const outcomeResponse = await fetch(
                    `http://localhost:8080/api/dropdown/fetch?category=sports&dropdownName=Outcome`
                );
                const outcomeData = await outcomeResponse.json();
                
                setDropdownOptions({
                    Category: categoryData,
                    EventLevel: eventLevelData,
                    Role: roleData,
                    Outcome: outcomeData
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

        if (event) {
            setFormData(event);
        }
    }, [event]);

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

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Event name is required';
        if (!formData.host.trim()) newErrors.host = 'Host is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.eventLevel) newErrors.eventLevel = 'Event level is required';
        if (!formData.role) newErrors.role = 'Role is required';
        if (!formData.outcome) newErrors.outcome = 'Outcome is required';
        
        const dateValidation = validateDate(formData.eventDate);
        if (!dateValidation.isValid) {
            newErrors.eventDate = dateValidation.message;
        }
        
        // if (!formData.achievement.trim()) newErrors.achievement = 'Achievement is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        
        // Check if a document is required for new submissions
        if (!event?.id && !formData.documentPath) {
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
            formDataToSend.append('eventDate', formData.eventDate);
            formDataToSend.append('host', formData.host);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('achievement', formData.achievement);
            formDataToSend.append('eventLevel', formData.eventLevel);
            formDataToSend.append('role', formData.role);
            formDataToSend.append('outcome', formData.outcome);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('verificationStatus', formData.verificationStatus);
            if (formData.documentPath) {
                formDataToSend.append('documentPath', formData.documentPath);
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
                    {/* Event Name */}
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

                    {/* Host */}
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

                    {/* Sport Category */}
                    <label className="block">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Sport Category
                        </span>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.category ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                            disabled={isLoading}
                        >
                            <option value="">Select category</option>
                            {dropdownOptions.Category.map((option) => (
                                <option key={option.id} value={option.optionValue}>
                                    {option.optionValue}
                                </option>
                            ))}
                        </select>
                        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                        {isLoading && !dropdownOptions.Category.length && (
                            <p className="mt-1 text-sm text-gray-500">Loading categories...</p>
                        )}
                    </label>

                    {/* Event Level */}
                    <label className="block">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Event Level
                        </span>
                        <select
                            name="eventLevel"
                            value={formData.eventLevel}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.eventLevel ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                            disabled={isLoading}
                        >
                            <option value="">Select level</option>
                            {dropdownOptions.EventLevel.map((option) => (
                                <option key={option.id} value={option.optionValue}>
                                    {option.optionValue}
                                </option>
                            ))}
                        </select>
                        {errors.eventLevel && <p className="mt-1 text-sm text-red-600">{errors.eventLevel}</p>}
                        {isLoading && !dropdownOptions.EventLevel.length && (
                            <p className="mt-1 text-sm text-gray-500">Loading event levels...</p>
                        )}
                    </label>

                    {/* Role */}
                    <label className="block">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Your Role
                        </span>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.role ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                            disabled={isLoading}
                        >
                            <option value="">Select role</option>
                            {dropdownOptions.Role.map((option) => (
                                <option key={option.id} value={option.optionValue}>
                                    {option.optionValue}
                                </option>
                            ))}
                        </select>
                        {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
                        {isLoading && !dropdownOptions.Role.length && (
                            <p className="mt-1 text-sm text-gray-500">Loading roles...</p>
                        )}
                    </label>

                    {/* Outcome */}
                    <label className="block">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Outcome
                        </span>
                        <select
                            name="outcome"
                            value={formData.outcome}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.outcome ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                            disabled={isLoading}
                        >
                            <option value="">Select outcome</option>
                            {dropdownOptions.Outcome.map((option) => (
                                <option key={option.id} value={option.optionValue}>
                                    {option.optionValue}
                                </option>
                            ))}
                        </select>
                        {errors.outcome && <p className="mt-1 text-sm text-red-600">{errors.outcome}</p>}
                        {isLoading && !dropdownOptions.Outcome.length && (
                            <p className="mt-1 text-sm text-gray-500">Loading outcomes...</p>
                        )}
                    </label>

                    {/* Date */}
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
                        {errors.eventDate && <p className="mt-1 text-sm text-red-600">{errors.eventDate}</p>}
                    </label>

                    {/* Achievement
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
                    </label> */}

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
                            <span className="text-red-500">*</span> Proof Document
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

export default SportsEventsForm;