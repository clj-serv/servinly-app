"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import OnboardingShell from "@/components/layouts/OnboardingShell";
import { useOnboardingState } from "@/lib/onboardingState";
import { supabase } from "@/lib/supabaseClient";
import { ensureDevSession } from "@/lib/devAuth";

// useOnboardingState import removed - will be restored when onboarding flow is integrated
import { loadUserExperiences, updateUserExperience, deleteUserExperience, type UserExperience } from "@/lib/userExperiences";
// import { useAuth } from "@/components/context/AuthContext";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatDateRange } from "@/lib/dateUtils";

// Role creation will use the existing onboarding flow

// Sortable Responsibility Item Component
function SortableResponsibilityItem({ 
  id, 
  index, 
  value, 
  onChange, 
  onRemove, 
  isHighlighted 
}: {
  id: string;
  index: number;
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  isHighlighted: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // Local state to prevent focus loss
  const [localValue, setLocalValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  // Update local state when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalValue(e.target.value);
    setIsEditing(true);
  };

  const handleBlur = () => {
    if (isEditing && localValue !== value) {
      onChange(localValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (localValue !== value) {
        onChange(localValue);
      }
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex gap-3 items-start group p-3 rounded-lg border ${
        isDragging ? 'border-blue-300 bg-blue-50' : 'border-transparent'
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-move p-1.5 text-gray-400 hover:text-blue-600 transition-colors group-hover:scale-110 flex-shrink-0 mt-1"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>

      {/* Textarea Field */}
      <textarea
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="flex-1 min-w-0 text-sm text-gray-700 rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        placeholder="Enter responsibility..."
        rows={3}
        style={{ minHeight: '3.75rem' }}
      />

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0 mt-1"
        title="Remove"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

// Sortable Highlight Item Component
function SortableHighlightItem({ 
  id, 
  index, 
  value, 
  onChange, 
  onRemove, 
  isHighlighted,
  isFreeText = false
}: {
  id: string;
  index: number;
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  isHighlighted: boolean;
  isFreeText?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // Local state to prevent focus loss
  const [localValue, setLocalValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  // Update local state when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalValue(e.target.value);
    setIsEditing(true);
  };

  const handleBlur = () => {
    if (isEditing && localValue !== value) {
      onChange(localValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (localValue !== value) {
        onChange(localValue);
      }
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex gap-3 items-start group p-3 rounded-lg border ${
        isDragging ? 'border-blue-300 bg-blue-50' : 'border-transparent'
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-move p-1.5 text-gray-400 hover:text-blue-600 transition-colors group-hover:scale-110 flex-shrink-0 mt-1"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>

      {/* Textarea Field */}
      <textarea
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="flex-1 min-w-0 text-sm text-gray-700 rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        placeholder={isFreeText ? "Enter career highlight..." : "Enter highlight..."}
        rows={3}
        style={{ minHeight: '3.75rem' }}
      />

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0 mt-1"
        title="Remove"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

function ProfilePage() {
  const router = useRouter();
  
  // Onboarding state values will be restored when onboarding flow is integrated

  // Helper function to capitalize role - preserve full text including slashes
  const capitalizeRole = (role: string) => {
    if (!role) return "";
    
    // Handle the specific case of "Server / Waitstaff" format
    if (role.includes(' / ')) {
      return role
        .split(' / ')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' / ');
    }
    
    // Handle other separators (hyphens, spaces)
    return role
      .split(/[\-\s]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(role.includes('-') ? '-' : ' ');
  };

  // Mock user for demo
  const user = { id: "550e8400-e29b-41d4-a716-446655440000" };

  // SWR fetcher function
  const fetcher = async (userId: string) => {
    if (!userId) return [];
    
    // Ensure dev session is active for RLS to pass
    await ensureDevSession();
    
    const experiences = await loadUserExperiences(userId);
    // Sort by created_at DESC to show most recent first
    return experiences.sort((a, b) => 
      new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );
  };

  // Use SWR for real-time data with revalidation on focus
  const { data: experiences = [], error, isLoading: loading, mutate } = useSWR(
    user?.id ? `user-experiences-${user.id}` : null,
    () => fetcher(user.id),
    {
      refreshOnFocus: true,
      revalidateOnMount: true,
      dedupingInterval: 2000, // Dedupe requests within 2 seconds
    }
  );

  // Debug logging for the experiences array
  console.log("Profile Page - Experiences Array:", experiences);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingExperience, setEditingExperience] = useState<UserExperience | null>(null);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end for responsibilities
  const handleResponsibilitiesDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && editingExperience) {
      const oldIndex = editingExperience.responsibilities.findIndex(r => r === active.id);
      const newIndex = editingExperience.responsibilities.findIndex(r => r === over?.id);

      const newResponsibilities = arrayMove(
        editingExperience.responsibilities,
        oldIndex,
        newIndex
      );

      setEditingExperience(prev => prev ? {
        ...prev,
        responsibilities: newResponsibilities
      } : null);
    }
  };

  // Handle drag end for highlights
  const handleHighlightsDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && editingExperience) {
      const oldIndex = editingExperience.highlight_suggestions.findIndex(h => h === active.id);
      const newIndex = editingExperience.highlight_suggestions.findIndex(h => h === over?.id);

      const newSuggestions = arrayMove(
        editingExperience.highlight_suggestions,
        oldIndex,
        newIndex
      );

      setEditingExperience(prev => prev ? {
        ...prev,
        highlight_suggestions: newSuggestions
      } : null);
    }
  };

  const startEditing = (experience: UserExperience) => {
    setEditingId(experience.id);
    setEditingExperience({ ...experience });
  };

  const saveEditing = async () => {
    if (editingExperience && user?.id) {
      try {
        // Update the experience in the database
        const updatedExperience = await updateUserExperience(editingExperience.id, {
          role: editingExperience.role,
          org_name: editingExperience.org_name,
          location: editingExperience.location,
          start_date: editingExperience.start_date,
          end_date: editingExperience.end_date,
          is_current: editingExperience.is_current,
          traits: editingExperience.traits,
          scenario: editingExperience.scenario,
          vibe: editingExperience.vibe,
          highlight_text: editingExperience.highlight_text,
          highlight_suggestions: editingExperience.highlight_suggestions?.filter(s => s.trim() !== ''),
          responsibilities: editingExperience.responsibilities.filter(r => r.trim() !== ''),
        });

        if (updatedExperience) {
          // Update SWR cache with new data
          mutate((currentExperiences: UserExperience[] | undefined) => {
            if (!currentExperiences) return [updatedExperience];
            return currentExperiences.map((exp: UserExperience) => 
              exp.id === editingExperience.id ? updatedExperience : exp
            );
          }, false);
        }
      } catch (error) {
        console.error('Error saving experience:', error);
      }
    }
    
    setEditingId(null);
    setEditingExperience(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingExperience(null);
  };

  const deleteExperience = async (experienceId: string) => {
    if (user?.id) {
      try {
        const success = await deleteUserExperience(experienceId);
        if (success) {
          mutate((currentExperiences: UserExperience[] | undefined) => {
            if (!currentExperiences) return [];
            return currentExperiences.filter((exp: UserExperience) => exp.id !== experienceId);
          }, false);
        }
      } catch (error) {
        console.error('Error deleting experience:', error);
      }
    }
  };

  // Modal state removed - will use existing onboarding flow

  const addNewRole = () => {
    // Navigate to existing onboarding flow for role creation
    router.push("/onboarding-v2?step=ROLE_SELECT");
  };

  // Function to save new experience from onboarding - will be implemented when onboarding flow is restored

  return (
    <OnboardingShell
      title="Your Profile"
      subtitle="Manage your work experiences and career highlights"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Work Experiences</h2>
          {experiences.length === 0 ? (
            // Show "Create First Role" button when no experiences exist
            <button
              onClick={addNewRole}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm border border-blue-200 hover:border-blue-300 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all duration-200"
            >
              + Create Role
            </button>
          ) : (
            // Show "Add New Role" button when experiences exist
            <button
              onClick={addNewRole}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm border border-blue-200 hover:border-blue-300 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all duration-200"
            >
              + Add Role
            </button>
          )}
        </div>

        {/* Experiences List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading experiences...</p>
            </div>
          ) : experiences.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No experiences yet</h3>
              <p className="text-gray-500 mb-4">Start building your profile by adding your first work experience.</p>
              <button
                onClick={addNewRole}
                className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2 hover:underline-offset-4 transition-all duration-200"
              >
                Create your first role
              </button>
            </div>
          ) : (
            experiences.map((experience) => (
            <div key={experience.id} className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
              {/* Experience Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  {editingId === experience.id ? (
                    // Editing Mode - Role Title
                    <input
                      type="text"
                      value={editingExperience?.role || ""}
                      onChange={(e) => setEditingExperience(prev => prev ? {...prev, role: e.target.value} : null)}
                      className="w-full max-w-full text-lg font-semibold text-gray-900 rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <h3 className="text-lg font-semibold text-gray-900">{experience.role}</h3>
                  )}
                  
                  {editingId === experience.id ? (
                    // Editing Mode - Organization
                    <input
                      type="text"
                      value={editingExperience?.org_name || ""}
                      onChange={(e) => setEditingExperience(prev => prev ? {...prev, org_name: e.target.value} : null)}
                      className="w-full max-w-full text-base font-semibold text-gray-900 rounded-lg border border-gray-300 px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-base font-semibold text-gray-900 mt-1">{experience.org_name}</p>
                  )}
                  
                  {editingId === experience.id ? (
                    // Editing Mode - Dates with "Currently Working" option
                    <div className="space-y-2 mt-1">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                          <input
                            type="month"
                            value={editingExperience?.start_date || ""}
                            onChange={(e) => setEditingExperience(prev => prev ? {...prev, start_date: e.target.value} : null)}
                            className="w-full text-sm font-semibold text-gray-900 rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <span className="hidden sm:inline text-sm font-semibold text-gray-900 self-end mb-2">-</span>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-600 mb-1">End Date</label>
                          <input
                            type="month"
                            value={editingExperience?.end_date || ""}
                            onChange={(e) => setEditingExperience(prev => prev ? {...prev, end_date: e.target.value} : null)}
                            className="w-full text-sm font-semibold text-gray-900 rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={editingExperience?.is_current}
                          />
                        </div>
                      </div>
                      
                      {/* Currently Working Checkbox */}
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={editingExperience?.is_current || false}
                          onChange={(e) => {
                            setEditingExperience(prev => prev ? {
                              ...prev, 
                              is_current: e.target.checked,
                              end_date: e.target.checked ? undefined : prev.end_date
                            } : null);
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-xs sm:text-sm">I'm currently working here</span>
                      </label>
                    </div>
                  ) : (
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {formatDateRange(experience.start_date, experience.end_date, experience.is_current)}
                    </p>
                  )}
                  
                  {editingId === experience.id ? (
                    // Editing Mode - Location
                    <input
                      type="text"
                      placeholder="Location"
                      value={editingExperience?.location || ""}
                      onChange={(e) => setEditingExperience(prev => prev ? {...prev, location: e.target.value} : null)}
                      className="w-full max-w-full text-sm text-gray-600 rounded-lg border border-gray-300 px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    experience.location && (
                      <p className="text-sm text-gray-600">{experience.location}</p>
                    )
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 ml-4 flex-shrink-0">
                  {editingId === experience.id ? (
                    // Editing Mode - Action Buttons
                    <>
                      <button
                        onClick={saveEditing}
                        className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors whitespace-nowrap"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors whitespace-nowrap"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => deleteExperience(experience.id)}
                        className="px-3 py-1.5 rounded-lg border border-red-300 text-red-700 text-sm font-medium hover:bg-red-50 transition-colors whitespace-nowrap"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEditing(experience)}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>

              {/* Experience Content */}
              {editingId === experience.id ? (
                // Editing Mode - Content with Drag and Drop
                <div className="space-y-4">
                  {/* Key Responsibilities */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Key Responsibilities 
                      <span className="text-xs text-gray-500 ml-2">
                        (Drag to reorder - top items appear first on your profile)
                      </span>
                    </h4>
                    
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleResponsibilitiesDragEnd}
                    >
                      <SortableContext
                        items={editingExperience?.responsibilities || []}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-2">
                          {editingExperience?.responsibilities.map((resp, index) => (
                            <SortableResponsibilityItem
                              key={`resp-${index}-${resp}`}
                              id={resp}
                              index={index}
                              value={resp}
                              onChange={(value) => {
                                const newResponsibilities = [...(editingExperience?.responsibilities || [])];
                                newResponsibilities[index] = value;
                                setEditingExperience(prev => prev ? {...prev, responsibilities: newResponsibilities} : null);
                              }}
                              onRemove={() => {
                                const newResponsibilities = editingExperience?.responsibilities.filter((_, i) => i !== index) || [];
                                setEditingExperience(prev => prev ? {...prev, responsibilities: newResponsibilities} : null);
                              }}
                              isHighlighted={index < 3}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                    
                    {/* Add new responsibility button */}
                    <button
                      onClick={() => {
                        const newResponsibilities = [...(editingExperience?.responsibilities || []), ""];
                        setEditingExperience(prev => prev ? {...prev, responsibilities: newResponsibilities} : null);
                      }}
                      className="ml-6 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      + Add Responsibility
                    </button>
                  </div>

                  {/* Career Highlights */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Career Highlights
                      <span className="text-xs text-gray-500 ml-2">
                        (Drag to reorder - top items appear first on your profile)
                      </span>
                    </h4>
                    
                    <div className="space-y-2">
                      {/* Free text highlight */}
                      {editingExperience?.highlight_text && (
                        <div className="flex gap-3 items-start p-3 rounded-lg border border-gray-200">
                          <textarea
                            value={editingExperience.highlight_text}
                            onChange={(e) => setEditingExperience(prev => prev ? {...prev, highlight_text: e.target.value} : null)}
                            className="flex-1 min-w-0 text-sm text-gray-700 rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            placeholder="Enter career highlight..."
                            rows={3}
                            style={{ minHeight: '3.75rem' }}
                          />
                        </div>
                      )}
                      
                      {/* Highlight suggestions with drag and drop */}
                      {editingExperience?.highlight_suggestions && editingExperience.highlight_suggestions.length > 0 && (
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handleHighlightsDragEnd}
                        >
                          <SortableContext
                            items={editingExperience.highlight_suggestions}
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="space-y-2">
                              {editingExperience.highlight_suggestions.map((suggestion, index) => (
                                <SortableHighlightItem
                                  key={`suggestion-${index}-${suggestion}`}
                                  id={suggestion}
                                  index={editingExperience?.highlight_text ? index + 1 : index}
                                  value={suggestion}
                                  onChange={(value) => {
                                    const newSuggestions = [...(editingExperience?.highlight_suggestions || [])];
                                    newSuggestions[index] = value;
                                    setEditingExperience(prev => prev ? {...prev, highlight_suggestions: newSuggestions} : null);
                                  }}
                                  onRemove={() => {
                                    const newSuggestions = editingExperience?.highlight_suggestions.filter((_, i) => i !== index) || [];
                                    setEditingExperience(prev => prev ? {...prev, highlight_suggestions: newSuggestions} : null);
                                  }}
                                  isHighlighted={(editingExperience?.highlight_text ? index + 1 : index) < 3}
                                />
                              ))}
                            </div>
                          </SortableContext>
                        </DndContext>
                      )}
                      
                      {/* Add new highlight button */}
                      <button
                        onClick={() => {
                          const newSuggestions = [...(editingExperience?.highlight_suggestions || []), ""];
                          setEditingExperience(prev => prev ? {...prev, highlight_suggestions: newSuggestions} : null);
                        }}
                        className="ml-6 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        + Add Highlight
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // View Mode - Content
                <div className="space-y-4">
                  {/* Key Responsibilities */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Responsibilities</h4>
                    <ul className="space-y-1">
                      {experience.responsibilities.map((resp, index) => (
                        <li key={index} className="flex gap-2 text-gray-700">
                          <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2"></span>
                          <span className="text-sm">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Career Highlight */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Career Highlight</h4>
                    <ul className="space-y-1">
                      {/* Show free text if entered */}
                      {experience.highlight_text && (
                        <li key="free-text" className="flex gap-2 text-gray-700">
                          <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2"></span>
                          <span className="text-sm">{experience.highlight_text}</span>
                        </li>
                      )}
                      
                      {/* Show selected suggestions */}
                      {experience.highlight_suggestions && experience.highlight_suggestions.length > 0 ? (
                        experience.highlight_suggestions.map((suggestion, index) => (
                          <li key={`suggestion-${index}`} className="flex gap-2 text-gray-700">
                            <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2"></span>
                            <span className="text-sm">{suggestion}</span>
                          </li>
                        ))
                      ) : null}
                      
                      {/* Show message if nothing selected */}
                      {!experience.highlight_text && (!experience.highlight_suggestions || experience.highlight_suggestions.length === 0) && (
                        <li className="flex gap-2 text-gray-700">
                          <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2"></span>
                          <span className="text-sm">No career highlights added yet</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        </div>

        {/* Role Creation Modal */}
        {/* Role creation will use the existing onboarding flow */}


        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-center items-center">
            <p className="text-sm text-gray-500">
              {experiences.length} experience{experiences.length !== 1 ? 's' : ''} in your profile
            </p>
          </div>
        </div>
      </div>
    </OnboardingShell>
  );
}

// Export as dynamic to prevent SSR issues with Supabase client
export default dynamic(() => Promise.resolve(ProfilePage), { ssr: false });