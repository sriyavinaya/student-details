import React, { useState } from "react";
import DashboardHeader from "@/components/student/StudentDashboardHeader";
import { Plus, Save, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define the field categories that can be edited
const FIELD_CATEGORIES = [
  { id: "technical", name: "Technical Events" },
  { id: "cultural", name: "Cultural Events" },
  { id: "sports", name: "Sports" },
  { id: "clubs", name: "Clubs and Societies" },
  { id: "internships", name: "Internships and Placements" },
  { id: "publications", name: "Publications" }
];

// Fields available for each category
const FIELD_TYPES = {
  technical: ["category", "status"],
  cultural: ["category", "status"],
  sports: ["category", "status"],
  clubs: ["category", "status"],
  internships: ["company_type", "status"],
  publications: ["publication_type", "status"]
};

// Initial dropdown options (in a real app, these would come from a database)
const INITIAL_OPTIONS = {
  technical: {
    category: [
      "Hackathon",
      "Workshop",
      "Competitions",
      "Technical fest - Tathva",
      "Technical fest of other colleges",
      "Other"
    ],
    status: ["Pending", "Ongoing", "Completed"]
  },
  cultural: {
    category: ["Dance", "Music", "Drama", "Art", "Debate", "Other"],
    status: ["Pending", "Ongoing", "Completed"]
  },
  sports: {
    category: ["Cricket", "Football", "Basketball", "Volleyball", "Athletics", "Other"],
    status: ["Pending", "Ongoing", "Completed"]
  },
  clubs: {
    category: ["Technical", "Cultural", "Sports", "Social Service", "Other"],
    status: ["Active", "Inactive"]
  },
  internships: {
    company_type: ["IT", "Finance", "Marketing", "Consulting", "Research", "Other"],
    status: ["Applied", "Selected", "Completed", "Rejected"]
  },
  publications: {
    publication_type: ["Journal", "Conference", "Book", "Blog", "Other"],
    status: ["Draft", "Submitted", "Published", "Rejected"]
  }
};

const EditFields = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("technical");
  const [selectedField, setSelectedField] = useState("category");
  const [options, setOptions] = useState(INITIAL_OPTIONS);
  const [newOption, setNewOption] = useState("");
  const [editing, setEditing] = useState(false);

  // Get the available fields for the selected category
  const availableFields = FIELD_TYPES[selectedCategory];
  
  // Get the options for the selected field
  const fieldOptions = options[selectedCategory]?.[selectedField] || [];

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    // Set default field for the new category
    setSelectedField(FIELD_TYPES[category][0]);
  };

  const handleFieldChange = (e) => {
    setSelectedField(e.target.value);
  };

  const handleAddOption = () => {
    if (!newOption.trim()) {
      toast({
        title: "Error",
        description: "Option cannot be empty",
        variant: "destructive"
      });
      return;
    }

    if (fieldOptions.includes(newOption.trim())) {
      toast({
        title: "Error",
        description: "Option already exists",
        variant: "destructive"
      });
      return;
    }

    // Add new option to the list
    setOptions(prev => {
      const updated = { ...prev };
      updated[selectedCategory][selectedField] = [
        ...fieldOptions,
        newOption.trim()
      ];
      return updated;
    });

    // Clear the input
    setNewOption("");
    setEditing(false);

    // Show success message
    toast({
      title: "Success",
      description: `Added "${newOption.trim()}" to ${selectedField} options`,
    });
  };

  const handleRemoveOption = (option) => {
    // Remove option from the list
    setOptions(prev => {
      const updated = { ...prev };
      updated[selectedCategory][selectedField] = 
        fieldOptions.filter(opt => opt !== option);
      return updated;
    });

    // Show success message
    toast({
      title: "Success",
      description: `Removed "${option}" from ${selectedField} options`,
    });
  };

  const handleSaveChanges = () => {
    // In a real app, this would save to a database
    toast({
      title: "Changes saved",
      description: "All dropdown options have been updated successfully",
    });
    
    // Here we would update the options in the database/storage
    // For now, we're just using state
    console.log("Saved options:", options);
  };

  return (
    <div>
      <DashboardHeader title="Edit Fields" />
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            This page allows you to customize dropdown options that appear in student forms.
            Changes made here will be reflected in all student event pages.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Category Selection */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Event Type
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {FIELD_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Field Selection */}
            <div>
              <label htmlFor="field" className="block text-sm font-medium text-gray-700 mb-1">
                Field to Edit
              </label>
              <select
                id="field"
                value={selectedField}
                onChange={handleFieldChange}
                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableFields.map(field => (
                  <option key={field} value={field}>
                    {field.replace('_', ' ').charAt(0).toUpperCase() + field.replace('_', ' ').slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium">
              Current Options for {selectedField.replace('_', ' ').charAt(0).toUpperCase() + selectedField.replace('_', ' ').slice(1)}
            </h3>
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Add Option
            </button>
          </div>

          {editing && (
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Enter new option"
                  className="flex-1 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddOption()}
                />
                <button
                  onClick={handleAddOption}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setNewOption("");
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-md p-4">
            <ul className="divide-y divide-gray-200">
              {fieldOptions.map((option) => (
                <li key={option} className="py-3 flex justify-between items-center">
                  <span className="text-gray-800">{option}</span>
                  <button
                    onClick={() => handleRemoveOption(option)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
              {fieldOptions.length === 0 && (
                <li className="py-3 text-gray-500 text-center">No options found. Add some options using the button above.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSaveChanges}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            <Save size={16} />
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFields;