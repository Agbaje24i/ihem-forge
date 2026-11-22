import React, { useState } from "react";
import { categories, tracks } from "../../data/tracks";
import LessonEditor from "./LessonEditor";

// Course material for a whole track. Every cohort of the track, and every
// approved student of it, sees these lessons in their portal.
const CourseContent = () => {
  const [track, setTrack] = useState("");

  return (
    <div>
      <h1 className="text-4xl font-bold">Course Content</h1>
      <p className="text-gray-600 mt-1 mb-6">
        Add the lessons, notes, videos and assignments for a track once. Every approved student of that track sees
        them in their portal. Use Cohorts &amp; Classes for dated live classes of one intake.
      </p>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <label className="block text-sm font-semibold text-gray-700 mb-1">Track</label>
        <select value={track} onChange={(e) => setTrack(e.target.value)} className="w-full max-w-md border rounded-lg p-2.5 mb-8">
          <option value="">Select a track</option>
          {categories.map((cat) => (
            <optgroup key={cat.id} label={cat.label}>
              {tracks
                .filter((t) => t.category === cat.id)
                .map((t) => (
                  <option key={t.slug} value={t.name}>
                    {t.name}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>

        {track ? (
          <LessonEditor
            listUrl={`/admin/track-lessons?track=${encodeURIComponent(track)}`}
            createUrl="/admin/track-lessons"
            extraBody={{ track }}
          />
        ) : (
          <p className="text-gray-500">Choose a track to manage its course content.</p>
        )}
      </div>
    </div>
  );
};

export default CourseContent;
