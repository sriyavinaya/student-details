import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const publicationTypeOptions = [
    'Journal Article',
    'Conference Paper',
    'Book Chapter',
    'Poster',
    'Thesis',
    'Other'
];

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

    // Generate year options (last 20 years)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 20 }, (_, i) => currentYear - i);

    useEffect(() => {
        if (publication) {
            setFormData(publication);
        }
    }, [publication]);

    const validateDOI = (doi) => {
        if (!doi) return true; // DOI is optional
        const doiPattern = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;
        return doiPattern.test(doi);
    };

    const validateORCID = (orcid) => {
        if (!orcid) return true; // ORCID is optional
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
        setFormData(prev => ({ ...prev, documentPath: e.target.files[0] }));
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
            
            if (formData.documentPath) {
                formDataToSend.append('documentPath', formData.documentPath);
            }

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

                    {/* Include all other form fields exactly as in the student version */}
                    {/* ... */}

                    <label className="block md:col-span-2">
                        <span className="text-gray-700">Full Text Document</span>
                        <div className="mt-1 flex items-center">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="block w-full border border-gray-300 rounded-md px-3 py-2"
                                accept=".pdf,.doc,.docx"
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

export default FacultyPublicationsForm;