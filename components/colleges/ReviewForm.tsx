"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Props {
  collegeId: string;
  onSuccess: () => void;
}

export function ReviewForm({ collegeId, onSuccess }: Props) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [batch, setBatch] = useState("");
  const [course, setCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError("Please select a rating"); return; }
    if (!title.trim()) { setError("Please add a title"); return; }
    if (content.trim().length < 20) { setError("Review must be at least 20 characters"); return; }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collegeId, rating, title: title.trim(), content: content.trim(),
          pros: pros.trim() || undefined, cons: cons.trim() || undefined,
          batch: batch ? parseInt(batch) : undefined,
          course: course.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Failed to submit review");
        return;
      }
      onSuccess();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-4">
      <h3 className="font-semibold text-gray-900">Write a Review</h3>

      {/* Star picker */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating *</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(star)}
              className="p-0.5 focus:outline-none"
            >
              <Star
                className={cn(
                  "h-7 w-7 transition-colors",
                  (hovered || rating) >= star
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-300"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Course (optional)"
          placeholder="e.g. B.Tech Computer Science"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />
        <Input
          label="Batch Year (optional)"
          placeholder="e.g. 2023"
          type="number"
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
        />
      </div>

      <Input
        label="Review Title *"
        placeholder="Summarise your experience in one line"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Review *</label>
        <textarea
          className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 resize-none"
          rows={4}
          placeholder="Share your experience — academics, campus life, placements..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Pros (optional)</label>
          <textarea
            className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400 resize-none"
            rows={2}
            placeholder="What did you like?"
            value={pros}
            onChange={(e) => setPros(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Cons (optional)</label>
          <textarea
            className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-400 resize-none"
            rows={2}
            placeholder="What could be better?"
            value={cons}
            onChange={(e) => setCons(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button type="submit" loading={loading} disabled={rating === 0}>
          Submit Review
        </Button>
      </div>
    </form>
  );
}
