import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const FacultyPublicationsForm = ({ publication, onClose, onSave, refreshTable }) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        title: '',
        publicationType: '',
        orcidId: '',
        author: '',
        year: new Date().getFullYear().toString(),
        collaborators: '',
        doi: '',
        keywords: '',
        abstractContent: '',
        description: '',
        documentPath: null,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const userToken = JSON.parse(localStorage.getItem("user"));
    const facultyId = userToken && userToken.role === 'FACULTY' ? userToken.id : null;
    const [dropdownOptions, setDropdownOptions] = useState({
        PublicationType: []
    });
    const [isLoading, setIsLoading] = useState(false);
    
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 20 }, (_, i) => currentYear - i);

    useEffect(() => {
        const fetchDropdownOptions = async () => {
            setIsLoading(true);
            try {
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
        if (!doi) return true;
        const doiPattern = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;
        return doiPattern.test(doi);
    };

    const validateORCID = (orcid) => {
        if (!orcid) return true;
        const orcidPattern = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/;
        return orcidPattern.test(orcid);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.publicationType) newErrors.publicationType = 'Publication type is required';
        if (!formData.author.trim()) newErrors.author = 'Author(s) is required';
        if (!formData.year) newErrors.year = 'Year is required';
        if (!formData.abstractContent.trim()) newErrors.abstractContent = 'Abstract is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        
        // Document validation - make it compulsory
        if (!formData.documentPath) {
            newErrors.documentPath = 'Document is required';
        } else if (formData.documentPath.size > 5 * 1024 * 1024) { // 5MB limit
            newErrors.documentPath = 'File size must be less than 5MB';
        }
        
        if (formData.orcidId && !validateORCID(formData.orcidId)) {
            newErrors.orcidId = 'Invalid ORCID format (should be XXXX-XXXX-XXXX-XXXX)';
        }
        
        if (formData.doi && !validateDOI(formData.doi)) {
            newErrors.doi = 'Invalid DOI format';
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
            // Validate file type
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, documentPath: 'Invalid file type. Only PDF, DOC, and DOCX are allowed' }));
                return;
            }
            
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, documentPath: 'File size must be less than 5MB' }));
                return;
            }
            
            setFormData(prev => ({ ...prev, documentPath: file }));
            setErrors(prev => ({ ...prev, documentPath: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!facultyId) {
            toast({
                title: 'Error',
                description: 'No faculty ID found. Please log in again.',
                variant: 'destructive',
            });
            return;
        }

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('facultyId', facultyId);
            formDataToSend.append('title', formData.title);
            formDataToSend.append('publicationType', formData.publicationType);
            formDataToSend.append('orcidId', formData.orcidId);
            formDataToSend.append('author', formData.author);
            formDataToSend.append('year', formData.year);
            formDataToSend.append('collaborators', formData.collaborators);
            formDataToSend.append('doi', formData.doi);
            formDataToSend.append('keywords', formData.keywords);
            formDataToSend.append('abstractContent', formData.abstractContent);
            formDataToSend.append('description', formData.description);
            
            // Document is now compulsory
            formDataToSend.append('documentPath', formData.documentPath);

            const response = await axios.post(
                'http://localhost:8080/api/faculty-publications/submit',
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
                description: 'Faculty publication submitted successfully!',
            });

            onClose();
            if (refreshTable) {
                await refreshTable();
            }

        } catch (error) {
            console.error('Submission error:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to save faculty publication',
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
                    {/* All the form fields remain exactly the same as in the student version */}
                    {/* Only the submission logic is different */}
                    
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
                        >
                            <option value="">Select type</option>
                            {dropdownOptions.PublicationType.map((option) => (
                                <option key={option.id} value={option.optionValue}>
                                    {option.optionValue}
                                </option>
                            ))}
                        </select>
                        {errors.publicationType && <p className="mt-1 text-sm text-red-600">{errors.publicationType}</p>}
                        {!dropdownOptions.PublicationType.length && (
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
                     
                      {/* Document - now compulsory */}
                    <label className="block md:col-span-2">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Full Text Document
                        </span>
                        <div className="mt-1 flex items-center">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                required
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
                        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                    >
                        {isSubmitting ? 'Submitting...' : 'SUBMIT'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FacultyPublicationsForm;