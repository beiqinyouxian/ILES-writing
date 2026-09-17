import React, { useMemo, useState } from 'react';
import lessons from '../../content/lessons.json';
import lesson1 from '../../content/lesson1.json';
import lesson2 from '../../content/lesson2.json';
import lesson3 from '../../content/lesson3.json';
import type {
  AppLesson,
  PracticeExercise,
  PracticeBlank,
  TipCard
} from '../utils/types';
import { Practice } from './Practice';
import { Overview } from './Overview';

const lessonMap: Record<string, AppLesson> = {
  l1: lesson1 as unknown as AppLesson,
  l2: lesson2 as unknown as AppLesson,
  l3: lesson3 as unknown as AppLesson,
  l4: lessons.lessons.find(l => l.id === 'l4') as AppLesson,
  l5: lessons.lessons.find(l => l.id === 'l5') as AppLesson
};

export default function App() {
  const [activeLessonId, setActiveLessonId] = useState('l1');
  const [activeView, setActiveView] = useState<'overview' | 'practice'>('overview');
  const activeLesson = lessonMap[activeLessonId];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div>
            <div className="title">雅思写作练习</div>
            <div className="subtitle">面向 6.5 分的实用训练</div>
          </div>
        </div>
        <div className="divider" />
        <div className="col">
          {lessons.lessons.map((l) => (
            <div
              key={l.id}
              className="lesson-card"
              style={{
                outline: activeLessonId === l.id ? '2px solid var(--accent)' : 'none'
              }}
              onClick={() => {
                setActiveLessonId(l.id);
                setActiveView('overview');
              }}
            >
              <div className="header">
                <div style={{ fontWeight: 700 }}>{l.title}</div>
                {l.status === 'available' ? (
                  <span className="tag">可用</span>
                ) : (
                  <span className="tag">预告</span>
                )}
              </div>
              <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
                {l.summary}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main className="main">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div>
            <div className="h1">{activeLesson.title}</div>
            <div className="subtitle">{activeLesson.summary}</div>
          </div>
          <div className="row">
            <button
              className={activeView === 'overview' ? '' : 'ghost'}
              onClick={() => setActiveView('overview')}
            >
              课程概览
            </button>
            <button
              className={activeView === 'practice' ? '' : 'ghost'}
              onClick={() => setActiveView('practice')}
            >
              进入练习
            </button>
          </div>
        </div>
        <div className="divider" />
        {activeView === 'overview' ? (
          <Overview lesson={activeLesson} />
        ) : (
          <Practice lesson={activeLesson} />
        )}
      </main>

      <aside className="tips">
        <TipsPanel lesson={activeLesson} />
      </aside>
    </div>
  );
}

function TipsPanel({ lesson }: { lesson: AppLesson }) {
  const [focusTag, setFocusTag] = useState<string | null>(null);

  // subscribe to custom events from Practice to update focused tag
  React.useEffect(() => {
    const onFocus = (e: Event) => {
      const ce = e as CustomEvent<{ tag: string | null }>;
      setFocusTag(ce.detail.tag);
    };
    window.addEventListener('practice:focusTag', onFocus as EventListener);
    return () => window.removeEventListener('practice:focusTag', onFocus as EventListener);
  }, []);

  const tips = useMemo(() => {
    const byTag = (t: TipCard) => (focusTag ? t.tags.includes(focusTag) : false);
    const tagged = (lesson.tips || []).filter(byTag);
    const general = (lesson.tips || []).filter(t => t.tags.includes('general'));
    // show tagged first; fallback to general tips
    return tagged.length > 0 ? tagged : general;
  }, [focusTag, lesson.tips]);

  return (
    <div>
      <div className="h2">提示面板</div>
      <div className="muted" style={{ marginBottom: 8 }}>
        {focusTag ? <>当前聚焦：<span className="pill">{focusTag}</span></> : '聚焦到某个空格或段落时，将展示对应句式提示'}
      </div>
      {(tips || []).map((t) => (
        <div key={t.id} className="tip-card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 700 }}>{t.title}</div>
            <div>
              {t.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
            </div>
          </div>
          <div style={{ marginTop: 6, fontSize: 14, lineHeight: 1.4 }}>{t.content}</div>
          {t.examples?.length ? (
            <ul style={{ marginTop: 6 }}>
              {t.examples.map((ex, i) => (
                <li key={i} className="muted" style={{ fontSize: 13 }}>{ex}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
      <div className="divider" />
      <div className="muted" style={{ fontSize: 12 }}>
        目标分：6.5。请避免过于生僻的词汇与过长句。
      </div>
    </div>
  );
}

