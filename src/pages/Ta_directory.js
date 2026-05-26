import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../lib/supabaseClient.js";
import TACard from "../components/TACard.js";
import { useScale } from "../hooks/useScale.js";
import heroImage from "../images/ta-directory/hero.jpg";
import externalLinkIcon from "../images/ta-directory/external-link.svg";
import searchIcon from "../images/ta-directory/search.svg";
import "../styles/teaching_assistants.css";

const FILTERS = ["ALL", "CS", "INFO", "ECE"];

// Extracts the department prefix (e.g. "CS" from "CS 2110") for filter matching.
function getDepartment(course) {
  if (!course) return "";
  return String(course).trim().split(/\s+/)[0].toUpperCase();
}

export default function Ta_directory() {
  useScale();
  const [tas, setTAs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  useEffect(() => {
    fetchTAData();
  }, []);

  async function fetchTAData() {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("id, netid, first_name, last_name, role, course")
        .eq("ta_semester", "fa25")
        .contains("role", ["ta"]);

      if (error) throw error;

      const mapped = data
        .map((m) => {
          const courses =
            Array.isArray(m.course) && m.course.length > 0 ? m.course : [];
          return {
            id: m.id,
            name: `${m.first_name} ${m.last_name}`.trim(),
            email: m.netid ? `${m.netid}@cornell.edu` : "",
            courses: [...courses].sort((a, b) => a.localeCompare(b)),
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name));

      setTAs(mapped);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredTAs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tas.filter((ta) => {
      const matchesDept =
        activeFilter === "ALL" ||
        ta.courses.some((c) => getDepartment(c) === activeFilter);
      const matchesQuery =
        !q ||
        ta.courses.some((c) => c.toLowerCase().includes(q)) ||
        ta.name.toLowerCase().includes(q);
      return matchesDept && matchesQuery;
    });
  }, [tas, query, activeFilter]);

  const stats = useMemo(() => {
    const courseSet = new Set();
    tas.forEach((ta) => ta.courses.forEach((c) => courseSet.add(c)));
    return { activeTAs: tas.length, courses: courseSet.size };
  }, [tas]);

  return (
    <div className="ta-page">
      <section className="ta-hero">
        <div className="ta-hero__inner">
          <div className="ta-hero__text">
            <h1 className="ta-hero__title">TA Directory</h1>
            <p className="ta-hero__subtitle">
              Connect with teaching assistants across computing courses for
              academic support, guidance, and office hours.
            </p>
            <a
              className="ta-hero__cta"
              href="https://www.cs.cornell.edu/courseinfo/taapplicationinformation"
              target="_blank"
              rel="noreferrer"
            >
              <span>Become a TA</span>
              <img src={externalLinkIcon} alt="" className="ta-hero__cta-icon" />
            </a>
          </div>
          <div className="ta-hero__image-wrap">
            <img
              src={heroImage}
              alt="URMC teaching assistants in a classroom"
              className="ta-hero__image"
            />
          </div>
        </div>
      </section>

      <section className="ta-directory">
        <div className="ta-directory__inner">
          <div className="ta-controls">
            <div className="ta-search">
              <img src={searchIcon} alt="" className="ta-search__icon" />
              <input
                type="text"
                className="ta-search__input"
                placeholder="Search courses"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search courses"
              />
            </div>
            <div className="ta-filters" role="tablist" aria-label="Filter by department">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === f}
                  className={`ta-filters__btn ${
                    activeFilter === f ? "ta-filters__btn--active" : ""
                  }`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="ta-status">Loading…</p>
          ) : error ? (
            <p className="ta-status ta-status--error">Error: {error}</p>
          ) : filteredTAs.length === 0 ? (
            <p className="ta-status">No TAs match your search.</p>
          ) : (
            <div className="ta-grid">
              {filteredTAs.map((ta) => (
                <TACard
                  key={ta.id}
                  name={ta.name}
                  email={ta.email}
                  courses={ta.courses}
                />
              ))}
            </div>
          )}

          <div className="ta-stats" aria-label="TA stats">
            <div className="ta-stats__block">
              <p className="ta-stats__num">{stats.activeTAs}</p>
              <p className="ta-stats__label">Active TAs</p>
            </div>
            <span className="ta-stats__divider" aria-hidden="true" />
            <div className="ta-stats__block">
              <p className="ta-stats__num">{stats.courses}</p>
              <p className="ta-stats__label">Courses</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
