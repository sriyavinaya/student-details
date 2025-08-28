import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const JobOpportunitiesForm = ({ opportunity, onClose, onSave, refreshTable }) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        companyName: '',
        startDate: '',
        role: '',
        type: 'INTERNSHIP',
        verificationStatus: 'Pending',
        documentPath: null,
        duration: '',
        stipend: '',
        ctc: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const userToken = JSON.parse(localStorage.getItem("user"));
    const userId = userToken ? userToken.id : null;

    useEffect(() => {
        if (opportunity) {
            setFormData(opportunity);
        }
    }, [opportunity]);

    const validateDate = (dateString) => {
        if (!dateString) return { isValid: false, message: 'Date is required' };
        
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        if (!datePattern.test(dateString)) {
            return { isValid: false, message: 'Date must be in YYYY-MM-DD format' };
        }
        
        const inputDate = new Date(dateString);
        
        if (isNaN(inputDate.getTime())) {
            return { isValid: false, message: 'Invalid date' };
        }
        
        const [year, month, day] = dateString.split('-').map(Number);
        const parsedDate = new Date(inputDate);
        if (
            parsedDate.getFullYear() !== year || 
            parsedDate.getMonth() + 1 !== month || 
            parsedDate.getDate() !== day
        ) {
            return { isValid: false, message: 'Invalid date for the given month' };
        }
        
        return { isValid: true, message: '' };
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
        if (!formData.role.trim()) newErrors.role = 'Role is required';
        
        const dateValidation = validateDate(formData.startDate);
        if (!dateValidation.isValid) {
            newErrors.startDate = dateValidation.message;
        }
        
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        
        // Type-specific validation
        if (formData.type === 'INTERNSHIP') {
            if (!formData.duration) newErrors.duration = 'Duration is required for internships';
            if (!formData.stipend) newErrors.stipend = 'Stipend is required for internships';
        } else if (formData.type === 'PLACEMENT') {
            if (!formData.ctc) newErrors.ctc = 'CTC is required for placements';
        }
        
        // Check if a document is required for new submissions
        if (!opportunity?.id && !formData.documentPath) {
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
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, documentPath: 'File size must be less than 5MB' }));
                return;
            }
            
            const validTypes = ['application/pdf', 'application/msword', 
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                'image/jpeg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, documentPath: 'Invalid file type. Please upload PDF, DOC, DOCX, JPG or PNG files only' }));
                return;
            }
            
            setFormData(prev => ({ ...prev, documentPath: file }));
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
            formDataToSend.append('description', formData.description);
            formDataToSend.append('companyName', formData.companyName);
            formDataToSend.append('startDate', formData.startDate);
            formDataToSend.append('role', formData.role);
            formDataToSend.append('type', formData.type);
            formDataToSend.append('verificationStatus', formData.verificationStatus);
            
            if (formData.type === 'INTERNSHIP') {
                formDataToSend.append('duration', formData.duration);
                formDataToSend.append('stipend', formData.stipend);
            } else if (formData.type === 'PLACEMENT') {
                formDataToSend.append('ctc', formData.ctc);
            }
            
            if (formData.documentPath) {
                formDataToSend.append('documentPath', formData.documentPath);
            }

            const response = await axios.post(
                'http://localhost:8080/api/job-opportunity/submit',
                formDataToSend,
                { 
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.status !== 200) throw new Error('Submission failed');

            toast({
                title: 'Success',
                description: 'Opportunity submitted successfully!',
            });

            onClose();
            refreshTable();

        } catch (error) {
            console.error('Submission error:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to submit opportunity',
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
                    {/* Basic Fields */}
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

                    <label className="block">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Company Name
                        </span>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.companyName ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                        />
                        {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
                    </label>

                    <label className="block">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Start Date
                        </span>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                        />
                        {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
                    </label>

                    <label className="block">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Role
                        </span>
                        <input
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.role ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                        />
                        {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
                    </label>

                    <label className="block">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Type
                        </span>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.type ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                        >
                            <option value="INTERNSHIP">Internship</option>
                            <option value="PLACEMENT">Placement</option>
                        </select>
                        {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                    </label>

                    {/* Type-specific fields (conditionally rendered) */}
                    {formData.type === 'INTERNSHIP' && (
                        <>
                            <label className="block">
                                <span className="text-gray-700">
                                    <span className="text-red-500">*</span> Duration
                                </span>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border ${errors.duration ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                                    placeholder="e.g. 3 months"
                                />
                                {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
                            </label>

                            <label className="block">
                                <span className="text-gray-700">
                                    <span className="text-red-500">*</span> Stipend
                                </span>
                                <input
                                    type="text"
                                    name="stipend"
                                    value={formData.stipend}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border ${errors.stipend ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                                    placeholder="e.g. ₹15,000/month"
                                />
                                {errors.stipend && <p className="mt-1 text-sm text-red-600">{errors.stipend}</p>}
                            </label>
                        </>
                    )}

                    {formData.type === 'PLACEMENT' && (
                        <label className="block">
                            <span className="text-gray-700">
                                <span className="text-red-500">*</span> CTC (Cost to Company)
                            </span>
                            <input
                                type="text"
                                name="ctc"
                                value={formData.ctc}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md border ${errors.ctc ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                                placeholder="e.g. ₹8,00,000 per annum"
                            />
                            {errors.ctc && <p className="mt-1 text-sm text-red-600">{errors.ctc}</p>}
                        </label>
                    )}
                </div>

                {/* Description (full width) */}
                <div className="mt-4">
                    <label className="block">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Description
                        </span>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.description ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                            rows={3}
                            placeholder="Describe the opportunity, your responsibilities, etc."
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                    </label>
                </div>

                {/* Document Upload */}
                <div className="mt-4">
                    <label className="block">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Offer Letter
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

export default JobOpportunitiesForm;