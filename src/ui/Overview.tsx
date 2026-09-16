import React from 'react';
import type { AppLesson } from '../utils/types';

export function Overview({ lesson }: { lesson: AppLesson }) {
  return (
    <div className="col" style={{ gap: 16 }}>
      {lesson.parts.map((p) => (
        <div key={p.id} className="lesson-card">
          <div className="header">
            <div style={{ fontWeight: 700 }}>{p.title}</div>
            <div>
              {p.tags?.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <ul>
              {p.keypoints.map((k, i) => (
                <li key={i} style={{ marginBottom: 6 }}>{k}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

