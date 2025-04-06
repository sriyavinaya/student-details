import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

// const publicationTypeOptions = [
//     'Journal Article',
//     'Conference Paper',
//     'Book Chapter',
//     'Poster',
//     'Thesis',
//     'Other'
// ];


const PublicationsForm = ({ publication, onClose, onSave, refreshTable }) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        title: '',
        publicationType: '',
        orcidId: '',
        author: '',
        year: new Date().getFullYear().toString(),
        // collaborators: '',
        doi: '',
        keywords: '',
        abstractContent: '',
        description: '',
        documentPath: null,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dropdownOptions, setDropdownOptions] = useState({
        PublicationType: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const userToken = JSON.parse(localStorage.getItem("user"));
    const userId = userToken ? userToken.id : null;

    // Generate year options (last 20 years)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 20 }, (_, i) => currentYear - i);

    // Fetch dropdown options from backend
    useEffect(() => {
        const fetchDropdownOptions = async () => {
            setIsLoading(true);
            try {
                // Fetch publication type options
                const response = await fetch(
                    `http://localhost:8080/api/dropdown/fetch?category=publications&dropdownName=PublicationType`
                );
                const data = await response.json();
                
                setDropdownOptions({
                    PublicationType: data
                });
            } catch (error) {
                console.error("Error fetching dropdown options:", error);
                toast({
                    title: 'Error',
                    description: 'Failed to load publication types',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchDropdownOptions();

        if (publication) {
            setFormData(publication);
        }
    }, [publication]);

    const validateDOI = (doi) => {
        if (!doi) return { isValid: true, message: '' }; // DOI is optional
        // Basic DOI pattern check (can be enhanced)
        const doiPattern = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;
        return {
            isValid: doiPattern.test(doi),
            message: 'Invalid DOI format (should be 10.xxxx/xxxxx)'
        };
    };

    const validateORCID = (orcid) => {
        if (!orcid) return { isValid: true, message: '' }; // ORCID is optional
        // ORCID pattern check (XXXX-XXXX-XXXX-XXXX)
        const orcidPattern = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/;
        return {
            isValid: orcidPattern.test(orcid),
            message: 'Invalid ORCID format (should be XXXX-XXXX-XXXX-XXXX)'
        };
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.publicationType) newErrors.publicationType = 'Publication type is required';
        if (!formData.author.trim()) newErrors.author = 'Author(s) is required';
        if (!formData.year) newErrors.year = 'Year is required';
        if (!formData.abstractContent.trim()) newErrors.abstractContent = 'Abstract is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        
        const orcidValidation = validateORCID(formData.orcidId);
        if (!orcidValidation.isValid) {
            newErrors.orcidId = orcidValidation.message;
        }
        
        const doiValidation = validateDOI(formData.doi);
        if (!doiValidation.isValid) {
            newErrors.doi = doiValidation.message;
        }

        // Check if a document is required for new submissions
        if (!publication?.id && !formData.documentPath) {
            newErrors.documentPath = 'Document is required';
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
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({ 
                    ...prev, 
                    documentPath: 'Invalid file type. Please upload PDF, DOC or DOCX files only' 
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
                description: 'Please fill all required fields correctly',
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
            formDataToSend.append('publicationType', formData.publicationType);
            formDataToSend.append('orcidId', formData.orcidId);
            formDataToSend.append('author', formData.author);
            formDataToSend.append('year', formData.year);
            // formDataToSend.append('collaborators', formData.collaborators);
            formDataToSend.append('doi', formData.doi);
            formDataToSend.append('keywords', formData.keywords);
            formDataToSend.append('abstractContent', formData.abstractContent);
            formDataToSend.append('description', formData.description);
            if (formData.documentPath) {
                formDataToSend.append('documentPath', formData.documentPath);
            }

            const response = await axios.post(
                'http://localhost:8080/api/publications/submit',
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
                description: 'Publication saved successfully!',
            });

            onClose();
            refreshTable();

        } catch (error) {
            console.error('Submission error:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to save publication',
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

                    {/* Publication Type */}
                    <label className="block">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Publication Type
                        </span>
                        <select
                            name="publicationType"
                            value={formData.publicationType}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.publicationType ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                            disabled={isLoading}
                        >
                            <option value="">Select type</option>
                            {dropdownOptions.PublicationType.map((option) => (
                                <option key={option.id} value={option.optionValue}>
                                    {option.optionValue}
                                </option>
                            ))}
                        </select>
                        {errors.publicationType && <p className="mt-1 text-sm text-red-600">{errors.publicationType}</p>}
                        {isLoading && !dropdownOptions.PublicationType.length && (
                            <p className="mt-1 text-sm text-gray-500">Loading publication types...</p>
                        )}
                    </label>

                    {/* ORCID ID */}
                    <label className="block">
                        <span className="text-gray-700">ORCID ID</span>
                        <input
                            type="text"
                            name="orcidId"
                            value={formData.orcidId}
                            onChange={handleChange}
                            placeholder="0000-0000-0000-0000"
                            className={`mt-1 block w-full rounded-md border ${errors.orcidId ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                        />
                        {errors.orcidId && <p className="mt-1 text-sm text-red-600">{errors.orcidId}</p>}
                    </label>

                    {/* Author(s) */}
                    <label className="block">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Author(s)
                        </span>
                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.author ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                        />
                        {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author}</p>}
                    </label>

                    {/* Year */}
                    <label className="block">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Year
                        </span>
                        <select
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.year ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                        >
                            {yearOptions.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                        {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
                    </label>

                    {/* Collaborators
                    <label className="block">
                        <span className="text-gray-700">Collaborators</span>
                        <input
                            type="text"
                            name="collaborators"
                            value={formData.collaborators}
                            onChange={handleChange}
                            placeholder="Separate names with commas"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        />
                    </label> */}

                    {/* DOI */}
                    <label className="block">
                        <span className="text-gray-700">DOI</span>
                        <input
                            type="text"
                            name="doi"
                            value={formData.doi}
                            onChange={handleChange}
                            placeholder="10.xxxx/xxxxx"
                            className={`mt-1 block w-full rounded-md border ${errors.doi ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                        />
                        {errors.doi && <p className="mt-1 text-sm text-red-600">{errors.doi}</p>}
                    </label>

                    {/* Keywords */}
                    <label className="block">
                        <span className="text-gray-700">Keywords</span>
                        <input
                            type="text"
                            name="keywords"
                            value={formData.keywords}
                            onChange={handleChange}
                            placeholder="Separate keywords with commas"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        />
                    </label>

                    {/* Abstract */}
                    <label className="block md:col-span-2">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Abstract
                        </span>
                        <textarea
                            name="abstractContent"
                            value={formData.abstractContent}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.abstractContent ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                            rows={5}
                        />
                        {errors.abstractContent && <p className="mt-1 text-sm text-red-600">{errors.abstractContent}</p>}
                    </label>

                    {/* Description */}
                    <label className="block md:col-span-2">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Description
                        </span>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.description ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:outline-none`}
                            rows={3}
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                    </label>

                    {/* Document */}
                    <label className="block md:col-span-2">
                        <span className="text-gray-700">
                            {!publication?.id && <span className="text-red-500">* </span>}
                            Full Text Document
                        </span>
                        <div className="mt-1 flex items-center">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className={`block w-full border ${errors.documentPath ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
                                accept=".pdf,.doc,.docx"
                            />
                            {formData.documentPath && (
                                <span className="ml-2 text-sm text-gray-600">
                                    {typeof formData.documentPath === 'object' 
                                        ? formData.documentPath.name 
                                        : 'File selected'}
                                </span>
                            )}
                        </div>
                        {errors.documentPath && <p className="mt-1 text-sm text-red-600">{errors.documentPath}</p>}
                        <p className="mt-1 text-xs text-gray-500">
                            Accepted formats: PDF, DOC, DOCX. Max size: 5MB
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

export default PublicationsForm;