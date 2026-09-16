import React, { useMemo, useState } from 'react';
import type { AppLesson, PracticeExercise, PracticeBlank } from '../utils/types';

export function Practice({ lesson }: { lesson: AppLesson }) {
  const [exerciseId, setExerciseId] = useState(lesson.exercises[0]?.id);
  const exercise = useMemo(
    () => lesson.exercises.find(e => e.id === exerciseId)!,
    [lesson.exercises, exerciseId]
  );
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showAnswers, setShowAnswers] = useState(false);

  const blanks = flattenBlanks(exercise);
  const progress = Math.round(
    (Object.values(answers).filter(v => v?.trim().length > 0).length / blanks.length) * 100
  );

  function emitFocus(tag: string | null) {
    const evt = new CustomEvent('practice:focusTag', { detail: { tag } });
    window.dispatchEvent(evt);
  }

  return (
    <div className="col" style={{ gap: 12 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div className="row" style={{ gap: 8 }}>
          {lesson.exercises.map(e => (
            <button
              key={e.id}
              className={e.id === exerciseId ? '' : 'ghost'}
              onClick={() => {
                setExerciseId(e.id);
                setAnswers({});
                setShowAnswers(false);
                emitFocus(null);
              }}
            >
              {e.title}
            </button>
          ))}
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="ghost" onClick={() => {
            setAnswers({});
            setShowAnswers(false);
            emitFocus(null);
          }}>清空</button>
          <button onClick={() => setShowAnswers(s => !s)}>{showAnswers ? '隐藏答案' : '显示答案'}</button>
        </div>
      </div>

      <div className="progress"><span style={{ width: `${progress}%` }} /></div>
      <div className="muted" style={{ fontSize: 12 }}>完成度：{progress}%</div>

      <div className="lesson-card">
        <div className="h2">{exercise.title}</div>
        <div className="muted" style={{ marginBottom: 10 }}>{exercise.instruction}</div>
        <div style={{ lineHeight: 1.8, fontSize: 16 }}>
          {exercise.blocks.map((b, i) => (
            <p key={i} style={{ marginBottom: 12 }}>
              {b.items.map((it, j) => {
                if (it.type === 'text') return <span key={j}>{it.text}</span>;
                if (it.type === 'blank') {
                  const id = it.id;
                  const correct = it.answer;
                  const filled = answers[id] ?? '';
                  const ok = filled.trim().length > 0 && normalize(filled) === normalize(correct);
                  const show = showAnswers ? correct : filled;
                  return (
                    <span key={j} className="blank-input" onFocus={() => emitFocus(it.focusTag || null)}>
                      <input
                        aria-label={id}
                        placeholder="填写..."
                        className="blank"
                        value={show}
                        style={{
                          borderBottomColor: showAnswers ? (ok ? 'var(--ok)' : '#ef4444') : '#374151'
                        }}
                        onChange={(e) => setAnswers(a => ({ ...a, [id]: e.target.value }))}
                        onFocus={() => emitFocus(it.focusTag || null)}
                      />
                    </span>
                  );
                }
                return null;
              })}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function flattenBlanks(ex: PracticeExercise): PracticeBlank[] {
  const arr: PracticeBlank[] = [];
  ex.blocks.forEach(b => {
    b.items.forEach(it => {
      if (it.type === 'blank') arr.push(it);
    });
  });
  return arr;
}

function normalize(s: string) {
  return s.replace(/\s+/g, ' ').trim().toLowerCase();
}

