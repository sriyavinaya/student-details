import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios'; // Import axios


const categoryOptions = [
    'Hackathon',
    'Workshop',
    'Competitions',
    'Technical fest - Tathva',
    'Technical fest of other colleges',
    'Other',
];

const statusOptions = ['Pending', 'Rejected', 'Approved'];

const TechnicalEventsForm = ({ event, onClose, onSave }) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        eventName: '',
        eventDate: '',
        host: '',
        category: '',
        achievement: '',
        description: '',
        verificationStatus: 'Pending',
        documentPath: null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const userToken = JSON.parse(localStorage.getItem("user")); // Adjust if stored elsewhere
    const userId = userToken ? userToken.id : null;


    useEffect(() => {
        if (event) {
            setFormData(event);
        }
    }, [event]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, documentPath: e.target.files[0] }));
    };

    const uploadProofDocument = async () => {
        if (!formData.documentPath) return null;

        const fileData = new FormData();
        fileData.append('file', formData.documentPath); // Field name must be "file"

        try {
            const response = await axios.post(
                'http://localhost:8080/api/technical/upload',
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
         

            console.log(documentLink);
         

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
        setIsSubmitting(true);

        const requiredFields = ['eventName', 'host', 'category', 'eventDate', 'description'];
        const missingFields = requiredFields.filter((field) => !formData[field]);

        if (missingFields.length > 0) {

            toast({
                title: 'Missing Fields',
                description: 'Please fill in all required fields',
                variant: 'destructive',
            });
            setIsSubmitting(false);
            return;
        }

        try {
            let documentLink = await uploadProofDocument();


            console.log(userId);


            const formDataToSend = new FormData();
            formDataToSend.append('studentId', userId); // Include student ID
            formDataToSend.append('id', formData.id || '0'); // Ensure ID is sent
            formDataToSend.append('eventName', formData.eventName);
            formDataToSend.append('eventDate', formData.eventDate);
            formDataToSend.append('host', formData.host);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('achievement', formData.achievement);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('verificationStatus', formData.verificationStatus);
            if (formData.documentPath) {
                formDataToSend.append('documentPath', formData.documentPath); // File field
            }

            const response = await axios.post(
                'http://localhost:8080/api/technical/submit',
                formDataToSend,
                {
                    withCredentials: true, // Include credentials (cookies)
                    headers: {
                        'Content-Type': 'multipart/form-data', // Set content type
                    },
                }
            );

            if (response.status !== 200) throw new Error('Submission failed');

            toast({
                title: 'Success',
                description: 'Event details saved successfully.',
            });

            onSave(formData);
            resetForm();
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: 'Submission Failed',
                description: error.message || 'Could not save event details.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

  

    const resetForm = () => {
        setFormData({
            eventName: '',
            eventDate: '',
            host: '',
            category: '',
            achievement: '',
            description: '',
            verificationStatus: 'Pending',
            documentPath: null,
        });
        document.querySelector('input[type="file"]').value = '';
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
                <div className="grid grid-cols-1 gap-6">
                    <label className="block">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Event Name
                        </span>
                        <input
                            type="text"
                            name="eventName"
                            value={formData.eventName}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        />
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
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        />
                    </label>

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
                            {categoryOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
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
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        />
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
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        />
                    </label>

                    <label className="block">
                        <span className="text-gray-700">
                            <span className="text-red-500">*</span> Description
                        </span>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        />
                    </label>

                    <label className="block">
                        <span className="text-gray-700">Proof Document</span>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        />
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

export default TechnicalEventsForm;