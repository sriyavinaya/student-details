import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash } from "lucide-react";

const EditFields = () => {
  const [category, setCategory] = useState("technical");
  const [field, setField] = useState("Category");
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState("");

  // Field options based on category
  const fieldOptions = {
    technical: ["Category", "Achievement"],
    cultural: ["Category", "Achievement"],
    sports: ["Category", "Achievement"],
    technical: ["Category", "Achievement"],
    technical: ["Category", "Achievement"],
    technical: ["Category", "Achievement"],
    technical: ["Category", "Achievement"],
    technical: ["Category", "Achievement"],
    technical: ["Category", "Achievement"],


  };

  // Fetch dropdown options from the backend
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/dropdown/fetch?category=${category}&dropdownName=${field}`
        );
        if (!response.ok) throw new Error("Failed to fetch options");
        const data = await response.json();
        setOptions(data);
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
      }
    };

    fetchOptions();
  }, [category, field]);

  // Add a new option to the backend
  const addOption = async () => {
    if (!newOption.trim()) return;

    try {
      const response = await fetch("http://localhost:8080/api/dropdown/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          category, 
          dropdownName: field, 
          optionValue: newOption 
        })
      });

      if (!response.ok) throw new Error("Failed to add option");
      
      const createdOption = await response.json();
      setOptions([...options, createdOption]);
      setNewOption("");
    } catch (error) {
      console.error("Error adding option:", error);
    }
  };

  // Delete an option from the backend
  const deleteOption = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/dropdown/delete?id=${id}`, 
        { method: "DELETE" }
      );
      
      if (!response.ok) throw new Error("Failed to delete option");
      
      setOptions(options.filter(option => option.id !== id));
    } catch (error) {
      console.error("Error deleting option:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Edit Dropdown Fields</h2>

      <div className="flex gap-4 mb-4">
        <Select onValueChange={setCategory} value={category}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="cultural">Cultural</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setField} value={field}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Field" />
          </SelectTrigger>
          <SelectContent>
            {fieldOptions[category].map((fieldOption) => (
              <SelectItem key={fieldOption} value={fieldOption}>
                {fieldOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4 flex gap-2">
        <Input 
          value={newOption} 
          onChange={(e) => setNewOption(e.target.value)} 
          placeholder="New option value"
          className="flex-1"
        />
        <Button onClick={addOption}>Add</Button>
      </div>

      <ul className="space-y-2">
        {options.map(option => (
          <li key={option.id} className="flex justify-between items-center p-2 border rounded">
            <span>{option.optionValue}</span>
            <Button 
              onClick={() => deleteOption(option.id)} 
              variant="ghost"
              size="sm"
              className="hover:bg-red-50"
            >
              <Trash className="w-4 h-4 text-red-500" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EditFields;